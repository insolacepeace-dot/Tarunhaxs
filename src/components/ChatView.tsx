import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Mic, Volume2, Sparkles, Heart, Languages, RefreshCw, Zap, Bot } from 'lucide-react';
import { ChatMessage, UserProfile } from '../types';
import { VoiceWave } from './VoiceWave';

import avatarMain from '../assets/images/diguu_avatar_main_1785882815230.jpg';

interface ChatViewProps {
  userProfile: UserProfile;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isSpeaking: boolean;
  isListening: boolean;
  onVoiceClick: () => void;
  onSpeakText: (text: string) => void;
  onLanguageChange: (mode: 'hinglish' | 'hindi' | 'gujarati' | 'english') => void;
  isLoading: boolean;
}

export const ChatView: React.FC<ChatViewProps> = ({
  userProfile,
  messages,
  onSendMessage,
  isSpeaking,
  isListening,
  onVoiceClick,
  onSpeakText,
  onLanguageChange,
  isLoading,
}) => {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const quickPrompts = userProfile.languageMode === 'gujarati' 
    ? [
        'કેમ છો જાન 💕 શું કરે છે?',
        'તમે જમ્યા કે નહિ જાન? 🍲',
        'હેય DIGUU, રોમેન્ટિક વાત કરો 💖',
        'આજે હવામાન કેવું છે? ☀️',
        'એક મીઠી શાયરી કે ગીત સંભળાવો 🎵',
      ]
    : userProfile.languageMode === 'hindi'
    ? [
        'अरे मेरी जान 💕 खाना खाया आपने?',
        'मेरा कितना ख्याल रखते हो आप 💖',
        'आज का मौसम कैसा है? ☀️',
        'आपकी आवाज़ कितनी प्यारी है 🎵',
        'मुझे एक प्यारी सी शायरी सुनाओ 🌸',
      ]
    : [
        'Hii Jaan 💕 Kaise ho aap?',
        'Aaj ka weather kaisa hai? ☀️',
        'Hey Diguu, music chalao 🎵',
        'Hey Diguu, shaam 7 baje call yaad dilana 🔔',
        'Ek sundar poem/shayari sunao 🌸',
      ];

  return (
    <div className="flex flex-col h-[calc(100vh-135px)] max-w-2xl mx-auto pb-4 px-2">
      {/* Top Controls Bar: Language Mode & Voice Wave */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-3 mb-2 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-indigo-500/40">
              <img src={avatarMain} alt="DIGUU" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-100 flex items-center gap-1">
                <span>DIGUU Voice Assistant</span>
                <Sparkles className="w-3 h-3 text-cyan-400" />
              </div>
              <div className="text-[10px] text-emerald-400 font-medium">Wake Word: "Hey Diguu"</div>
            </div>
          </div>

          {/* Language Mode Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-full border border-slate-800">
            <button
              onClick={() => onLanguageChange('hinglish')}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                userProfile.languageMode === 'hinglish' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              Hinglish
            </button>
            <button
              onClick={() => onLanguageChange('hindi')}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                userProfile.languageMode === 'hindi' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => onLanguageChange('gujarati')}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                userProfile.languageMode === 'gujarati' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              ગુજરાતી
            </button>
            <button
              onClick={() => onLanguageChange('english')}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                userProfile.languageMode === 'english' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              Eng
            </button>
          </div>
        </div>

        {/* Real-time Voice Sine Wave */}
        <VoiceWave isSpeaking={isSpeaking} isListening={isListening} />
      </div>

      {/* Messages Scroll Feed */}
      <div className="flex-1 overflow-y-auto space-y-3 px-2 py-2">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-full overflow-hidden border border-indigo-500/40 shrink-0 mb-1">
                  <img src={avatarMain} alt="DIGUU" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
              )}

              <div
                className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                  isUser
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-br-none'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-100 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Action Tag Badge if triggered */}
                {msg.actionTag && (
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-semibold border border-cyan-500/30">
                    <Zap className="w-3 h-3 text-cyan-400" />
                    <span>{msg.actionTag}</span>
                  </div>
                )}

                {/* Footer time & Audio TTS play button for AI messages */}
                <div className={`flex items-center justify-between gap-2 mt-2 pt-1 border-t ${isUser ? 'border-indigo-400/30' : 'border-slate-800'}`}>
                  <span className={`text-[10px] ${isUser ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>

                  {!isUser && (
                    <button
                      onClick={() => onSpeakText(msg.text)}
                      className="p-1 rounded-full hover:bg-slate-800 text-cyan-400 transition-colors"
                      title="Speak Message"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-indigo-300 font-medium p-2 bg-slate-900/60 rounded-2xl w-fit border border-slate-800">
            <Bot className="w-4 h-4 animate-bounce text-cyan-400" />
            <span>DIGUU is thinking & responding... ✨</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 no-scrollbar">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(prompt)}
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 text-[11px] font-medium text-slate-300 whitespace-nowrap transition-all hover:bg-indigo-500/10 shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Field & Mic Trigger Bar */}
      <form onSubmit={handleSend} className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={onVoiceClick}
          className={`p-3 rounded-full text-white transition-all shadow-lg ${
            isListening
              ? 'bg-cyan-500 shadow-cyan-500/40 animate-pulse'
              : 'bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-indigo-500/30 hover:scale-105'
          }`}
          title="Voice Speech Input"
        >
          <Mic className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message to DIGUU..."
          className="flex-1 bg-slate-900/80 border border-slate-800 rounded-full px-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 shadow-inner"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-3 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:scale-105 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
