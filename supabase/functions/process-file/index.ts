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
    const { userId, fileName, fileContent, fileType } = await req.json();

    if (!userId || !fileName || !fileContent) {
      return new Response(
        JSON.stringify({ error: 'UserId, fileName, and fileContent are required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Processing file - User: ${userId}, File: ${fileName}, Type: ${fileType}`);

    // Use AI to extract key information and suggest study materials
    const analysisPrompt = `Analyze this study material and extract key information:

File: ${fileName}
Content: ${fileContent}

Please provide:
1. A concise title for these notes
2. The main subject/topic area
3. Key concepts and topics covered (max 5)
4. A brief summary of the content
5. Suggested study focus areas

Return as JSON with this structure:
{
  "title": "Suggested title",
  "subject": "Subject area",
  "keyTopics": ["Topic 1", "Topic 2", "Topic 3"],
  "summary": "Brief summary of the content",
  "studyFocus": ["Focus area 1", "Focus area 2"]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: 'You are an expert study material analyzer. Always return valid JSON.' },
          { role: 'user', content: analysisPrompt }
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    let analysis = {
      title: fileName.replace(/\.[^/.]+$/, ""), // Remove file extension
      subject: 'General Studies',
      keyTopics: [],
      summary: fileContent.substring(0, 200) + '...',
      studyFocus: []
    };

    if (response.ok) {
      try {
        const data = await response.json();
        const aiAnalysis = JSON.parse(data.choices[0].message.content);
        analysis = { ...analysis, ...aiAnalysis };
      } catch (parseError) {
        console.warn('Failed to parse AI analysis, using fallback');
      }
    }

    // Save the processed note to database
    const { data: savedNote, error: saveError } = await supabase
      .from('notes')
      .insert({
        user_id: userId,
        title: analysis.title,
        content: fileContent,
        subject: analysis.subject,
        file_type: fileType || 'text',
        tags: analysis.keyTopics
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving note:', saveError);
      return new Response(
        JSON.stringify({ error: 'Failed to save note' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Log study session
    await supabase
      .from('study_sessions')
      .insert({
        user_id: userId,
        subject: analysis.subject,
        duration_minutes: 5, // Estimated time for file upload
        notes_studied: [savedNote.id]
      });

    console.log(`File processed and saved successfully - Note ID: ${savedNote.id}`);

    return new Response(
      JSON.stringify({ 
        note: savedNote,
        analysis: analysis,
        message: 'File processed successfully!'
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in process-file function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});