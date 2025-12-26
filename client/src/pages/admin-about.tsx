import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function AdminAboutPage() {
  const { toast } = useToast();
  const { data: aboutData } = useQuery<any>({ queryKey: ["/api/about"] });
  const [aboutForm, setAboutForm] = useState({ title: "", description: "", bio: "" });

  useEffect(() => {
    if (aboutData?.data) {
      setAboutForm(aboutData.data);
    }
  }, [aboutData]);

  const aboutUpdateMutation = useMutation({
    mutationFn: async (data: any) => apiRequest("POST", "/api/admin/about", data),
    onSuccess: () => {
      toast({ title: "About content updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/about"] });
    },
    onError: () => toast({ title: "Error updating about content", variant: "destructive" }),
  });

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Manage About Section</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>About Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                value={aboutForm.title} 
                onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })} 
                placeholder="Enter title" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                value={aboutForm.description} 
                onChange={(e) => setAboutForm({ ...aboutForm, description: e.target.value })} 
                placeholder="Enter description" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <Textarea 
                className="min-h-[200px]"
                value={aboutForm.bio} 
                onChange={(e) => setAboutForm({ ...aboutForm, bio: e.target.value })} 
                placeholder="Enter bio" 
              />
            </div>
            <Button 
              className="w-full"
              onClick={() => aboutUpdateMutation.mutate(aboutForm)} 
              disabled={aboutUpdateMutation.isPending}
            >
              {aboutUpdateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
