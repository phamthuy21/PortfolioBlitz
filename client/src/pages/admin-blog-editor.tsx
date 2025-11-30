import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Trash2, Eye, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { BlogPost } from "@shared/schema";

export default function AdminBlogEditor() {
  const [, params] = useRoute("/admin/blog/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const isNew = params?.id === "new";
  const postId = isNew ? null : params?.id;

  const token = localStorage.getItem("adminToken");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    tags: "",
    published: false,
  });

  const { data: postData, isLoading } = useQuery<{ success: boolean; data: BlogPost }>({
    queryKey: ["/api/admin/blog", postId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/blog`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const post = data.data.find((p: BlogPost) => p.id === postId);
      return { success: true, data: post };
    },
    enabled: !isNew && !!postId,
  });

  useEffect(() => {
    if (postData?.data) {
      const post = postData.data;
      setFormData({
        title: post.title || "",
        slug: post.slug || "",
        excerpt: post.excerpt || "",
        content: post.content || "",
        coverImage: post.coverImage || "",
        tags: post.tags?.join(", ") || "",
        published: post.published || false,
      });
    }
  }, [postData]);

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const body = {
        ...data,
        tags: data.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      const response = await fetch("/api/admin/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({ title: "Post created successfully" });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
        navigate("/admin");
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const body = {
        ...data,
        tags: data.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({ title: "Post updated successfully" });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Post deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      navigate("/admin");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNew) {
      createMutation.mutate(formData);
    } else {
      updateMutation.mutate(formData);
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    setFormData({ ...formData, slug });
  };

  if (!token) {
    navigate("/admin");
    return null;
  }

  if (!isNew && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon" data-testid="button-back-admin">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold" data-testid="text-editor-title">
              {isNew ? "New Post" : "Edit Post"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            {!isNew && formData.published && (
              <Link href={`/blog/${formData.slug}`}>
                <Button variant="outline" size="sm" data-testid="button-view-post">
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Post title"
                    data-testid="input-post-title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <div className="flex gap-2">
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="post-url-slug"
                      data-testid="input-post-slug"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateSlug}
                      data-testid="button-generate-slug"
                    >
                      Generate
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Brief description of the post"
                    rows={2}
                    data-testid="input-post-excerpt"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content (Markdown)</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write your post content in markdown..."
                    rows={15}
                    className="font-mono text-sm"
                    data-testid="input-post-content"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverImage">Cover Image URL</Label>
                  <Input
                    id="coverImage"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    data-testid="input-post-cover"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="react, typescript, web development"
                    data-testid="input-post-tags"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                    data-testid="switch-published"
                  />
                  <Label htmlFor="published">Published</Label>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <div>
                {!isNew && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate()}
                    disabled={deleteMutation.isPending}
                    data-testid="button-delete-post"
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    Delete Post
                  </Button>
                )}
              </div>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-save-post"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {isNew ? "Create Post" : "Save Changes"}
              </Button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
