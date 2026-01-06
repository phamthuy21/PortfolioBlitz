import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { 
  Mail, Trash2, Check, Eye, Lock, Loader2, 
  BarChart3, FileText, Home, User, Lightbulb, Briefcase, 
  Award, Settings, ChevronRight, MessageSquare, Plus, ExternalLink, LogOut
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminNavbar } from "@/components/AdminNavbar";
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
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-purple-500/10 -z-10" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4"
      >
        <Card className="border-primary/20 shadow-2xl backdrop-blur-sm bg-card/80" data-testid="card-admin-login">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto p-4 rounded-2xl bg-primary/10 w-fit">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight" data-testid="text-login-title">Portfolio Admin</CardTitle>
            <CardDescription className="text-base text-muted-foreground">Sign in to manage your professional presence</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-12 text-lg border-primary/20 focus:border-primary transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="input-admin-password"
                  autoFocus
                />
              </div>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-destructive text-sm font-medium flex items-center gap-2" 
                  data-testid="text-login-error"
                >
                  <span className="w-1 h-1 rounded-full bg-destructive" />
                  {error}
                </motion.p>
              )}
              <Button
                type="submit"
                className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover-elevate active-elevate-2"
                disabled={loading}
                data-testid="button-admin-login"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Access Dashboard"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t border-primary/10 pt-6">
            <p className="text-xs text-muted-foreground">© 2026 Thuy Pham Portfolio System</p>
          </CardFooter>
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
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Retrieving messages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight" data-testid="text-messages-title">Messages</h2>
          <p className="text-muted-foreground mt-1">
            Manage incoming contact requests from your portfolio
          </p>
        </div>
        <Badge variant="secondary" className="px-4 py-1 text-sm rounded-full">
          {unreadCount} New / {messages.length} Total
        </Badge>
      </div>

      {messages.length === 0 ? (
        <Card className="border-dashed border-2 py-20 flex flex-col items-center justify-center bg-muted/30">
          <CardContent className="text-center space-y-4">
            <div className="p-4 rounded-full bg-background shadow-sm w-fit mx-auto">
              <Mail className="h-12 w-12 text-muted-foreground/30" />
            </div>
            <div className="space-y-1">
              <p className="text-xl font-semibold">Inbox is quiet</p>
              <p className="text-muted-foreground">No visitor messages received yet</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group"
              >
                <Card
                  className={`transition-all duration-300 border-l-4 ${
                    !message.isRead 
                      ? "border-l-primary border-primary/20 bg-primary/5 shadow-md shadow-primary/5" 
                      : "border-l-transparent hover:border-l-muted-foreground/30"
                  }`}
                  data-testid={`card-message-${message.id}`}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center flex-wrap gap-3">
                          <h3 className="font-bold text-lg leading-none" data-testid={`text-message-name-${message.id}`}>
                            {message.name}
                          </h3>
                          {!message.isRead && (
                            <Badge variant="default" className="text-[10px] uppercase tracking-wider px-2 py-0">New</Badge>
                          )}
                          <span className="text-xs text-muted-foreground font-medium flex items-center">
                            <span className="mr-1">📅</span>
                            {message.createdAt && format(new Date(message.createdAt), "MMM d, HH:mm")}
                          </span>
                        </div>
                        <a
                          href={`mailto:${message.email}`}
                          className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                          data-testid={`link-message-email-${message.id}`}
                        >
                          <Mail className="h-3 w-3" />
                          {message.email}
                        </a>
                        <div className="relative pl-4 border-l-2 border-muted/50 py-1">
                          <p className="text-base leading-relaxed" data-testid={`text-message-content-${message.id}`}>
                            {message.message}
                          </p>
                        </div>
                      </div>
                      <div className="flex sm:flex-row md:flex-col lg:flex-row gap-2 self-end md:self-start opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        {!message.isRead && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="bg-background shadow-sm border"
                            onClick={() => markReadMutation.mutate(message.id)}
                            disabled={markReadMutation.isPending}
                            data-testid={`button-mark-read-${message.id}`}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Read
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => deleteMutation.mutate(message.id)}
                          disabled={deleteMutation.isPending}
                          data-testid={`button-delete-message-${message.id}`}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Discard
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function ContentTab({ token }: { token: string }) {
  const contentLinks = [
    { title: "Home Section", href: "/admin/home", icon: Home, description: "Hero title, subtitle, and CTA", color: "bg-blue-500/10 text-blue-500" },
    { title: "About Section", href: "/admin/about", icon: User, description: "Personal bio and introduction", color: "bg-emerald-500/10 text-emerald-500" },
    { title: "Skills", href: "/admin/skills", icon: Lightbulb, description: "Technical skills and proficiency", color: "bg-amber-500/10 text-amber-500" },
    { title: "Projects", href: "/admin/projects", icon: Briefcase, description: "Portfolio projects and tech stack", color: "bg-purple-500/10 text-purple-500" },
    { title: "Certificates", href: "/admin/certificates", icon: Award, description: "Professional certifications", color: "bg-pink-500/10 text-pink-500" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight">Portfolio Content</h2>
        <p className="text-muted-foreground mt-1">Update and maintain your professional information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentLinks.map((link, i) => (
          <motion.div
            key={link.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={link.href}>
              <Card className="h-full hover:border-primary/50 transition-all cursor-pointer group hover-elevate hover:shadow-lg overflow-hidden border-2 border-transparent">
                <CardHeader className="p-6">
                  <div className={`p-3 rounded-2xl w-fit mb-4 transition-transform group-hover:scale-110 duration-300 ${link.color}`}>
                    <link.icon className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-xl flex items-center justify-between">
                      {link.title}
                      <ChevronRight className="h-5 w-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{link.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
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
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Calculating analytics...</p>
      </div>
    );
  }

  const summary = analyticsData?.data?.summary;
  const recentEvents = analyticsData?.data?.recentEvents || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight" data-testid="text-analytics-title">Insights</h2>
          <p className="text-muted-foreground mt-1">See how visitors interact with your portfolio</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] })}>
          Refresh Stats
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-none bg-gradient-to-br from-primary/5 to-transparent overflow-hidden" data-testid="card-total-views">
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-3xl bg-primary/10 border border-primary/20">
                <Eye className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-black tracking-tighter">{summary?.totalViews || 0}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Page Views</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-gradient-to-br from-emerald-500/5 to-transparent overflow-hidden" data-testid="card-unique-visitors">
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20">
                <BarChart3 className="h-8 w-8 text-emerald-500" />
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-black tracking-tighter text-emerald-600">{summary?.uniqueVisitors || 0}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Unique Visitors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-gradient-to-br from-purple-500/5 to-transparent overflow-hidden" data-testid="card-section-count">
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-3xl bg-purple-500/10 border border-purple-500/20">
                <MessageSquare className="h-8 w-8 text-purple-500" />
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-black tracking-tighter text-purple-600">{Object.keys(summary?.sectionViews || {}).length}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Hot Sections</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Popular Sections</CardTitle>
            <CardDescription>Views by portfolio area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(summary?.sectionViews || {}).length > 0 ? (
                Object.entries(summary?.sectionViews || {})
                  .sort(([, a], [, b]) => b - a)
                  .map(([section, count], i) => (
                    <div key={section} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="capitalize font-semibold">{section}</span>
                        <span className="text-primary font-bold">{count}</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / (summary?.totalViews || 1)) * 100}%` }}
                          className="h-full bg-primary"
                        />
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-center py-8 text-muted-foreground">No section data yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest visitor events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {recentEvents.length > 0 ? (
                recentEvents.slice(0, 20).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-transparent hover:border-primary/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-background shadow-sm">
                        <Badge variant="outline" className="text-[10px] uppercase border-primary/20 text-primary">{event.eventType}</Badge>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold leading-tight">{event.page}</p>
                        {event.section && <p className="text-xs text-muted-foreground">{event.section} section</p>}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap ml-4">
                      {event.createdAt && format(new Date(event.createdAt), "HH:mm:ss")}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-muted-foreground">Waiting for activity...</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
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
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight" data-testid="text-blog-title">Blog Management</h2>
          <p className="text-muted-foreground mt-1">Publish articles and thought leadership</p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="h-11 px-6 shadow-lg shadow-primary/20 hover-elevate" data-testid="button-new-post">
            <Plus className="mr-2 h-5 w-5" /> New Article
          </Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <Card className="border-dashed border-2 py-20 flex flex-col items-center justify-center bg-muted/30">
          <CardContent className="text-center space-y-6">
            <div className="p-4 rounded-full bg-background shadow-sm w-fit mx-auto">
              <FileText className="h-12 w-12 text-muted-foreground/30" />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-semibold">No stories yet</p>
              <p className="text-muted-foreground">Start writing to build your audience</p>
            </div>
            <Link href="/admin/blog/new">
              <Button variant="outline" className="h-10 hover-elevate" data-testid="button-create-first-post">
                Draft your first post
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-primary/5 group" data-testid={`card-post-${post.id}`}>
              <CardContent className="p-0 flex flex-col md:flex-row">
                {post.coverImage && (
                  <div className="w-full md:w-48 h-48 md:h-auto overflow-hidden">
                    <img src={post.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="flex-1 p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={post.published ? "default" : "secondary"} className="uppercase text-[10px] font-black">
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-medium">{post.createdAt && format(new Date(post.createdAt), "MMMM d, yyyy")}</span>
                      </div>
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{post.title}</h3>
                    </div>
                    <Link href={`/admin/blog/${post.id}`}>
                      <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 text-primary" data-testid={`button-edit-post-${post.id}`}>
                        <Settings className="h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                  <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-2">
                      {post.tags?.map(tag => (
                        <Badge key={tag} variant="outline" className="bg-background text-[10px] text-muted-foreground">{tag}</Badge>
                      ))}
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <Button variant="link" className="h-auto p-0 text-xs font-bold text-primary flex items-center group/link">
                        View Live <ExternalLink className="ml-1 h-3 w-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminDashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState("messages");

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary selection:text-primary-foreground">
      <AdminNavbar token={token} onLogout={onLogout} />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-10">
          <div className="flex items-center justify-center sm:justify-start">
            <TabsList className="h-14 p-1.5 bg-muted/50 backdrop-blur border border-primary/5 rounded-2xl shadow-sm" data-testid="tabs-admin">
              <TabsTrigger value="messages" className="h-11 px-6 rounded-xl data-[state=active]:shadow-lg" data-testid="tab-messages">
                <Mail className="mr-2.5 h-4 w-4" />
                <span className="font-bold tracking-tight">Inbox</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="h-11 px-6 rounded-xl data-[state=active]:shadow-lg" data-testid="tab-content">
                <Settings className="mr-2.5 h-4 w-4" />
                <span className="font-bold tracking-tight">Content</span>
              </TabsTrigger>
              <TabsTrigger value="blog" className="h-11 px-6 rounded-xl data-[state=active]:shadow-lg" data-testid="tab-blog">
                <FileText className="mr-2.5 h-4 w-4" />
                <span className="font-bold tracking-tight">Blog</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="h-11 px-6 rounded-xl data-[state=active]:shadow-lg" data-testid="tab-analytics">
                <BarChart3 className="mr-2.5 h-4 w-4" />
                <span className="font-bold tracking-tight">Insights</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "messages" && (
              <TabsContent value="messages" key="messages-content" forceMount>
                <MessagesTab token={token} />
              </TabsContent>
            )}

            {activeTab === "content" && (
              <TabsContent value="content" key="content-content" forceMount>
                <ContentTab token={token} />
              </TabsContent>
            )}

            {activeTab === "blog" && (
              <TabsContent value="blog" key="blog-content" forceMount>
                <BlogTab token={token} />
              </TabsContent>
            )}

            {activeTab === "analytics" && (
              <TabsContent value="analytics" key="analytics-content" forceMount>
                <AnalyticsTab token={token} />
              </TabsContent>
            )}
          </AnimatePresence>
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