import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  message: true,
}).extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  coverImage: text("cover_image"),
  tags: text("tags").array(),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  coverImage: true,
  tags: true,
  published: true,
}).extend({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export const analyticsEvents = pgTable("analytics_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventType: text("event_type").notNull(),
  page: text("page").notNull(),
  section: text("section"),
  visitorId: text("visitor_id"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).pick({
  eventType: true,
  page: true,
  section: true,
  visitorId: true,
  userAgent: true,
  referrer: true,
});

export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
}

export const homeContent = pgTable("home_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  heading: text("heading").notNull(),
  subheading: text("subheading").notNull(),
  ctaText: text("cta_text").notNull(),
  backgroundImage: text("background_image"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertHomeContentSchema = createInsertSchema(homeContent).pick({
  heading: true,
  subheading: true,
  ctaText: true,
  backgroundImage: true,
}).extend({
  heading: z.string().min(3, "Heading required"),
  subheading: z.string().min(3, "Subheading required"),
  ctaText: z.string().min(3, "CTA text required"),
  backgroundImage: z.string().optional(),
});

export type InsertHomeContent = z.infer<typeof insertHomeContentSchema>;
export type HomeContent = typeof homeContent.$inferSelect;

export const aboutContent = pgTable("about_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAboutContentSchema = createInsertSchema(aboutContent).pick({
  title: true,
  description: true,
  image: true,
}).extend({
  title: z.string().min(3, "Title required"),
  description: z.string().min(10, "Description required"),
  image: z.string().optional(),
});

export type InsertAboutContent = z.infer<typeof insertAboutContentSchema>;
export type AboutContent = typeof aboutContent.$inferSelect;

export const skills = pgTable("skills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  proficiency: integer("proficiency").default(80),
  icon: text("icon"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSkillSchema = createInsertSchema(skills).pick({
  name: true,
  category: true,
  proficiency: true,
  icon: true,
}).extend({
  name: z.string().min(2, "Name required"),
  category: z.string().min(2, "Category required"),
  proficiency: z.number().min(0).max(100).optional(),
  icon: z.string().optional(),
});

export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skills.$inferSelect;

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image"),
  techStack: text("tech_stack").array(),
  category: text("category"),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  title: true,
  description: true,
  image: true,
  techStack: true,
  category: true,
  githubUrl: true,
  liveUrl: true,
}).extend({
  title: z.string().min(3, "Title required"),
  description: z.string().min(10, "Description required"),
  image: z.string().optional(),
  techStack: z.array(z.string()).optional(),
  category: z.string().optional(),
  githubUrl: z.string().optional(),
  liveUrl: z.string().optional(),
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type ProjectDb = typeof projects.$inferSelect;

export const certificates = pgTable("certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  issuer: text("issuer").notNull(),
  issuedDate: text("issued_date").notNull(),
  credentialUrl: text("credential_url"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCertificateSchema = createInsertSchema(certificates).pick({
  title: true,
  issuer: true,
  issuedDate: true,
  credentialUrl: true,
  image: true,
}).extend({
  title: z.string().min(3, "Title required"),
  issuer: z.string().min(2, "Issuer required"),
  issuedDate: z.string().min(1, "Date required"),
  credentialUrl: z.string().optional(),
  image: z.string().optional(),
});

export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type Certificate = typeof certificates.$inferSelect;
