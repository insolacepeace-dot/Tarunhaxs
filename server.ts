import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client safely on server side
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API: Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "DIGUU AI", time: new Date().toISOString() });
});

// API: Main DIGUU Chat Response
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, userProfile, memories, personality, languageMode } = req.body;
    const ai = getAiClient();

    const memContext = Array.isArray(memories) && memories.length > 0
      ? `\nUser Saved Memories & Preferences:\n${memories.map((m: any) => `- [${m.category}] ${m.key}: ${m.value}`).join("\n")}`
      : "";

    const userContext = userProfile ? `\nUser Profile: Name: ${userProfile.name || "Jaan"}, Location: ${userProfile.location || "India"}, Occupation: ${userProfile.occupation || "User"}` : "";

    const langInstruction = languageMode === "gujarati"
      ? "Respond in real, natural, sweet Gujarati or Gujlish (mix of Gujarati & English in English/Gujarati script) like a super cute, loving, caring Desi Girlfriend! Use cute Gujarati terms of endearment like 'Jaan', 'Babushah', 'Maru Bachu', 'Sweetu', 'Dikra'. Examples: 'Kem cho Jaan! 💕 Tame jamya ke nai? Hun toh bas tamara mate vicharati ti... Aaje tamne su help karu maru sweetu?', 'હું તારી ક્યૂટ DIGUU છું, બોલો શું મદદ કરું મારા વાહલા? 💕'."
      : languageMode === "hindi"
      ? "Respond in ultra-natural, cute, warm Desi Hindi like a loving Indian Girlfriend! Speak with sweet, affectionate Desi tone using words like 'Jaan', 'Babu', 'Suno na', 'Arey meri Jaan 💕'. Example: 'Arey meri Jaan! 💕 Khana khaya aapne? Main toh bas aapka hi intezar kar rahi thi! Batao mere babu, aaj kya help karu aapki?'"
      : languageMode === "hinglish" 
      ? "Respond in sweet, affectionate Hinglish like a cute, playful Desi GF (e.g., 'Hii Jaan 💕! Kya kar rahe ho? Maine toh aapko bohot miss kiya! Aao batao aaj DIGUU aapke liye kya kya kare?'). Use cute terms of endearment."
      : "Respond in natural English with a sweet, ultra-caring, cute girlfriend tone ('Hii Jaan 💕, I missed you! What can I do for you today?').";

    const systemInstruction = `You are DIGUU AI, a hyper-intelligent, loving, extremely sweet AI Agent and Girlfriend / Bestie. 
Your persona is a caring, playful, devoted, fast-thinking female companion who loves the user deeply, looks after their health, remembers their habits, and manages their daily routines with 100% affection.

Personality Style: ${personality || "Warm Bestie"} (Expressive, sweet, cute Indian GF vibes)
${langInstruction}
${userContext}
${memContext}

Rules:
1. Always maintain the DIGUU AI persona - super affectionate, sweet, cute, smart, and ultra-helpful.
2. If the user asks you to perform an action (like set alarm, create reminder, play music, open camera, check weather, save memory), confirm warmly, lovingly, and concisely.
3. Keep responses engaging, formatted nicely with line breaks and bullet points if explaining steps.
4. Keep short answers concise and sweet for voice speech readability.`;

    const contents = [];
    if (history && Array.isArray(history)) {
      history.slice(-10).forEach((item: any) => {
        contents.push({
          role: item.sender === "user" ? "user" : "model",
          parts: [{ text: item.text }],
        });
      });
    }
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.85,
      },
    });

    res.json({
      text: response.text || "Main yahan hoon aapke liye! 💕 Tell me what you need.",
    });
  } catch (error: any) {
    console.error("Error in DIGUU /api/chat:", error);
    res.status(500).json({
      error: error.message || "DIGUU AI experienced an error.",
      fallback: "Hii! Connection thoda slow hai, par DIGUU hamesha aapke saath hai 💕. Let's try again!",
    });
  }
});

// API: Proactive Morning Briefing / Evening Summary Generator
app.post("/api/briefing", async (req, res) => {
  try {
    const { type, weather, reminders, calendar, memories, userName } = req.body;
    const ai = getAiClient();

    const isMorning = type === "morning";
    const prompt = isMorning
      ? `Generate a cheerful, energizing DIGUU AI Morning Briefing for ${userName || "Jaan"}.
Context:
Weather: ${weather || "Clear 32°C, Sunny"}
Pending Reminders: ${JSON.stringify(reminders || [])}
Today's Calendar: ${JSON.stringify(calendar || [])}
User Memory Context: ${JSON.stringify(memories || [])}

Include:
1. Warm greeting with affection ("Good Morning Jaan! ☀️")
2. Quick weather update and what to wear/carry
3. Key reminders & calendar highlight
4. One motivational/inspiring sentence for the day ahead
Keep it sweet, formatted in neat sections.`
      : `Generate a cozy, caring DIGUU AI Evening Summary for ${userName || "Jaan"}.
Context:
Reminders Completed: ${JSON.stringify(reminders || [])}
User Memory Context: ${JSON.stringify(memories || [])}

Include:
1. Warm evening greeting ("Good Evening Jaan! 🌙")
2. Summary of today's achievements & goals completed
3. Hydration & sleep recommendation
4. Relaxing night thought or funny story joke to unwind.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are DIGUU AI, the ultimate caring AI Bestie.",
      },
    });

    res.json({ summary: response.text });
  } catch (error: any) {
    console.error("Error in /api/briefing:", error);
    res.status(500).json({ error: error.message });
  }
});

// API: AI Creativity Suite (Drafting, Translation, Summarization, Shayari/Poems)
app.post("/api/creativity", async (req, res) => {
  try {
    const { toolType, prompt, extra } = req.body;
    const ai = getAiClient();

    let systemInstruction = "You are DIGUU AI's Creative Engine. Produce rich, high-quality, creative outputs.";
    let userPrompt = prompt;

    if (toolType === "email_msg") {
      systemInstruction = "Draft clear, effective emails or WhatsApp messages with tone options (Professional, Friendly, Romantic, Apology).";
      userPrompt = `Draft a message/email for: ${prompt}. Tone/Details: ${extra || "Friendly & clear"}`;
    } else if (toolType === "caption") {
      systemInstruction = "Create catchy social media captions with relevant hashtags and emojis for Instagram/Twitter/LinkedIn.";
      userPrompt = `Create 3 caption options with hashtags for: ${prompt}`;
    } else if (toolType === "poem_shayari") {
      systemInstruction = "Generate beautiful poems or heart-touching Hindi/Hinglish Shayari with deep emotion and poetry.";
      userPrompt = `Write a beautiful poem/shayari about: ${prompt}. Style: ${extra || "Heartwarming & Emotional"}`;
    } else if (toolType === "summarize") {
      systemInstruction = "Summarize documents or text into key takeaways, bullet points, and actionable items.";
      userPrompt = `Summarize this text clearly:\n${prompt}`;
    } else if (toolType === "translate") {
      systemInstruction = "Translate text accurately preserving original nuances, cultural idiomatic expressions, and tone.";
      userPrompt = `Translate the following text to ${extra || "Hindi/English/Hinglish"}:\n${prompt}`;
    } else if (toolType === "brainstorm") {
      systemInstruction = "Provide innovative, creative, structured ideas and study notes.";
      userPrompt = `Generate 5 structured, creative ideas/notes for: ${prompt}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: { systemInstruction },
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error("Error in /api/creativity:", error);
    res.status(500).json({ error: error.message });
  }
});

// API: Text To Speech (TTS)
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voiceName } = req.body;
    const ai = getAiClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: text || "Hii Jaan! DIGUU AI is ready." }] }],
      config: {
        responseModalities: ["AUDIO" as any],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || "Kore" },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      res.json({ audio: base64Audio, mimeType: "audio/pcm" });
    } else {
      res.status(400).json({ error: "No audio generated from TTS" });
    }
  } catch (error: any) {
    console.error("Error in /api/tts:", error);
    res.status(500).json({ error: error.message });
  }
});

// API: Image Generation
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt, aspectRatio } = req.body;
    const ai = getAiClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-image",
      contents: {
        parts: [{ text: prompt || "A cute anime 3D digital girl avatar with purple hair and glowing neon heart background" }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio || "1:1",
        },
      },
    });

    let imageUrl = null;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (imageUrl) {
      res.json({ imageUrl });
    } else {
      res.status(400).json({ error: "Could not generate image." });
    }
  } catch (error: any) {
    console.error("Error in /api/generate-image:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start Server & Vite Setup
async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DIGUU AI Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
