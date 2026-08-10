import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, X, Check, Lock } from 'lucide-react';
import { AppPermissions } from '../types';

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  permissions: AppPermissions;
  onTogglePermission: (key: keyof AppPermissions) => void;
}

export const PermissionsModal: React.FC<PermissionsModalProps> = ({
  isOpen,
  onClose,
  permissions,
  onTogglePermission,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg bg-slate-900 border border-pink-500/30 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-slate-100">All Permissions Enabled</h3>
              <p className="text-xs text-pink-300">100% Control With Your Permission</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {(Object.keys(permissions) as (keyof AppPermissions)[]).map((key) => (
            <div
              key={key}
              className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-slate-200 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                <div className="text-[10px] text-slate-400">Granted for seamless DIGUU AI execution</div>
              </div>

              <button
                onClick={() => onTogglePermission(key)}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  permissions[key] ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                }`}
              >
                <Check className="w-4 h-4 font-black" />
              </button>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold shadow-lg"
          >
            Save & Confirm Permissions
          </button>
        </div>
      </motion.div>
    </div>
  );
};
