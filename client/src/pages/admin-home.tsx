import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AdminNavbar } from "@/components/AdminNavbar";

export default function AdminHomePage() {
  const { toast } = useToast();
  const token = localStorage.getItem("adminToken");
  const { data: homeData, isLoading } = useQuery<any>({ queryKey: ["/api/home"] });
  const [homeForm, setHomeForm] = useState({ heroTitle: "", heroSubtitle: "", ctaText: "" });

  useEffect(() => {
    if (homeData?.data) {
      setHomeForm(homeData.data);
    }
  }, [homeData]);

  const homeUpdateMutation = useMutation({
    mutationFn: async (data: any) => apiRequest("POST", "/api/admin/home", data),
    onSuccess: () => {
      toast({ title: "Home content updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/home"] });
    },
    onError: () => toast({ title: "Error updating home content", variant: "destructive" }),
  });

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin";
  };

  if (!token) {
    window.location.href = "/admin";
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar token={token} onLogout={handleLogout} />
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold">Manage Home Section</h1>

        <Card>
          <CardHeader>
            <CardTitle>Hero Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Hero Title</label>
              <Input 
                value={homeForm.heroTitle} 
                onChange={(e) => setHomeForm({ ...homeForm, heroTitle: e.target.value })} 
                placeholder="Enter hero title" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Hero Subtitle</label>
              <Input 
                value={homeForm.heroSubtitle} 
                onChange={(e) => setHomeForm({ ...homeForm, heroSubtitle: e.target.value })} 
                placeholder="Enter hero subtitle" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">CTA Text</label>
              <Input 
                value={homeForm.ctaText} 
                onChange={(e) => setHomeForm({ ...homeForm, ctaText: e.target.value })} 
                placeholder="Enter CTA text" 
              />
            </div>
            <Button 
              className="w-full"
              onClick={() => homeUpdateMutation.mutate(homeForm)} 
              disabled={homeUpdateMutation.isPending}
            >
              {homeUpdateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

