import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const socialLinks = [
  {
    name: "GitHub",
    icon: SiGithub,
    href: "https://github.com",
  },
  {
    name: "LinkedIn",
    icon: SiLinkedin,
    href: "https://linkedin.com",
  },
];

export function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const currentYear = new Date().getFullYear();

  return (
    <footer ref={ref} className="py-12 border-t border-border bg-card/30" data-testid="section-footer">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <span data-testid="text-footer-copyright">
              {currentYear} Thuy Pham. Made with
            </span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="h-4 w-4 text-primary fill-primary" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-2"
            data-testid="container-social-links"
          >
            {socialLinks.map((link) => (
              <Button
                key={link.name}
                size="icon"
                variant="ghost"
                onClick={() => window.open(link.href, "_blank")}
                aria-label={link.name}
                data-testid={`link-social-${link.name.toLowerCase()}`}
              >
                <link.icon className="h-5 w-5" />
              </Button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
