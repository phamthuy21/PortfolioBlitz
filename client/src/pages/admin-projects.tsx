import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function AdminProjectsPage() {
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const { data: projectsData } = useQuery<any>({ queryKey: ["/api/projects"] });
  const [projectForm, setProjectForm] = useState({ title: "", description: "", image: "", techStack: [], githubUrl: "", liveUrl: "", featured: false });

  const projectCreateMutation = useMutation({
    mutationFn: async (data: any) => apiRequest("POST", "/api/admin/projects", data),
    onSuccess: () => {
      toast({ title: "Project created" });
      setProjectForm({ title: "", description: "", image: "", techStack: [], githubUrl: "", liveUrl: "", featured: false });
      setShowAddForm(false);
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
    onError: () => toast({ title: "Error creating project", variant: "destructive" }),
  });

  const projectDeleteMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/admin/projects/${id}`, {}),
    onSuccess: () => {
      toast({ title: "Project deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
    onError: () => toast({ title: "Error deleting project", variant: "destructive" }),
  });

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Manage Projects</h1>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="mr-2 h-4 w-4" /> Add Project
          </Button>
        </div>

        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} placeholder="Project title" />
              <Textarea value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} placeholder="Project description" />
              <Input value={projectForm.image} onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })} placeholder="Image URL" />
              <Input value={projectForm.githubUrl} onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })} placeholder="GitHub URL" />
              <Input value={projectForm.liveUrl} onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })} placeholder="Live URL" />
              <div className="flex gap-2">
                <Button onClick={() => projectCreateMutation.mutate(projectForm)}>Create</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {projectsData?.data?.map((project: any) => (
            <Card key={project.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-medium text-lg">{project.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  </div>
                  <Button variant="destructive" size="icon" onClick={() => projectDeleteMutation.mutate(project.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {project.techStack && (
                  <div className="flex gap-1 flex-wrap">
                    {project.techStack.map((tech: string) => <Badge key={tech}>{tech}</Badge>)}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
