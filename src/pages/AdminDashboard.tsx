import { LayoutDashboard, Image as ImageIcon, MessageSquare, Edit3, Settings, LogOut, CheckCircle2, Save, Send, X, Mail, AlertCircle, ShieldAlert } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useSettings } from "../contexts/SettingsContext";
import { supabase } from "../lib/supabase";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { VictimRehabilitationSection } from "@/components/rehabilitation/VictimRehabilitationSection";

export function AdminDashboard() {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [submissions, setSubmissions] = useState<any[]>([]);

  // View Submission State
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);

  // Newsletter State
  const [newsletterSubject, setNewsletterSubject] = useState("");
  const [newsletterBody, setNewsletterBody] = useState("");
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "sending" | "success">("idle");

  // Chart Data Preparation
  const chartData = useMemo(() => {
    const last30Days = eachDayOfInterval({ start: subDays(new Date(), 29), end: new Date() });
    return last30Days.map(date => {
      const dateStr = format(date, 'MMM dd');
      const count = submissions.filter((sub: any) => format(new Date(sub.created_at), 'MMM dd') === dateStr).length;
      return { name: dateStr, count };
    });
  }, [submissions]);

  // Unique Emails for Newsletter
  const uniqueEmails = useMemo(() => {
    const emails = submissions.map((sub: any) => sub.email).filter(Boolean);
    return Array.from(new Set(emails));
  }, [submissions]);

  // Toggle all emails
  const toggleAllEmails = () => {
    if (selectedEmails.length === uniqueEmails.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(uniqueEmails);
    }
  };

  // Toggle single email
  const toggleEmail = (email: string) => {
    setSelectedEmails(prev => prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]);
  };

  const handleSendNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmails.length === 0) {
      alert("Please select at least one recipient.");
      return;
    }
    setNewsletterStatus("sending");
    // Simulate sending email via a backend API
    setTimeout(() => {
      setNewsletterStatus("success");
      setNewsletterSubject("");
      setNewsletterBody("");
      setSelectedEmails([]);
      setTimeout(() => setNewsletterStatus("idle"), 3000);
    }, 1500);
  };

  useEffect(() => {
    async function checkAuth() {
      const localAuth = localStorage.getItem("gaarc_admin_auth");
      if (localAuth) {
        try {
          const parsed = JSON.parse(localAuth);
          if (parsed.authenticated) {
            return; // Authenticated
          }
        } catch (e) {}
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin');
      }
    }
    checkAuth();

    async function fetchSubmissions() {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error("Error fetching submissions:", error);
      }
      if (data) setSubmissions(data);
    }
    fetchSubmissions();
  }, [navigate]);

  // Settings Form State
  const [formData, setFormData] = useState(settings);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("saving");
    setSaveError(null);
    
    const result = await updateSettings(formData);
    if (result.success) {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3500);
    } else {
      setSaveStatus("error");
      setSaveError(result.error || "Failed to save to database. You may need to create tables in Supabase.");
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("gaarc_admin_auth");
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const handleUrlPaste = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const srcMatch = val.match(/src=["'](.*?)["']/);
    if (srcMatch) {
      e.target.value = srcMatch[1];
    }
  };

  return (
    <div className="flex h-screen bg-imrc-bg-alt overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-imrc-primary text-white flex flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-imrc-secondary flex items-center justify-center font-bold">G</div>
          <span className="font-semibold text-lg tracking-tight">GAARC Admin</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
          <button 
            onClick={() => setActiveTab("Dashboard")}
            className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-colors w-full text-left font-medium ${activeTab === "Dashboard" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
          >
            <LayoutDashboard className={`w-5 h-5 ${activeTab === "Dashboard" ? "text-imrc-accent" : ""}`} /> Dashboard Overview
          </button>
          <button 
            onClick={() => setActiveTab("Rehabilitation")}
            className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-colors w-full text-left font-medium ${activeTab === "Rehabilitation" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
          >
            <ShieldAlert className={`w-5 h-5 ${activeTab === "Rehabilitation" ? "text-imrc-accent" : ""}`} /> Victim Rehabilitation
          </button>
          <button 
            onClick={() => setActiveTab("Gallery")}
            className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-colors w-full text-left font-medium ${activeTab === "Gallery" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
          >
            <ImageIcon className={`w-5 h-5 ${activeTab === "Gallery" ? "text-imrc-accent" : ""}`} /> Manage Gallery
          </button>
          <button 
            onClick={() => setActiveTab("Submissions")}
            className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-colors w-full text-left font-medium ${activeTab === "Submissions" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
          >
            <MessageSquare className={`w-5 h-5 ${activeTab === "Submissions" ? "text-imrc-accent" : ""}`} /> View Submissions
          </button>
          <button 
            onClick={() => setActiveTab("Content")}
            className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-colors w-full text-left font-medium ${activeTab === "Content" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
          >
            <Edit3 className={`w-5 h-5 ${activeTab === "Content" ? "text-imrc-accent" : ""}`} /> Edit Content
          </button>
          <button 
            onClick={() => setActiveTab("Newsletter")}
            className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-colors w-full text-left font-medium ${activeTab === "Newsletter" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
          >
            <Mail className={`w-5 h-5 ${activeTab === "Newsletter" ? "text-imrc-accent" : ""}`} /> Newsletter
          </button>
          <button 
            onClick={() => setActiveTab("Settings")}
            className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-colors w-full text-left font-medium ${activeTab === "Settings" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
          >
            <Settings className={`w-5 h-5 ${activeTab === "Settings" ? "text-imrc-accent" : ""}`} /> Settings
          </button>
        </nav>

        <div className="p-4 border-t border-white/10 shrink-0">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-400 hover:text-imrc-error transition-colors rounded-[8px]">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-8 border-b border-gray-100 shrink-0">
          <h1 className="text-2xl font-semibold text-imrc-primary m-0">Dashboard Overview</h1>
          <Link to="/" className="text-sm font-medium text-imrc-secondary hover:text-imrc-accent transition-colors">
            View Live Site &rarr;
          </Link>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          {activeTab === "Rehabilitation" && (
            <VictimRehabilitationSection />
          )}

          {activeTab !== "Dashboard" && activeTab !== "Rehabilitation" && activeTab !== "Gallery" && activeTab !== "Submissions" && activeTab !== "Settings" && activeTab !== "Content" && activeTab !== "Newsletter" && (
            <div className="bg-white p-8 rounded-[12px] shadow-sm border border-gray-100 mb-8 text-center">
              <h2 className="text-xl font-semibold text-imrc-primary mb-2">{activeTab} Module</h2>
              <p className="text-imrc-muted">This module is currently in development. Full backend integration required.</p>
            </div>
          )}

          {/* Content Section */}
          <div className={`bg-white rounded-[12px] shadow-sm border border-gray-100 overflow-hidden ${activeTab !== "Content" ? "hidden" : ""}`}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-imrc-primary m-0">Content Management</h2>
              <button 
                onClick={handleSettingsSave}
                disabled={saveStatus === "saving"}
                className={cn(
                  "px-4 py-2 rounded-[8px] text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-70",
                  saveStatus === "error" ? "bg-red-600 hover:bg-red-700 text-white" : "bg-imrc-secondary hover:bg-imrc-primary text-white"
                )}
              >
                {saveStatus === "saving" ? (
                  "Saving..."
                ) : saveStatus === "success" ? (
                  <><CheckCircle2 className="w-4 h-4" /> Saved</>
                ) : saveStatus === "error" ? (
                  <><AlertCircle className="w-4 h-4" /> Save Failed</>
                ) : (
                  <><Save className="w-4 h-4" /> Save Changes</>
                )}
              </button>
            </div>
            <div className="p-6">
              {saveError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-[8px] mb-6 flex items-center gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <span>Failed to save changes: {saveError}</span>
                </div>
              )}
              <form className="space-y-6">
                <div>
                  <h3 className="text-md font-semibold text-imrc-primary mb-4">Page Hero Images</h3>
                  <p className="text-sm text-imrc-muted mb-4">Manage the banner images displayed at the top of each page.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-imrc-muted mb-1">About Us Page Hero</label>
                      <input 
                        type="text" 
                        placeholder="https://example.com/about.jpg"
                        value={formData.heroImageAbout || ''}
                        onChange={(e) => {
                          handleUrlPaste(e);
                          setFormData({...formData, heroImageAbout: e.target.value});
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-[8px] outline-none focus:border-imrc-secondary focus:ring-1 focus:ring-imrc-secondary text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-imrc-muted mb-1">Mission Page Hero</label>
                      <input 
                        type="text" 
                        placeholder="https://example.com/mission.jpg"
                        value={formData.heroImageMission || ''}
                        onChange={(e) => {
                          handleUrlPaste(e);
                          setFormData({...formData, heroImageMission: e.target.value});
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-[8px] outline-none focus:border-imrc-secondary focus:ring-1 focus:ring-imrc-secondary text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-imrc-muted mb-1">Vision Page Hero</label>
                      <input 
                        type="text" 
                        placeholder="https://example.com/vision.jpg"
                        value={formData.heroImageVision || ''}
                        onChange={(e) => {
                          handleUrlPaste(e);
                          setFormData({...formData, heroImageVision: e.target.value});
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-[8px] outline-none focus:border-imrc-secondary focus:ring-1 focus:ring-imrc-secondary text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-imrc-muted mb-1">Gallery Page Hero</label>
                      <input 
                        type="text" 
                        placeholder="https://example.com/gallery.jpg"
                        value={formData.heroImageGallery || ''}
                        onChange={(e) => {
                          handleUrlPaste(e);
                          setFormData({...formData, heroImageGallery: e.target.value});
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-[8px] outline-none focus:border-imrc-secondary focus:ring-1 focus:ring-imrc-secondary text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-imrc-muted mb-1">Contact Page Hero</label>
                      <input 
                        type="text" 
                        placeholder="https://example.com/contact.jpg"
                        value={formData.heroImageContact || ''}
                        onChange={(e) => {
                          handleUrlPaste(e);
                          setFormData({...formData, heroImageContact: e.target.value});
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-[8px] outline-none focus:border-imrc-secondary focus:ring-1 focus:ring-imrc-secondary text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-imrc-muted mb-1">About Us - "Legacy of Protection" Image</label>
                      <input 
                        type="text" 
                        placeholder="https://example.com/legacy.jpg"
                        value={formData.imageLegacy || ''}
                        onChange={(e) => {
                          handleUrlPaste(e);
                          setFormData({...formData, imageLegacy: e.target.value});
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-[8px] outline-none focus:border-imrc-secondary focus:ring-1 focus:ring-imrc-secondary text-sm" 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-md font-semibold text-imrc-primary mb-4">Leadership Team (About Us)</h3>
                  <p className="text-sm text-imrc-muted mb-4">Manage the 3 global leaders shown on the About Us page.</p>
                  <div className="space-y-6">
                    {formData.teamMembers?.map((member, i) => (
                      <div key={i} className="bg-gray-50 p-4 rounded-[8px] border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <h4 className="text-sm font-bold text-imrc-primary">Team Member {i + 1}</h4>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-imrc-muted mb-1">Name</label>
                          <input 
                            type="text" 
                            value={member.name}
                            onChange={(e) => {
                              const newTeam = [...formData.teamMembers];
                              newTeam[i] = { ...newTeam[i], name: e.target.value };
                              setFormData({...formData, teamMembers: newTeam});
                            }}
                            className="w-full px-3 py-2 border border-gray-200 rounded-[8px] outline-none focus:border-imrc-secondary text-sm" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-imrc-muted mb-1">Title</label>
                          <input 
                            type="text" 
                            value={member.title}
                            onChange={(e) => {
                              const newTeam = [...formData.teamMembers];
                              newTeam[i] = { ...newTeam[i], title: e.target.value };
                              setFormData({...formData, teamMembers: newTeam});
                            }}
                            className="w-full px-3 py-2 border border-gray-200 rounded-[8px] outline-none focus:border-imrc-secondary text-sm" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-imrc-muted mb-1">Email (Optional)</label>
                          <input 
                            type="email" 
                            value={member.email || ''}
                            onChange={(e) => {
                              const newTeam = [...formData.teamMembers];
                              newTeam[i] = { ...newTeam[i], email: e.target.value };
                              setFormData({...formData, teamMembers: newTeam});
                            }}
                            className="w-full px-3 py-2 border border-gray-200 rounded-[8px] outline-none focus:border-imrc-secondary text-sm" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-imrc-muted mb-1">Image URL</label>
                          <input 
                            type="text" 
                            value={member.image}
                            placeholder="https://example.com/person.jpg"
                            onChange={(e) => {
                              handleUrlPaste(e);
                              const newTeam = [...formData.teamMembers];
                              newTeam[i] = { ...newTeam[i], image: e.target.value };
                              setFormData({...formData, teamMembers: newTeam});
                            }}
                            className="w-full px-3 py-2 border border-gray-200 rounded-[8px] outline-none focus:border-imrc-secondary text-sm" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Stats Overview */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ${activeTab !== "Dashboard" ? "hidden" : ""}`}>
            <div className="bg-white p-6 rounded-[12px] shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-imrc-secondary/10 flex items-center justify-center shrink-0">
                <MessageSquare className="w-6 h-6 text-imrc-secondary" />
              </div>
              <div>
                <p className="text-sm text-imrc-muted font-medium">Total Submissions</p>
                <p className="text-2xl font-bold text-imrc-primary">142</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-[12px] shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-imrc-accent/10 flex items-center justify-center shrink-0">
                <ImageIcon className="w-6 h-6 text-imrc-accent" />
              </div>
              <div>
                <p className="text-sm text-imrc-muted font-medium">Gallery Items</p>
                <p className="text-2xl font-bold text-imrc-primary">48</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[12px] shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-imrc-success/10 flex items-center justify-center shrink-0">
                <Settings className="w-6 h-6 text-imrc-success" />
              </div>
              <div>
                <p className="text-sm text-imrc-muted font-medium">Active Users</p>
                <p className="text-2xl font-bold text-imrc-primary">3</p>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className={`bg-white p-6 rounded-[12px] shadow-sm border border-gray-100 mb-8 ${activeTab !== "Dashboard" ? "hidden" : ""}`}>
             <h2 className="text-lg font-semibold text-imrc-primary mb-6">Contact Submissions (Last 30 Days)</h2>
             <div className="h-72 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={chartData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                   <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dx={-10} />
                   <Tooltip 
                     contentStyle={{ borderRadius: '8px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                     labelStyle={{ color: '#1a1f36', fontWeight: 'bold' }}
                   />
                   <Line type="monotone" dataKey="count" name="Submissions" stroke="#f47e33" strokeWidth={3} dot={{r: 4, fill: '#f47e33', strokeWidth: 0}} activeDot={{r: 6}} />
                 </LineChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* Manage Gallery Section */}
          <div className={`bg-white rounded-[12px] shadow-sm border border-gray-100 mb-8 overflow-hidden ${activeTab !== "Dashboard" && activeTab !== "Gallery" ? "hidden" : ""}`}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-imrc-primary m-0">Manage Gallery</h2>
            </div>
            <div className="p-6">
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  setUploadStatus("uploading");
                  const form = e.target as HTMLFormElement;
                  const data = Object.fromEntries(new FormData(form).entries());
                  
                  try {
                    const { error } = await supabase.from('gallery_items').insert([
                      { image_url: data.imageUrl, category: data.category }
                    ]);
                    if (error) throw error;
                    setUploadStatus("success");
                    form.reset();
                    setTimeout(() => setUploadStatus("idle"), 4000);
                  } catch (err) {
                    console.error(err);
                    setUploadStatus("idle");
                    alert("Error adding image to gallery");
                  }
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-imrc-muted mb-1">Image URL</label>
                    <input 
                      type="text" 
                      name="imageUrl"
                      required
                      placeholder="https://example.com/image.jpg"
                      onChange={handleUrlPaste}
                      className="w-full px-3 py-2 border border-gray-200 rounded-[8px] outline-none focus:border-imrc-secondary focus:ring-1 focus:ring-imrc-secondary text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-imrc-muted mb-1">Category</label>
                    <select 
                      name="category"
                      required
                      defaultValue="Events"
                      className="w-full px-3 py-2 border border-gray-200 rounded-[8px] outline-none focus:border-imrc-secondary focus:ring-1 focus:ring-imrc-secondary text-sm bg-white"
                    >
                      <option value="Events">Events</option>
                      <option value="Partnerships">Partnerships</option>
                      <option value="Field Work">Field Work</option>
                    </select>
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={uploadStatus === "uploading"}
                  className="bg-imrc-secondary hover:bg-imrc-primary text-white px-4 py-2 rounded-[8px] text-sm font-medium transition-colors w-full disabled:opacity-70"
                >
                  {uploadStatus === "uploading" ? "Adding Image..." : "Add to Gallery"}
                </button>
                {uploadStatus === "success" && (
                  <p className="text-sm font-medium text-imrc-success flex items-center justify-center gap-2 mt-4">
                    <CheckCircle2 className="w-5 h-5" /> Image successfully added to Gallery
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* View Submissions Section */}
          <div className={`bg-white rounded-[12px] shadow-sm border border-gray-100 overflow-hidden ${activeTab !== "Dashboard" && activeTab !== "Submissions" ? "hidden" : ""}`}>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-imrc-primary m-0">Recent Contact Submissions</h2>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-semibold text-imrc-muted uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-imrc-muted uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-imrc-muted uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-4 text-xs font-semibold text-imrc-muted uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {submissions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-imrc-muted">
                        No submissions yet.
                      </td>
                    </tr>
                  ) : (
                    submissions.map((sub: any) => (
                      <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-imrc-text whitespace-nowrap">
                          {new Date(sub.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-imrc-primary">{sub.name}</td>
                        <td className="px-6 py-4 text-sm text-imrc-muted">{sub.subject}</td>
                        <td className="px-6 py-4">
                          <span className={cn("px-3 py-1 rounded-full text-xs font-medium", sub.status === "New" ? "bg-imrc-accent-light text-imrc-primary" : "bg-imrc-success/20 text-imrc-success")}>
                            {sub.status || 'New'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setSelectedSubmission(sub)}
                            className="text-imrc-secondary hover:text-imrc-primary font-medium text-sm transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className={`bg-white rounded-[12px] shadow-sm border border-gray-100 overflow-hidden ${activeTab !== "Newsletter" ? "hidden" : ""}`}>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-imrc-primary m-0">Newsletter / Mass Email</h2>
              <p className="text-sm text-imrc-muted mt-1">Send updates to users who have contacted you.</p>
            </div>
            <div className="flex flex-col md:flex-row h-[600px]">
              {/* Recipients List */}
              <div className="w-full md:w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/50">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-semibold text-imrc-primary">Recipients ({selectedEmails.length})</span>
                  <button 
                    type="button"
                    onClick={toggleAllEmails}
                    className="text-xs font-medium text-imrc-secondary hover:underline"
                  >
                    {selectedEmails.length > 0 && selectedEmails.length === uniqueEmails.length ? "Deselect All" : "Select All"}
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                  {uniqueEmails.length === 0 ? (
                    <p className="text-sm text-imrc-muted p-4 text-center">No contacts found.</p>
                  ) : (
                    uniqueEmails.map(email => (
                      <label key={email} className="flex items-center gap-3 p-2 hover:bg-white rounded-[8px] cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={selectedEmails.includes(email as string)}
                          onChange={() => toggleEmail(email as string)}
                          className="rounded border-gray-300 text-imrc-secondary focus:ring-imrc-secondary"
                        />
                        <span className="text-sm text-imrc-text truncate">{email as string}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
              
              {/* Email Composer */}
              <div className="w-full md:w-2/3 flex flex-col">
                <form onSubmit={handleSendNewsletter} className="flex flex-col h-full p-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-imrc-primary mb-1">Subject</label>
                    <input 
                      type="text" 
                      required
                      value={newsletterSubject}
                      onChange={(e) => setNewsletterSubject(e.target.value)}
                      placeholder="Email Subject"
                      className="w-full px-4 py-2 border border-gray-200 rounded-[8px] outline-none focus:border-imrc-secondary focus:ring-1 focus:ring-imrc-secondary text-sm"
                    />
                  </div>
                  <div className="flex-1 flex flex-col mb-6">
                    <label className="block text-sm font-medium text-imrc-primary mb-1">Message</label>
                    <textarea 
                      required
                      value={newsletterBody}
                      onChange={(e) => setNewsletterBody(e.target.value)}
                      placeholder="Write your email content here..."
                      className="w-full flex-1 px-4 py-3 border border-gray-200 rounded-[8px] outline-none focus:border-imrc-secondary focus:ring-1 focus:ring-imrc-secondary text-sm resize-none"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <p className="text-xs text-imrc-muted">
                      {selectedEmails.length > 0 ? `Sending to ${selectedEmails.length} recipient(s)` : "Select recipients to send"}
                    </p>
                    <button 
                      type="submit"
                      disabled={newsletterStatus === "sending" || selectedEmails.length === 0}
                      className="bg-imrc-secondary hover:bg-imrc-primary text-white px-6 py-2 rounded-[8px] text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {newsletterStatus === "sending" ? (
                        "Sending..."
                      ) : newsletterStatus === "success" ? (
                        <><CheckCircle2 className="w-4 h-4" /> Sent successfully</>
                      ) : (
                        <><Send className="w-4 h-4" /> Send Email</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className={`bg-white rounded-[12px] shadow-sm border border-gray-100 overflow-hidden ${activeTab !== "Settings" ? "hidden" : ""}`}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-imrc-primary m-0">Global Settings</h2>
              <button 
                onClick={handleSettingsSave}
                disabled={saveStatus === "saving"}
                className={cn(
                  "px-4 py-2 rounded-[8px] text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-70",
                  saveStatus === "error" ? "bg-red-600 hover:bg-red-700 text-white" : "bg-imrc-secondary hover:bg-imrc-primary text-white"
                )}
              >
                {saveStatus === "saving" ? (
                  "Saving..."
                ) : saveStatus === "success" ? (
                  <><CheckCircle2 className="w-4 h-4" /> Saved</>
                ) : saveStatus === "error" ? (
                  <><AlertCircle className="w-4 h-4" /> Save Failed</>
                ) : (
                  <><Save className="w-4 h-4" /> Save Changes</>
                )}
              </button>
            </div>
            <div className="p-6">
              {saveError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-[8px] mb-6 flex items-center gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <span>Failed to save changes: {saveError}</span>
                </div>
              )}
              <form className="space-y-6">
                <div>
                  <h3 className="text-md font-semibold text-imrc-primary mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-imrc-muted mb-1">Email Address</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-[8px] outline-none focus:border-imrc-secondary focus:ring-1 focus:ring-imrc-secondary text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-imrc-muted mb-1">Phone Number</label>
                      <input 
                        type="text" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-[8px] outline-none focus:border-imrc-secondary focus:ring-1 focus:ring-imrc-secondary text-sm" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-imrc-muted mb-1">Headquarters Location</label>
                      <textarea 
                        rows={3}
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-[8px] outline-none focus:border-imrc-secondary focus:ring-1 focus:ring-imrc-secondary text-sm resize-y" 
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-md font-semibold text-imrc-primary mb-4">Branding & Media (URLs)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-imrc-muted mb-1">Logo URL</label>
                      <input 
                        type="text" 
                        placeholder="https://example.com/logo.png"
                        value={formData.logoUrl}
                        onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-[8px] outline-none focus:border-imrc-secondary focus:ring-1 focus:ring-imrc-secondary text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-imrc-muted mb-1">Contact Page Hero Image</label>
                      <input 
                        type="text" 
                        placeholder="https://example.com/hero.jpg"
                        value={formData.heroImageContact}
                        onChange={(e) => setFormData({...formData, heroImageContact: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-[8px] outline-none focus:border-imrc-secondary focus:ring-1 focus:ring-imrc-secondary text-sm" 
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          
        </div>
      </main>

      {/* Submission Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[12px] shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
              <div>
                <h3 className="text-xl font-bold text-imrc-primary mb-1">{selectedSubmission.subject}</h3>
                <p className="text-sm text-imrc-muted">Received: {new Date(selectedSubmission.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedSubmission(null)} className="text-gray-400 hover:text-imrc-primary transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-[8px]">
                <div>
                  <p className="text-xs font-semibold text-imrc-muted uppercase tracking-wider mb-1">Sender Name</p>
                  <p className="text-imrc-primary font-medium">{selectedSubmission.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-imrc-muted uppercase tracking-wider mb-1">Email Address</p>
                  <p className="text-imrc-primary font-medium"><a href={`mailto:${selectedSubmission.email}`} className="text-imrc-secondary hover:underline">{selectedSubmission.email}</a></p>
                </div>
                {selectedSubmission.phone && (
                  <div className="col-span-2">
                    <p className="text-xs font-semibold text-imrc-muted uppercase tracking-wider mb-1">Phone Number</p>
                    <p className="text-imrc-primary font-medium">{selectedSubmission.phone}</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-imrc-muted uppercase tracking-wider mb-2">Message</p>
                <div className="text-imrc-text whitespace-pre-wrap bg-white border border-gray-100 p-4 rounded-[8px] leading-relaxed">
                  {selectedSubmission.message}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setSelectedSubmission(null)}
                className="bg-white border border-gray-200 text-imrc-primary px-6 py-2 rounded-[8px] font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
