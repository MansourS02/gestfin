import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import SectionTitle from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, GraduationCap, ArrowRight } from "lucide-react";

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  price_xof: number;
  access_type: "purchase" | "subscription" | "both";
  duration_hours: number | null;
  level: string | null;
}

const Formations = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("courses")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setCourses(data as Course[]);
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <section className="pt-32 pb-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Nos Formations</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Développez vos compétences avec les formations professionnelles du Cabinet GEST,
            conçues par des experts ayant plus de 20 ans d'expérience.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <p className="text-center text-muted-foreground">Chargement...</p>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground">Aucune formation disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((c) => (
                <Link
                  key={c.id}
                  to={`/formations/${c.slug}`}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:border-secondary transition-all"
                >
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {c.cover_image_url ? (
                      <img src={c.cover_image_url} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
                        <GraduationCap className="w-16 h-16 text-primary-foreground/40" />
                      </div>
                    )}
                    {c.level && (
                      <Badge className="absolute top-3 left-3 bg-card text-card-foreground">{c.level}</Badge>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-xl font-bold mb-2 group-hover:text-secondary transition-colors">{c.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{c.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {c.duration_hours && (
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {c.duration_hours}h</span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">{c.price_xof.toLocaleString("fr-FR")} FCFA</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Formations;
