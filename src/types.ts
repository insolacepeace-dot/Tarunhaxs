export type Sender = 'user' | 'diguu';

export interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  timestamp: string;
  actionTag?: string;
  isVoice?: boolean;
}

export type MemoryCategory = 'food' | 'music' | 'movies' | 'contacts' | 'routines' | 'places' | 'preferences';

export interface MemoryItem {
  id: string;
  category: MemoryCategory;
  key: string;
  value: string;
  createdAt: string;
  permissionGranted: boolean;
}

export interface Routine {
  id: string;
  title: string;
  time: string;
  repeat: 'Daily' | 'Weekdays' | 'Weekends';
  enabled: boolean;
  icon?: string;
}

export interface Reminder {
  id: string;
  title: string;
  date: string;
  time: string;
  repeat: string;
  category: 'Health' | 'Work' | 'Personal' | 'Call' | 'Alarm';
  completed: boolean;
  soundName?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: 'Work' | 'Personal' | 'Ideas' | 'Voice Notes' | 'Meeting Summaries';
  updatedAt: string;
}

export interface HabitGoal {
  id: string;
  title: string;
  targetDays: number;
  currentStreak: number;
  completedToday: boolean;
  category: 'Health' | 'Productivity' | 'Mindfulness' | 'Learning';
}

export interface UserProfile {
  name: string;
  nickname: string;
  location: string;
  occupation: string;
  theme: 'neon-cyber' | 'dark-velvet' | 'violet-glow' | 'sunset-gold' | 'light-cyber';
  personality: 'Warm Bestie' | 'Professional AI' | 'Chill Buddy' | 'Guru Coach';
  languageMode: 'hinglish' | 'hindi' | 'gujarati' | 'english';
  voiceStyle: 'Kore' | 'Zephyr' | 'Puck' | 'Charon' | 'Fenrir';
  voiceSpeed: number; // 0.8 to 1.5
  wakeWordEnabled: boolean;
  avatarVariant: string;
  avatarOutfit: string;
  haloColor: string;
}

export interface AppPermissions {
  microphone: boolean;
  storage: boolean;
  camera: boolean;
  location: boolean;
  contacts: boolean;
  phone: boolean;
  sms: boolean;
  calendar: boolean;
  accessibility: boolean;
  notifications: boolean;
  alarms: boolean;
  usageAccess: boolean;
  deviceAdmin: boolean;
}

export interface QuickActionItem {
  id: string;
  label: string;
  iconName: string;
  category: string;
  action: string;
  shortcut?: string;
}

export interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  highLow: string;
}

export interface SavedPlace {
  id: string;
  name: string;
  address: string;
  category: 'Home' | 'Work' | 'Gym' | 'Cafe' | 'Other';
  estimatedMinutes: number;
}
