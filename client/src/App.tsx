import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Home from "@/pages/home";
import AdminPage from "@/pages/admin";
import AdminBlogEditor from "@/pages/admin-blog-editor";
import BlogPage from "@/pages/blog";
import BlogPostPage from "@/pages/blog-post";
import ResumePage from "@/pages/resume";
import AdminContentPage from "@/pages/admin-content";
import AdminHomePage from "@/pages/admin-home";
import AdminAboutPage from "@/pages/admin-about";
import AdminSkillsPage from "@/pages/admin-skills";
import AdminProjectsPage from "@/pages/admin-projects";
import AdminCertificatesPage from "@/pages/admin-certificates";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/admin/blog/:id" component={AdminBlogEditor} />
      <Route path="/admin/content" component={AdminContentPage} />
      <Route path="/admin/home" component={AdminHomePage} />
      <Route path="/admin/about" component={AdminAboutPage} />
      <Route path="/admin/skills" component={AdminSkillsPage} />
      <Route path="/admin/projects" component={AdminProjectsPage} />
      <Route path="/admin/certificates" component={AdminCertificatesPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      <Route path="/resume" component={ResumePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
