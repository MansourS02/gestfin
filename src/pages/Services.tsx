import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SectionTitle from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import {
  BookOpen, BarChart3, TrendingUp, Users, ArrowRight,
  FileText, Briefcase, Shield, Target, Megaphone,
  GraduationCap, Handshake, AlertTriangle, PieChart
} from "lucide-react";

const poles = [
  {
    id: "etudes",
    title: "Études",
    icon: BookOpen,
    color: "bg-secondary",
    services: [
      { icon: PieChart, title: "Étude marketing", desc: "Analyse approfondie de votre marché, de la concurrence et des tendances pour orienter vos décisions." },
      { icon: BarChart3, title: "Étude économique et financière", desc: "Évaluation de la viabilité économique et financière de vos projets d'investissement." },
      { icon: FileText, title: "Élaboration de business plan", desc: "Rédaction complète de business plans convaincants pour vos levées de fonds et développements." },
    ],
  },
  {
    id: "gestion",
    title: "Gestion",
    icon: Briefcase,
    color: "bg-primary",
    services: [
      { icon: TrendingUp, title: "Gestion et développement d'affaires", desc: "Stratégies de croissance et optimisation de vos processus commerciaux." },
      { icon: Shield, title: "Gestion de patrimoine", desc: "Conseil en gestion et valorisation de votre patrimoine professionnel et personnel." },
      { icon: BarChart3, title: "Audit et contrôle de gestion", desc: "Diagnostic complet de votre organisation et mise en place d'outils de pilotage." },
    ],
  },
  {
    id: "strategies",
    title: "Stratégies",
    icon: Target,
    color: "bg-accent",
    services: [


      { icon: Megaphone, title: "Audit marketing", desc: "Évaluation de votre positionnement marketing et recommandations d'amélioration." },

      { icon: Target, title: "Plan stratégique de développement", desc: "Définition de votre vision à long terme et feuille de route opérationnelle." },
      { icon: BarChart3, title: "Évaluation et suivi", desc: "Indicateurs de performance, tableaux de bord et suivi de vos objectifs stratégiques." },
    ],
  },
  {

    id: "audit-marketing",
    title: "Audit Marketing",
    icon: Megaphone,
    color: "bg-secondary",
    services: [
      { icon: Megaphone, title: "Audit marketing", desc: "Évaluation de votre positionnement marketing et recommandations d'amélioration." },
    ],
  },
  {


    id: "formation",
    title: "Formation & Accompagnement",
    icon: GraduationCap,
    color: "bg-secondary",
    services: [
      { icon: Megaphone, title: "Marketing & stratégie digitale", desc: "Maîtrisez les outils du marketing digital pour développer votre présence en ligne." },

      { icon: Users, title: "Management des unités commerciales", desc: "Management et leadership pour piloter vos équipes commerciales." },

      { icon: Users, title: "Management des unités commerciales", desc: "Techniques de management et leadership pour piloter vos équipes commerciales." },

      { icon: Handshake, title: "Négociation des relations d'affaires", desc: "Développez vos compétences en négociation commerciale et partenariats stratégiques." },
      { icon: AlertTriangle, title: "Gestion des crises", desc: "Anticipation, gestion et communication de crise pour protéger votre réputation." },
    ],
  },
];

const Services = () => {
  return (
    <Layout>
      <section className="gradient-navy py-20">
        <div className="container mx-auto px-4">
          <SectionTitle
            light
            subtitle="Nos expertises"
            title="Des solutions complètes pour chaque enjeu"
            description="Quatre pôles d'expertise complémentaires pour accompagner votre réussite."
          />
        </div>
      </section>

      {poles.map((pole, pi) => (
        <section key={pole.id} className={pi % 2 === 0 ? "py-20 bg-background" : "py-20 bg-muted"}>
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-10">
              <div className={`w-12 h-12 rounded-lg ${pole.color} flex items-center justify-center`}>
                <pole.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">{pole.title}</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pole.services.map((s, i) => (
                <div key={i} className="bg-card rounded-xl p-6 border border-border hover:border-secondary/40 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                    <s.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{s.desc}</p>
                  <Link to="/rendez-vous" className="inline-flex items-center text-secondary text-sm font-medium hover:underline">
                    Demander un devis <ArrowRight className="ml-1 w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="gradient-navy py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">
            Un besoin spécifique ?
          </h2>
          <p className="text-primary-foreground/70 text-lg mb-8 max-w-xl mx-auto">
            Chaque projet est unique. Contactez-nous pour un diagnostic personnalisé.
          </p>
          <Link to="/rendez-vous">
            <Button size="lg" variant="secondary" className="font-semibold px-8">
              Prendre rendez-vous <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
