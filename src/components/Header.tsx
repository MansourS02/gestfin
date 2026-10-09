import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
  House,
  Info,
  Mail,
  Menu,
  Phone,
  X,
} from "lucide-react";
import logoGest from "@/assets/logo-gest.png";

const navItems = [
  { label: "Accueil", path: "/", icon: House },
  { label: "À propos", path: "/a-propos", icon: Info },
  { label: "Services", path: "/services", icon: BriefcaseBusiness },
  { label: "Formations", path: "/formations", icon: GraduationCap },
  { label: "Contact", path: "/contact", icon: Mail },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setIsOpen(false);
  const isActive = (path: string) =>
    path === "/" ? location.pathname === path : location.pathname.startsWith(path);

  const navigation = (
    <nav aria-label="Navigation principale" className="flex flex-col gap-2">
      {navItems.map(({ label, path, icon: Icon }) => (
        <Link
          key={path}
          to={path}
          onClick={closeMenu}
          aria-current={isActive(path) ? "page" : undefined}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
            isActive(path)
              ? "bg-white text-blue-800 shadow-sm"
              : "text-white/80 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
          {label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-blue-100 bg-white px-4 shadow-sm md:hidden">
        <Link to="/" onClick={closeMenu} aria-label="GEST - Accueil">
          <img src={logoGest} alt="Logo GEST" className="h-11 w-auto" />
        </Link>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          className="rounded-lg p-2 text-blue-900 transition-colors hover:bg-blue-50"
        >
          {isOpen ? <X aria-hidden="true" className="h-6 w-6" /> : <Menu aria-hidden="true" className="h-6 w-6" />}
        </button>
      </header>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-gradient-to-b from-blue-900 to-blue-800 px-5 py-6 text-white shadow-xl md:flex">
        <Link to="/" className="mb-10 flex items-center justify-center rounded-xl bg-white p-3" aria-label="GEST - Accueil">
          <img src={logoGest} alt="Logo GEST" className="h-14 w-auto" />
        </Link>
        <p className="mb-4 px-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
          Menu principal
        </p>
        {navigation}
        <div className="mt-auto border-t border-white/15 pt-5">
          <a
            href="tel:+221775041565"
            className="mb-4 flex items-center gap-3 px-4 text-sm text-white/80 transition-colors hover:text-white"
          >
            <Phone aria-hidden="true" className="h-5 w-5" />
            +221 77 504 15 65
          </a>
          <Link
            to="/rendez-vous"
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-blue-900 transition-colors hover:bg-blue-50"
          >
            <CalendarDays aria-hidden="true" className="h-5 w-5" />
            Prendre rendez-vous
          </Link>
        </div>
      </aside>

      {isOpen && (
        <div className="fixed inset-0 top-16 z-40 md:hidden">
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={closeMenu}
            className="absolute inset-0 h-full w-full bg-slate-950/40"
          />
          <aside
            id="mobile-navigation"
            className="relative flex h-full w-[min(18rem,85vw)] flex-col bg-gradient-to-b from-blue-900 to-blue-800 px-5 py-6 text-white shadow-xl"
          >
            <Link to="/" onClick={closeMenu} className="mb-8 flex items-center justify-center rounded-xl bg-white p-3" aria-label="GEST - Accueil">
              <img src={logoGest} alt="Logo GEST" className="h-14 w-auto" />
            </Link>
            <p className="mb-4 px-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              Menu principal
            </p>
            {navigation}
            <div className="mt-auto border-t border-white/15 pt-5">
              <a
                href="tel:+221775041565"
                className="mb-4 flex items-center gap-3 px-4 text-sm text-white/80"
              >
                <Phone aria-hidden="true" className="h-5 w-5" />
                +221 77 504 15 65
              </a>
              <Link
                to="/rendez-vous"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-blue-900"
              >
                <CalendarDays aria-hidden="true" className="h-5 w-5" />
                Prendre rendez-vous
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Header;
