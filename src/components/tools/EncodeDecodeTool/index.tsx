import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { Base64Panel } from './Base64Panel';
import { HexPanel } from './HexPanel';
import { URLPanel } from './URLPanel';
import type { HistoryItem } from '../../../types';

const ENCODE_ALGORITHMS = [
  { id: 'base64', label: 'Base64', description: 'Binary-to-text encoding' },
  { id: 'hex', label: 'Hexadecimal', description: 'Base-16 representation' },
  { id: 'url', label: 'URL Encode', description: 'Percent-encoding for URLs' },
];

interface EncodeDecodeToolProps {
  onGenerate: (item: HistoryItem) => void;
}

export function EncodeDecodeTool({ onGenerate }: EncodeDecodeToolProps) {
  const [algorithm, setAlgorithm] = useState('base64');

  return (
    <div className="tool-panel animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
          <ArrowLeftRight size={28} className="text-emerald-400" />
          Encode / Decode
        </h2>
        <p className="text-gray-400 italic">Convert text between different encoding formats.</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {ENCODE_ALGORITHMS.map((algo) => (
          <button
            key={algo.id}
            onClick={() => setAlgorithm(algo.id)}
            className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
              algorithm === algo.id
                ? 'border-emerald-500 bg-emerald-900/20'
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
            }`}
          >
            <div className={`font-semibold mb-1 ${algorithm === algo.id ? 'text-emerald-400' : 'text-gray-300'}`}>
              {algo.label}
            </div>
            <div className={`text-xs ${algorithm === algo.id ? 'text-emerald-300/70' : 'text-gray-500'}`}>
              {algo.description}
            </div>
          </button>
        ))}
      </div>

      <div className="card">
        {algorithm === 'base64' && <Base64Panel onGenerate={onGenerate} />}
        {algorithm === 'hex' && <HexPanel onGenerate={onGenerate} />}
        {algorithm === 'url' && <URLPanel onGenerate={onGenerate} />}
      </div>
    </div>
  );
}
