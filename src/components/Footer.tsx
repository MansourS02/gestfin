import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import logoGest from "@/assets/logo-gest.png";

const Footer = () => {
  return (
    <footer className="gradient-navy text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logoGest} alt="Logo GEST" className="h-14 w-auto" />
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              Gestion · Étude · Stratégie Marketing. Plus de 20 ans d'expertise de notre Directeur au service de votre réussite.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li><Link to="/services" className="hover:text-secondary transition-colors">Études</Link></li>
              <li><Link to="/services" className="hover:text-secondary transition-colors">Gestion</Link></li>
              <li><Link to="/services" className="hover:text-secondary transition-colors">Stratégies</Link></li>
              <li><Link to="/services" className="hover:text-secondary transition-colors">Formation</Link></li>
            </ul>
          </div>

          {/* Liens */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Liens utiles</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li><Link to="/a-propos" className="hover:text-secondary transition-colors">À propos</Link></li>
              <li><Link to="/rendez-vous" className="hover:text-secondary transition-colors">Prendre rendez-vous</Link></li>
              <li><Link to="/contact" className="hover:text-secondary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/60">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-secondary shrink-0" />
                Yoff Diamalaye 2 n° 02, Dakar, Sénégal
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <a href="tel:+221775041565" className="hover:text-secondary transition-colors">+221 77 504 15 65</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-secondary shrink-0" />
                <a href="mailto:gestasow@gmail.com" className="hover:text-secondary transition-colors">gestasow@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/40">
          <p>© {new Date().getFullYear()} Cabinet GEST. Tous droits réservés.</p>
          <p>RC: TEB RC.SN_DKR.2024.4.43430</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
