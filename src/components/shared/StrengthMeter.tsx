import { Shield } from 'lucide-react';

interface StrengthMeterProps {
  strength: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';
}

const CONFIG = {
  'weak': { color: 'bg-red-500', text: 'text-red-400', label: 'Weak' },
  'fair': { color: 'bg-yellow-500', text: 'text-yellow-400', label: 'Fair' },
  'good': { color: 'bg-blue-500', text: 'text-blue-400', label: 'Good' },
  'strong': { color: 'bg-emerald-500', text: 'text-emerald-400', label: 'Strong' },
  'very-strong': { color: 'bg-emerald-400', text: 'text-emerald-300', label: 'Very Strong' },
};

export function StrengthMeter({ strength }: StrengthMeterProps) {
  const config = CONFIG[strength];
  const levels = ['weak', 'fair', 'good', 'strong', 'very-strong'];
  const currentIndex = levels.indexOf(strength);

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {levels.map((level, i) => (
          <div
            key={level}
            className={`w-6 h-2 rounded-full transition-all duration-300 ${
              i <= currentIndex ? config.color : 'bg-gray-700'
            }`}
          />
        ))}
      </div>
      <span className={`text-xs font-semibold flex items-center gap-1 ${config.text}`}>
        <Shield size={12} />
        {config.label}
      </span>
    </div>
  );
}
