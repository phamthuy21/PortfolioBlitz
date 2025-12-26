import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdminNavbar } from "@/components/AdminNavbar";

export default function AdminCertificatesPage() {
  const { toast } = useToast();
  const token = localStorage.getItem("adminToken");
  const [showAddForm, setShowAddForm] = useState(false);
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
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Manage Certificates</h1>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="mr-2 h-4 w-4" /> Add Certificate
          </Button>
        </div>

        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Certificate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input value={certForm.title} onChange={(e) => setCertForm({ ...certForm, title: e.target.value })} placeholder="Certificate title" />
              <Input value={certForm.issuer} onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })} placeholder="Issuer" />
              <Input type="date" value={certForm.issueDate} onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })} placeholder="Issue date" />
              <Input type="date" value={certForm.expiryDate} onChange={(e) => setCertForm({ ...certForm, expiryDate: e.target.value })} placeholder="Expiry date (optional)" />
              <Input value={certForm.credentialUrl} onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })} placeholder="Credential URL" />
              <div className="flex gap-2">
                <Button onClick={() => certCreateMutation.mutate(certForm)}>Create</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {certificatesData?.data?.map((cert: any) => (
            <Card key={cert.id}>
              <CardContent className="pt-6 flex justify-between items-start">
                <div>
                  <p className="font-medium">{cert.title}</p>
                  <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  <p className="text-xs text-muted-foreground">{cert.issueDate}</p>
                </div>
                <Button variant="destructive" size="icon" onClick={() => certDeleteMutation.mutate(cert.id)}>
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

