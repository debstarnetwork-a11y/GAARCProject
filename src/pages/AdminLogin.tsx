import React, { useState } from "react";
import { ShieldCheck, Mail, Lock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { supabase, supabaseUrl } from "@/lib/supabase";

export function AdminLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const email = (formData.get('email') as string || "").trim().toLowerCase();
    const password = (formData.get('password') as string || "").trim();

    try {
      // Check master admin credentials fallback
      if (email === "serviceteamatm@gmail.com" && password === "12345") {
        localStorage.setItem("gaarc_admin_auth", JSON.stringify({ email, authenticated: true, timestamp: Date.now() }));
        navigate('/admin-dashboard');
        return;
      }

      if (!supabaseUrl || supabaseUrl.includes('placeholder.supabase.co')) {
        setError("Supabase project is not linked yet. Please provide your Supabase Project URL and Anon Key.");
        setLoading(false);
        return;
      }

      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        setError(authError.message);
      } else {
        localStorage.setItem("gaarc_admin_auth", JSON.stringify({ email, authenticated: true, timestamp: Date.now() }));
        navigate('/admin-dashboard');
      }
    } catch (err: any) {
      if (err?.message?.includes('Failed to fetch') || !supabaseUrl || supabaseUrl.includes('placeholder')) {
        setError("Cannot reach Supabase. Please ensure your actual Supabase URL and Anon Key are configured.");
      } else {
        setError(err?.message || "An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh-gradient py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[24px] shadow-card relative overflow-hidden">
        
        {/* Top decorative bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-imrc-secondary" />

        <div className="text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-imrc-bg-alt rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-imrc-primary" />
          </div>
          <h2 className="mt-2 text-3xl font-extrabold text-imrc-primary tracking-tight">
            GAARC Admin Portal
          </h2>
          <p className="mt-2 text-sm text-imrc-muted">
            Secure access for authorized personnel only.
          </p>
        </div>
        
        {error && (
          <div className="p-4 bg-imrc-error/10 border border-imrc-error rounded-[8px] flex items-start gap-3">
            <Info className="w-5 h-5 text-imrc-error shrink-0 mt-0.5" />
            <p className="text-sm text-imrc-error font-medium">{error}</p>
          </div>
        )}

        <form className="mt-4 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-[8px] relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-imrc-text focus:outline-none focus:ring-imrc-secondary focus:border-imrc-secondary sm:text-sm"
                  placeholder="Admin Email"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-[8px] relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-imrc-text focus:outline-none focus:ring-imrc-secondary focus:border-imrc-secondary sm:text-sm"
                  placeholder="Admin Password"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link to="/" className="text-imrc-muted hover:text-imrc-primary flex items-center gap-1 transition-colors">
              &larr; Return to Site
            </Link>
          </div>

          <div>
            <Button type="submit" variant="primary" className="w-full justify-center text-sm" disabled={loading}>
              {loading ? "Authenticating..." : "Authenticate"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
