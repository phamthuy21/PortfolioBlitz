import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function AdminSkillsPage() {
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
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
            <h1 className="text-3xl font-bold">Manage Skills</h1>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="mr-2 h-4 w-4" /> Add Skill
          </Button>
        </div>

        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Skill</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} placeholder="Skill name" />
              <Input value={skillForm.icon} onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })} placeholder="Icon name" />
              <Input value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })} placeholder="Category" />
              <Input type="number" value={skillForm.proficiency} onChange={(e) => setSkillForm({ ...skillForm, proficiency: parseInt(e.target.value) })} placeholder="Proficiency (0-100)" />
              <div className="flex gap-2">
                <Button onClick={() => skillCreateMutation.mutate(skillForm)}>Create</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {skillsData?.data?.map((skill: any) => (
            <Card key={skill.id}>
              <CardContent className="pt-6 flex justify-between items-center">
                <div>
                  <p className="font-medium">{skill.name}</p>
                  <p className="text-sm text-muted-foreground">{skill.category}</p>
                </div>
                <Button variant="destructive" size="icon" onClick={() => skillDeleteMutation.mutate(skill.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
