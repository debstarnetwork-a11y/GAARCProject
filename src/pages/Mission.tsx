import { Lightbulb, BookOpen, Scale, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Mission() {
  const [heroImage, setHeroImage] = useState(""); // TODO: Fetch from Supabase

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section 
        className={cn("h-[50vh] min-h-[400px] flex items-center justify-center relative overflow-hidden", !heroImage && "bg-mesh-gradient")}
        style={heroImage ? { backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {heroImage && <div className="absolute inset-0 bg-imrc-primary/60 mix-blend-multiply" />}
        <div className="container-custom relative z-10 text-center">
          <h1 className="text-white drop-shadow-md">Our Mission</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl mx-auto text-center">
          <p className="text-xl md:text-2xl font-medium text-imrc-primary leading-relaxed">
            The Global Anti-Identity Theft & Rehabilitation Commission (GAARC) is an international 
            advocacy entity established to enlighten, educate, reform, and rehabilitate victims of 
            identity theft, impersonation, and cyber abuse. 
          </p>
          <div className="w-24 h-1 bg-imrc-accent mx-auto my-10 rounded-full" />
          <p className="text-lg text-imrc-muted leading-relaxed">
            As a non-governmental initiative, GAARC is committed to providing comprehensive 
            support networks, privacy guidance, identity restoration pathways, and compassionate 
            rehabilitation for individuals and communities affected by identity crimes.
          </p>
        </div>
      </section>

      {/* Side-by-Side Images */}
      <section className="w-full bg-white pb-20">
        <div className="container-custom max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Left Column */}
            <div className="flex flex-col h-full">
              <div className="overflow-hidden rounded-[12px] shadow-sm border border-gray-100 group">
                <img 
                  src="https://i.ibb.co/93tDjv53/identity-theft-02.jpg" 
                  alt="identity theft 02" 
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                />
              </div>

              {/* Centered Button expanding the gap */}
              <div className="flex-1 flex justify-center items-center py-8">
                <Link to="/contact">
                  <Button variant="secondary" size="lg" className="shadow-md border border-gray-200 text-imrc-primary hover:bg-imrc-primary hover:text-white">
                    Protect Your Identity <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="overflow-hidden rounded-[12px] shadow-sm border border-gray-100 group mt-auto">
                <img 
                  src="https://i.ibb.co/7xS7rskm/identity-theft-01.jpg" 
                  alt="identity theft 01" 
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                />
              </div>
            </div>
            {/* Right Column */}
            <div className="overflow-hidden rounded-[12px] shadow-sm border border-gray-100 group h-full">
              <img 
                src="https://i.ibb.co/ymRrm9hf/identity-theft-04.jpg" 
                alt="identity theft 04" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Grid */}
      <section className="section-padding bg-imrc-bg-alt">
        <div className="container-custom">
          <h2 className="text-center mb-16">The Four Pillars</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Pillar 1 */}
            <div className="bg-white p-8 rounded-[12px] shadow-card hover:shadow-card-hover transition-all duration-300 flex items-start gap-6 border border-gray-100">
              <div className="bg-imrc-bg-alt p-4 rounded-full shrink-0">
                <Lightbulb className="w-8 h-8 text-imrc-secondary" />
              </div>
              <div>
                <h3 className="mb-2">Enlighten</h3>
                <p className="text-sm text-imrc-muted">
                  Raising global awareness about the deceptive methods used in cyber 
                  exploitation and identity theft, bringing illicit tactics into the light.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-8 rounded-[12px] shadow-card hover:shadow-card-hover transition-all duration-300 flex items-start gap-6 border border-gray-100">
              <div className="bg-imrc-bg-alt p-4 rounded-full shrink-0">
                <BookOpen className="w-8 h-8 text-imrc-secondary" />
              </div>
              <div>
                <h3 className="mb-2">Educate</h3>
                <p className="text-sm text-imrc-muted">
                  Providing critical privacy resources, training modules, and accessible information 
                  to help citizens proactively protect their personal data and identity.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-8 rounded-[12px] shadow-card hover:shadow-card-hover transition-all duration-300 flex items-start gap-6 border border-gray-100">
              <div className="bg-imrc-bg-alt p-4 rounded-full shrink-0">
                <Scale className="w-8 h-8 text-imrc-secondary" />
              </div>
              <div>
                <h3 className="mb-2">Reform</h3>
                <p className="text-sm text-imrc-muted">
                  Advocating for stronger international standards and privacy safeguards 
                  to deter identity criminals and protect vulnerable communities.
                </p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white p-8 rounded-[12px] shadow-card hover:shadow-card-hover transition-all duration-300 flex items-start gap-6 border border-gray-100">
              <div className="bg-imrc-bg-alt p-4 rounded-full shrink-0">
                <Heart className="w-8 h-8 text-imrc-secondary" />
              </div>
              <div>
                <h3 className="mb-2">Rehabilitate</h3>
                <p className="text-sm text-imrc-muted">
                  Restoring victims' peace of mind through empathetic counseling, privacy 
                  guidance, and structured pathways to full identity reclamation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Identity Theft Image Section */}
      <section className="w-full bg-white pt-24 pb-8">
        <div className="container-custom max-w-5xl mx-auto overflow-hidden rounded-[12px] shadow-sm border border-gray-100">
          <img 
            src="https://i.ibb.co/gZ3XSQbt/identity-theft-06.jpg" 
            alt="Identity Theft Awareness" 
            className="w-full h-auto object-cover" 
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white text-center">
        <div className="container-custom flex flex-col items-center">
          <h2 className="mb-6">Join Our Mission</h2>
          <p className="text-imrc-muted max-w-2xl mb-10">
            Whether you are a victim seeking help, or an institution looking to partner 
            with us in the fight against identity theft, your journey begins here.
          </p>
          <Link to="/contact">
            <Button variant="primary" className="flex items-center gap-2">
              Connect With Us <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
