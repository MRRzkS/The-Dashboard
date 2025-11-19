import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { text: "Error: API Key is missing in the safe (.env.local)" }, 
        { status: 500 }
      );
    }

    // Initialize the new Engine
    const ai = new GoogleGenAI({ apiKey });

    // The Prompt: We inject a system instruction to keep the persona
    const prompt = `You are Vito Corelli's digital assistant. You are helpful, precise, and understated. 
    You speak in a professional, slightly 'Noir' tone. 
    
    The Boss asks: ${message}`;

    // Execute the new protocol
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Or "gemini-1.5-pro" (gemini-3 is currently internal/waitlist, using the latest stable flash for speed)
      // If you truly have access to "gemini-3-pro-preview", replace the line above with:
      // model: "gemini-3-pro-preview", 
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt }
          ]
        }
      ],
    });

    // Extract the intel
    const text = response.text;

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("--- SECURE LINE FAILURE ---");
    console.error(error);
    return NextResponse.json(
      { text: `Connection severed: ${error.message}` }, 
      { status: 500 }
    );
  }
}