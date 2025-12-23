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
  insertCertificateSchema
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

  // Home Content Routes
  app.get("/api/home", async (req, res) => {
    try {
      const content = await storage.getHomeContent();
      res.json({ success: true, data: content || null });
    } catch (error) {
      console.error("Error retrieving home content:", error);
      res.status(500).json({ success: false, message: "An error occurred." });
    }
  });

  app.post("/api/admin/home", adminAuth, async (req, res) => {
    try {
      const validatedData = insertHomeContentSchema.parse(req.body);
      const content = await storage.upsertHomeContent(validatedData);
      res.json({ success: true, data: content });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: fromZodError(error).message });
      } else {
        console.error("Error updating home content:", error);
        res.status(500).json({ success: false, message: "An error occurred." });
      }
    }
  });

  // About Content Routes
  app.get("/api/about", async (req, res) => {
    try {
      const content = await storage.getAboutContent();
      res.json({ success: true, data: content || null });
    } catch (error) {
      console.error("Error retrieving about content:", error);
      res.status(500).json({ success: false, message: "An error occurred." });
    }
  });

  app.post("/api/admin/about", adminAuth, async (req, res) => {
    try {
      const validatedData = insertAboutContentSchema.parse(req.body);
      const content = await storage.upsertAboutContent(validatedData);
      res.json({ success: true, data: content });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: fromZodError(error).message });
      } else {
        console.error("Error updating about content:", error);
        res.status(500).json({ success: false, message: "An error occurred." });
      }
    }
  });

  // Skills Routes
  app.get("/api/skills", async (req, res) => {
    try {
      const skillsList = await storage.getSkills();
      res.json({ success: true, data: skillsList });
    } catch (error) {
      console.error("Error retrieving skills:", error);
      res.status(500).json({ success: false, message: "An error occurred." });
    }
  });

  app.post("/api/admin/skills", adminAuth, async (req, res) => {
    try {
      const validatedData = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(validatedData);
      res.status(201).json({ success: true, data: skill });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: fromZodError(error).message });
      } else {
        console.error("Error creating skill:", error);
        res.status(500).json({ success: false, message: "An error occurred." });
      }
    }
  });

  app.patch("/api/admin/skills/:id", adminAuth, async (req, res) => {
    try {
      const skill = await storage.updateSkill(req.params.id, req.body);
      if (!skill) return res.status(404).json({ success: false, message: "Skill not found" });
      res.json({ success: true, data: skill });
    } catch (error) {
      console.error("Error updating skill:", error);
      res.status(500).json({ success: false, message: "An error occurred." });
    }
  });

  app.delete("/api/admin/skills/:id", adminAuth, async (req, res) => {
    try {
      await storage.deleteSkill(req.params.id);
      res.json({ success: true, message: "Skill deleted" });
    } catch (error) {
      console.error("Error deleting skill:", error);
      res.status(500).json({ success: false, message: "An error occurred." });
    }
  });

  // Projects Routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projectsList = await storage.getProjects();
      res.json({ success: true, data: projectsList });
    } catch (error) {
      console.error("Error retrieving projects:", error);
      res.status(500).json({ success: false, message: "An error occurred." });
    }
  });

  app.post("/api/admin/projects", adminAuth, async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json({ success: true, data: project });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: fromZodError(error).message });
      } else {
        console.error("Error creating project:", error);
        res.status(500).json({ success: false, message: "An error occurred." });
      }
    }
  });

  app.patch("/api/admin/projects/:id", adminAuth, async (req, res) => {
    try {
      const project = await storage.updateProject(req.params.id, req.body);
      if (!project) return res.status(404).json({ success: false, message: "Project not found" });
      res.json({ success: true, data: project });
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ success: false, message: "An error occurred." });
    }
  });

  app.delete("/api/admin/projects/:id", adminAuth, async (req, res) => {
    try {
      await storage.deleteProject(req.params.id);
      res.json({ success: true, message: "Project deleted" });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ success: false, message: "An error occurred." });
    }
  });

  // Certificates Routes
  app.get("/api/certificates", async (req, res) => {
    try {
      const certsList = await storage.getCertificates();
      res.json({ success: true, data: certsList });
    } catch (error) {
      console.error("Error retrieving certificates:", error);
      res.status(500).json({ success: false, message: "An error occurred." });
    }
  });

  app.post("/api/admin/certificates", adminAuth, async (req, res) => {
    try {
      const validatedData = insertCertificateSchema.parse(req.body);
      const certificate = await storage.createCertificate(validatedData);
      res.status(201).json({ success: true, data: certificate });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: fromZodError(error).message });
      } else {
        console.error("Error creating certificate:", error);
        res.status(500).json({ success: false, message: "An error occurred." });
      }
    }
  });

  app.patch("/api/admin/certificates/:id", adminAuth, async (req, res) => {
    try {
      const certificate = await storage.updateCertificate(req.params.id, req.body);
      if (!certificate) return res.status(404).json({ success: false, message: "Certificate not found" });
      res.json({ success: true, data: certificate });
    } catch (error) {
      console.error("Error updating certificate:", error);
      res.status(500).json({ success: false, message: "An error occurred." });
    }
  });

  app.delete("/api/admin/certificates/:id", adminAuth, async (req, res) => {
    try {
      await storage.deleteCertificate(req.params.id);
      res.json({ success: true, message: "Certificate deleted" });
    } catch (error) {
      console.error("Error deleting certificate:", error);
      res.status(500).json({ success: false, message: "An error occurred." });
    }
  });

  return httpServer;
}
