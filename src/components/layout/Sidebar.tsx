import { History, Trash2, Save, Diamond } from 'lucide-react';
import type { HistoryItem } from '../../types';

interface SidebarProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  onRemoveItem: (id: string) => void;
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function getTypeIcon(type: string): string {
  switch (type) {
    case 'password': return '🔐';
    case 'hash': return '#️⃣';
    case 'encoded': return '🔄';
    case 'uuid': return '🆔';
    default: return '📄';
  }
}

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + '...' : str;
}

export function Sidebar({ history, onClearHistory, onRemoveItem }: SidebarProps) {
  return (
    <aside className="w-72 bg-gray-900 border-r border-gray-800 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Diamond size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Milidia</h1>
            <p className="text-xs text-gray-500">Security Tools</p>
          </div>
        </div>
      </div>

      {/* Templates */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 mb-3">
          <Save size={14} />
          Templates
        </div>
        <p className="text-xs text-gray-600 mb-2">Apply a Template</p>
        <div className="bg-gray-800 rounded-lg px-3 py-2 text-sm text-gray-400 border border-gray-700">
          None
        </div>
      </div>

      {/* History */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-400">
            <History size={14} />
            History
          </div>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-900/20 transition-all"
              title="Clear all history"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          {history.length === 0 ? (
            <p className="text-xs text-gray-600 text-center py-8">No history yet</p>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="group bg-gray-800/50 border border-gray-700/50 rounded-lg p-3 hover:border-gray-600 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs">{getTypeIcon(item.type)}</span>
                  <span className="text-[10px] text-gray-600">{formatTime(item.timestamp)}</span>
                </div>
                <code className="text-xs text-gray-300 font-mono block break-all">
                  {truncate(item.value, 28)}
                </code>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-gray-600">
                    {(item.metadata.algorithm as string) || item.type}
                  </span>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-600 hover:text-red-400 transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Saved Configs */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 mb-3">
          <Save size={14} />
          Saved Configs
        </div>
        <p className="text-xs text-gray-600 mb-2">Template Name</p>
        <div className="bg-gray-800 rounded-lg px-3 py-2 text-sm text-gray-500 border border-gray-700">
          e.g., My Profile
        </div>
      </div>
    </aside>
  );
}
