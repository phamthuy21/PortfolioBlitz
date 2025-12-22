import { useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, useInView } from "framer-motion";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Clock, Tag, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { setSEOMeta } from "@/pages/seo";
import type { BlogPost } from "@shared/schema";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <motion.div variants={cardVariants}>
      <Link href={`/blog/${post.slug}`}>
        <Card className="hover-elevate cursor-pointer h-full" data-testid={`card-blog-${post.id}`}>
          {post.coverImage && (
            <div className="h-48 overflow-hidden rounded-t-md">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardHeader className={post.coverImage ? "pt-4" : ""}>
            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors" data-testid={`text-blog-title-${post.id}`}>
              {post.title}
            </h3>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-muted-foreground text-sm line-clamp-2 mb-4" data-testid={`text-blog-excerpt-${post.id}`}>
              {post.excerpt}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {post.createdAt && format(new Date(post.createdAt), "MMM d, yyyy")}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {Math.ceil(post.content.length / 1000)} min read
              </div>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function BlogPage() {
  useEffect(() => {
    setSEOMeta({
      title: "Blog - Thuy Pham | Web Development Articles",
      description: "Read articles about web development, full stack technologies, and software engineering best practices.",
      canonical: "/blog",
    });
  }, []);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { data: postsData, isLoading } = useQuery<{ success: boolean; data: BlogPost[] }>({
    queryKey: ["/api/blog"],
  });

  const posts = postsData?.data || [];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" data-testid="button-back-home">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold" data-testid="text-blog-page-title">Blog</h1>
          </div>
          <DarkModeToggle />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" data-testid="text-blog-heading">
            Blog
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Thoughts on web development, technology, and building great products.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            data-testid="grid-blog-posts"
          >
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
