import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Github, ExternalLink, Code2, ShoppingCart, CheckSquare, Brain, Building2, Heart, Share2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@shared/schema";

const projectIcons = [ShoppingCart, CheckSquare, Brain, Building2, Heart, Share2];

const projects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description:
      "A full-featured e-commerce platform with real-time inventory management, payment processing, and an admin dashboard.",
    image: "",
    techStack: ["React", "Node.js", "PostgreSQL", "Stripe"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
  {
    id: 2,
    title: "Task Management App",
    description:
      "A collaborative task management application with real-time updates, team workspaces, and project analytics.",
    image: "",
    techStack: ["Next.js", "TypeScript", "MongoDB", "Socket.io"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
  {
    id: 3,
    title: "AI Content Generator",
    description:
      "An AI-powered content generation tool that helps create blog posts, social media content, and marketing copy.",
    image: "",
    techStack: ["React", "Python", "OpenAI", "FastAPI"],
    githubUrl: "https://github.com",
  },
  {
    id: 4,
    title: "Real Estate Portal",
    description:
      "A comprehensive real estate platform with property listings, virtual tours, and mortgage calculator.",
    image: "",
    techStack: ["React", "Node.js", "PostgreSQL", "MapBox"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
  {
    id: 5,
    title: "Health & Fitness Tracker",
    description:
      "A health tracking application that monitors workouts, nutrition, sleep patterns, and provides personalized insights.",
    image: "",
    techStack: ["React Native", "Node.js", "MongoDB", "Charts.js"],
    githubUrl: "https://github.com",
  },
  {
    id: 6,
    title: "Social Media Dashboard",
    description:
      "A unified dashboard for managing multiple social media accounts with scheduling, analytics, and engagement tools.",
    image: "",
    techStack: ["Vue.js", "Python", "Redis", "GraphQL"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const IconComponent = projectIcons[index] || Code2;
  
  return (
    <motion.div variants={cardVariants}>
      <Card
        className="group overflow-visible h-full flex flex-col hover-elevate transition-all duration-300"
        data-testid={`card-project-${project.id}`}
      >
        <CardHeader className="p-0">
          <div className="relative h-48 overflow-hidden rounded-t-md bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <motion.div
              className="flex flex-col items-center justify-center gap-2"
              whileHover={{ scale: 1.1, rotate: 2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <IconComponent className="w-12 h-12 text-primary/50" />
              <span className="text-xl font-bold text-primary/40">{project.title.charAt(0)}</span>
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-5">
          <h3
            className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors"
            data-testid={`text-project-title-${project.id}`}
          >
            {project.title}
          </h3>
          <p
            className="text-sm text-muted-foreground mb-4 line-clamp-3"
            data-testid={`text-project-description-${project.id}`}
          >
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2" data-testid={`container-tech-stack-${project.id}`}>
            {project.techStack.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="text-xs"
                data-testid={`badge-tech-${project.id}-${tech.toLowerCase().replace(/\./g, "").replace(/\s/g, "-")}`}
              >
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0 gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(project.githubUrl, "_blank")}
            data-testid={`button-github-${project.id}`}
          >
            <Github className="mr-2 h-4 w-4" />
            Code
          </Button>
          {project.liveUrl && (
            <Button
              size="sm"
              onClick={() => window.open(project.liveUrl, "_blank")}
              data-testid={`button-live-${project.id}`}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Live Demo
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-20 lg:py-32 bg-card/50" ref={ref} data-testid="section-projects">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            data-testid="text-projects-title"
          >
            Featured Projects
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-projects-subtitle">
            Here are some of my recent projects that showcase my skills and
            experience in building modern web applications.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          data-testid="grid-projects"
        >
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
