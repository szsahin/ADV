import { Copy, Trash2, Download, Clock } from 'lucide-react';
import type { HistoryItem } from '../../types';
import { CopyButton } from '../shared/CopyButton';

interface OutputPanelProps {
  outputs: HistoryItem[];
  onClear: () => void;
}

function getTypeLabel(type: string): string {
  switch (type) {
    case 'password': return 'password';
    case 'hash': return 'hash';
    case 'encoded': return 'encoded';
    case 'uuid': return 'uuid';
    default: return type;
  }
}

function getTypeColor(type: string): string {
  switch (type) {
    case 'password': return 'text-blue-400';
    case 'hash': return 'text-yellow-400';
    case 'encoded': return 'text-emerald-400';
    case 'uuid': return 'text-purple-400';
    default: return 'text-gray-400';
  }
}

export function OutputPanel({ outputs, onClear }: OutputPanelProps) {
  if (outputs.length === 0) return null;

  const latest = outputs[0];

  return (
    <div className="border-t border-gray-800 bg-gray-900/50 px-6 py-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-400">
          <Clock size={14} />
          Latest Output
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const text = outputs.map(o => o.value).join('\n');
              const blob = new Blob([text], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'milidia-output.txt';
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="p-2 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-900/20 transition-all"
            title="Download all"
          >
            <Download size={16} />
          </button>
          <button
            onClick={onClear}
            className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-900/20 transition-all"
            title="Clear all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="output-item">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold uppercase tracking-wider ${getTypeColor(latest.type)}`}>
              {getTypeLabel(latest.type)}
            </span>
            <span className="text-xs text-gray-600">
              {new Date(latest.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <code className="text-sm font-mono text-white break-all block">
            {latest.value}
          </code>
        </div>
        <CopyButton text={latest.value} />
      </div>

      {outputs.length > 1 && (
        <p className="text-xs text-gray-600 mt-2 text-center">
          + {outputs.length - 1} more in history
        </p>
      )}
    </div>
  );
}
