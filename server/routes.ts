import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateChatResponse } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat endpoint to handle user questions
  app.post("/api/chat", async (req, res) => {
    try {
      const { question } = req.body;
      
      if (!question || typeof question !== "string") {
        return res.status(400).json({ 
          error: "Invalid request. 'question' is required and must be a string."
        });
      }
      
      // Generate response using OpenAI
      const answer = await generateChatResponse(question);
      
      // Send the response back to the client
      res.json({ answer });
    } catch (error) {
      console.error("Error processing chat request:", error);
      res.status(500).json({ 
        error: "An error occurred while processing your request." 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
