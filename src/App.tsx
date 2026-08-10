import React, { useState, useEffect } from 'react';
import { 
  initialUserProfile, 
  initialMemories, 
  initialRoutines, 
  initialReminders, 
  initialNotes, 
  initialHabits, 
  initialPermissions, 
  initialQuickActions, 
  initialWeather, 
  initialPlaces 
} from './data/initialData';
import { 
  UserProfile, 
  MemoryItem, 
  Routine, 
  Reminder, 
  Note, 
  HabitGoal, 
  AppPermissions, 
  QuickActionItem, 
  ChatMessage 
} from './types';

import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { SmartDashboard } from './components/SmartDashboard';
import { ChatView } from './components/ChatView';
import { MemoryAndRoutinesView } from './components/MemoryAndRoutinesView';
import { CreativitySuiteView } from './components/CreativitySuiteView';
import { CustomizationView } from './components/CustomizationView';
import { PermissionsModal } from './components/PermissionsModal';
import { QuickActionsModal } from './components/QuickActionsModal';
import {
  nativeToggleFlashlight,
  nativeOpenWhatsApp,
  nativeOpenClock,
  nativeOpenCalendar
} from './utils/deviceActions';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Core App States
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [memories, setMemories] = useState<MemoryItem[]>(initialMemories);
  const [routines, setRoutines] = useState<Routine[]>(initialRoutines);
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [habits, setHabits] = useState<HabitGoal[]>(initialHabits);
  const [permissions, setPermissions] = useState<AppPermissions>(initialPermissions);
  const [quickActions] = useState<QuickActionItem[]>(initialQuickActions);
  const [weather] = useState(initialWeather);
  const [places] = useState(initialPlaces);

  // Chat & Voice States
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'diguu',
      text: `Hii ${initialUserProfile.nickname} 💕! Main DIGUU AI hoon, aapki cute & caring girlfriend! Bolo mere babu, aaj aapke liye kya karun? (Kem cho Jaan! 💖)`,
      timestamp: 'Just now',
    },
  ]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Briefing States
  const [briefingText, setBriefingText] = useState('');
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);

  // Modals
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [selectedQuickAction, setSelectedQuickAction] = useState<QuickActionItem | null>(null);

  // Speech Synthesis Helper
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = userProfile.voiceSpeed || 1.0;
      utterance.pitch = 1.25; // Sweet, cute, cheerful GF tone

      // Try selecting Indian female or Gujarati/Hindi voice if available
      const voices = window.speechSynthesis.getVoices();
      const isGujarati = userProfile.languageMode === 'gujarati';
      const isHindi = userProfile.languageMode === 'hindi' || userProfile.languageMode === 'hinglish';

      let selectedVoice = null;
      if (isGujarati) {
        selectedVoice = voices.find(v => v.lang.includes('gu') || v.name.includes('Gujarati'));
      }
      if (!selectedVoice && (isHindi || isGujarati)) {
        selectedVoice = voices.find(v => v.lang.includes('hi') || v.name.includes('Hindi') || v.name.includes('Google हिन्दी'));
      }
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Google UK English Female') || v.name.includes('Samantha') || v.name.includes('Zira') || v.lang.includes('en-IN'));
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  // Web Speech Recognition for Voice Input
  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = userProfile.languageMode === 'gujarati' 
        ? 'gu-IN' 
        : (userProfile.languageMode === 'hindi' || userProfile.languageMode === 'hinglish')
        ? 'hi-IN' 
        : 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSendMessage(transcript);
        }
      };

      recognition.start();
    } else {
      // Fallback simulated voice prompt if Web Speech is blocked in browser
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        const fallbackText = userProfile.languageMode === 'gujarati'
          ? 'Kem cho Jaan 💕 Aaje havaaman kevo che?'
          : 'Hii Jaan 💕 Khana khaya aapne? Aaj ka weather batao!';
        handleSendMessage(fallbackText);
      }, 2000);
    }
  };

  // Main DIGUU Chat Communication handler
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const apiBase = localStorage.getItem('diguu_api_base_url') || '';
      const response = await fetch(`${apiBase}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages,
          userProfile,
          memories,
          personality: userProfile.personality,
          languageMode: userProfile.languageMode,
        }),
      });

      const data = await response.json();
      const aiResponseText = data.text || data.fallback || 'Main aapke saath hoon 💕';

      // Check if response triggered an action
      let actionTag = undefined;
      if (text.toLowerCase().includes('reminder') || text.toLowerCase().includes('yaad')) {
        actionTag = 'ACTION: REMINDER_SET 🔔';
      } else if (text.toLowerCase().includes('weather')) {
        actionTag = 'ACTION: WEATHER_CHECK ☀️';
      } else if (text.toLowerCase().includes('flashlight')) {
        actionTag = 'ACTION: FLASHLIGHT_TOGGLE 🔦';
      } else if (text.toLowerCase().includes('music')) {
        actionTag = 'ACTION: MUSIC_PLAYING 🎵';
      }

      const diguuMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'diguu',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTag,
      };

      setMessages((prev) => [...prev, diguuMsg]);
      speakText(aiResponseText);
    } catch (err) {
      console.error('Error sending message:', err);
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'diguu',
        text: 'Hii Jaan! DIGUU AI is listening and right here for you 💕',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Generate Proactive Morning / Evening Briefing
  const handleGenerateBriefing = async (type: 'morning' | 'evening') => {
    setIsBriefingLoading(true);
    try {
      const apiBase = localStorage.getItem('diguu_api_base_url') || '';
      const res = await fetch(`${apiBase}/api/briefing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          weather: `${weather.condition}, ${weather.temp}°C in ${weather.city}`,
          reminders,
          memories,
          userName: userProfile.nickname,
        }),
      });
      const data = await res.json();
      if (data.summary) {
        setBriefingText(data.summary);
      }
    } catch (err) {
      console.error('Error generating briefing:', err);
    } finally {
      setIsBriefingLoading(false);
    }
  };

  // Memory Handlers
  const handleAddMemory = (memory: Omit<MemoryItem, 'id' | 'createdAt'>) => {
    const newItem: MemoryItem = {
      ...memory,
      id: `mem-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setMemories((prev) => [newItem, ...prev]);
  };

  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  const handleToggleMemoryPermission = (id: string) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, permissionGranted: !m.permissionGranted } : m))
    );
  };

  // Routine Handlers
  const handleToggleRoutine = (id: string) => {
    setRoutines((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleAddRoutine = (routine: Omit<Routine, 'id'>) => {
    setRoutines((prev) => [...prev, { ...routine, id: `r-${Date.now()}` }]);
  };

  // Reminder Handlers
  const handleToggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const handleAddReminder = (reminder: Omit<Reminder, 'id' | 'completed'>) => {
    setReminders((prev) => [{ ...reminder, id: `rem-${Date.now()}`, completed: false }, ...prev]);
  };

  // Note Handlers
  const handleAddNote = (note: Omit<Note, 'id' | 'updatedAt'>) => {
    const newNote: Note = {
      ...note,
      id: `n-${Date.now()}`,
      updatedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  // Profile Update Handler
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  // Permission Toggle Handler
  const handleTogglePermission = (key: keyof AppPermissions) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-pink-500 selection:text-white">
      {/* App Header */}
      <Header
        userProfile={userProfile}
        weather={weather}
        onOpenPermissions={() => setIsPermissionsModalOpen(true)}
        onOpenCustomization={() => setActiveTab('profile')}
      />

      {/* Main View Container */}
      <main className="pt-2">
        {activeTab === 'home' && (
          <SmartDashboard
            userProfile={userProfile}
            weather={weather}
            reminders={reminders}
            habits={habits}
            quickActions={quickActions}
            places={places}
            isSpeaking={isSpeaking}
            isListening={isListening}
            onVoiceClick={startVoiceInput}
            onSelectAction={(action) => {
              if (action.action === 'toggle_flashlight') {
                nativeToggleFlashlight();
              } else if (action.action === 'open_whatsapp') {
                nativeOpenWhatsApp();
              } else if (action.action === 'set_alarm') {
                nativeOpenClock();
              } else if (action.action === 'set_reminder') {
                nativeOpenCalendar();
              } else {
                setSelectedQuickAction(action);
              }
            }}
            onToggleReminder={handleToggleReminder}
            onGenerateBriefing={handleGenerateBriefing}
            briefingText={briefingText}
            isBriefingLoading={isBriefingLoading}
          />
        )}

        {activeTab === 'chat' && (
          <ChatView
            userProfile={userProfile}
            messages={messages}
            onSendMessage={handleSendMessage}
            isSpeaking={isSpeaking}
            isListening={isListening}
            onVoiceClick={startVoiceInput}
            onSpeakText={speakText}
            onLanguageChange={(mode) => handleUpdateProfile({ languageMode: mode })}
            isLoading={isChatLoading}
          />
        )}

        {activeTab === 'memory' && (
          <MemoryAndRoutinesView
            memories={memories}
            routines={routines}
            habits={habits}
            onAddMemory={handleAddMemory}
            onDeleteMemory={handleDeleteMemory}
            onToggleMemoryPermission={handleToggleMemoryPermission}
            onToggleRoutine={handleToggleRoutine}
            onAddRoutine={handleAddRoutine}
          />
        )}

        {activeTab === 'creativity' && (
          <CreativitySuiteView
            notes={notes}
            onAddNote={handleAddNote}
          />
        )}

        {activeTab === 'profile' && (
          <CustomizationView
            userProfile={userProfile}
            permissions={permissions}
            onUpdateProfile={handleUpdateProfile}
            onTogglePermission={handleTogglePermission}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Permissions Modal */}
      <PermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        permissions={permissions}
        onTogglePermission={handleTogglePermission}
      />

      {/* Quick Actions Modal */}
      <QuickActionsModal
        actionItem={selectedQuickAction}
        onClose={() => setSelectedQuickAction(null)}
        onAddReminder={handleAddReminder}
      />
    </div>
  );
}
