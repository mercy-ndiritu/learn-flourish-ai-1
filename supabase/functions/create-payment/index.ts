import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  amount: number;
  currency?: string;
  phone_number?: string;
  email?: string;
  api_ref?: string;
  method?: string;
}

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

    if (!user?.email) {
      throw new Error("User not authenticated");
    }

    const { amount, currency = "KES", phone_number, method = "M-PESA" }: PaymentRequest = await req.json();

    const intasendUrl = "https://sandbox.intasend.com/api/v1/payment/mpesa-stk-push/";
    const intasendKey = Deno.env.get("INTASEND_SECRET_KEY");

    if (!intasendKey) {
      throw new Error("Intasend secret key not configured");
    }

    const paymentData = {
      amount: amount,
      currency: currency,
      phone_number: phone_number || user.phone || "",
      email: user.email,
      api_ref: `payment_${user.id}_${Date.now()}`,
      method: method,
      provider: "MPESA",
      wallet: {
        phone_number: phone_number || user.phone || "",
        email: user.email,
        label: "StudySphere Payment"
      }
    };

    const response = await fetch(intasendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${intasendKey}`,
      },
      body: JSON.stringify(paymentData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Payment initiation failed");
    }

    // Store payment record in database
    const serviceSupabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    await serviceSupabase.from("payments").insert({
      user_id: user.id,
      amount: amount,
      currency: currency,
      payment_reference: result.id || paymentData.api_ref,
      status: "pending",
      provider: "intasend",
      method: method
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Payment error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});