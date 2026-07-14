import { Check } from 'lucide-react';

interface CheckboxOption {
  id: string;
  label: string;
  checked: boolean;
}

interface CheckboxGroupProps {
  options: CheckboxOption[];
  onChange: (id: string, checked: boolean) => void;
  columns?: number;
}

export function CheckboxGroup({ options, onChange, columns = 2 }: CheckboxGroupProps) {
  return (
    <div className={`grid gap-3 ${columns === 2 ? 'grid-cols-2' : columns === 3 ? 'grid-cols-3' : 'grid-cols-1'}`}>
      {options.map((option) => (
        <label
          key={option.id}
          className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
            option.checked
              ? 'border-blue-500/50 bg-blue-900/20'
              : 'border-gray-700/50 bg-gray-800/30 hover:border-gray-600'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 ${
              option.checked
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 border border-gray-600'
            }`}
          >
            {option.checked && <Check size={14} strokeWidth={3} />}
          </div>
          <input
            type="checkbox"
            checked={option.checked}
            onChange={(e) => onChange(option.id, e.target.checked)}
            className="sr-only"
          />
          <span className={`text-sm font-medium ${option.checked ? 'text-blue-300' : 'text-gray-400'}`}>
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}
