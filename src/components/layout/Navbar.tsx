import { NavLink, Link } from "react-router-dom";
import { ShieldCheck, Menu, X, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useSettings } from "../../contexts/SettingsContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Mission", path: "/mission" },
  { name: "Vision", path: "/vision" },
  { name: "Gallery", path: "/gallery" },
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export function Navbar() {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const logoUrl = settings.logoUrl;
  const [menuBgColor, setMenuBgColor] = useState(""); // TODO: Fetch from Supabase

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b-[3px] border-imrc-secondary",
        !menuBgColor && scrolled ? "bg-imrc-primary/95 backdrop-blur-md shadow-sm" : "",
        !menuBgColor && !scrolled ? "bg-imrc-primary" : ""
      )}
      style={menuBgColor ? { backgroundColor: menuBgColor } : {}}
    >
      <div className="container-custom h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          {logoUrl ? (
            <img src={logoUrl} alt="GAARC Logo" className="h-10 w-auto" />
          ) : (
            <>
              <div className="text-white">
                <Globe className="w-8 h-8 transition-transform group-hover:rotate-12" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl leading-none text-white tracking-tight">GAARC</span>
                <span className="text-[0.62rem] font-medium text-white/80 uppercase tracking-wider">Global Anti-Identity Theft Commission</span>
              </div>
            </>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  "px-4 py-2 text-sm font-medium transition-colors relative",
                  "after:content-[''] after:absolute after:w-[calc(100%-2rem)] after:h-[2px] after:bottom-1 after:left-4 after:bg-imrc-accent after:origin-left after:transition-transform after:duration-300",
                  isActive
                    ? "text-imrc-accent after:scale-x-100"
                    : "text-white/90 after:scale-x-0 hover:text-imrc-accent hover:after:scale-x-100"
                )
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div
        className={cn(
          "md:hidden absolute top-20 left-0 w-full bg-imrc-primary shadow-lg border-b-[3px] border-imrc-secondary transition-all duration-300 overflow-hidden",
          isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="flex flex-col py-4 px-6 gap-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  "text-lg font-medium",
                  isActive ? "text-imrc-accent" : "text-white/90"
                )
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
}
