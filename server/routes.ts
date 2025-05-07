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

  // API endpoints for knowledge management
  
  // Get all knowledge items
  app.get("/api/knowledge", async (req, res) => {
    try {
      const items = await storage.getAllKnowledgeItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching knowledge items:", error);
      res.status(500).json({ error: "Failed to retrieve knowledge items" });
    }
  });
  
  // Add new knowledge item
  app.post("/api/knowledge", async (req, res) => {
    try {
      const { content } = req.body;
      
      if (!content || typeof content !== "string") {
        return res.status(400).json({ 
          error: "Invalid request. 'content' is required and must be a string."
        });
      }
      
      const newItem = await storage.addKnowledgeItem(content);
      res.status(201).json(newItem);
    } catch (error) {
      console.error("Error adding knowledge item:", error);
      res.status(500).json({ error: "Failed to add knowledge item" });
    }
  });
  
  // Clear all knowledge items
  app.delete("/api/knowledge", async (req, res) => {
    try {
      await storage.clearKnowledgeItems();
      res.json({ message: "All knowledge items have been cleared" });
    } catch (error) {
      console.error("Error clearing knowledge items:", error);
      res.status(500).json({ error: "Failed to clear knowledge items" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
