import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { User } from "lucide-react";
import {
  SiReact,
  SiTypescript,
  SiNodedotjs,
  SiPostgresql,
  SiTailwindcss,
  SiGit,
  SiDocker,
  SiFigma,
  SiMongodb,
  SiPython,
  SiNextdotjs,
  SiAmazonwebservices,
} from "react-icons/si";
import { Card, CardContent } from "@/components/ui/card";

const skills = [
  { name: "React", icon: SiReact, category: "frontend" },
  { name: "TypeScript", icon: SiTypescript, category: "frontend" },
  { name: "Next.js", icon: SiNextdotjs, category: "frontend" },
  { name: "Tailwind CSS", icon: SiTailwindcss, category: "frontend" },
  { name: "Node.js", icon: SiNodedotjs, category: "backend" },
  { name: "Python", icon: SiPython, category: "backend" },
  { name: "PostgreSQL", icon: SiPostgresql, category: "backend" },
  { name: "MongoDB", icon: SiMongodb, category: "backend" },
  { name: "Git", icon: SiGit, category: "tools" },
  { name: "Docker", icon: SiDocker, category: "tools" },
  { name: "AWS", icon: SiAmazonwebservices, category: "tools" },
  { name: "Figma", icon: SiFigma, category: "tools" },
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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function SkillCard({
  name,
  icon: Icon,
  index,
}: {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  index: number;
}) {
  return (
    <motion.div variants={itemVariants}>
      <Card 
        className="hover-elevate group cursor-default"
        data-testid={`card-skill-${index}`}
      >
        <CardContent className="flex items-center gap-3 p-4">
          <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
            <Icon className="h-5 w-5" />
          </div>
          <span className="font-medium text-sm" data-testid={`text-skill-${name.toLowerCase().replace(/\./g, "").replace(/\s/g, "-")}`}>
            {name}
          </span>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-20 lg:py-32" ref={ref} data-testid="section-about">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            data-testid="text-about-title"
          >
            About Me
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-about-subtitle">
            Get to know more about me and my technical expertise
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/3 flex justify-center"
            data-testid="container-about-avatar"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-purple-500/30 rounded-2xl blur-2xl" />
              <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-2xl border-2 border-primary/20 relative bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center overflow-hidden">
                <User className="w-24 h-24 sm:w-28 sm:h-28 text-primary/50" />
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:w-2/3"
          >
            <div className="space-y-4 text-muted-foreground mb-8">
              <p data-testid="text-about-description-1">
                I'm a passionate Full Stack Developer with over 5 years of
                experience building modern web applications. I specialize in
                creating seamless user experiences with React and building
                robust backend systems with Node.js and Python.
              </p>
              <p data-testid="text-about-description-2">
                My journey in software development started with a curiosity
                about how things work on the web. Today, I'm dedicated to
                writing clean, maintainable code and continuously learning new
                technologies to stay at the forefront of web development.
              </p>
              <p data-testid="text-about-description-3">
                When I'm not coding, you can find me exploring new technologies,
                contributing to open-source projects, or sharing knowledge with
                the developer community through blog posts and mentoring.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <h3
            className="text-2xl font-semibold mb-8 text-center"
            data-testid="text-skills-title"
          >
            Skills & Technologies
          </h3>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            data-testid="grid-skills"
          >
            {skills.map((skill, index) => (
              <SkillCard key={skill.name} name={skill.name} icon={skill.icon} index={index} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
