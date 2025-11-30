import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema, insertBlogPostSchema, insertAnalyticsEventSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

function adminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Message sent successfully",
        data: message,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({
          success: false,
          message: validationError.message,
        });
      } else {
        console.error("Error saving contact message:", error);
        res.status(500).json({
          success: false,
          message: "An error occurred while sending your message. Please try again.",
        });
      }
    }
  });

  app.get("/api/admin/messages", adminAuth, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json({
        success: true,
        data: messages,
      });
    } catch (error) {
      console.error("Error retrieving messages:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while retrieving messages.",
      });
    }
  });

  app.patch("/api/admin/messages/:id/read", adminAuth, async (req, res) => {
    try {
      const message = await storage.markMessageAsRead(req.params.id);
      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }
      res.json({
        success: true,
        data: message,
      });
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred.",
      });
    }
  });

  app.delete("/api/admin/messages/:id", adminAuth, async (req, res) => {
    try {
      await storage.deleteContactMessage(req.params.id);
      res.json({
        success: true,
        message: "Message deleted",
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred.",
      });
    }
  });

  app.post("/api/admin/login", async (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      res.json({
        success: true,
        token: ADMIN_PASSWORD,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }
  });

  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts(true);
      res.json({
        success: true,
        data: posts,
      });
    } catch (error) {
      console.error("Error retrieving blog posts:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred.",
      });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post || !post.published) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }
      res.json({
        success: true,
        data: post,
      });
    } catch (error) {
      console.error("Error retrieving blog post:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred.",
      });
    }
  });

  app.get("/api/admin/blog", adminAuth, async (req, res) => {
    try {
      const posts = await storage.getBlogPosts(false);
      res.json({
        success: true,
        data: posts,
      });
    } catch (error) {
      console.error("Error retrieving blog posts:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred.",
      });
    }
  });

  app.post("/api/admin/blog", adminAuth, async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json({
        success: true,
        data: post,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({
          success: false,
          message: validationError.message,
        });
      } else {
        console.error("Error creating blog post:", error);
        res.status(500).json({
          success: false,
          message: "An error occurred.",
        });
      }
    }
  });

  app.patch("/api/admin/blog/:id", adminAuth, async (req, res) => {
    try {
      const post = await storage.updateBlogPost(req.params.id, req.body);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }
      res.json({
        success: true,
        data: post,
      });
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred.",
      });
    }
  });

  app.delete("/api/admin/blog/:id", adminAuth, async (req, res) => {
    try {
      await storage.deleteBlogPost(req.params.id);
      res.json({
        success: true,
        message: "Post deleted",
      });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred.",
      });
    }
  });

  app.post("/api/analytics", async (req, res) => {
    try {
      const validatedData = insertAnalyticsEventSchema.parse(req.body);
      const event = await storage.createAnalyticsEvent(validatedData);
      res.status(201).json({
        success: true,
        data: event,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid data",
        });
      } else {
        console.error("Error creating analytics event:", error);
        res.status(500).json({
          success: false,
          message: "An error occurred.",
        });
      }
    }
  });

  app.get("/api/admin/analytics", adminAuth, async (req, res) => {
    try {
      const summary = await storage.getAnalyticsSummary();
      const events = await storage.getAnalyticsEvents(100);
      res.json({
        success: true,
        data: {
          summary,
          recentEvents: events,
        },
      });
    } catch (error) {
      console.error("Error retrieving analytics:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred.",
      });
    }
  });

  return httpServer;
}
