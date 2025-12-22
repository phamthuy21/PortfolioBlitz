import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { useAnalytics, useSectionTracking } from "@/hooks/use-analytics";
import { setSEOMeta } from "@/pages/seo";

export default function Home() {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    setSEOMeta({
      title: "Thuy Pham - Full Stack Developer | Portfolio",
      description: "Experienced full stack developer specializing in modern web applications. View my projects, skills, and experience.",
      ogTitle: "Thuy Pham - Full Stack Developer",
      ogDescription: "Portfolio showcasing full stack development projects and technical expertise",
      canonical: "/",
    });
    trackPageView("/");
  }, [trackPageView]);

  useSectionTracking("home");
  useSectionTracking("about");
  useSectionTracking("projects");
  useSectionTracking("contact");

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
