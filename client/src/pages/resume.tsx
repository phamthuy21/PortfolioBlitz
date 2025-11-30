import { useEffect } from "react";
import { motion } from "framer-motion";
import { Download, ArrowLeft, Mail, MapPin, Phone, ExternalLink, Loader2 } from "lucide-react";
import { Link } from "wouter";
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
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const skills = [
  { name: "React", icon: SiReact },
  { name: "TypeScript", icon: SiTypescript },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "Tailwind CSS", icon: SiTailwindcss },
  { name: "Node.js", icon: SiNodedotjs },
  { name: "Python", icon: SiPython },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "MongoDB", icon: SiMongodb },
  { name: "Git", icon: SiGit },
  { name: "Docker", icon: SiDocker },
  { name: "AWS", icon: SiAmazonwebservices },
  { name: "Figma", icon: SiFigma },
];

const experience = [
  {
    title: "Senior Full Stack Developer",
    company: "Tech Innovations Inc.",
    period: "2022 - Present",
    description: "Lead development of enterprise web applications using React, Node.js, and PostgreSQL. Mentor junior developers and implement best practices.",
    achievements: [
      "Architected and delivered 5+ major features that increased user engagement by 40%",
      "Reduced application load time by 60% through performance optimization",
      "Led a team of 4 developers in an Agile environment",
    ],
  },
  {
    title: "Full Stack Developer",
    company: "Digital Solutions LLC",
    period: "2020 - 2022",
    description: "Developed and maintained multiple client-facing web applications with focus on user experience and performance.",
    achievements: [
      "Built 10+ responsive web applications from concept to deployment",
      "Implemented CI/CD pipelines reducing deployment time by 70%",
      "Collaborated with design team to create intuitive user interfaces",
    ],
  },
  {
    title: "Junior Web Developer",
    company: "StartUp Hub",
    period: "2019 - 2020",
    description: "Contributed to frontend development using React and TypeScript while learning backend technologies.",
    achievements: [
      "Developed reusable component library used across multiple projects",
      "Participated in code reviews and improved code quality standards",
    ],
  },
];

const education = [
  {
    degree: "Bachelor of Science in Computer Science",
    school: "University of Technology",
    period: "2015 - 2019",
    details: "GPA: 3.8/4.0, Dean's List, Computer Science Club President",
  },
];

export default function ResumePage() {
  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        #resume-content, #resume-content * {
          visibility: visible;
        }
        #resume-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .no-print {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur no-print">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" data-testid="button-back-home">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold" data-testid="text-resume-page-title">Resume</h1>
          </div>
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <Button onClick={handlePrint} data-testid="button-download-resume">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8" id="resume-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <header className="text-center pb-6 border-b">
            <h1 className="text-4xl font-bold mb-2" data-testid="text-resume-name">Thuy Pham</h1>
            <p className="text-xl text-primary mb-4" data-testid="text-resume-title">Full Stack Developer</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                thuy.pham@example.com
              </span>
              <span className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                +1 (555) 123-4567
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                San Francisco, CA
              </span>
            </div>
          </header>

          <section>
            <h2 className="text-2xl font-bold mb-4" data-testid="text-section-summary">Professional Summary</h2>
            <p className="text-muted-foreground leading-relaxed">
              Passionate Full Stack Developer with 5+ years of experience building modern web applications. 
              Specialized in React, Node.js, and cloud technologies. Proven track record of delivering 
              high-quality, scalable solutions while mentoring junior developers and driving technical 
              excellence. Strong problem-solving skills combined with excellent communication abilities 
              make me an effective team player and leader.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4" data-testid="text-section-skills">Technical Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill.name} variant="secondary" className="px-3 py-1">
                  <skill.icon className="h-3 w-3 mr-1" />
                  {skill.name}
                </Badge>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4" data-testid="text-section-experience">Professional Experience</h2>
            <div className="space-y-6">
              {experience.map((job, index) => (
                <Card key={index} className="border-l-4 border-l-primary" data-testid={`card-experience-${index}`}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <Badge variant="outline">{job.period}</Badge>
                    </div>
                    <p className="text-primary font-medium">{job.company}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground mb-3">{job.description}</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {job.achievements.map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4" data-testid="text-section-education">Education</h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <Card key={index} data-testid={`card-education-${index}`}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <CardTitle className="text-lg">{edu.degree}</CardTitle>
                      <Badge variant="outline">{edu.period}</Badge>
                    </div>
                    <p className="text-primary font-medium">{edu.school}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground text-sm">{edu.details}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="no-print">
            <h2 className="text-2xl font-bold mb-4" data-testid="text-section-links">Links</h2>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                GitHub
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                LinkedIn
              </a>
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
}
