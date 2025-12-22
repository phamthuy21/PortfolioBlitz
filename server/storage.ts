import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import {
  type User,
  type InsertUser,
  type ContactMessage,
  type InsertContactMessage,
  type BlogPost,
  type InsertBlogPost,
  type AnalyticsEvent,
  type InsertAnalyticsEvent,
  type HomeContent,
  type InsertHomeContent,
  type AboutContent,
  type InsertAboutContent,
  type Skill,
  type InsertSkill,
  type ProjectDb,
  type InsertProject,
  type Certificate,
  type InsertCertificate,
  users,
  contactMessages,
  blogPosts,
  analyticsEvents,
  homeContent,
  aboutContent,
  skills,
  projects,
  certificates,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: string): Promise<ContactMessage | undefined>;
  markMessageAsRead(id: string): Promise<ContactMessage | undefined>;
  deleteContactMessage(id: string): Promise<void>;
  
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  getBlogPosts(publishedOnly?: boolean): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<void>;
  
  createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent>;
  getAnalyticsEvents(limit?: number): Promise<AnalyticsEvent[]>;
  getAnalyticsSummary(): Promise<{
    totalViews: number;
    uniqueVisitors: number;
    sectionViews: Record<string, number>;
    pageViews: Record<string, number>;
  }>;
  
  getHomeContent(): Promise<HomeContent | undefined>;
  upsertHomeContent(content: InsertHomeContent): Promise<HomeContent>;
  
  getAboutContent(): Promise<AboutContent | undefined>;
  upsertAboutContent(content: InsertAboutContent): Promise<AboutContent>;
  
  createSkill(skill: InsertSkill): Promise<Skill>;
  getSkills(): Promise<Skill[]>;
  updateSkill(id: string, skill: Partial<InsertSkill>): Promise<Skill | undefined>;
  deleteSkill(id: string): Promise<void>;
  
  createProject(project: InsertProject): Promise<ProjectDb>;
  getProjects(): Promise<ProjectDb[]>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<ProjectDb | undefined>;
  deleteProject(id: string): Promise<void>;
  
  createCertificate(cert: InsertCertificate): Promise<Certificate>;
  getCertificates(): Promise<Certificate[]>;
  updateCertificate(id: string, cert: Partial<InsertCertificate>): Promise<Certificate | undefined>;
  deleteCertificate(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db.insert(contactMessages).values(insertMessage).returning();
    return message;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async getContactMessage(id: string): Promise<ContactMessage | undefined> {
    const [message] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return message;
  }

  async markMessageAsRead(id: string): Promise<ContactMessage | undefined> {
    const [message] = await db
      .update(contactMessages)
      .set({ isRead: true })
      .where(eq(contactMessages.id, id))
      .returning();
    return message;
  }

  async deleteContactMessage(id: string): Promise<void> {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [blogPost] = await db.insert(blogPosts).values(post).returning();
    return blogPost;
  }

  async getBlogPosts(publishedOnly = false): Promise<BlogPost[]> {
    if (publishedOnly) {
      return db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.createdAt));
    }
    return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updated] = await db
      .update(blogPosts)
      .set({ ...post, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return updated;
  }

  async deleteBlogPost(id: string): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  async createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const [analyticsEvent] = await db.insert(analyticsEvents).values(event).returning();
    return analyticsEvent;
  }

  async getAnalyticsEvents(limit = 100): Promise<AnalyticsEvent[]> {
    return db.select().from(analyticsEvents).orderBy(desc(analyticsEvents.createdAt)).limit(limit);
  }

  async getAnalyticsSummary(): Promise<{
    totalViews: number;
    uniqueVisitors: number;
    sectionViews: Record<string, number>;
    pageViews: Record<string, number>;
  }> {
    const events = await db.select().from(analyticsEvents);
    
    const uniqueVisitors = new Set(events.map((e: AnalyticsEvent) => e.visitorId).filter(Boolean)).size;
    const sectionViews: Record<string, number> = {};
    const pageViews: Record<string, number> = {};

    for (const event of events) {
      if (event.section) {
        sectionViews[event.section] = (sectionViews[event.section] || 0) + 1;
      }
      pageViews[event.page] = (pageViews[event.page] || 0) + 1;
    }

    return {
      totalViews: events.length,
      uniqueVisitors,
      sectionViews,
      pageViews,
    };
  }

  async getHomeContent(): Promise<HomeContent | undefined> {
    const [content] = await db.select().from(homeContent);
    return content;
  }

  async upsertHomeContent(content: InsertHomeContent): Promise<HomeContent> {
    const existing = await this.getHomeContent();
    if (existing) {
      const [updated] = await db.update(homeContent).set({ ...content, updatedAt: new Date() }).returning();
      return updated;
    }
    const [created] = await db.insert(homeContent).values(content).returning();
    return created;
  }

  async getAboutContent(): Promise<AboutContent | undefined> {
    const [content] = await db.select().from(aboutContent);
    return content;
  }

  async upsertAboutContent(content: InsertAboutContent): Promise<AboutContent> {
    const existing = await this.getAboutContent();
    if (existing) {
      const [updated] = await db.update(aboutContent).set({ ...content, updatedAt: new Date() }).returning();
      return updated;
    }
    const [created] = await db.insert(aboutContent).values(content).returning();
    return created;
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const [created] = await db.insert(skills).values(skill).returning();
    return created;
  }

  async getSkills(): Promise<Skill[]> {
    return db.select().from(skills).orderBy(desc(skills.createdAt));
  }

  async updateSkill(id: string, skill: Partial<InsertSkill>): Promise<Skill | undefined> {
    const [updated] = await db.update(skills).set(skill).where(eq(skills.id, id)).returning();
    return updated;
  }

  async deleteSkill(id: string): Promise<void> {
    await db.delete(skills).where(eq(skills.id, id));
  }

  async createProject(project: InsertProject): Promise<ProjectDb> {
    const [created] = await db.insert(projects).values(project).returning();
    return created;
  }

  async getProjects(): Promise<ProjectDb[]> {
    return db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<ProjectDb | undefined> {
    const [updated] = await db.update(projects).set(project).where(eq(projects.id, id)).returning();
    return updated;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async createCertificate(cert: InsertCertificate): Promise<Certificate> {
    const [created] = await db.insert(certificates).values(cert).returning();
    return created;
  }

  async getCertificates(): Promise<Certificate[]> {
    return db.select().from(certificates).orderBy(desc(certificates.createdAt));
  }

  async updateCertificate(id: string, cert: Partial<InsertCertificate>): Promise<Certificate | undefined> {
    const [updated] = await db.update(certificates).set(cert).where(eq(certificates.id, id)).returning();
    return updated;
  }

  async deleteCertificate(id: string): Promise<void> {
    await db.delete(certificates).where(eq(certificates.id, id));
  }
}

export const storage = new DatabaseStorage();
