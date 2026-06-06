import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Clock, GraduationCap, CheckCircle2, BookOpen, PlayCircle, Lock } from "lucide-react";

const FormationDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: c } = await supabase.from("courses").select("*").eq("slug", slug!).maybeSingle();
      if (!c) { setLoading(false); return; }
      setCourse(c);

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
        const { data: enroll } = await supabase
          .from("enrollments")
          .select("status")
          .eq("user_id", session.user.id)
          .eq("course_id", c.id)
          .maybeSingle();
        if (enroll && ["active", "completed"].includes(enroll.status)) setHasAccess(true);
      }

      const { data: mods } = await supabase
        .from("modules")
        .select("id, title, description, position, lessons(id, title, position)")
        .eq("course_id", c.id)
        .order("position");
      if (mods) setModules(mods);
      setLoading(false);
    };
    load();
  }, [slug]);

  const handleEnroll = async () => {
    if (!userId) { navigate("/auth"); return; }
    setEnrolling(true);
    const { error } = await supabase.from("enrollments").insert({
      user_id: userId,
      course_id: course.id,
      status: "pending",
    });
    setEnrolling(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Demande envoyée ! L'administrateur va valider votre accès.");
  };

  if (loading) return <Layout><div className="pt-32 pb-20 text-center">Chargement...</div></Layout>;
  if (!course) return <Layout><div className="pt-32 pb-20 text-center">Formation introuvable</div></Layout>;

  const totalLessons = modules.reduce((s, m) => s + (m.lessons?.length || 0), 0);

  return (
    <Layout>
      <section className="pt-32 pb-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {course.level && <Badge variant="secondary" className="mb-3">{course.level}</Badge>}
            <h1 className="font-display text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-primary-foreground/80 text-lg">{course.description}</p>
            <div className="flex flex-wrap gap-5 mt-6 text-sm">
              {course.duration_hours && (
                <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {course.duration_hours} heures</span>
              )}
              <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> {modules.length} modules</span>
              <span className="flex items-center gap-2"><PlayCircle className="w-4 h-4" /> {totalLessons} leçons</span>
            </div>
          </div>
          <div className="bg-card text-card-foreground rounded-xl p-6 h-fit">
            {course.cover_image_url && (
              <img src={course.cover_image_url} alt={course.title} className="w-full aspect-video object-cover rounded-lg mb-4" />
            )}
            <div className="text-3xl font-bold text-primary mb-4">{course.price_xof.toLocaleString("fr-FR")} FCFA</div>
            {hasAccess ? (
              <Button onClick={() => navigate(`/apprendre/${course.slug}`)} className="w-full" size="lg">
                Accéder à la formation
              </Button>
            ) : (
              <Button onClick={handleEnroll} disabled={enrolling} className="w-full bg-secondary text-secondary-foreground hover:bg-teal-light" size="lg">
                {enrolling ? "..." : userId ? "Demander l'accès" : "Se connecter pour s'inscrire"}
              </Button>
            )}
            <p className="text-xs text-muted-foreground mt-3 text-center">
              {hasAccess ? "Vous êtes inscrit à cette formation" : "L'accès sera validé manuellement après paiement"}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-display text-2xl font-bold mb-6">Programme de la formation</h2>
          {modules.length === 0 ? (
            <p className="text-muted-foreground">Le programme sera publié prochainement.</p>
          ) : (
            <div className="space-y-3">
              {modules.map((m, i) => (
                <div key={m.id} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{m.title}</h3>
                      {m.description && <p className="text-sm text-muted-foreground mt-1">{m.description}</p>}
                      <div className="mt-3 space-y-1">
                        {m.lessons?.sort((a: any, b: any) => a.position - b.position).map((l: any) => (
                          <div key={l.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                            {hasAccess ? <PlayCircle className="w-4 h-4 text-secondary" /> : <Lock className="w-3 h-3" />}
                            <span>{l.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default FormationDetail;
