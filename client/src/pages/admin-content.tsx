import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Edit2, ArrowLeft, X } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function AdminContentPage() {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Home Content
  const { data: homeData } = useQuery<any>({ queryKey: ["/api/home"] });
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

  // About Content
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

  // Skills
  const { data: skillsData } = useQuery<any>({ queryKey: ["/api/skills"] });
  const [skillForm, setSkillForm] = useState({ name: "", icon: "", category: "frontend", proficiency: 50 });

  const skillCreateMutation = useMutation({
    mutationFn: async (data: any) => apiRequest("POST", "/api/admin/skills", data),
    onSuccess: () => {
      toast({ title: "Skill created" });
      setSkillForm({ name: "", icon: "", category: "frontend", proficiency: 50 });
      setShowAddForm(false);
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
    },
    onError: () => toast({ title: "Error creating skill", variant: "destructive" }),
  });

  const skillDeleteMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/admin/skills/${id}`, {}),
    onSuccess: () => {
      toast({ title: "Skill deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
    },
    onError: () => toast({ title: "Error deleting skill", variant: "destructive" }),
  });

  // Projects
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

  // Certificates
  const { data: certificatesData } = useQuery<any>({ queryKey: ["/api/certificates"] });
  const [certForm, setCertForm] = useState({ title: "", issuer: "", issueDate: "", expiryDate: "", credentialUrl: "", image: "" });

  const certCreateMutation = useMutation({
    mutationFn: async (data: any) => apiRequest("POST", "/api/admin/certificates", data),
    onSuccess: () => {
      toast({ title: "Certificate created" });
      setCertForm({ title: "", issuer: "", issueDate: "", expiryDate: "", credentialUrl: "", image: "" });
      setShowAddForm(false);
      queryClient.invalidateQueries({ queryKey: ["/api/certificates"] });
    },
    onError: () => toast({ title: "Error creating certificate", variant: "destructive" }),
  });

  const certDeleteMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/admin/certificates/${id}`, {}),
    onSuccess: () => {
      toast({ title: "Certificate deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/certificates"] });
    },
    onError: () => toast({ title: "Error deleting certificate", variant: "destructive" }),
  });

  return (
    <div className="min-h-screen bg-background p-4" data-testid="admin-content-page">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between" data-testid="admin-content-header">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon" data-testid="button-back-admin">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold" data-testid="text-admin-content-title">Content Management</h1>
          </div>
        </div>

        <Tabs defaultValue="home" className="w-full" data-testid="tabs-admin-content">
          <TabsList className="grid w-full grid-cols-5" data-testid="tabs-list-content">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
          </TabsList>

          {/* HOME TAB */}
          <TabsContent value="home" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div data-testid="home-content-form">
                  <label className="text-sm font-medium">Hero Title</label>
                  <Input value={homeForm.heroTitle} onChange={(e) => setHomeForm({ ...homeForm, heroTitle: e.target.value })} placeholder="Enter hero title" data-testid="input-home-title" />
                </div>
                <div data-testid="home-subtitle-form">
                  <label className="text-sm font-medium">Hero Subtitle</label>
                  <Input value={homeForm.heroSubtitle} onChange={(e) => setHomeForm({ ...homeForm, heroSubtitle: e.target.value })} placeholder="Enter hero subtitle" data-testid="input-home-subtitle" />
                </div>
                <div data-testid="home-cta-form">
                  <label className="text-sm font-medium">CTA Text</label>
                  <Input value={homeForm.ctaText} onChange={(e) => setHomeForm({ ...homeForm, ctaText: e.target.value })} placeholder="Enter CTA text" data-testid="input-home-cta" />
                </div>
                <Button onClick={() => homeUpdateMutation.mutate(homeForm)} disabled={homeUpdateMutation.isPending} data-testid="button-save-home">Save</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABOUT TAB */}
          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>About Section Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div data-testid="about-title-form">
                  <label className="text-sm font-medium">Title</label>
                  <Input value={aboutForm.title} onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })} placeholder="Enter title" data-testid="input-about-title" />
                </div>
                <div data-testid="about-description-form">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea value={aboutForm.description} onChange={(e) => setAboutForm({ ...aboutForm, description: e.target.value })} placeholder="Enter description" data-testid="input-about-description" />
                </div>
                <div data-testid="about-bio-form">
                  <label className="text-sm font-medium">Bio</label>
                  <Textarea value={aboutForm.bio} onChange={(e) => setAboutForm({ ...aboutForm, bio: e.target.value })} placeholder="Enter bio" data-testid="input-about-bio" />
                </div>
                <Button onClick={() => aboutUpdateMutation.mutate(aboutForm)} disabled={aboutUpdateMutation.isPending} data-testid="button-save-about">Save</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SKILLS TAB */}
          <TabsContent value="skills" className="space-y-4">
            <Button onClick={() => setShowAddForm(!showAddForm)} data-testid="button-add-skill">
              <Plus className="mr-2 h-4 w-4" /> Add Skill
            </Button>
            
            {showAddForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Add New Skill</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} placeholder="Skill name" data-testid="input-skill-name" />
                  <Input value={skillForm.icon} onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })} placeholder="Icon name" data-testid="input-skill-icon" />
                  <Input value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })} placeholder="Category" data-testid="input-skill-category" />
                  <Input type="number" value={skillForm.proficiency} onChange={(e) => setSkillForm({ ...skillForm, proficiency: parseInt(e.target.value) })} placeholder="Proficiency (0-100)" data-testid="input-skill-proficiency" />
                  <div className="flex gap-2">
                    <Button onClick={() => skillCreateMutation.mutate(skillForm)} disabled={skillCreateMutation.isPending} data-testid="button-create-skill">Create</Button>
                    <Button variant="outline" onClick={() => { setShowAddForm(false); setSkillForm({ name: "", icon: "", category: "frontend", proficiency: 50 }); }} data-testid="button-cancel-skill">Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4" data-testid="skills-list">
              {skillsData?.data?.map((skill: any) => (
                <Card key={skill.id} data-testid={`card-skill-${skill.id}`}>
                  <CardContent className="pt-6 flex justify-between items-center">
                    <div>
                      <p className="font-medium" data-testid={`text-skill-name-${skill.id}`}>{skill.name}</p>
                      <p className="text-sm text-muted-foreground" data-testid={`text-skill-category-${skill.id}`}>{skill.category}</p>
                    </div>
                    <Button variant="destructive" size="icon" onClick={() => skillDeleteMutation.mutate(skill.id)} data-testid={`button-delete-skill-${skill.id}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* PROJECTS TAB */}
          <TabsContent value="projects" className="space-y-4">
            <Button onClick={() => setShowAddForm(!showAddForm)} data-testid="button-add-project">
              <Plus className="mr-2 h-4 w-4" /> Add Project
            </Button>

            {showAddForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Add New Project</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} placeholder="Project title" data-testid="input-project-title" />
                  <Textarea value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} placeholder="Project description" data-testid="input-project-description" />
                  <Input value={projectForm.image} onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })} placeholder="Image URL" data-testid="input-project-image" />
                  <Input value={projectForm.githubUrl} onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })} placeholder="GitHub URL" data-testid="input-project-github" />
                  <Input value={projectForm.liveUrl} onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })} placeholder="Live URL" data-testid="input-project-live" />
                  <div className="flex gap-2">
                    <Button onClick={() => projectCreateMutation.mutate(projectForm)} disabled={projectCreateMutation.isPending} data-testid="button-create-project">Create</Button>
                    <Button variant="outline" onClick={() => { setShowAddForm(false); setProjectForm({ title: "", description: "", image: "", techStack: [], githubUrl: "", liveUrl: "", featured: false }); }} data-testid="button-cancel-project">Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4" data-testid="projects-list">
              {projectsData?.data?.map((project: any) => (
                <Card key={project.id} data-testid={`card-project-${project.id}`}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-medium text-lg" data-testid={`text-project-title-${project.id}`}>{project.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-project-desc-${project.id}`}>{project.description}</p>
                      </div>
                      <Button variant="destructive" size="icon" onClick={() => projectDeleteMutation.mutate(project.id)} data-testid={`button-delete-project-${project.id}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {project.techStack && <div className="flex gap-1 flex-wrap" data-testid={`tech-stack-${project.id}`}>{project.techStack.map((tech: string) => <Badge key={tech}>{tech}</Badge>)}</div>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* CERTIFICATES TAB */}
          <TabsContent value="certificates" className="space-y-4">
            <Button onClick={() => setShowAddForm(!showAddForm)} data-testid="button-add-certificate">
              <Plus className="mr-2 h-4 w-4" /> Add Certificate
            </Button>

            {showAddForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Add New Certificate</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input value={certForm.title} onChange={(e) => setCertForm({ ...certForm, title: e.target.value })} placeholder="Certificate title" data-testid="input-cert-title" />
                  <Input value={certForm.issuer} onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })} placeholder="Issuer" data-testid="input-cert-issuer" />
                  <Input type="date" value={certForm.issueDate} onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })} placeholder="Issue date" data-testid="input-cert-issue-date" />
                  <Input type="date" value={certForm.expiryDate} onChange={(e) => setCertForm({ ...certForm, expiryDate: e.target.value })} placeholder="Expiry date (optional)" data-testid="input-cert-expiry-date" />
                  <Input value={certForm.credentialUrl} onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })} placeholder="Credential URL" data-testid="input-cert-credential-url" />
                  <div className="flex gap-2">
                    <Button onClick={() => certCreateMutation.mutate(certForm)} disabled={certCreateMutation.isPending} data-testid="button-create-cert">Create</Button>
                    <Button variant="outline" onClick={() => { setShowAddForm(false); setCertForm({ title: "", issuer: "", issueDate: "", expiryDate: "", credentialUrl: "", image: "" }); }} data-testid="button-cancel-cert">Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4" data-testid="certificates-list">
              {certificatesData?.data?.map((cert: any) => (
                <Card key={cert.id} data-testid={`card-cert-${cert.id}`}>
                  <CardContent className="pt-6 flex justify-between items-start">
                    <div>
                      <p className="font-medium" data-testid={`text-cert-title-${cert.id}`}>{cert.title}</p>
                      <p className="text-sm text-muted-foreground" data-testid={`text-cert-issuer-${cert.id}`}>{cert.issuer}</p>
                      <p className="text-xs text-muted-foreground" data-testid={`text-cert-date-${cert.id}`}>{cert.issueDate}</p>
                    </div>
                    <Button variant="destructive" size="icon" onClick={() => certDeleteMutation.mutate(cert.id)} data-testid={`button-delete-cert-${cert.id}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
