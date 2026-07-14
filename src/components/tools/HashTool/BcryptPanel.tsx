import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { HistoryItem } from '../../../types';
import { useBcrypt } from '../../../hooks/useBcrypt';
import { CopyButton } from '../../shared/CopyButton';

interface BcryptPanelProps {
  onGenerate: (item: HistoryItem) => void;
}

const COST_LABELS: Record<number, string> = {
  4: 'Fast (testing only)',
  6: 'Low',
  8: 'Moderate',
  10: 'Standard',
  12: 'Secure',
  14: 'High security',
  16: 'Paranoid',
};

export function BcryptPanel({ onGenerate }: BcryptPanelProps) {
  const [input, setInput] = useState('');
  const [costFactor, setCostFactor] = useState(12);
  const [output, setOutput] = useState('');
  const [base64Output, setBase64Output] = useState(false);
  const { hash, isWorking } = useBcrypt();

  const handleHash = async () => {
    if (!input.trim()) return;
    let result = await hash(input, costFactor);
    if (base64Output) {
      result = btoa(result);
    }
    setOutput(result);
    onGenerate({
      value: result,
      type: 'hash',
      metadata: { algorithm: 'bcrypt', costFactor, inputLength: input.length, base64Output },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-gray-300 mb-2 block">
          Password / String to Hash
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter password to hash..."
          className="input-field"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-300">Cost Factor (Rounds)</label>
          <span className="text-sm font-mono font-semibold text-blue-400 bg-blue-900/30 px-3 py-1 rounded-lg">
            {costFactor} — {COST_LABELS[costFactor] || 'Custom'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCostFactor(Math.max(4, costFactor - 1))}
            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            -
          </button>
          <input
            type="range"
            min={4}
            max={16}
            step={1}
            value={costFactor}
            onChange={(e) => setCostFactor(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-800 rounded-full appearance-none cursor-pointer accent-blue-500"
          />
          <button
            onClick={() => setCostFactor(Math.min(16, costFactor + 1))}
            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            +
          </button>
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>4 (fast)</span>
          <span>16 (slow)</span>
        </div>
      </div>

      <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-700/50 bg-gray-800/30 cursor-pointer hover:border-gray-600 transition-all">
        <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
          base64Output ? 'bg-blue-500 text-white' : 'bg-gray-700 border border-gray-600'
        }`}>
          {base64Output && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
        </div>
        <input
          type="checkbox"
          checked={base64Output}
          onChange={(e) => { setBase64Output(e.target.checked); setOutput(''); }}
          className="sr-only"
        />
        <div>
          <div className="text-sm font-medium text-gray-300">Base64 Output</div>
          <div className="text-xs text-gray-500">Encode the bcrypt hash as Base64</div>
        </div>
      </label>

      <div className="warning-box">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
          <div className="text-yellow-200/80">
            <strong className="text-yellow-400">Client-side only.</strong> This hashes entirely in your browser — 
            no data is sent to any server. For production systems, always hash passwords server-side with a proper backend.
          </div>
        </div>
      </div>

      <button
        onClick={handleHash}
        disabled={!input.trim() || isWorking}
        className="btn-primary w-full"
      >
        {isWorking ? 'Hashing...' : 'Generate Bcrypt Hash'}
      </button>

      {output && (
        <div className="output-item">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">bcrypt</span>
              {base64Output && (
                <span className="text-[10px] bg-blue-900/50 text-blue-400 px-2 py-0.5 rounded">Base64</span>
              )}
            </div>
            <code className="font-mono text-sm text-white break-all block">{output}</code>
          </div>
          <CopyButton text={output} />
        </div>
      )}
    </div>
  );
}
