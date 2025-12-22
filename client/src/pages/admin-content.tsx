import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Loader2, Trash2, Plus } from "lucide-react";

const token = localStorage.getItem("adminToken") || "";

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
};

export default function AdminContentPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("home");

  const { data: homeData, isLoading: homeLoading } = useQuery({
    queryKey: ["/api/admin/home"],
    queryFn: () => fetchWithAuth("/api/admin/home"),
  });

  const homeUpdate = useMutation({
    mutationFn: (data: any) =>
      fetchWithAuth("/api/admin/home", { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({ title: "Home content updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/home"] });
    },
  });

  const { data: aboutData, isLoading: aboutLoading } = useQuery({
    queryKey: ["/api/admin/about"],
    queryFn: () => fetchWithAuth("/api/admin/about"),
  });

  const aboutUpdate = useMutation({
    mutationFn: (data: any) =>
      fetchWithAuth("/api/admin/about", { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({ title: "About content updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/about"] });
    },
  });

  const { data: skillsData, isLoading: skillsLoading } = useQuery({
    queryKey: ["/api/admin/skills"],
    queryFn: () => fetchWithAuth("/api/admin/skills"),
  });

  const skillCreate = useMutation({
    mutationFn: (data: any) =>
      fetchWithAuth("/api/admin/skills", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({ title: "Skill created" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/skills"] });
    },
  });

  const skillDelete = useMutation({
    mutationFn: (id: string) =>
      fetchWithAuth(`/api/admin/skills/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast({ title: "Skill deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/skills"] });
    },
  });

  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/admin/projects"],
    queryFn: () => fetchWithAuth("/api/admin/projects"),
  });

  const projectCreate = useMutation({
    mutationFn: (data: any) =>
      fetchWithAuth("/api/admin/projects", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({ title: "Project created" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
    },
  });

  const projectDelete = useMutation({
    mutationFn: (id: string) =>
      fetchWithAuth(`/api/admin/projects/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast({ title: "Project deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
    },
  });

  const { data: certsData, isLoading: certsLoading } = useQuery({
    queryKey: ["/api/admin/certificates"],
    queryFn: () => fetchWithAuth("/api/admin/certificates"),
  });

  const certCreate = useMutation({
    mutationFn: (data: any) =>
      fetchWithAuth("/api/admin/certificates", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({ title: "Certificate created" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/certificates"] });
    },
  });

  const certDelete = useMutation({
    mutationFn: (id: string) =>
      fetchWithAuth(`/api/admin/certificates/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast({ title: "Certificate deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/certificates"] });
    },
  });

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Please log in to access this page</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8" data-testid="text-admin-content-title">
          Manage Portfolio Content
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5" data-testid="tabs-admin-content">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            <Card data-testid="card-home-content">
              <CardHeader>
                <CardTitle>Home Content</CardTitle>
              </CardHeader>
              <CardContent>
                {homeLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      homeUpdate.mutate({
                        heading: fd.get("heading"),
                        subheading: fd.get("subheading"),
                        ctaText: fd.get("ctaText"),
                      });
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-sm font-medium">Heading</label>
                      <Input name="heading" defaultValue={(homeData as any)?.heading || ""} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Subheading</label>
                      <Input name="subheading" defaultValue={(homeData as any)?.subheading || ""} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">CTA Text</label>
                      <Input name="ctaText" defaultValue={(homeData as any)?.ctaText || ""} />
                    </div>
                    <Button type="submit" disabled={homeUpdate.isPending}>
                      {homeUpdate.isPending ? "Saving..." : "Save"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about">
            <Card data-testid="card-about-content">
              <CardHeader>
                <CardTitle>About Content</CardTitle>
              </CardHeader>
              <CardContent>
                {aboutLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      aboutUpdate.mutate({
                        title: fd.get("title"),
                        description: fd.get("description"),
                      });
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input name="title" defaultValue={(aboutData as any)?.title || ""} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        name="description"
                        defaultValue={(aboutData as any)?.description || ""}
                        rows={6}
                      />
                    </div>
                    <Button type="submit" disabled={aboutUpdate.isPending}>
                      {aboutUpdate.isPending ? "Saving..." : "Save"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <Card data-testid="card-skills">
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {skillsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        skillCreate.mutate({
                          name: fd.get("name"),
                          category: fd.get("category"),
                          proficiency: parseInt(fd.get("proficiency") as string) || 80,
                        });
                        e.currentTarget.reset();
                      }}
                      className="space-y-4 p-4 border rounded-lg"
                    >
                      <Input name="name" placeholder="Skill name" required />
                      <Input name="category" placeholder="Category" required />
                      <Input name="proficiency" type="number" min="0" max="100" defaultValue="80" />
                      <Button type="submit" disabled={skillCreate.isPending}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Skill
                      </Button>
                    </form>
                    <div className="space-y-2">
                      {(skillsData as any[])?.map((skill) => (
                        <div
                          key={skill.id}
                          className="flex items-center justify-between p-3 border rounded"
                        >
                          <div>
                            <p className="font-medium">{skill.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {skill.category} - {skill.proficiency}%
                            </p>
                          </div>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => skillDelete.mutate(skill.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card data-testid="card-projects">
              <CardHeader>
                <CardTitle>Projects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {projectsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        projectCreate.mutate({
                          title: fd.get("title"),
                          description: fd.get("description"),
                          category: fd.get("category"),
                        });
                        e.currentTarget.reset();
                      }}
                      className="space-y-4 p-4 border rounded-lg"
                    >
                      <Input name="title" placeholder="Project title" required />
                      <Textarea name="description" placeholder="Description" rows={3} required />
                      <Input name="category" placeholder="Category" />
                      <Button type="submit" disabled={projectCreate.isPending}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Project
                      </Button>
                    </form>
                    <div className="space-y-2">
                      {(projectsData as any[])?.map((project) => (
                        <div
                          key={project.id}
                          className="flex items-center justify-between p-3 border rounded"
                        >
                          <div>
                            <p className="font-medium">{project.title}</p>
                            <p className="text-sm text-muted-foreground">{project.category}</p>
                          </div>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => projectDelete.mutate(project.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates">
            <Card data-testid="card-certificates">
              <CardHeader>
                <CardTitle>Certificates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {certsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        certCreate.mutate({
                          title: fd.get("title"),
                          issuer: fd.get("issuer"),
                          issuedDate: fd.get("issuedDate"),
                        });
                        e.currentTarget.reset();
                      }}
                      className="space-y-4 p-4 border rounded-lg"
                    >
                      <Input name="title" placeholder="Certificate title" required />
                      <Input name="issuer" placeholder="Issuer" required />
                      <Input name="issuedDate" type="date" required />
                      <Button type="submit" disabled={certCreate.isPending}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Certificate
                      </Button>
                    </form>
                    <div className="space-y-2">
                      {(certsData as any[])?.map((cert) => (
                        <div
                          key={cert.id}
                          className="flex items-center justify-between p-3 border rounded"
                        >
                          <div>
                            <p className="font-medium">{cert.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {cert.issuer} - {cert.issuedDate}
                            </p>
                          </div>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => certDelete.mutate(cert.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
