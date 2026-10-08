import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type TeamMember = {
  name: string;
  title: string;
  email: string | null;
  initials: string;
  image: string;
};

export type Settings = {
  email: string;
  phone: string;
  location: string;
  logoUrl: string;
  heroImageAbout: string;
  heroImageMission: string;
  heroImageVision: string;
  heroImageGallery: string;
  heroImageContact: string;
  imageLegacy: string;
  teamMembers: TeamMember[];
};

const defaultSettings: Settings = {
  email: 'support@gaarc.org',
  phone: '+414028597',
  location: '96, Route de la Louvière\nGeneva\n1203 Switzerland',
  logoUrl: '',
  heroImageAbout: '',
  heroImageMission: '',
  heroImageVision: '',
  heroImageGallery: '',
  heroImageContact: '',
  imageLegacy: 'https://i.ibb.co/GfSmfpGV/Image-2.png',
  teamMembers: [
    {
      name: "Anita D. Benz",
      title: "Secretary for Emergency Victim Rehabilitation Services",
      email: "info@gaarc.org",
      initials: "AB",
      image: "https://i.ibb.co/5hK1jcC5/Anita-D-Benz.jpg"
    },
    {
      name: "Alfred Kammer",
      title: "Director of Regional Affairs, European Bureau",
      email: null,
      initials: "AK",
      image: "https://i.ibb.co/yBYb37DQ/Alfred-Karmer-01.jpg"
    },
    {
      name: "Kristalina Georgieva",
      title: "Honorary Advisory Delegate",
      email: null,
      initials: "KG",
      image: "https://i.ibb.co/twr6n85Z/Kristalina-Georgieva-01.jpg"
    }
  ]
};

const STORAGE_KEY = 'gaarc_app_settings';

function getInitialSettings(): Settings {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      return { ...defaultSettings, ...JSON.parse(cached) };
    }
  } catch (e) {
    console.warn('Failed to parse cached settings:', e);
  }
  return defaultSettings;
}

type SettingsContextType = {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(getInitialSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .eq('id', 1)
          .maybeSingle();

        if (error) {
          console.warn('Could not fetch settings from Supabase:', error.message);
        }

        if (data) {
          const merged: Settings = {
            email: data.email ?? defaultSettings.email,
            phone: data.phone ?? defaultSettings.phone,
            location: data.location ?? defaultSettings.location,
            logoUrl: data.logo_url ?? defaultSettings.logoUrl,
            heroImageAbout: data.hero_image_about ?? defaultSettings.heroImageAbout,
            heroImageContact: data.hero_image_contact ?? defaultSettings.heroImageContact,
            heroImageMission: data.hero_image_mission ?? defaultSettings.heroImageMission,
            heroImageVision: data.hero_image_vision ?? defaultSettings.heroImageVision,
            heroImageGallery: data.hero_image_gallery ?? defaultSettings.heroImageGallery,
            imageLegacy: data.image_legacy ?? defaultSettings.imageLegacy,
            teamMembers: data.team_members ?? defaultSettings.teamMembers,
          };
          setSettings(merged);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          } catch (e) {
            // ignore storage quota issues
          }
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<Settings>): Promise<{ success: boolean; error?: string }> => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    
    // Save to localStorage immediately so changes reflect on the frontend instantly
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
    
    try {
      const payload: any = {
        id: 1,
        email: updated.email,
        phone: updated.phone,
        location: updated.location,
        logo_url: updated.logoUrl,
        hero_image_about: updated.heroImageAbout,
        hero_image_contact: updated.heroImageContact,
        hero_image_mission: updated.heroImageMission,
        hero_image_vision: updated.heroImageVision,
        hero_image_gallery: updated.heroImageGallery,
        image_legacy: updated.imageLegacy,
        team_members: updated.teamMembers,
        updated_at: new Date().toISOString(),
      };

      // Use upsert so that if row 1 does not exist, it inserts it!
      const { error } = await supabase
        .from('settings')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        // If it failed because the columns don't exist yet, fallback to base columns
        if (error.message && error.message.includes('column')) {
          console.warn('Fallback: Saving without new columns.', error.message);
          const fallbackPayload = { ...payload };
          delete fallbackPayload.image_legacy;
          delete fallbackPayload.team_members;
          const { error: fallbackError } = await supabase
            .from('settings')
            .upsert(fallbackPayload, { onConflict: 'id' });
            
          if (fallbackError) {
            return { success: false, error: fallbackError.message };
          }
          return { success: true };
        }
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error updating settings in Supabase:', error);
      return { success: false, error: error?.message || 'Database connection error' };
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
