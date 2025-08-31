import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, subject } = await req.json();

    if (!message || !userId) {
      return new Response(
        JSON.stringify({ error: 'Message and userId are required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`AI Tutor request - User: ${userId}, Subject: ${subject}, Message: ${message}`);

    // Get user's recent notes for context
    const { data: userNotes } = await supabase
      .from('notes')
      .select('title, content, subject')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(3);

    // Prepare context from user's notes
    let contextNotes = '';
    if (userNotes && userNotes.length > 0) {
      contextNotes = userNotes.map(note => 
        `Subject: ${note.subject || 'General'}\nTitle: ${note.title}\nContent: ${note.content?.substring(0, 500)}...`
      ).join('\n\n');
    }

    const systemPrompt = `You are StudySphere AI, a knowledgeable and supportive academic tutor. You help students understand complex concepts, provide study guidance, and answer educational questions.

Your personality:
- Patient and encouraging
- Explain concepts clearly with examples
- Ask follow-up questions to ensure understanding
- Provide step-by-step solutions when appropriate
- Adapt your teaching style to the student's level

${contextNotes ? `
Student's Recent Study Materials:
${contextNotes}

Use this context to provide more personalized help when relevant.` : ''}

Focus area: ${subject || 'General academic support'}

Always be supportive and help the student learn rather than just providing direct answers.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 800,
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', await response.text());
      return new Response(
        JSON.stringify({ error: 'Failed to get AI response' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log(`AI Tutor response generated successfully for user ${userId}`);

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        subject: subject || 'General'
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in ai-tutor function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});