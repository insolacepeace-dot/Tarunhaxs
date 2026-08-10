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
  CheckCircle2,
  MessageSquare,
  Send,
  Bot,
  BellRing,
  Filter,
  CheckCircle,
  Clock
} from 'lucide-react';
import { UserProfile, AppPermissions, WhatsAppAutoReplyLog } from '../types';
import { openSpecialSystemSettings, generateWhatsAppAIReply } from '../utils/nativeBridge';

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
  const [simSender, setSimSender] = useState('Aarav');
  const [simMessage, setSimMessage] = useState('Bhai shaam ko milenge kya? Important kaam hai!');
  const [simLoading, setSimLoading] = useState(false);
  const [simReply, setSimReply] = useState<string | null>(null);
  const [replyLogs, setReplyLogs] = useState<WhatsAppAutoReplyLog[]>([
    {
      id: 'log-1',
      sender: 'Priya',
      incomingMessage: 'Khana khaya aapne? Meeting kab khatam hogi?',
      aiResponse: `Hii Priya! ${userProfile.name || 'Tarun'} is currently in a meeting. Will message you right after! 💕`,
      timestamp: '10:42 AM',
      rule: 'contacts_only',
      status: 'sent',
    },
  ]);

  const handleRunSimulator = async () => {
    if (!simMessage.trim()) return;
    setSimLoading(true);
    setSimReply(null);
    try {
      const generated = await generateWhatsAppAIReply(
        simSender || 'Friend',
        simMessage,
        userProfile.name || 'Tarun',
        userProfile.languageMode || 'hinglish',
        userProfile.whatsappAutoReplyRule || 'all',
        userProfile.whatsappCustomContacts || ''
      );
      setSimReply(generated);

      const newLog: WhatsAppAutoReplyLog = {
        id: `log-${Date.now()}`,
        sender: simSender || 'Contact',
        incomingMessage: simMessage,
        aiResponse: generated,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        rule: userProfile.whatsappAutoReplyRule || 'all',
        status: 'simulated',
      };
      setReplyLogs((prev) => [newLog, ...prev.slice(0, 5)]);
    } catch (e) {
      console.error('Simulator error:', e);
    } finally {
      setSimLoading(false);
    }
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
      {/* 0. USER IDENTITY & CUSTOM NAME SETTING */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-indigo-500/30 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-100">User Identity & Address Name</h3>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">Your Name (How DIGUU Addresses You)</label>
          <div className="relative">
            <input
              type="text"
              value={userProfile.name || ''}
              onChange={(e) => onUpdateProfile({ name: e.target.value, nickname: e.target.value })}
              placeholder="Enter your name (e.g. Tarun)"
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <Sparkles className="w-4 h-4 text-indigo-400 absolute right-3.5 top-3 pointer-events-none" />
          </div>
          <p className="text-[11px] text-indigo-300/80">
            DIGUU AI will directly speak to you using this name in every response (e.g. "Hii {userProfile.name || 'Tarun'} 💕").
          </p>
        </div>
      </div>

      {/* 0.5 WHATSAPP AI AUTO-REPLY AGENT */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-emerald-500/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                <span>WhatsApp AI Auto-Reply Agent</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  Android Native
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Automatically respond to WhatsApp notifications in the voice of {userProfile.name || 'Tarun'}
              </p>
            </div>
          </div>

          {/* Master Toggle */}
          <button
            type="button"
            onClick={() => onUpdateProfile({ whatsappAutoReplyEnabled: !userProfile.whatsappAutoReplyEnabled })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
              userProfile.whatsappAutoReplyEnabled ? 'bg-emerald-500' : 'bg-slate-800'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                userProfile.whatsappAutoReplyEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Android Notification Listener Permission Banner */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BellRing className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="text-[11px] text-slate-300">
              <span className="font-semibold text-slate-200">Android Notification Listener Service:</span>
              <span className="block text-slate-400 text-[10px]">
                Requires Android BIND_NOTIFICATION_LISTENER_SERVICE permission
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openSpecialSystemSettings('notification_listener')}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shrink-0 transition-colors cursor-pointer"
          >
            Grant Access ⚙️
          </button>
        </div>

        {/* Custom Auto-Reply Rule Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span>Auto-Reply Response Rules</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'all', label: '🌐 All Messages', desc: 'Reply to every incoming WhatsApp text' },
              { id: 'contacts_only', label: '👥 Saved Contacts', desc: 'Reply only to known saved numbers' },
              { id: 'busy_mode', label: '🌙 Busy / DND Mode', desc: 'Reply when busy or in focus mode' },
              { id: 'custom_list', label: '📝 Custom List', desc: 'Filter specific target contact names' },
            ].map((ruleItem) => (
              <button
                key={ruleItem.id}
                type="button"
                onClick={() => onUpdateProfile({ whatsappAutoReplyRule: ruleItem.id as any })}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  (userProfile.whatsappAutoReplyRule || 'all') === ruleItem.id
                    ? 'bg-emerald-500/20 border-emerald-500 text-slate-100 ring-1 ring-emerald-500/40'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-emerald-300 flex items-center justify-between">
                  <span>{ruleItem.label}</span>
                  {(userProfile.whatsappAutoReplyRule || 'all') === ruleItem.id && (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{ruleItem.desc}</div>
              </button>
            ))}
          </div>

          {/* Custom Contacts List Input */}
          {(userProfile.whatsappAutoReplyRule === 'custom_list') && (
            <div className="mt-2 space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">Allowed Contact Names (Comma Separated)</label>
              <input
                type="text"
                value={userProfile.whatsappCustomContacts || ''}
                onChange={(e) => onUpdateProfile({ whatsappCustomContacts: e.target.value })}
                placeholder="e.g. Aarav, Mom, Priya, Rahul"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}
        </div>

        {/* Live Simulator & Tester */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>Test AI WhatsApp Auto-Reply</span>
            </span>
            <span className="text-[10px] text-slate-400">Gemini 3.6 Flash Engine</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={simSender}
              onChange={(e) => setSimSender(e.target.value)}
              placeholder="Sender Name"
              className="col-span-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
            />
            <input
              type="text"
              value={simMessage}
              onChange={(e) => setSimMessage(e.target.value)}
              placeholder="Test WhatsApp Message..."
              className="col-span-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="button"
            onClick={handleRunSimulator}
            disabled={simLoading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {simLoading ? (
              <span>Generating AI Reply...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Simulate WhatsApp Notification & Generate Reply</span>
              </>
            )}
          </button>

          {/* Generated Reply Preview Box */}
          {simReply && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 space-y-1.5"
            >
              <div className="flex items-center justify-between text-[11px] text-emerald-300 font-bold">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>AI Generated WhatsApp Reply:</span>
                </span>
                <span className="text-[10px] bg-emerald-500/30 px-2 py-0.5 rounded-full text-emerald-200">
                  RemoteInput Sent
                </span>
              </div>
              <p className="text-xs text-slate-100 font-medium italic">"{simReply}"</p>
            </motion.div>
          )}

          {/* History Logs */}
          {replyLogs.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-900">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" />
                <span>Recent Auto-Replies Log</span>
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {replyLogs.map((log) => (
                  <div key={log.id} className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] space-y-0.5">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="font-bold text-emerald-300">{log.sender}</span>
                      <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-400 line-clamp-1">In: "{log.incomingMessage}"</p>
                    <p className="text-slate-200 font-semibold line-clamp-1 text-emerald-200">Out: "{log.aiResponse}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

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

        {/* Voice Gender Toggle Switcher */}
        <div className="space-y-2 pt-1 border-t border-slate-800">
          <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span>Voice Gender Switcher</span>
            <span className="text-[10px] text-pink-400 font-semibold uppercase">Dynamic TTS Allocation</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onUpdateProfile({ voiceGender: 'female', voiceStyle: 'Kore' })}
              className={`p-3 rounded-2xl border text-left transition-all ${
                userProfile.voiceGender === 'female'
                  ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500 text-slate-100 shadow-md ring-1 ring-pink-500/50'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-300">Female Voice 👩</span>
                {userProfile.voiceGender === 'female' && <Check className="w-4 h-4 text-pink-400" />}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                hi-IN-Wavenet-A / gu-IN-Wavenet-A (Cute & Sweet)
              </div>
            </button>

            <button
              type="button"
              onClick={() => onUpdateProfile({ voiceGender: 'male', voiceStyle: 'Puck' })}
              className={`p-3 rounded-2xl border text-left transition-all ${
                userProfile.voiceGender === 'male'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500 text-slate-100 shadow-md ring-1 ring-cyan-500/50'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300">Male Voice 👨</span>
                {userProfile.voiceGender === 'male' && <Check className="w-4 h-4 text-cyan-400" />}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                hi-IN-Wavenet-B / gu-IN-Wavenet-B (Warm & Deep)
              </div>
            </button>
          </div>
        </div>

        {/* Voice Style & Speed */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">Voice Tone Style Preset</label>
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
