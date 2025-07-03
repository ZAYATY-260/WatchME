import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

let chat;
let history = [];

export async function sendToGemini(userInput) {
  if (!chat) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    chat = model.startChat({ history: [] }); // start with empty history
    history = [];
  }

  // Add the new user message to the history
  history.push({ author: "user", content: userInput });

  // Build a system prompt for guidance
  const systemPrompt = `
You are a helpful assistant that extracts the most likely movie title from the user's description.
Respond ONLY with the movie title — no extra explanation, punctuation, or quotes.
`;

  // Always include system prompt as the first message (or keep it in history if supported)
  const messages = [{ author: "system", content: systemPrompt }, ...history];

  // Send the updated history to Gemini
  const result = await chat.sendMessage(userInput, { history: messages });
  const response = await result.response;
  const text = await response.text();

  // Add Gemini's reply to the history
  history.push({ author: "assistant", content: text.trim() });

  // Clean up the response and return
  return text.trim().replace(/[".]/g, "");
}
