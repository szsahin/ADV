import { Shield, Clock } from 'lucide-react';
import type { ReactNode } from 'react';

interface EntropyDisplayProps {
  bits: number;
  crackTime: string;
  strength: string;
}

const STRENGTH_CONFIG: Record<string, { color: string; label: string; icon: ReactNode }> = {
  'weak': { color: 'text-red-400', label: 'Weak', icon: <Shield size={14} className="text-red-400" /> },
  'fair': { color: 'text-yellow-400', label: 'Fair', icon: <Shield size={14} className="text-yellow-400" /> },
  'good': { color: 'text-blue-400', label: 'Good', icon: <Shield size={14} className="text-blue-400" /> },
  'strong': { color: 'text-emerald-400', label: 'Strong', icon: <Shield size={14} className="text-emerald-400" /> },
  'very-strong': { color: 'text-emerald-300', label: 'Very Strong', icon: <Shield size={14} className="text-emerald-300" /> },
};

export function EntropyDisplay({ bits, crackTime, strength }: EntropyDisplayProps) {
  const config = STRENGTH_CONFIG[strength] || STRENGTH_CONFIG['weak'];
  const percentage = Math.min((bits / 128) * 100, 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1.5 text-gray-300">
          <Shield size={14} />
          Entropy: <span className="font-mono font-semibold text-blue-400">{bits.toFixed(2)} bits</span>
        </span>
        <span className="text-gray-600">|</span>
        <span className="flex items-center gap-1.5 text-gray-300">
          <Clock size={14} />
          Crack Time: <span className="font-mono font-semibold text-blue-400">{crackTime}</span>
        </span>
        <span className="text-gray-600">|</span>
        <span className="flex items-center gap-1.5">
          {config.icon}
          <span className={`font-semibold ${config.color}`}>{config.label}</span>
        </span>
      </div>

      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: strength === 'weak' ? '#ef4444' : 
                           strength === 'fair' ? '#eab308' :
                           strength === 'good' ? '#3b82f6' :
                           strength === 'strong' ? '#10b981' : '#34d399'
          }}
        />
      </div>
    </div>
  );
}
