import { useState } from 'react';
import { Fingerprint, RefreshCw } from 'lucide-react';
import type { HistoryItem } from '../../../types';
import { CopyButton } from '../../shared/CopyButton';

interface UUIDToolProps {
  onGenerate: (item: HistoryItem) => void;
}

function generateUUIDv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateUUIDv7(): string {
  const timestamp = Date.now();
  const timeHex = timestamp.toString(16).padStart(12, '0');
  const randomBytes = new Uint8Array(10);
  crypto.getRandomValues(randomBytes);

  const hex = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');

  return `${timeHex.slice(0, 8)}-${timeHex.slice(8)}-7${hex.slice(0, 3)}-${hex.slice(3, 7)}-${hex.slice(7)}`;
}

export function UUIDTool({ onGenerate }: UUIDToolProps) {
  const [version, setVersion] = useState<'v4' | 'v7'>('v4');
  const [count, setCount] = useState(1);
  const [generated, setGenerated] = useState<string[]>([]);

  const handleGenerate = () => {
    const generator = version === 'v4' ? generateUUIDv4 : generateUUIDv7;
    const uuids = Array.from({ length: count }, () => generator());
    setGenerated(uuids);
    uuids.forEach((uuid) => {
      onGenerate({
        value: uuid,
        type: 'uuid',
        metadata: { version, count },
      });
    });
  };

  return (
    <div className="tool-panel animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
          <Fingerprint size={28} className="text-purple-400" />
          UUID Generator
        </h2>
        <p className="text-gray-400 italic">Generate universally unique identifiers.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <button
          onClick={() => setVersion('v4')}
          className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
            version === 'v4'
              ? 'border-purple-500 bg-purple-900/20'
              : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
          }`}
        >
          <div className={`font-semibold mb-1 ${version === 'v4' ? 'text-purple-400' : 'text-gray-300'}`}>
            UUID v4
          </div>
          <div className={`text-xs ${version === 'v4' ? 'text-purple-300/70' : 'text-gray-500'}`}>
            Random-based UUID. 122 bits of randomness. Best for most use cases.
          </div>
        </button>
        <button
          onClick={() => setVersion('v7')}
          className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
            version === 'v7'
              ? 'border-purple-500 bg-purple-900/20'
              : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
          }`}
        >
          <div className={`font-semibold mb-1 ${version === 'v7' ? 'text-purple-400' : 'text-gray-300'}`}>
            UUID v7
          </div>
          <div className={`text-xs ${version === 'v7' ? 'text-purple-300/70' : 'text-gray-500'}`}>
            Time-ordered UUID. Contains timestamp prefix. Better for database indexing.
          </div>
        </button>
      </div>

      <div className="card space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">Quantity</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCount(Math.max(1, count - 1))}
              className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              -
            </button>
            <span className="text-lg font-mono font-semibold text-purple-400 w-12 text-center">{count}</span>
            <button
              onClick={() => setCount(Math.min(100, count + 1))}
              className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <button onClick={handleGenerate} className="btn-primary w-full flex items-center justify-center gap-2">
          <RefreshCw size={18} />
          Generate {count > 1 ? `${count} UUIDs` : 'UUID'}
        </button>

        {generated.length > 0 && (
          <div className="space-y-2">
            {generated.map((uuid, i) => (
              <div key={i} className="output-item">
                <span className="text-xs text-purple-400 font-mono w-8">{i + 1}.</span>
                <code className="flex-1 font-mono text-sm text-white">{uuid}</code>
                <CopyButton text={uuid} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
