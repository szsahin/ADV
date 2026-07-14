import { useState } from 'react';
import { Hash } from 'lucide-react';
import { BcryptPanel } from './BcryptPanel';
import { SHA256Panel } from './SHA256Panel';
import { Argon2Panel } from './Argon2Panel';
import type { HistoryItem } from '../../../types';

const HASH_ALGORITHMS = [
  { id: 'bcrypt', label: 'Bcrypt', description: 'Adaptive cost hashing\n(best for passwords)' },
  { id: 'sha', label: 'SHA / MD5', description: 'Fast cryptographic hashes\nwith Base64 output option' },
  { id: 'argon2id', label: 'Argon2id', description: 'Modern memory-hard hash\n(recommended)' },
];

interface HashToolProps {
  onGenerate: (item: HistoryItem) => void;
}

export function HashTool({ onGenerate }: HashToolProps) {
  const [algorithm, setAlgorithm] = useState('bcrypt');

  return (
    <div className="tool-panel animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
          <Hash size={28} className="text-blue-400" />
          Hash Generator
        </h2>
        <p className="text-gray-400 italic">Hash passwords and strings with modern algorithms.</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {HASH_ALGORITHMS.map((algo) => (
          <button
            key={algo.id}
            onClick={() => setAlgorithm(algo.id)}
            className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
              algorithm === algo.id
                ? 'algorithm-card-active'
                : 'algorithm-card-inactive'
            }`}
          >
            <div className={`font-semibold mb-1 ${algorithm === algo.id ? 'text-blue-400' : 'text-gray-300'}`}>
              {algo.label}
            </div>
            <div className={`text-xs whitespace-pre-line ${algorithm === algo.id ? 'text-blue-300/70' : 'text-gray-500'}`}>
              {algo.description}
            </div>
          </button>
        ))}
      </div>

      <div className="card">
        {algorithm === 'bcrypt' && <BcryptPanel onGenerate={onGenerate} />}
        {algorithm === 'sha' && <SHA256Panel onGenerate={onGenerate} />}
        {algorithm === 'argon2id' && <Argon2Panel onGenerate={onGenerate} />}
      </div>
    </div>
  );
}
