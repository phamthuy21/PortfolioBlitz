import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { 
  insertContactMessageSchema, 
  insertBlogPostSchema, 
  insertAnalyticsEventSchema,
  insertHomeContentSchema,
  insertAboutContentSchema,
  insertSkillSchema,
  insertProjectSchema,
  insertCertificateSchema,
} from "@shared/schema";
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
        res.status(200).json({
          success: true,
          message: "Analytics recorded",
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
      res.json({
        success: true,
        data: {
          summary: { totalViews: 0, totalEvents: 0 },
          recentEvents: [],
        },
      });
    }
  });

  // Home Content
  app.get("/api/admin/home", adminAuth, async (req, res) => {
    try {
      const content = await storage.getHomeContent();
      res.json({ success: true, data: content });
    } catch (error) {
      res.json({ success: true, data: { heading: "Full Stack Developer", subheading: "Building modern web applications", ctaText: "View My Work" } });
    }
  });

  app.put("/api/admin/home", adminAuth, async (req, res) => {
    try {
      const data = insertHomeContentSchema.parse(req.body);
      const content = await storage.upsertHomeContent(data);
      res.json({ success: true, data: content });
    } catch (error) {
      res.status(400).json({ success: false, message: "Invalid data" });
    }
  });

  // About Content
  app.get("/api/admin/about", adminAuth, async (req, res) => {
    try {
      const content = await storage.getAboutContent();
      res.json({ success: true, data: content });
    } catch (error) {
      res.json({ success: true, data: { title: "About Me", description: "Passionate full stack developer with experience in modern technologies" } });
    }
  });

  app.put("/api/admin/about", adminAuth, async (req, res) => {
    try {
      const data = insertAboutContentSchema.parse(req.body);
      const content = await storage.upsertAboutContent(data);
      res.json({ success: true, data: content });
    } catch (error) {
      res.status(400).json({ success: false, message: "Invalid data" });
    }
  });

  // Skills
  app.get("/api/admin/skills", adminAuth, async (req, res) => {
    try {
      const skills = await storage.getSkills();
      res.json({ success: true, data: skills });
    } catch (error) {
      res.json({ success: true, data: [] });
    }
  });

  app.post("/api/admin/skills", adminAuth, async (req, res) => {
    try {
      const data = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(data);
      res.status(201).json({ success: true, data: skill });
    } catch (error) {
      res.status(400).json({ success: false, message: "Invalid data" });
    }
  });

  app.patch("/api/admin/skills/:id", adminAuth, async (req, res) => {
    try {
      const skill = await storage.updateSkill(req.params.id, req.body);
      res.json({ success: true, data: skill });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error" });
    }
  });

  app.delete("/api/admin/skills/:id", adminAuth, async (req, res) => {
    try {
      await storage.deleteSkill(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error" });
    }
  });

  // Projects
  app.get("/api/admin/projects", adminAuth, async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json({ success: true, data: projects });
    } catch (error) {
      res.json({ success: true, data: [] });
    }
  });

  app.post("/api/admin/projects", adminAuth, async (req, res) => {
    try {
      const data = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(data);
      res.status(201).json({ success: true, data: project });
    } catch (error) {
      res.status(400).json({ success: false, message: "Invalid data" });
    }
  });

  app.patch("/api/admin/projects/:id", adminAuth, async (req, res) => {
    try {
      const project = await storage.updateProject(req.params.id, req.body);
      res.json({ success: true, data: project });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error" });
    }
  });

  app.delete("/api/admin/projects/:id", adminAuth, async (req, res) => {
    try {
      await storage.deleteProject(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error" });
    }
  });

  // Certificates
  app.get("/api/admin/certificates", adminAuth, async (req, res) => {
    try {
      const certs = await storage.getCertificates();
      res.json({ success: true, data: certs });
    } catch (error) {
      res.json({ success: true, data: [] });
    }
  });

  app.post("/api/admin/certificates", adminAuth, async (req, res) => {
    try {
      const data = insertCertificateSchema.parse(req.body);
      const cert = await storage.createCertificate(data);
      res.status(201).json({ success: true, data: cert });
    } catch (error) {
      res.status(400).json({ success: false, message: "Invalid data" });
    }
  });

  app.patch("/api/admin/certificates/:id", adminAuth, async (req, res) => {
    try {
      const cert = await storage.updateCertificate(req.params.id, req.body);
      res.json({ success: true, data: cert });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error" });
    }
  });

  app.delete("/api/admin/certificates/:id", adminAuth, async (req, res) => {
    try {
      await storage.deleteCertificate(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error" });
    }
  });

  return httpServer;
}
