import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Globe, Mail, MapPin, CheckCircle2, Phone } from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";

export function Footer() {
  const { settings } = useSettings();
  const [subscribed, setSubscribed] = useState(false);
  const logoUrl = settings.logoUrl;
  const contactEmail = settings.email;
  const contactPhone = settings.phone;
  const contactLocation = settings.location;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="bg-imrc-primary text-white pt-16">
      <div className="container-custom grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        {/* About GAARC */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt="GAARC Logo" className="h-8 w-auto" />
            ) : (
              <>
                <Globe className="w-6 h-6 text-imrc-accent" />
                <span className="font-bold text-xl tracking-tight">GAARC</span>
              </>
            )}
          </Link>
          <p className="text-sm text-gray-300 leading-relaxed">
            The Global Anti-Identity Theft & Rehabilitation Commission — enlightening, 
            educating, and reforming victims of identity theft, cyber impersonation, and digital abuse globally.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          <h4 className="font-semibold text-lg text-imrc-secondary">Quick Links</h4>
          <ul className="flex flex-col gap-2">
            <li><Link to="/mission" className="text-sm text-gray-300 hover:text-imrc-accent transition-colors">Our Mission</Link></li>
            <li><Link to="/vision" className="text-sm text-gray-300 hover:text-imrc-accent transition-colors">Our Vision</Link></li>
            <li><Link to="/about" className="text-sm text-gray-300 hover:text-imrc-accent transition-colors">About Us</Link></li>
            <li><Link to="/gallery" className="text-sm text-gray-300 hover:text-imrc-accent transition-colors">Operations Gallery</Link></li>
            <li><Link to="/contact" className="text-sm text-gray-300 hover:text-imrc-accent transition-colors">Contact Support</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-4">
          <h4 className="font-semibold text-lg text-imrc-secondary">Headquarters</h4>
          <div className="flex flex-col gap-3 text-sm text-gray-300">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-imrc-accent shrink-0 mt-0.5" />
              <p className="whitespace-pre-wrap">{contactLocation}</p>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <Phone className="w-4 h-4 text-imrc-accent shrink-0" />
              <a href={`tel:${contactPhone.replace(/[^0-9+]/g, '')}`} className="hover:text-imrc-accent transition-colors">{contactPhone}</a>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <span className="font-medium text-white">Support Team</span>
              <span className="text-xs text-imrc-secondary uppercase tracking-wider">Victim Rehabilitation Unit</span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <Mail className="w-4 h-4 text-imrc-accent shrink-0" />
              <a href={`mailto:${contactEmail}`} className="hover:text-imrc-accent transition-colors">{contactEmail}</a>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-4">
          <h4 className="font-semibold text-lg text-imrc-secondary">Stay Updated</h4>
          <p className="text-sm text-gray-300">Subscribe to our alerts on identity protection standards and cyber awareness.</p>
          <form className="flex mt-2" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-white/10 text-white placeholder-gray-400 px-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-imrc-accent text-sm"
              required
            />
            <button 
              type="submit" 
              className="bg-imrc-accent hover:bg-imrc-accent-light text-imrc-primary px-4 py-2 rounded-r-md font-semibold text-sm transition-colors"
            >
              Subscribe
            </button>
          </form>
          {subscribed && (
            <p className="text-sm text-imrc-success flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-4 h-4" /> Subscribed successfully
            </p>
          )}
        </div>
      </div>

      <div className="bg-[#04286B] py-6 mt-12 border-t border-white/10">
        <div className="container-custom flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/70">
            © {new Date().getFullYear()} GAARC — Global Anti-Identity Theft & Rehabilitation Commission. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
