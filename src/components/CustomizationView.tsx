import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Palette, 
  Mic, 
  ShieldCheck, 
  Sliders, 
  Smartphone, 
  Laptop, 
  Watch, 
  Home as HomeIcon, 
  Check, 
  Heart, 
  Instagram, 
  Youtube, 
  Github, 
  Twitter,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { UserProfile, AppPermissions } from '../types';

import avatarMain from '../assets/images/diguu_avatar_main_1785882815230.jpg';
import avatarWink from '../assets/images/diguu_avatar_wink_1785882896630.jpg';

interface CustomizationViewProps {
  userProfile: UserProfile;
  permissions: AppPermissions;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onTogglePermission: (key: keyof AppPermissions) => void;
}

export const CustomizationView: React.FC<CustomizationViewProps> = ({
  userProfile,
  permissions,
  onUpdateProfile,
  onTogglePermission,
}) => {
  const [apiBaseUrl, setApiBaseUrl] = useState(localStorage.getItem('diguu_api_base_url') || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveApiBase = () => {
    const cleanedUrl = apiBaseUrl.trim().replace(/\/$/, '');
    localStorage.setItem('diguu_api_base_url', cleanedUrl);
    setApiBaseUrl(cleanedUrl);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const outfits = [
    'Pink Sweats & Bow 🎀',
    'Cyberpunk Neon Jacket ⚡',
    'Soft Sunset Hoodie 🌅',
    'Elegant Floral Kurti 🌸',
  ];

  const personalities = [
    { name: 'Warm Bestie', desc: 'Loving, affectionate, caring ("Hii Jaan 💕")' },
    { name: 'Professional AI', desc: 'Formal, precise, fast & structured' },
    { name: 'Chill Buddy', desc: 'Casual, funny, relaxed & humorous' },
    { name: 'Guru Coach', desc: 'Motivational, health-focused & structured' },
  ];

  const haloColors = [
    { name: 'Cyber Pink', color: '#ec4899' },
    { name: 'Neon Cyan', color: '#38bdf8' },
    { name: 'Royal Purple', color: '#a855f7' },
    { name: 'Sunset Gold', color: '#eab308' },
  ];

  const permissionItems: { key: keyof AppPermissions; label: string; desc: string }[] = [
    { key: 'microphone', label: 'Microphone Access', desc: 'For real-time voice commands and speech conversation' },
    { key: 'storage', label: 'Storage & Media', desc: 'For saving AI generated images and notes' },
    { key: 'camera', label: 'Camera Access', desc: 'For photo capture and visual AI queries' },
    { key: 'location', label: 'Location Access', desc: 'For weather updates and travel navigation time' },
    { key: 'contacts', label: 'Contacts Access', desc: 'For calling and sending messages to friends/family' },
    { key: 'calendar', label: 'Calendar Access', desc: 'For scheduling reminders and morning briefings' },
    { key: 'notifications', label: 'Notifications', desc: 'For proactive water, sleep, and stretch alerts' },
    { key: 'accessibility', label: 'Accessibility Service', desc: 'For full device control and hands-free routines' },
  ];

  return (
    <div className="space-y-6 pb-24 px-4 max-w-2xl mx-auto pt-2">
      {/* 1. DIGUU AVATAR CUSTOMIZER */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-pink-500/20 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-pink-400" />
          <h3 className="text-sm font-bold text-slate-100">DIGUU Avatar & Outfits</h3>
        </div>

        {/* Variant Picker */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onUpdateProfile({ avatarVariant: 'main' })}
            className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
              userProfile.avatarVariant === 'main'
                ? 'bg-pink-500/10 border-pink-500 shadow-md ring-1 ring-pink-500'
                : 'bg-slate-950 border-slate-800'
            }`}
          >
            <img src={avatarMain} alt="Main Avatar" referrerPolicy="no-referrer" className="w-12 h-12 rounded-full object-cover" />
            <div className="text-left">
              <div className="text-xs font-bold text-slate-100">Main Companion</div>
              <div className="text-[10px] text-pink-300">Warm & Smiling</div>
            </div>
          </button>

          <button
            onClick={() => onUpdateProfile({ avatarVariant: 'wink' })}
            className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
              userProfile.avatarVariant === 'wink'
                ? 'bg-pink-500/10 border-pink-500 shadow-md ring-1 ring-pink-500'
                : 'bg-slate-950 border-slate-800'
            }`}
          >
            <img src={avatarWink} alt="Wink Avatar" referrerPolicy="no-referrer" className="w-12 h-12 rounded-full object-cover" />
            <div className="text-left">
              <div className="text-xs font-bold text-slate-100">Playful Wink</div>
              <div className="text-[10px] text-pink-300">Winking 💕</div>
            </div>
          </button>
        </div>

        {/* Outfit Choice */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">Avatar Outfit Style</label>
          <div className="grid grid-cols-2 gap-2">
            {outfits.map((outfit) => (
              <button
                key={outfit}
                onClick={() => onUpdateProfile({ avatarOutfit: outfit })}
                className={`p-2.5 rounded-xl text-xs font-medium border text-left transition-all ${
                  userProfile.avatarOutfit === outfit
                    ? 'bg-purple-500/20 border-purple-500 text-purple-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {outfit}
              </button>
            ))}
          </div>
        </div>

        {/* Neon Halo Color */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">Neon Halo Glow Color</label>
          <div className="flex items-center gap-3">
            {haloColors.map((halo) => (
              <button
                key={halo.name}
                onClick={() => onUpdateProfile({ haloColor: halo.color })}
                className="w-9 h-9 rounded-full border-2 border-slate-800 flex items-center justify-center transition-transform hover:scale-110"
                style={{ backgroundColor: halo.color }}
              >
                {userProfile.haloColor === halo.color && <Check className="w-5 h-5 text-slate-950 font-black" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. AI PERSONALITY & VOICE SETTINGS */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Mic className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold text-slate-100">AI Personality & Voice Experience</h3>
        </div>

        {/* Language & Accent Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">Language & Accent Mode</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'gujarati', label: 'ગુજરાતી (Gujarati GF)', desc: 'Real Gujarati cute sweet voice' },
              { id: 'hindi', label: 'हिंदी (Desi GF)', desc: 'Natural Hindi cute girlfriend tone' },
              { id: 'hinglish', label: 'Hinglish (Bestie)', desc: 'Playful Indian Hinglish' },
              { id: 'english', label: 'English (US/UK)', desc: 'Natural sweet English' },
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => onUpdateProfile({ languageMode: lang.id as any })}
                className={`p-2.5 rounded-2xl text-left border transition-all ${
                  userProfile.languageMode === lang.id
                    ? 'bg-indigo-500/20 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-xs font-bold text-indigo-300">{lang.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{lang.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Personality Picker */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">AI Persona Mode</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {personalities.map((p) => (
              <button
                key={p.name}
                onClick={() => onUpdateProfile({ personality: p.name as any })}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  userProfile.personality === p.name
                    ? 'bg-pink-500/15 border-pink-500 text-slate-100 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-xs font-bold text-pink-300">{p.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Voice Style & Speed */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">Voice Tone Style</label>
          <div className="flex gap-2">
            {['Kore (Warm Female)', 'Zephyr (Soft Female)', 'Puck (Energetic)'].map((vName) => {
              const code = vName.split(' ')[0] as any;
              return (
                <button
                  key={code}
                  onClick={() => onUpdateProfile({ voiceStyle: code })}
                  className={`flex-1 py-2 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                    userProfile.voiceStyle === code
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  {code}
                </button>
              );
            })}
          </div>
        </div>

        {/* Voice Speed Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-medium text-slate-300">
            <span>Speech Rate / Speed</span>
            <span className="text-pink-300 font-bold">{userProfile.voiceSpeed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="1.5"
            step="0.1"
            value={userProfile.voiceSpeed}
            onChange={(e) => onUpdateProfile({ voiceSpeed: parseFloat(e.target.value) })}
            className="w-full accent-pink-500"
          />
        </div>
      </div>

      {/* 3. PERMISSIONS CONTROL CENTER */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100">All Permissions Enabled</h3>
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
            100% User Control
          </span>
        </div>

        <div className="space-y-2 pt-1">
          {permissionItems.map((item) => (
            <div
              key={item.key}
              className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-slate-200">{item.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
              </div>

              <button
                onClick={() => onTogglePermission(item.key)}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  permissions[item.key] ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                }`}
              >
                <Check className="w-4 h-4 font-black" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3.5 BACKEND API SERVER SETTINGS */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-pink-500/20 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-pink-400" />
          <h3 className="text-sm font-bold text-slate-100">Android & Backend API Settings</h3>
        </div>
        <p className="text-xs text-slate-300">
          When running DIGUU AI as an Android APK, configure your custom backend API server URL so the app can communicate with the Gemini AI.
        </p>
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Backend API Server URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. https://your-diguu-backend.onrender.com"
              value={apiBaseUrl}
              onChange={(e) => setApiBaseUrl(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-pink-500/50"
            />
            <button
              onClick={handleSaveApiBase}
              className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold transition-all whitespace-nowrap"
            >
              Save URL
            </button>
          </div>
          {saveSuccess && (
            <p className="text-[11px] text-emerald-400 font-bold animate-pulse">✓ Backend Server URL updated successfully!</p>
          )}
          <p className="text-[10px] text-slate-500">
            Leave blank to connect to the local server (default).
          </p>
        </div>
      </div>

      {/* 4. DEVELOPER PROFILE CARD */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border border-pink-500/30 shadow-2xl text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 p-0.5 shadow-lg flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-bold text-pink-300 text-lg">
            RT
          </div>
        </div>

        <div>
          <div className="flex items-center justify-center gap-1.5">
            <h3 className="text-base font-bold text-slate-100">Rohit Tarun</h3>
            <CheckCircle2 className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
          </div>
          <p className="text-xs text-pink-300 font-medium">Creator & Lead Developer of DIGUU AI</p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-1">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-900 text-pink-400 hover:bg-pink-500/20 transition-colors">
            <Instagram className="w-4 h-4" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-900 text-rose-400 hover:bg-rose-500/20 transition-colors">
            <Youtube className="w-4 h-4" />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-900 text-slate-200 hover:bg-slate-800 transition-colors">
            <Github className="w-4 h-4" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-900 text-cyan-400 hover:bg-cyan-500/20 transition-colors">
            <Twitter className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* 5. FUTURE EXPANSION ROADMAP */}
      <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Future Expansion Roadmap</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-left">
            <Laptop className="w-4 h-4 text-purple-400 mb-1" />
            <div className="text-xs font-bold text-slate-200">Desktop Companion</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Mac & Windows Overlay</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-left">
            <Watch className="w-4 h-4 text-pink-400 mb-1" />
            <div className="text-xs font-bold text-slate-200">Smartwatch App</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Wear OS & Apple Watch</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-left">
            <HomeIcon className="w-4 h-4 text-cyan-400 mb-1" />
            <div className="text-xs font-bold text-slate-200">Smart Home IoT</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Lights, Thermostats, Locks</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-left">
            <Smartphone className="w-4 h-4 text-emerald-400 mb-1" />
            <div className="text-xs font-bold text-slate-200">Plugin Ecosystem</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Custom Voice Actions</div>
          </div>
        </div>
      </div>
    </div>
  );
};
