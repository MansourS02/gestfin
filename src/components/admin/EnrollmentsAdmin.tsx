import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Check, X, Trash2 } from "lucide-react";

export default function EnrollmentsAdmin() {
  const [enrollments, setEnrollments] = useState<any[]>([]);

  const load = async () => {
    const { data } = await supabase
      .from("enrollments")
      .select("id, status, enrolled_at, user_id, courses(title), profiles!enrollments_user_id_fkey(full_name)")
      .order("enrolled_at", { ascending: false });
    if (data) setEnrollments(data);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("enrollments").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Statut mis à jour"); load(); }
  };

  const deleteEnrollment = async (id: string) => {
    if (!confirm("Supprimer cette inscription ?")) return;
    await supabase.from("enrollments").delete().eq("id", id);
    toast.success("Supprimé");
    load();
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Apprenant</TableHead>
            <TableHead>Formation</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enrollments.length === 0 && (
            <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Aucune inscription</TableCell></TableRow>
          )}
          {enrollments.map((e) => (
            <TableRow key={e.id}>
              <TableCell className="text-sm">{new Date(e.enrolled_at).toLocaleDateString("fr-FR")}</TableCell>
              <TableCell className="text-sm">{e.profiles?.full_name || e.user_id.slice(0, 8)}</TableCell>
              <TableCell className="text-sm">{e.courses?.title}</TableCell>
              <TableCell>
                <Select value={e.status} onValueChange={(v) => updateStatus(e.id, v)}>
                  <SelectTrigger className="w-36 h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Button size="sm" variant="ghost" onClick={() => deleteEnrollment(e.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
