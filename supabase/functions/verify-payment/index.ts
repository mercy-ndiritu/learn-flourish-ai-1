import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabase.auth.getUser(token);
    const user = data.user;

    if (!user) {
      throw new Error("User not authenticated");
    }

    const { payment_id } = await req.json();

    const intasendUrl = `https://sandbox.intasend.com/api/v1/payment/status/`;
    const intasendKey = Deno.env.get("INTASEND_SECRET_KEY");

    if (!intasendKey) {
      throw new Error("Intasend secret key not configured");
    }

    const response = await fetch(`${intasendUrl}${payment_id}/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${intasendKey}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Payment verification failed");
    }

    // Update payment status in database
    const serviceSupabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    await serviceSupabase
      .from("payments")
      .update({ 
        status: result.state?.toLowerCase() || "unknown",
        updated_at: new Date().toISOString()
      })
      .eq("payment_reference", payment_id);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});