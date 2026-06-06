import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { LogOut, Calendar, Mail, Trash2, Check, GraduationCap, Users } from "lucide-react";
import CoursesAdmin from "@/components/admin/CoursesAdmin";
import EnrollmentsAdmin from "@/components/admin/EnrollmentsAdmin";

interface Appointment {
  id: string;
  nom: string;
  entreprise: string | null;
  telephone: string;
  email: string;
  service: string;
  date_souhaitee: string;
  message: string | null;
  statut: string;
  created_at: string;
}
interface Message {
  id: string;
  nom: string;
  email: string;
  sujet: string;
  message: string;
  lu: boolean;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roles) {
        toast.error("Accès refusé : vous n'êtes pas administrateur");
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      setIsAdmin(true);
      await loadData();
      setLoading(false);
    };
    init();
  }, [navigate]);

  const loadData = async () => {
    const [a, m] = await Promise.all([
      supabase.from("appointments").select("*").order("created_at", { ascending: false }),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
    ]);
    if (a.data) setAppointments(a.data);
    if (m.data) setMessages(m.data);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const updateStatus = async (id: string, statut: string) => {
    const { error } = await supabase.from("appointments").update({ statut }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Statut mis à jour"); loadData(); }
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm("Supprimer ce rendez-vous ?")) return;
    await supabase.from("appointments").delete().eq("id", id);
    toast.success("Supprimé");
    loadData();
  };

  const markRead = async (id: string, lu: boolean) => {
    await supabase.from("contact_messages").update({ lu }).eq("id", id);
    loadData();
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Supprimer ce message ?")) return;
    await supabase.from("contact_messages").delete().eq("id", id);
    toast.success("Supprimé");
    loadData();
  };

  if (loading) return <Layout><div className="py-32 text-center">Chargement...</div></Layout>;

  if (!isAdmin) {
    return (
      <Layout>
        <div className="py-32 text-center container mx-auto px-4">
          <h1 className="font-display text-2xl font-bold mb-3">Accès refusé</h1>
          <p className="text-muted-foreground mb-6">
            Votre compte n'a pas les droits administrateur. Contactez le super admin pour obtenir l'accès.
          </p>
          <Button onClick={handleSignOut} variant="outline">Se déconnecter</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-24 bg-muted min-h-screen">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold">Tableau de bord</h1>
              <p className="text-muted-foreground">Gestion des rendez-vous et messages</p>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="w-4 h-4 mr-2" /> Déconnexion
            </Button>
          </div>

          <Tabs defaultValue="appointments">
            <TabsList>
              <TabsTrigger value="appointments">
                <Calendar className="w-4 h-4 mr-2" /> Rendez-vous ({appointments.length})
              </TabsTrigger>
              <TabsTrigger value="messages">
                <Mail className="w-4 h-4 mr-2" /> Messages ({messages.filter(m => !m.lu).length})
              </TabsTrigger>
              <TabsTrigger value="courses">
                <GraduationCap className="w-4 h-4 mr-2" /> Formations
              </TabsTrigger>
              <TabsTrigger value="enrollments">
                <Users className="w-4 h-4 mr-2" /> Inscriptions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appointments">
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date demande</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date souhaitée</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.length === 0 && (
                      <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Aucun rendez-vous</TableCell></TableRow>
                    )}
                    {appointments.map(a => (
                      <TableRow key={a.id}>
                        <TableCell className="text-sm">{new Date(a.created_at).toLocaleDateString("fr-FR")}</TableCell>
                        <TableCell>
                          <div className="font-medium">{a.nom}</div>
                          {a.entreprise && <div className="text-xs text-muted-foreground">{a.entreprise}</div>}
                        </TableCell>
                        <TableCell className="text-sm">
                          <div>{a.email}</div>
                          <div className="text-muted-foreground">{a.telephone}</div>
                        </TableCell>
                        <TableCell className="text-sm">{a.service}</TableCell>
                        <TableCell className="text-sm">{new Date(a.date_souhaitee).toLocaleDateString("fr-FR")}</TableCell>
                        <TableCell>
                          <Badge variant={a.statut === "confirme" ? "default" : a.statut === "annule" ? "destructive" : "secondary"}>
                            {a.statut}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => updateStatus(a.id, "confirme")} title="Confirmer">
                              <Check className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => deleteAppointment(a.id)} title="Supprimer">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="messages">
              <div className="space-y-3">
                {messages.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Aucun message</p>
                )}
                {messages.map(m => (
                  <div key={m.id} className={`bg-card border rounded-xl p-5 ${!m.lu ? "border-secondary" : "border-border"}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          {m.sujet} {!m.lu && <Badge variant="default" className="text-xs">Nouveau</Badge>}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {m.nom} · {m.email} · {new Date(m.created_at).toLocaleString("fr-FR")}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => markRead(m.id, !m.lu)}>
                          {m.lu ? "Marquer non lu" : "Marquer lu"}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteMessage(m.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-foreground/80 whitespace-pre-wrap mt-3">{m.message}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
