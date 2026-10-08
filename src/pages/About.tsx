import { Shield, Globe, Star } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { cn } from "@/lib/utils";

export function About() {
  const { settings } = useSettings();
  const heroImage = settings.heroImageAbout;
  const legacyImage = settings.imageLegacy;
  const team = settings.teamMembers || [];

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section 
        className={cn("h-[40vh] min-h-[350px] flex items-center justify-center relative overflow-hidden", !heroImage && "bg-mesh-gradient")}
        style={heroImage ? { backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {heroImage && <div className="absolute inset-0 bg-imrc-primary/60 mix-blend-multiply" />}
        <div className="container-custom relative z-10 text-center">
          <h1 className="text-white">About GAARC</h1>
        </div>
      </section>

      {/* History & Description */}
      <section className="section-padding bg-white">
        <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="mb-6">Our Legacy of Protection</h2>
            <p className="text-imrc-muted mb-4 leading-relaxed">
              Founded on the principles of individual privacy, digital security, and human dignity, the 
              Global Anti-Identity Theft & Rehabilitation Commission (GAARC) stands as a trusted bulwark 
              against the rising tide of identity theft, cyber impersonation, and personal data compromise. 
            </p>
            <p className="text-imrc-muted leading-relaxed">
              We operate across international borders, partnering with community advocates, 
              educational groups, and cybersecurity specialists to ensure that victims of identity 
              crimes receive immediate rehabilitation, guidance, and emotional support.
            </p>
          </div>
          {/* Legacy of Protection Image */}
          <div className="relative w-full max-w-lg mx-auto overflow-hidden rounded-[24px] shadow-card">
            <img 
              src={legacyImage || "https://i.ibb.co/GfSmfpGV/Image-2.png"} 
              alt="Our Legacy of Protection" 
              className="w-full h-auto object-cover block" 
            />
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="section-padding bg-imrc-bg-alt">
        <div className="container-custom text-center">
          <h2 className="mb-16">Global Leadership</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => {
              const Icon = i === 0 ? Shield : i === 1 ? Globe : Star;
              return (
              <div key={i} className="bg-white p-8 rounded-[12px] shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-[6px] border border-gray-100 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-imrc-primary flex items-center justify-center border-4 border-imrc-accent shadow-md overflow-hidden">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-2xl font-bold">{member.initials}</span>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-sm z-10">
                    <Icon className="w-6 h-6 text-imrc-accent" />
                  </div>
                </div>
                <h3 className="text-xl mb-2">{member.name}</h3>
                <p className="text-sm text-imrc-secondary font-semibold mb-4 min-h-[40px]">
                  {member.title}
                </p>
                {member.email && (
                  <a href={`mailto:${member.email}`} className="text-sm text-imrc-muted hover:text-imrc-accent transition-colors mt-auto">
                    {member.email}
                  </a>
                )}
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* Partnership Highlight Box */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="bg-imrc-bg-alt p-8 md:p-12 rounded-r-[12px] border-l-4 border-imrc-secondary shadow-sm">
            <div className="flex items-start gap-6">
              <Star className="w-10 h-10 text-imrc-secondary shrink-0 hidden sm:block" />
              <div>
                <h3 className="text-2xl mb-4 text-imrc-primary">International Support</h3>
                <p className="text-imrc-text font-medium leading-relaxed text-lg">
                  GAARC works alongside international non-profit coalitions and cyber safety organizations, 
                  uniting civil society to protect vulnerable individuals and restore peace of mind for victims of identity compromise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
