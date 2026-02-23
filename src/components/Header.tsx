import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoGest from "@/assets/logo-gest.png";

const navItems = [
  { label: "Accueil", path: "/" },
  { label: "À propos", path: "/a-propos" },
  { label: "Services", path: "/services" },
  { label: "Contact", path: "/contact" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-b border-navy-light/30">
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logoGest} alt="Logo GEST" className="h-12 w-auto" />
          <div>
            <span className="hidden md:block text-primary-foreground/60 text-[10px] leading-none tracking-wider uppercase">
              Gestion · Étude · Stratégie
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-secondary text-secondary-foreground"
                  : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href="tel:+221775041565" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
            <Phone className="w-4 h-4" />
          </a>
          <Link to="/rendez-vous">
            <Button variant="secondary" size="sm" className="font-semibold">
              Prendre RDV
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-primary-foreground p-2"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-primary border-t border-navy-light/30">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "bg-secondary text-secondary-foreground"
                    : "text-primary-foreground/80 hover:bg-primary-foreground/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/rendez-vous" onClick={() => setIsOpen(false)}>
              <Button variant="secondary" className="w-full mt-2 font-semibold">
                Prendre rendez-vous
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
