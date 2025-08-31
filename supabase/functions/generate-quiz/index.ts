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
    const { userId, subject, difficulty, questionCount = 5 } = await req.json();

    if (!userId || !subject || !difficulty) {
      return new Response(
        JSON.stringify({ error: 'UserId, subject, and difficulty are required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Generating quiz - User: ${userId}, Subject: ${subject}, Difficulty: ${difficulty}, Questions: ${questionCount}`);

    // Get user's notes for the subject to create personalized questions
    const { data: userNotes } = await supabase
      .from('notes')
      .select('title, content')
      .eq('user_id', userId)
      .eq('subject', subject)
      .order('created_at', { ascending: false })
      .limit(5);

    let contextContent = '';
    if (userNotes && userNotes.length > 0) {
      contextContent = userNotes.map(note => 
        `Title: ${note.title}\nContent: ${note.content?.substring(0, 1000)}`
      ).join('\n\n');
    }

    const prompt = `Create a ${difficulty} level quiz about ${subject} with exactly ${questionCount} multiple choice questions.

${contextContent ? `
Based on the following study materials:
${contextContent}

Create questions that test understanding of these specific materials.` : `
Create questions that test fundamental concepts in ${subject}.`}

Requirements:
- Each question should have 4 options (A, B, C, D)
- Only one correct answer per question
- Questions should be appropriate for ${difficulty} level
- Include a brief explanation for the correct answer
- Questions should be clear and unambiguous

Return ONLY a valid JSON object with this exact structure:
{
  "title": "${subject} Quiz - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level",
  "questions": [
    {
      "question": "Question text here?",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of why this is correct"
    }
  ]
}

The correctAnswer should be the index (0-3) of the correct option.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: 'You are an expert quiz generator. Always return valid JSON that matches the requested format exactly.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', await response.text());
      return new Response(
        JSON.stringify({ error: 'Failed to generate quiz' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    const quizContent = data.choices[0].message.content;

    let parsedQuiz;
    try {
      parsedQuiz = JSON.parse(quizContent);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', quizContent);
      return new Response(
        JSON.stringify({ error: 'Failed to generate valid quiz format' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Save the quiz to database
    const { data: savedQuiz, error: saveError } = await supabase
      .from('quizzes')
      .insert({
        user_id: userId,
        title: parsedQuiz.title,
        subject: subject,
        questions: parsedQuiz.questions,
        difficulty: difficulty
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving quiz:', saveError);
      return new Response(
        JSON.stringify({ error: 'Failed to save quiz' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Quiz generated and saved successfully - ID: ${savedQuiz.id}`);

    return new Response(
      JSON.stringify({ 
        quiz: savedQuiz,
        message: 'Quiz generated successfully!'
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-quiz function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});