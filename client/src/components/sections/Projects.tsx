import { useState, useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { Github, ExternalLink, Code2, ShoppingCart, CheckSquare, Brain, Building2, Heart, Share2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";

const projectIcons = [ShoppingCart, CheckSquare, Brain, Building2, Heart, Share2];

type ProjectCategory = "all" | "frontend" | "backend" | "fullstack" | "mobile";

const categories: { value: ProjectCategory; label: string }[] = [
  { value: "all", label: "All Projects" },
  { value: "fullstack", label: "Full Stack" },
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "mobile", label: "Mobile" },
];

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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const IconComponent = projectIcons[index % projectIcons.length] || Code2;

  return (
    <motion.div variants={cardVariants}>
      <Card
        className="group overflow-visible h-full flex flex-col hover-elevate transition-all duration-300"
        data-testid={`card-project-${project.id}`}
      >
        <CardHeader className="p-0">
          <div className="relative h-48 overflow-hidden rounded-t-md bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
            {project.image ? (
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 transition-transform duration-300 group-hover:scale-110">
                <IconComponent className="w-12 h-12 text-primary/50" />
                <span className="text-xl font-bold text-primary/40">{project.title.charAt(0)}</span>
              </div>
            )}
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
            {project.techStack?.map((tech) => (
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
          {project.githubUrl && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(project.githubUrl!, "_blank")}
              data-testid={`button-github-${project.id}`}
            >
              <Github className="mr-2 h-4 w-4" />
              Code
            </Button>
          )}
          {project.liveUrl && (
            <Button
              size="sm"
              onClick={() => window.open(project.liveUrl!, "_blank")}
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
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>("all");
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  const { data: projectsData } = useQuery<{ success: boolean; data: Project[] }>({
    queryKey: ["/api/projects"],
  });

  const projectsList = projectsData?.data || [];

  const allTechStacks = useMemo(() => {
    return Array.from(
      new Set(projectsList.flatMap((p) => p.techStack || []))
    ).sort();
  }, [projectsList]);

  const filteredProjects = useMemo(() => {
    return projectsList.filter((project) => {
      const categoryMatch = selectedCategory === "all" || project.category === selectedCategory;
      const techMatch = !selectedTech || project.techStack?.includes(selectedTech);
      return categoryMatch && techMatch;
    });
  }, [projectsList, selectedCategory, selectedTech]);

  const handleCategoryChange = (category: ProjectCategory) => {
    setSelectedCategory(category);
  };

  const handleTechChange = (tech: string | null) => {
    setSelectedTech(tech);
  };

  return (
    <section id="projects" className="py-20 lg:py-32 bg-card/50" ref={ref} data-testid="section-projects">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
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
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10 space-y-6"
        >
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2" data-testid="filter-categories">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? "default" : "outline"}
                size="sm"
                className="rounded-full transition-all duration-200"
                onClick={() => handleCategoryChange(cat.value)}
                data-testid={`button-filter-category-${cat.value}`}
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Tech Filter */}
          <div className="flex flex-wrap justify-center gap-2" data-testid="filter-tech-stack">
            <Badge
              variant={selectedTech === null ? "default" : "outline"}
              className="cursor-pointer transition-all duration-200"
              onClick={() => handleTechChange(null)}
              data-testid="badge-filter-all-tech"
            >
              All Tech
            </Badge>
            {allTechStacks.map((tech) => (
              <Badge
                key={tech}
                variant={selectedTech === tech ? "default" : "outline"}
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleTechChange(tech)}
                data-testid={`badge-filter-${tech.toLowerCase().replace(/\./g, "").replace(/\s/g, "-")}`}
              >
                {tech}
              </Badge>
            ))}
          </div>
        </motion.div>

        {filteredProjects.length > 0 ? (
          <motion.div
            key={selectedTech || "all"}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            data-testid="grid-projects"
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
            data-testid="text-no-projects"
          >
            <p className="text-muted-foreground text-lg">
              {projectsList.length === 0 ? "No projects found. Add some in the admin panel!" : "No projects match the selected filters."}
            </p>
            {projectsList.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSelectedTech(null);
                }}
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-8 text-sm text-muted-foreground"
          data-testid="text-filter-count"
        >
          Showing {filteredProjects.length} of {projectsList.length} projects
        </motion.div>
      </div>
    </section>
  );
}
