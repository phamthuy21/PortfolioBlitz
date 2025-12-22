import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Clock, Tag, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { setSEOMeta } from "@/pages/seo";
import type { BlogPost } from "@shared/schema";

function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: JSX.Element[] = [];
  let currentList: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushList = () => {
    if (currentList.length > 0 && listType) {
      const ListTag = listType;
      elements.push(
        <ListTag key={`list-${elements.length}`} className={`mb-4 ${listType === "ul" ? "list-disc" : "list-decimal"} list-inside text-muted-foreground`}>
          {currentList.map((item, i) => (
            <li key={i} className="mb-1">{item}</li>
          ))}
        </ListTag>
      );
      currentList = [];
      listType = null;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("# ")) {
      flushList();
      elements.push(
        <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{trimmed.slice(2)}</h1>
      );
    } else if (trimmed.startsWith("## ")) {
      flushList();
      elements.push(
        <h2 key={index} className="text-2xl font-bold mt-6 mb-3">{trimmed.slice(3)}</h2>
      );
    } else if (trimmed.startsWith("### ")) {
      flushList();
      elements.push(
        <h3 key={index} className="text-xl font-semibold mt-4 mb-2">{trimmed.slice(4)}</h3>
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (listType !== "ul") flushList();
      listType = "ul";
      currentList.push(trimmed.slice(2));
    } else if (/^\d+\.\s/.test(trimmed)) {
      if (listType !== "ol") flushList();
      listType = "ol";
      currentList.push(trimmed.replace(/^\d+\.\s/, ""));
    } else if (trimmed.startsWith("```")) {
      flushList();
      elements.push(
        <div key={index} className="bg-muted rounded-md p-4 my-4 font-mono text-sm overflow-x-auto">
          <code>{trimmed.slice(3)}</code>
        </div>
      );
    } else if (trimmed.startsWith("> ")) {
      flushList();
      elements.push(
        <blockquote key={index} className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
          {trimmed.slice(2)}
        </blockquote>
      );
    } else if (trimmed === "") {
      flushList();
    } else {
      flushList();
      const processedLine = trimmed
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/`(.*?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm">$1</code>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>');

      elements.push(
        <p
          key={index}
          className="text-muted-foreground mb-4 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: processedLine }}
        />
      );
    }
  });

  flushList();

  return <div className="prose prose-sm sm:prose max-w-none">{elements}</div>;
}

export default function BlogPostPage() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;

  const { data: postData, isLoading, error } = useQuery<{ success: boolean; data: BlogPost }>({
    queryKey: ["/api/blog", slug],
    queryFn: async () => {
      const response = await fetch(`/api/blog/${slug}`);
      return response.json();
    },
    enabled: !!slug,
  });

  const post = postData?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/blog">
                <Button variant="ghost" size="icon" data-testid="button-back-blog">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold">Blog</h1>
            </div>
            <DarkModeToggle />
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
          <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
          <Link href="/blog">
            <Button data-testid="button-view-all-posts">View All Posts</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/blog">
              <Button variant="ghost" size="icon" data-testid="button-back-blog">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Blog</h1>
          </div>
          <DarkModeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {post.coverImage && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-64 sm:h-96 object-cover"
              />
            </div>
          )}

          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" data-testid="text-post-title">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {post.createdAt && format(new Date(post.createdAt), "MMMM d, yyyy")}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {Math.ceil(post.content.length / 1000)} min read
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          <div className="border-t pt-8" data-testid="post-content">
            <MarkdownContent content={post.content} />
          </div>
        </motion.article>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t"
        >
          <Link href="/blog">
            <Button variant="outline" data-testid="button-all-posts">
              <ArrowLeft className="mr-2 h-4 w-4" />
              All Posts
            </Button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
