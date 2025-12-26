import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Mail, Trash2, Check, Eye, ArrowLeft, Lock, Loader2, BarChart3, FileText, Home, User, Lightbulb, Briefcase, Award, Settings } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ContactMessage, BlogPost, AnalyticsEvent } from "@shared/schema";

function LoginForm({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        onLogin(data.token);
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md" data-testid="card-admin-login">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle data-testid="text-login-title">Admin Login</CardTitle>
            <CardDescription>Enter your password to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="input-admin-password"
                />
              </div>
              {error && (
                <p className="text-destructive text-sm" data-testid="text-login-error">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                data-testid="button-admin-login"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function MessagesTab({ token }: { token: string }) {
  const { toast } = useToast();

  const { data: messagesData, isLoading } = useQuery<{ success: boolean; data: ContactMessage[] }>({
    queryKey: ["/api/admin/messages"],
    queryFn: async () => {
      const response = await fetch("/api/admin/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return fetch(`/api/admin/messages/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      toast({ title: "Message deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
    },
  });

  const messages = messagesData?.data || [];
  const unreadCount = messages.filter(m => !m.isRead).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" data-testid="text-messages-title">Contact Messages</h2>
          <p className="text-muted-foreground">
            {messages.length} total, {unreadCount} unread
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Mail className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No messages yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card
                className={`${!message.isRead ? "border-primary/50 bg-primary/5" : ""}`}
                data-testid={`card-message-${message.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold" data-testid={`text-message-name-${message.id}`}>
                          {message.name}
                        </span>
                        {!message.isRead && (
                          <Badge variant="default" className="text-xs">New</Badge>
                        )}
                      </div>
                      <a
                        href={`mailto:${message.email}`}
                        className="text-sm text-primary hover:underline"
                        data-testid={`link-message-email-${message.id}`}
                      >
                        {message.email}
                      </a>
                      <p className="mt-3 text-sm text-muted-foreground" data-testid={`text-message-content-${message.id}`}>
                        {message.message}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {message.createdAt && format(new Date(message.createdAt), "PPp")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!message.isRead && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => markReadMutation.mutate(message.id)}
                          disabled={markReadMutation.isPending}
                          data-testid={`button-mark-read-${message.id}`}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteMutation.mutate(message.id)}
                        disabled={deleteMutation.isPending}
                        data-testid={`button-delete-message-${message.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function AnalyticsTab({ token }: { token: string }) {
  const { data: analyticsData, isLoading } = useQuery<{
    success: boolean;
    data: {
      summary: {
        totalViews: number;
        uniqueVisitors: number;
        sectionViews: Record<string, number>;
        pageViews: Record<string, number>;
      };
      recentEvents: AnalyticsEvent[];
    };
  }>({
    queryKey: ["/api/admin/analytics"],
    queryFn: async () => {
      const response = await fetch("/api/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const summary = analyticsData?.data?.summary;
  const recentEvents = analyticsData?.data?.recentEvents || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold" data-testid="text-analytics-title">Analytics</h2>
        <p className="text-muted-foreground">Track visitor engagement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card data-testid="card-total-views">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summary?.totalViews || 0}</p>
                <p className="text-sm text-muted-foreground">Total Page Views</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-unique-visitors">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summary?.uniqueVisitors || 0}</p>
                <p className="text-sm text-muted-foreground">Unique Visitors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-section-count">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Object.keys(summary?.sectionViews || {}).length}</p>
                <p className="text-sm text-muted-foreground">Sections Viewed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {Object.keys(summary?.sectionViews || {}).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Section Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(summary?.sectionViews || {}).map(([section, count]) => (
                <div key={section} className="flex items-center justify-between">
                  <span className="capitalize">{section}</span>
                  <Badge variant="secondary">{count} views</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {recentEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentEvents.slice(0, 10).map((event) => (
                <div key={event.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{event.eventType}</Badge>
                    <span className="text-muted-foreground">{event.page}</span>
                    {event.section && <span className="text-muted-foreground">- {event.section}</span>}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {event.createdAt && format(new Date(event.createdAt), "HH:mm")}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {recentEvents.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No analytics data yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Data will appear as visitors interact with your portfolio
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function BlogTab({ token }: { token: string }) {
  const { data: postsData, isLoading } = useQuery<{ success: boolean; data: BlogPost[] }>({
    queryKey: ["/api/admin/blog"],
    queryFn: async () => {
      const response = await fetch("/api/admin/blog", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
  });

  const posts = postsData?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" data-testid="text-blog-title">Blog Posts</h2>
          <p className="text-muted-foreground">{posts.length} posts</p>
        </div>
        <Link href="/admin/blog/new">
          <Button data-testid="button-new-post">New Post</Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No blog posts yet</p>
            <Link href="/admin/blog/new">
              <Button variant="outline" className="mt-4" data-testid="button-create-first-post">
                Create your first post
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} data-testid={`card-post-${post.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{post.title}</h3>
                      <Badge variant={post.published ? "default" : "secondary"}>
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {post.createdAt && format(new Date(post.createdAt), "PPP")}
                    </p>
                  </div>
                  <Link href={`/admin/blog/${post.id}`}>
                    <Button variant="outline" size="sm" data-testid={`button-edit-post-${post.id}`}>
                      Edit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

import { AdminNavbar } from "@/components/AdminNavbar";

function ContentTab({ token }: { token: string }) {
  const contentLinks = [
    { title: "Home Section", href: "/admin/home", icon: Home, description: "Hero title, subtitle, and CTA" },
    { title: "About Section", href: "/admin/about", icon: User, description: "Personal bio and introduction" },
    { title: "Skills", href: "/admin/skills", icon: Lightbulb, description: "Technical skills and proficiency" },
    { title: "Projects", href: "/admin/projects", icon: Briefcase, description: "Portfolio projects and tech stack" },
    { title: "Certificates", href: "/admin/certificates", icon: Award, description: "Professional certifications" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Content Management</h2>
        <p className="text-muted-foreground">Manage your portfolio content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contentLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer group hover-elevate">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <link.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{link.title}</CardTitle>
                  <CardDescription>{link.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function AdminDashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar token={token} onLogout={onLogout} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="messages" className="space-y-6">
          <TabsList data-testid="tabs-admin">
            <TabsTrigger value="messages" data-testid="tab-messages">
              <Mail className="mr-2 h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="content" data-testid="tab-content">
              <Settings className="mr-2 h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="blog" data-testid="tab-blog">
              <FileText className="mr-2 h-4 w-4" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="analytics" data-testid="tab-analytics">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages">
            <MessagesTab token={token} />
          </TabsContent>

          <TabsContent value="content">
            <ContentTab token={token} />
          </TabsContent>

          <TabsContent value="blog">
            <BlogTab token={token} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab token={token} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}


export default function AdminPage() {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("adminToken");
  });

  const handleLogin = (newToken: string) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
  };

  if (!token) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <AdminDashboard token={token} onLogout={handleLogout} />;
}
