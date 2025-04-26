import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const model = geminiAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});
