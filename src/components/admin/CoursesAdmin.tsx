import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Trash2, ChevronDown, ChevronRight, BookOpen, FileText, Edit } from "lucide-react";

export default function CoursesAdmin() {
  const [courses, setCourses] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [modulesByCourse, setModulesByCourse] = useState<Record<string, any[]>>({});
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
    if (data) setCourses(data);
  };

  useEffect(() => { load(); }, []);

  const loadModules = async (courseId: string) => {
    const { data } = await supabase
      .from("modules")
      .select("id, title, description, position, lessons(id, title, position), quizzes(id, title, passing_score)")
      .eq("course_id", courseId)
      .order("position");
    if (data) setModulesByCourse((m) => ({ ...m, [courseId]: data }));
  };

  const toggleExpand = (id: string) => {
    const n = new Set(expanded);
    if (n.has(id)) n.delete(id);
    else { n.add(id); loadModules(id); }
    setExpanded(n);
  };

  const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const saveCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const data = {
      title: f.get("title") as string,
      slug: editingCourse?.slug || slugify(f.get("title") as string),
      description: f.get("description") as string,
      cover_image_url: f.get("cover_image_url") as string || null,
      price_xof: parseInt(f.get("price_xof") as string) || 0,
      access_type: f.get("access_type") as "purchase" | "subscription" | "both",
      duration_hours: parseFloat(f.get("duration_hours") as string) || null,
      level: f.get("level") as string || null,
      is_published: f.get("is_published") === "on",
    };
    const { error } = editingCourse
      ? await supabase.from("courses").update(data).eq("id", editingCourse.id)
      : await supabase.from("courses").insert(data);
    if (error) toast.error(error.message);
    else { toast.success("Enregistré"); setOpen(false); setEditingCourse(null); load(); }
  };

  const deleteCourse = async (id: string) => {
    if (!confirm("Supprimer cette formation et tout son contenu ?")) return;
    await supabase.from("courses").delete().eq("id", id);
    toast.success("Supprimé");
    load();
  };

  const addModule = async (courseId: string) => {
    const title = prompt("Titre du module :");
    if (!title) return;
    const position = (modulesByCourse[courseId]?.length || 0) + 1;
    await supabase.from("modules").insert({ course_id: courseId, title, position });
    loadModules(courseId);
  };

  const deleteModule = async (id: string, courseId: string) => {
    if (!confirm("Supprimer ce module ?")) return;
    await supabase.from("modules").delete().eq("id", id);
    loadModules(courseId);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Formations ({courses.length})</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditingCourse(null); }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Nouvelle formation</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingCourse ? "Modifier" : "Nouvelle"} formation</DialogTitle></DialogHeader>
            <form onSubmit={saveCourse} className="space-y-3">
              <div><Label>Titre *</Label><Input name="title" required defaultValue={editingCourse?.title} /></div>
              <div><Label>Description</Label><Textarea name="description" rows={3} defaultValue={editingCourse?.description} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Prix (FCFA)</Label><Input name="price_xof" type="number" defaultValue={editingCourse?.price_xof || 0} /></div>
                <div><Label>Durée (heures)</Label><Input name="duration_hours" type="number" step="0.5" defaultValue={editingCourse?.duration_hours} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Niveau</Label>
                  <Select name="level" defaultValue={editingCourse?.level || "Débutant"}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Débutant">Débutant</SelectItem>
                      <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                      <SelectItem value="Avancé">Avancé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Type d'accès</Label>
                  <Select name="access_type" defaultValue={editingCourse?.access_type || "both"}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purchase">Achat unique</SelectItem>
                      <SelectItem value="subscription">Abonnement</SelectItem>
                      <SelectItem value="both">Les deux</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>URL image de couverture</Label><Input name="cover_image_url" type="url" defaultValue={editingCourse?.cover_image_url} /></div>
              <div className="flex items-center gap-2">
                <Switch name="is_published" defaultChecked={editingCourse?.is_published} />
                <Label>Publier (visible au public)</Label>
              </div>
              <Button type="submit" className="w-full">Enregistrer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {courses.map((c) => (
          <div key={c.id} className="bg-card border border-border rounded-lg">
            <div className="flex items-center justify-between p-3">
              <button onClick={() => toggleExpand(c.id)} className="flex items-center gap-2 flex-1 text-left">
                {expanded.has(c.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <BookOpen className="w-4 h-4 text-secondary" />
                <span className="font-medium">{c.title}</span>
                {c.is_published ? <Badge variant="default" className="ml-2">Publié</Badge> : <Badge variant="secondary" className="ml-2">Brouillon</Badge>}
              </button>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => { setEditingCourse(c); setOpen(true); }}><Edit className="w-4 h-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => deleteCourse(c.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>

            {expanded.has(c.id) && (
              <div className="border-t border-border p-4 bg-muted/50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-sm">Modules</h3>
                  <Button size="sm" variant="outline" onClick={() => addModule(c.id)}><Plus className="w-3 h-3 mr-1" /> Module</Button>
                </div>
                <div className="space-y-2">
                  {(modulesByCourse[c.id] || []).map((m, i) => (
                    <ModuleEditor key={m.id} module={m} index={i} onChange={() => loadModules(c.id)} onDelete={() => deleteModule(m.id, c.id)} />
                  ))}
                  {(modulesByCourse[c.id] || []).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-3">Aucun module — cliquez sur "Module" pour commencer</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ModuleEditor({ module, index, onChange, onDelete }: any) {
  const [open, setOpen] = useState(false);
  const [lessons, setLessons] = useState<any[]>(module.lessons || []);
  const [quiz, setQuiz] = useState<any>(module.quizzes?.[0]);

  const addLesson = async () => {
    const title = prompt("Titre de la leçon :");
    if (!title) return;
    const position = lessons.length + 1;
    const { data } = await supabase.from("lessons").insert({ module_id: module.id, title, position }).select().single();
    if (data) setLessons([...lessons, data]);
  };

  const editLesson = async (l: any) => {
    const newTitle = prompt("Titre :", l.title);
    if (newTitle === null) return;
    const content = prompt("Contenu texte :", l.content || "");
    const video_url = prompt("URL vidéo (YouTube embed ex: https://www.youtube.com/embed/XXX) :", l.video_url || "");
    const resource_url = prompt("URL ressource PDF :", l.resource_url || "");
    await supabase.from("lessons").update({ title: newTitle, content, video_url: video_url || null, resource_url: resource_url || null }).eq("id", l.id);
    toast.success("Leçon mise à jour");
    onChange();
  };

  const delLesson = async (id: string) => {
    if (!confirm("Supprimer cette leçon ?")) return;
    await supabase.from("lessons").delete().eq("id", id);
    setLessons(lessons.filter((x) => x.id !== id));
  };

  const createQuiz = async () => {
    const score = prompt("Note minimale pour réussir (%) :", "70");
    const { data } = await supabase.from("quizzes").insert({ module_id: module.id, passing_score: parseInt(score || "70") }).select().single();
    if (data) setQuiz(data);
  };

  const addQuestion = async () => {
    if (!quiz) return;
    const question = prompt("Question :");
    if (!question) return;
    const { data: q } = await supabase.from("quiz_questions").insert({ quiz_id: quiz.id, question, position: 0 }).select().single();
    if (!q) return;
    for (let i = 1; i <= 4; i++) {
      const text = prompt(`Réponse ${i} :`);
      if (!text) break;
      const correct = confirm(`"${text}" — est-ce la bonne réponse ? OK = oui, Annuler = non`);
      await supabase.from("quiz_answers").insert({ question_id: q.id, answer_text: text, is_correct: correct, position: i });
    }
    toast.success("Question ajoutée");
  };

  return (
    <div className="bg-card border border-border rounded">
      <div className="flex items-center justify-between p-2">
        <button onClick={() => setOpen(!open)} className="flex items-center gap-2 flex-1 text-left">
          {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          <span className="text-sm font-medium">Module {index + 1} : {module.title}</span>
          <span className="text-xs text-muted-foreground">({lessons.length} leçons)</span>
        </button>
        <Button size="sm" variant="ghost" onClick={onDelete}><Trash2 className="w-3 h-3 text-destructive" /></Button>
      </div>
      {open && (
        <div className="border-t border-border p-3 space-y-2 bg-background">
          {lessons.map((l) => (
            <div key={l.id} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
              <span>📖 {l.title}</span>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => editLesson(l)}><Edit className="w-3 h-3" /></Button>
                <Button size="sm" variant="ghost" onClick={() => delLesson(l.id)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
              </div>
            </div>
          ))}
          <Button size="sm" variant="outline" onClick={addLesson} className="w-full"><Plus className="w-3 h-3 mr-1" /> Leçon</Button>

          <div className="pt-2 border-t">
            {quiz ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2"><FileText className="w-3 h-3" /> Quiz (≥{quiz.passing_score}%)</span>
                  <Button size="sm" variant="outline" onClick={addQuestion}><Plus className="w-3 h-3 mr-1" /> Question</Button>
                </div>
              </div>
            ) : (
              <Button size="sm" variant="outline" onClick={createQuiz} className="w-full">
                <FileText className="w-3 h-3 mr-1" /> Créer le quiz du module
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
