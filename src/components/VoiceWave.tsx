import React from 'react';
import { motion } from 'motion/react';

interface VoiceWaveProps {
  isSpeaking: boolean;
  isListening: boolean;
}

export const VoiceWave: React.FC<VoiceWaveProps> = ({ isSpeaking, isListening }) => {
  const bars = [16, 28, 45, 20, 60, 35, 80, 50, 90, 40, 75, 30, 65, 25, 55, 20, 40, 15];

  return (
    <div className="flex items-center justify-center gap-1 h-12 my-2 px-4">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          className={`w-1 rounded-full ${
            isSpeaking
              ? 'bg-gradient-to-t from-pink-500 via-purple-500 to-cyan-400 shadow-[0_0_8px_#ec4899]'
              : isListening
              ? 'bg-gradient-to-t from-cyan-400 to-blue-600 shadow-[0_0_8px_#38bdf8]'
              : 'bg-indigo-900/60'
          }`}
          animate={
            isSpeaking || isListening
              ? {
                  height: [
                    `${Math.max(8, height * 0.2)}px`,
                    `${Math.min(48, height * (isSpeaking ? 0.9 : 0.6))}px`,
                    `${Math.max(8, height * 0.25)}px`,
                  ],
                }
              : { height: '8px' }
          }
          transition={{
            repeat: Infinity,
            duration: 0.6 + (i % 4) * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
