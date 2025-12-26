import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, LogOut, Sun, Moon } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { DarkModeToggle } from "@/components/DarkModeToggle";

export function AdminNavbar({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [location] = useLocation();
  
  const navItems = [
    { title: "Dashboard", href: "/admin" },
    { title: "Home", href: "/admin/home" },
    { title: "About", href: "/admin/about" },
    { title: "Skills", href: "/admin/skills" },
    { title: "Projects", href: "/admin/projects" },
    { title: "Certs", href: "/admin/certificates" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="font-bold text-lg px-2" data-testid="link-admin-root">
              Admin
            </Button>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button 
                  variant={location === item.href ? "secondary" : "ghost"} 
                  size="sm" 
                  className="text-sm h-8"
                >
                  {item.title}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <DarkModeToggle />
          <Button variant="outline" size="sm" onClick={onLogout} data-testid="button-logout" className="h-8">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
