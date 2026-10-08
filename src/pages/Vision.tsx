import { Quote } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Vision() {
  const [heroImage, setHeroImage] = useState("https://i.ibb.co/8DjjtBsX/Overall-Visions.png");

  const timelineEvents = [
    {
      year: "2024",
      title: "Foundation & Advocacy Alliances",
      description: "Establishing the core GAARC outreach structure and forming foundational alliances with digital rights networks.",
      image: "https://i.ibb.co/SwF6jN02/2024-Vision.png"
    },
    {
      year: "2025",
      title: "Expansion of Rehabilitation Programs",
      description: "Scaling our direct-to-victim emotional and identity restoration pathways across 50+ countries.",
      image: "https://i.ibb.co/PzJDfG8D/2025-Vision.png"
    },
    {
      year: "2026",
      title: "Digital Identity Protection Initiative",
      description: "Launching global tech-driven educational frameworks to preemptively stop systemic online impersonation.",
      image: "https://i.ibb.co/zVHfGbq2/2026-Vision.png"
    },
    {
      year: "2030",
      title: "Global Identity Theft Eradication Framework",
      description: "Implementing a unified, worldwide standard for victim rehabilitation and proactive identity security.",
      image: "https://i.ibb.co/RkRs8rRv/2030-Vision.png"
    }
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Title Section */}
      <section className="bg-imrc-primary pt-28 pb-8 px-4">
        <div className="container-custom text-center">
          <h1 className="text-white max-w-4xl mx-auto drop-shadow-md text-3xl md:text-5xl font-bold leading-tight">
            Our Vision
          </h1>
        </div>
      </section>

      {/* Hero Image */}
      {heroImage && (
        <section className="w-full bg-imrc-bg-alt border-b border-gray-200">
          <div className="w-full mx-auto">
             <img src={heroImage} alt="Overall Visions" className="w-full h-auto object-contain" />
          </div>
        </section>
      )}

      {/* Main Vision Statement */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl mx-auto text-center relative">
          <Quote className="absolute -top-10 left-0 w-24 h-24 text-imrc-bg-alt -z-10" />
          <p className="text-xl md:text-2xl font-medium text-imrc-primary leading-relaxed mb-8">
            We envision a world where no individual falls victim to identity theft without 
            access to immediate, comprehensive, and dignified rehabilitation.
          </p>
          <p className="text-lg text-imrc-muted leading-relaxed">
            GAARC aims to become the global standard-bearer for identity rehabilitation, 
            working hand-in-hand with civic institutions, technology leaders, 
            and civil society to eradicate the devastating effects of synthetic identity theft and cyber impersonation.
          </p>
        </div>
      </section>

      {/* Timeline Roadmap */}
      <section className="section-padding bg-imrc-bg-alt">
        <div className="container-custom max-w-4xl mx-auto">
          <h2 className="text-center mb-16">Roadmap to 2030</h2>
          
          <div className="relative border-l-2 border-imrc-secondary ml-4 md:ml-1/2">
            {timelineEvents.map((event, idx) => (
              <div key={idx} className="mb-12 relative pl-8 md:pl-0 md:w-1/2 md:odd:ml-auto md:odd:pl-8 md:even:pr-8 md:even:text-right">
                {/* Timeline Dot */}
                <div className="absolute w-4 h-4 bg-imrc-accent rounded-full -left-[9px] md:left-auto md:odd:-left-[9px] md:even:-right-[9px] top-1" />
                
                <div className="bg-white rounded-[12px] shadow-sm hover:shadow-card transition-all duration-300 border border-gray-100 overflow-hidden group">
                  <div className="w-full bg-gray-50 flex items-center justify-center overflow-hidden">
                    <img src={event.image} alt={`${event.year} Vision`} className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700 ease-out" />
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-imrc-secondary/10 text-imrc-secondary rounded-full text-xs font-bold mb-3">
                      {event.year}
                    </span>
                    <h4 className="text-lg mb-2">{event.title}</h4>
                    <p className="text-sm text-imrc-muted leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Block */}
      <section className="py-24 bg-white">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="bg-imrc-primary text-white p-10 md:p-16 rounded-[12px] relative overflow-hidden shadow-card text-center">
            <Quote className="absolute top-4 left-4 w-16 h-16 text-imrc-secondary/20" />
            <Quote className="absolute bottom-4 right-4 w-16 h-16 text-imrc-secondary/20 rotate-180" />
            <p className="relative z-10 text-xl md:text-2xl font-light italic leading-relaxed text-gray-200">
              "Financial security is a fundamental human right. Rebuilding the lives of those 
              devastated by identity crimes is not just charity—it is our global institutional duty."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
