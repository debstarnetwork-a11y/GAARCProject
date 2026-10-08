import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShieldAlert, HeartHandshake, Scale, Users, Globe2, Building2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Home() {
  // TODO: Fetch this image URL from Supabase / Admin dashboard
  const [heroImage, setHeroImage] = useState("https://i.ibb.co/5g3f2vdw/image-04.jpg");
  const [initiativesBg, setInitiativesBg] = useState(""); // Background for Core Initiatives

  return (
    <div className="flex flex-col w-full">
      {/* Title Section (Above Hero Image) */}
      <section className="bg-imrc-primary pt-32 pb-6 px-4">
        <div className="container-custom text-center">
          <h1 className="text-white max-w-4xl mx-auto drop-shadow-md text-3xl md:text-5xl font-bold leading-tight">
            Empowering Global Identity Protection & Rehabilitation
          </h1>
        </div>
      </section>

      {/* Hero Section */}
      <section 
        className={cn("relative h-[65vh] min-h-[450px] flex flex-col justify-end overflow-hidden", !heroImage && "bg-mesh-gradient")}
        style={heroImage ? { backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {heroImage && <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />}
        {/* Floating shapes (CSS animated ideally, simplified here) */}
        {!heroImage && (
          <>
            <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-imrc-secondary/10 blur-3xl animate-pulse" />
            <div className="absolute bottom-40 right-20 w-64 h-64 bg-imrc-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          </>
        )}

        {/* Bottom of Hero: Buttons */}
        <div className="container-custom relative z-10 w-full mt-auto pb-8 md:pb-12">
          <div className="flex flex-row justify-between items-end w-full">
            <Link to="/contact">
              <Button variant="primary" size="lg" className="shadow-lg px-8">Get Help Now</Button>
            </Link>
            <Link to="/mission">
              <Button variant="secondary" size="lg" className="border-white text-white hover:bg-white hover:text-imrc-primary backdrop-blur-md bg-black/30 px-8 shadow-lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="w-full bg-imrc-primary border-t border-white/10 py-4 shadow-inner">
        <div className="container-custom flex flex-col md:flex-row items-center justify-center gap-6">
          <span className="text-white/80 text-sm font-medium uppercase tracking-wider">Trusted & Supported By</span>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-white/10 px-4 py-1.5 rounded-full text-xs font-semibold text-white border border-white/20 flex items-center gap-2">
              <Globe2 className="w-3 h-3 text-imrc-accent" /> International Coalitions
            </span>
            <span className="bg-white/10 px-4 py-1.5 rounded-full text-xs font-semibold text-white border border-white/20 flex items-center gap-2">
              <HeartHandshake className="w-3 h-3 text-imrc-accent" /> Global NGOs
            </span>
            <span className="bg-white/10 px-4 py-1.5 rounded-full text-xs font-semibold text-white border border-white/20 flex items-center gap-2">
              <Building2 className="w-3 h-3 text-imrc-accent" /> Community Advocates
            </span>
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container-custom text-center">
          <p className="text-imrc-primary font-medium text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
            The Global Anti-Identity Theft & Rehabilitation Commission (GAARC) — enlightening, 
            educating, and reforming victims of identity theft, synthetic impersonation, and cyber exploitation worldwide.
          </p>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="section-padding bg-imrc-bg-alt">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-[12px] p-8 shadow-card flex flex-col items-center text-center">
              <Globe2 className="w-12 h-12 text-imrc-secondary mb-4" />
              <h3 className="text-4xl font-bold text-imrc-accent mb-2">50+</h3>
              <p className="text-imrc-primary font-medium">Countries Reached</p>
            </div>
            <div className="bg-white rounded-[12px] p-8 shadow-card flex flex-col items-center text-center">
              <Users className="w-12 h-12 text-imrc-secondary mb-4" />
              <h3 className="text-4xl font-bold text-imrc-accent mb-2">10,000+</h3>
              <p className="text-imrc-primary font-medium">Victims Rehabilitated</p>
            </div>
            <div className="bg-white rounded-[12px] p-8 shadow-card flex flex-col items-center text-center">
              <Building2 className="w-12 h-12 text-imrc-secondary mb-4" />
              <h3 className="text-4xl font-bold text-imrc-accent mb-2">15+</h3>
              <p className="text-imrc-primary font-medium">Global Partners</p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Preview */}
      <section 
        className={cn("section-padding relative", !initiativesBg && "bg-white")}
        style={initiativesBg ? { backgroundImage: `url(${initiativesBg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {initiativesBg && <div className="absolute inset-0 bg-white/90" />}
        <div className="container-custom relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="mb-4">Our Core Initiatives</h2>
            <p className="text-imrc-muted">
              Providing comprehensive support systems, digital privacy guidance, and identity restoration 
              pathways for individuals devastated by identity crimes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group bg-white border border-gray-100 rounded-[12px] p-8 shadow-card hover:shadow-card-hover hover:-translate-y-[6px] transition-all duration-300 flex flex-col">
              <ShieldAlert className="w-10 h-10 text-imrc-secondary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl mb-3">Identity Theft Education</h3>
              <p className="text-imrc-muted text-sm mb-6 flex-1">
                Raising global awareness through targeted digital hygiene resources, community workshops, and training 
                modules to prevent data theft before it happens.
              </p>
              <Link to="/mission" className="text-imrc-accent font-semibold text-sm hover:text-imrc-primary transition-colors flex items-center gap-1 w-fit">
                Read More <span className="text-lg leading-none">&rarr;</span>
              </Link>
            </div>

            {/* Card 2 */}
            <div className="group bg-white border border-gray-100 rounded-[12px] p-8 shadow-card hover:shadow-card-hover hover:-translate-y-[6px] transition-all duration-300 flex flex-col">
              <HeartHandshake className="w-10 h-10 text-imrc-secondary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl mb-3">Victim Rehabilitation</h3>
              <p className="text-imrc-muted text-sm mb-6 flex-1">
                Direct intervention providing emotional guidance, profile reclamation assistance, 
                and dignity restoration for those affected by cyber impersonation.
              </p>
              <Link to="/contact" className="text-imrc-accent font-semibold text-sm hover:text-imrc-primary transition-colors flex items-center gap-1 w-fit">
                Get Support <span className="text-lg leading-none">&rarr;</span>
              </Link>
            </div>

            {/* Card 3 */}
            <div className="group bg-white border border-gray-100 rounded-[12px] p-8 shadow-card hover:shadow-card-hover hover:-translate-y-[6px] transition-all duration-300 flex flex-col">
              <Scale className="w-10 h-10 text-imrc-secondary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl mb-3">Global Policy Advocacy</h3>
              <p className="text-imrc-muted text-sm mb-6 flex-1">
                Working with international non-profit coalitions and civic groups to advocate for 
                protective standards aimed at curbing digital identity abuse.
              </p>
              <Link to="/mission" className="text-imrc-accent font-semibold text-sm hover:text-imrc-primary transition-colors flex items-center gap-1 w-fit">
                Our Vision <span className="text-lg leading-none">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="section-padding bg-imrc-bg-alt border-t border-gray-100">
        <div className="container-custom text-center">
          <h2 className="mb-10 text-3xl">Our Global Alliances & Supporters</h2>
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="bg-white px-6 py-4 rounded-[8px] shadow-sm font-semibold text-imrc-primary text-lg border-l-4 border-imrc-secondary flex items-center gap-3">
               <Globe2 className="w-6 h-6 text-imrc-secondary" /> International Coalitions
            </div>
            <div className="bg-white px-6 py-4 rounded-[8px] shadow-sm font-semibold text-imrc-primary text-lg border-l-4 border-imrc-secondary flex items-center gap-3">
               <Building2 className="w-6 h-6 text-imrc-secondary" /> Regional Civil Societies
            </div>
            <div className="bg-white px-6 py-4 rounded-[8px] shadow-sm font-semibold text-imrc-primary text-lg border-l-4 border-imrc-secondary flex items-center gap-3">
               <Users className="w-6 h-6 text-imrc-secondary" /> Cyber Awareness Advocates
            </div>
          </div>
          <div className="inline-block bg-white p-6 rounded-[12px] shadow-card border border-imrc-accent-light max-w-3xl mx-auto">
            <p className="text-imrc-text font-medium">
              <span className="text-imrc-accent font-bold text-xl mr-2">"</span>
              Collaborating across borders to safeguard individual digital identities and rebuild dignity for survivors of online impersonation.
              <span className="text-imrc-accent font-bold text-xl ml-2">"</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
