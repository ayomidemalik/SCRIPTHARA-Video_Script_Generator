import { GoogleGenerativeAI } from "@google/generative-ai";

const kv = { store: new Map(), async get(key) { return this.store.get(key); }, async set(key, val, options) { this.store.set(key, val); if (options?.ex) { setTimeout(() => this.store.delete(key), options.ex * 1000); } } };
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

const parseDurationFromInput = (text) => {
    const minRegex = /(\d+\.?\d*)\s*(minute|minutes|min|m)\b/i;
    const secRegex = /(\d+)\s*(second|seconds|sec|s)\b/i;
    const minMatch = text.match(minRegex);
    const secMatch = text.match(secRegex);
    let totalSeconds = 0;
    if (minMatch) totalSeconds += parseFloat(minMatch[1]) * 60;
    if (secMatch) totalSeconds += parseInt(secMatch[1], 10);
    if (totalSeconds > 0) {
        if (totalSeconds < 60) {
            return `${Math.round(totalSeconds)}-second`;
        } else {
            const totalMinutes = totalSeconds / 60;
            return `${totalMinutes.toFixed(1).replace('.0', '')}-minute`;
        }
    }
    return null;
};

export async function POST(request) {
  try {
    const { input: userInput, duration: selectedDuration } = await request.json();
    if (!userInput?.trim()) {
      return Response.json({ error: "Input required" }, { status: 400 });
    }

    let scriptDuration;
    const parsedDuration = parseDurationFromInput(userInput);

    if (parsedDuration) {
        scriptDuration = parsedDuration;
    } else {
        if (typeof selectedDuration === 'number') {
            scriptDuration = `${selectedDuration}-second`;
        } else if (typeof selectedDuration === 'string') {
            let totalMinutes = 0;
            if (selectedDuration.includes('m')) totalMinutes += parseFloat(selectedDuration.split('m')[0]);
            if (selectedDuration.includes('s')) {
                const secondsPart = selectedDuration.split('m ')[1] || '';
                totalMinutes += parseFloat(secondsPart.replace('s', '')) / 60;
            }
            scriptDuration = `${totalMinutes.toFixed(1).replace('.0', '')}-minute`;
        } else {
            scriptDuration = '30-second'; // Fallback
        }
    }

    const cleanInput = userInput
        .replace(/(\d+\.?\d*)\s*(minute|minutes|min|m)\b/gi, '')
        .replace(/(\d+)\s*(second|seconds|sec|s)\b/gi, '')
        .trim();

    const cacheKey = `script:${cleanInput}:${scriptDuration}`;
    const cached = await kv.get(cacheKey);
    if (cached) return Response.json({ script: cached });

    if (!genAI) {
      return Response.json({ script: generateFallbackScript(cleanInput), warning: "Add GEMINI_API_KEY in .env.local" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    
    // Updated prompt with the new structure
    const prompt = `
      You are an expert scriptwriter for social media content. Create a video script about: "${cleanInput}".

      **Primary Directive**: The total length of the script MUST closely match the target duration of **${scriptDuration}**. The sum of all time markers must equal the total target duration.

      **Formatting Rules (Strictly Enforced)**:
      1.  **Time Marker**: On its own line in the format (X-Y seconds).
      2.  **Section Title**: On the next line, starting with an uppercase letter.
      3.  **Visuals**: On the next line, prefixed with the bolded text "**Visuals**:". Describe the on-screen action.
      4.  **Voiceover / Presenter**: On the next line, prefixed with the bolded text "**Voiceover / Presenter**:". Write the spoken words.
      5.  Use a blank line to separate each complete section for readability.

      **Example of the Required Structure**:
      
      (0-5 seconds)
      The Perfect Hook
      **Visuals**: A cinematic close-up of dark chocolate melting over a freshly baked brownie.
      **Voiceover / Presenter**: You've been making brownies wrong your entire life. Here's the secret to making them perfect every single time.

      (5-15 seconds)
      Revealing the Secret
      **Visuals**: Quick cuts showing a hand cracking an egg into a bowl, followed by a shot of high-quality cocoa powder being sifted.
      **Voiceover / Presenter**: It all comes down to two things: using room temperature eggs for a fudgier texture, and sifting your dry ingredients to avoid clumps.
    `;

    const result = await model.generateContent(prompt);
    const script = result.response.text();

    await kv.set(cacheKey, script, { ex: 3600 });
    return Response.json({ script });

  } catch (error) {
    console.error('Error:', error);
    return Response.json({
      script: generateFallbackScript("your topic"),
      warning: "An error occurred while generating the script."
    }, { status: 500 });
  }
}

// Updated fallback script to match the new format
function generateFallbackScript(topic = 'your topic') {
  return `(0-5 seconds)
The Hook
**Visuals**: An engaging opening shot related to '${topic}'.
**Voiceover / Presenter**: Are you ready to discover the ultimate secret about ${topic.slice(0,25)}?

(5-10 seconds)
Call to Action
**Visuals**: A clear and direct shot of the subject or brand logo.
**Voiceover / Presenter**: Like and follow for more tips that you won't want to miss!`;
}