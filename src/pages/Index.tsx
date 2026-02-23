import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import SectionTitle from "@/components/SectionTitle";
import heroBg from "@/assets/hero-bg.jpg";
import {
  BarChart3, BookOpen, Users, TrendingUp, Shield, Award,
  ArrowRight, CheckCircle2, Star, Phone
} from "lucide-react";

const services = [
  {
    icon: BookOpen,
    title: "Études",
    desc: "Études marketing, économiques et financières. Élaboration de business plans sur mesure.",
  },
  {
    icon: BarChart3,
    title: "Gestion",
    desc: "Gestion d'affaires, de patrimoine, audit et contrôle de gestion pour votre croissance.",
  },
  {
    icon: TrendingUp,
    title: "Stratégies",
    desc: "Audit marketing, plans stratégiques de développement, évaluation et suivi.",
  },
  {
    icon: Users,
    title: "Formation",
    desc: "Marketing digital, management commercial, négociation et gestion des crises.",
  },
];

const stats = [
  { value: "20+", label: "Années d'expérience" },
  { value: "500+", label: "Projets réalisés" },
  { value: "200+", label: "Clients accompagnés" },
  { value: "100%", label: "Engagement qualité" },
];

const testimonials = [
  {
    name: "Fatou Diallo",
    role: "DG, Teranga Solutions",
    text: "GEST a transformé notre vision stratégique. Un accompagnement professionnel et rigoureux qui a propulsé notre entreprise.",
  },
  {
    name: "Ibrahima Ndiaye",
    role: "Fondateur, SenTech SA",
    text: "Grâce au business plan élaboré par GEST, nous avons obtenu les financements nécessaires à notre expansion régionale.",
  },
  {
    name: "Aminata Ba",
    role: "Directrice Marketing, AfriBrand",
    text: "Les formations dispensées par M. Sow ont révolutionné notre approche du marketing digital. Résultats concrets en 3 mois.",
  },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 gradient-hero" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-semibold mb-6 animate-fade-in">
              Cabinet de conseil depuis 2004
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Votre partenaire en{" "}
              <span className="text-gradient">Gestion, Étude & Stratégie</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/75 leading-relaxed max-w-xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Plus de 20 ans d'expertise au service des entreprises africaines. Conseil en marketing, gestion et stratégie sur mesure.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Link to="/rendez-vous">
                <Button size="lg" variant="secondary" className="font-semibold text-base px-8">
                  Prendre rendez-vous
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline" className="font-semibold text-base px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Découvrir nos services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center py-4">
                <div className="font-display text-3xl md:text-4xl font-bold text-secondary">{s.value}</div>
                <div className="text-primary-foreground/60 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi nous choisir */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <SectionTitle
            subtitle="Notre différence"
            title="Pourquoi choisir le Cabinet GEST ?"
            description="Une expertise reconnue, un accompagnement personnalisé et des résultats mesurables."
          />
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Award, title: "Expertise certifiée", desc: "Diplômé en Marketing Management avec plus de 20 ans d'expérience terrain." },
              { icon: Shield, title: "Confiance & rigueur", desc: "Un accompagnement structuré, confidentiel et orienté résultats." },
              { icon: Users, title: "Approche sur mesure", desc: "Chaque projet est unique. Nos solutions sont adaptées à vos enjeux." },
            ].map((item, i) => (
              <div key={i} className="bg-card rounded-xl p-8 border border-border hover:shadow-lg transition-shadow group">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-5 group-hover:bg-secondary/20 transition-colors">
                  <item.icon className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <SectionTitle
            subtitle="Nos pôles"
            title="Des services complets pour votre développement"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <div key={i} className="bg-card rounded-xl p-6 border border-border hover:border-secondary/40 hover:shadow-md transition-all group">
                <div className="w-11 h-11 rounded-lg bg-primary flex items-center justify-center mb-4">
                  <s.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{s.desc}</p>
                <Link to="/services" className="inline-flex items-center text-secondary text-sm font-medium hover:underline">
                  En savoir plus <ArrowRight className="ml-1 w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <SectionTitle
            subtitle="Témoignages"
            title="Ce que disent nos clients"
          />
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-card rounded-xl p-8 border border-border">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 italic">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-foreground">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-navy py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Prêt à développer votre activité ?
          </h2>
          <p className="text-primary-foreground/70 text-lg mb-8 max-w-xl mx-auto">
            Contactez-nous pour un premier échange gratuit et sans engagement.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/rendez-vous">
              <Button size="lg" variant="secondary" className="font-semibold px-8">
                Prendre rendez-vous
              </Button>
            </Link>
            <a href="tel:+221775041565">
              <Button size="lg" variant="outline" className="font-semibold px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Phone className="mr-2 w-4 h-4" />
                +221 77 504 15 65
              </Button>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
