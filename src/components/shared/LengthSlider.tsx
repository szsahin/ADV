import { Minus, Plus } from 'lucide-react';

interface LengthSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
}

export function LengthSlider({ value, onChange, min = 4, max = 128, label = 'Length' }: LengthSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <span className="text-sm font-mono font-semibold text-blue-400 bg-blue-900/30 px-3 py-1 rounded-lg">
          {value}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
        >
          <Minus size={16} />
        </button>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-2 bg-gray-800 rounded-full appearance-none cursor-pointer accent-blue-500"
        />
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
