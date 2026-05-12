import Layout from "@/components/Layout";
import SectionTitle from "@/components/SectionTitle";
import { Award, BookOpen, Target, Users, CheckCircle2 } from "lucide-react";

const milestones = [
  "Diplômé en Économie et Gestion",
  "Expert diplômé en Marketing Management",
  "Consultant Formateur certifié",
  "Plus de 20 ans d'expérience professionnelle",
  "Fondateur du Cabinet GEST",
];

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-navy py-20">
        <div className="container mx-auto px-4">
          <SectionTitle
            light
            subtitle="Notre histoire"
            title="À propos du Cabinet GEST"
            description="Fondé par Amari Sow, le Cabinet GEST accompagne les entreprises dans leur croissance depuis plus de deux décennies."
          />
        </div>
      </section>

      {/* Profil */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <span className="text-secondary text-sm font-semibold uppercase tracking-widest">Le fondateur</span>
              <h2 className="font-display text-3xl font-bold mt-2 mb-6">Amari Sow</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Économiste et Gestionnaire de formation, Amari Sow est un expert diplômé en Marketing Management. 
                Fort de plus de 20 ans d'expérience, il a accompagné des centaines d'entreprises dans leur développement stratégique.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                En tant que Consultant Formateur, il partage son expertise à travers des formations pratiques en marketing digital, 
                management commercial et négociation d'affaires. Sa vision : rendre l'excellence accessible aux entreprises africaines.
              </p>
              <ul className="space-y-3">
                {milestones.map((m, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground">
                    <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-muted rounded-2xl p-8 flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full bg-primary/10 border-4 border-secondary/30 flex items-center justify-center mb-6">
                <span className="font-display text-4xl font-bold text-primary">AS</span>
              </div>
              <h3 className="font-display text-xl font-bold">Amari Sow</h3>
              <p className="text-secondary font-medium mt-1">Économiste · Gestionnaire · Consultant</p>
              <p className="text-muted-foreground text-sm mt-4 max-w-sm">
                Expert diplômé en Marketing Management — Consultant Formateur avec 20+ ans d'expérience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Vision */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-card rounded-xl p-8 border border-border">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-5">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-4">Notre mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                Accompagner les entreprises et les entrepreneurs dans l'élaboration et la mise en œuvre de stratégies 
                performantes en matière de gestion, de marketing et de développement commercial.
              </p>
            </div>
            <div className="bg-card rounded-xl p-8 border border-border">
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-5">
                <BookOpen className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-4">Notre vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                Devenir le cabinet de référence en Afrique de l'Ouest, alliant excellence et innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="gradient-navy py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { value: "20+", label: "Années d'expérience" },
              { value: "500+", label: "Projets réalisés" },
              { value: "200+", label: "Clients accompagnés" },
              { value: "15+", label: "Secteurs couverts" },
            ].map((s, i) => (
              <div key={i}>
                <div className="font-display text-3xl md:text-4xl font-bold text-secondary">{s.value}</div>
                <div className="text-primary-foreground/60 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
