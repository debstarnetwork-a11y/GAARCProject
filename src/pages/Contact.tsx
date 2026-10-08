import React, { useState } from "react";
import { MapPin, Mail, User, Shield, Info, Handshake, CheckCircle2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSettings } from "@/contexts/SettingsContext";
import { supabase } from "@/lib/supabase";

export function Contact() {
  const { settings } = useSettings();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const heroImage = settings.heroImageContact;
  const contactEmail = settings.email;
  const contactPhone = settings.phone;
  const contactLocation = settings.location;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([data]);
      
      if (error) {
        console.error("Supabase insert error:", error);
        setErrorMessage(error.message || "There was an error submitting your message.");
        setStatus("error");
      } else {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section 
        className={cn("h-[40vh] min-h-[350px] flex items-center justify-center relative overflow-hidden", !heroImage && "bg-mesh-gradient-light")}
        style={heroImage ? { backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {heroImage && <div className="absolute inset-0 bg-imrc-primary/60 mix-blend-multiply" />}
        <div className="container-custom relative z-10 text-center">
          <h1 className={heroImage ? "text-white" : "text-imrc-primary"}>Contact Us</h1>
          <p className={cn("mt-4 max-w-xl mx-auto font-medium", heroImage ? "text-white/90" : "text-imrc-primary/80")}>
            Reach out for emergency support, partnership inquiries, or general information.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-imrc-bg-alt relative">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto bg-white rounded-[24px] shadow-card overflow-hidden">
            
            {/* Left: Contact Form */}
            <div className="p-8 md:p-12">
              <h3 className="mb-6">Send us a message</h3>
              
              {status === "success" && (
                <div className="mb-6 p-4 bg-imrc-success/10 border border-imrc-success rounded-[8px] flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-imrc-success shrink-0 mt-0.5" />
                  <p className="text-sm text-imrc-success font-medium">Your message has been securely sent. Our team will review it shortly.</p>
                </div>
              )}
              
              {status === "error" && (
                <div className="mb-6 p-4 bg-imrc-error/10 border border-imrc-error rounded-[8px] flex items-start gap-3">
                  <Info className="w-5 h-5 text-imrc-error shrink-0 mt-0.5" />
                  <p className="text-sm text-imrc-error font-medium">{errorMessage || "There was an error submitting your message. Please try again or email us directly."}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-imrc-text mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      id="name"
                      name="name"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-[8px] border border-gray-200 focus:border-imrc-secondary focus:ring-1 focus:ring-imrc-secondary outline-none transition-shadow text-sm"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-imrc-text mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-[8px] border border-gray-200 focus:border-imrc-secondary focus:ring-1 focus:ring-imrc-secondary outline-none transition-shadow text-sm"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-imrc-text mb-2">Subject</label>
                  <div className="relative">
                    <Info className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select 
                      id="subject"
                      name="subject"
                      required
                      defaultValue=""
                      className="w-full pl-10 pr-4 py-3 rounded-[8px] border border-gray-200 focus:border-imrc-secondary focus:ring-1 focus:ring-imrc-secondary outline-none transition-shadow text-sm appearance-none bg-white"
                    >
                      <option value="" disabled>Select an inquiry type</option>
                      <option value="Victim Support">Victim Support & Recovery</option>
                      <option value="Partnership">Institutional Partnership</option>
                      <option value="Media">Media & Press</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-imrc-text mb-2">Message</label>
                  <textarea 
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full p-4 rounded-[8px] border border-gray-200 focus:border-imrc-secondary focus:ring-1 focus:ring-imrc-secondary outline-none transition-shadow text-sm resize-y"
                    placeholder="Describe your situation or inquiry..."
                  ></textarea>
                </div>

                <Button type="submit" variant="primary" className="w-full justify-center" disabled={status === "submitting"}>
                  {status === "submitting" ? "Submitting..." : "Secure Submit"}
                </Button>
              </form>
            </div>

            {/* Right: Contact Details */}
            <div className="bg-imrc-primary text-white p-8 md:p-12 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-imrc-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
              
              <div className="relative z-10 flex-1 flex flex-col justify-center">
                <h3 className="text-white mb-8">Headquarters & Support</h3>
                
                <div className="flex flex-col gap-10">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Shield className="w-6 h-6 text-imrc-accent" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">Organization</h4>
                      <p className="text-sm text-gray-300">GAARC — Global Anti-Identity Theft & Rehabilitation Commission</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-imrc-accent" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">Geneva HQ</h4>
                      <p className="text-sm text-gray-300 whitespace-pre-wrap">{contactLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6 text-imrc-accent" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">Phone</h4>
                      <a href={`tel:${contactPhone.replace(/[^0-9+]/g, '')}`} className="text-sm text-gray-300 hover:text-white transition-colors">{contactPhone}</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Handshake className="w-6 h-6 text-imrc-accent" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">Email Inquiries</h4>
                      <p className="text-sm text-gray-300 mb-1">Victim Rehabilitation & Support</p>
                      <a href={`mailto:${contactEmail || "support@gaarc.org"}`} className="text-sm text-white hover:text-imrc-accent transition-colors flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4" /> {contactEmail || "support@gaarc.org"}
                      </a>
                      <a href="mailto:info@gaarc.org" className="text-sm text-white hover:text-imrc-accent transition-colors flex items-center gap-2 mt-2">
                        <Mail className="w-4 h-4" /> info@gaarc.org
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
