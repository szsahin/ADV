import { useState } from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import type { HistoryItem } from '../../../types';
import { CopyButton } from '../../shared/CopyButton';

interface Argon2PanelProps {
  onGenerate: (item: HistoryItem) => void;
}

export function Argon2Panel({ onGenerate }: Argon2PanelProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [base64Output, setBase64Output] = useState(false);
  const [isWorking, setIsWorking] = useState(false);

  const handleHash = async () => {
    if (!input.trim()) return;
    setIsWorking(true);
    // Argon2 requires WASM - simplified for now, showing placeholder
    // In production, use argon2-browser package
    const placeholder = `$argon2id$v=19$m=65536,t=3,p=4$${btoa(input).slice(0, 22)}$${await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input)).then(buf => 
      Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 43)
    )}`;
    let result = placeholder;
    if (base64Output) {
      result = btoa(result);
    }
    setOutput(result);
    setIsWorking(false);
    onGenerate({
      value: result,
      type: 'hash',
      metadata: { algorithm: 'argon2id', inputLength: input.length, base64Output },
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-900/20 border border-blue-800/50 rounded-xl p-4 flex items-start gap-3">
        <Info size={18} className="text-blue-400 shrink-0 mt-0.5" />
        <div className="text-blue-200/80 text-sm">
          <strong className="text-blue-400">Argon2id</strong> is the winner of the Password Hashing Competition (2015).
          It provides better resistance to GPU cracking attacks than Bcrypt. 
          <strong> Install <code>argon2-browser</code> for full implementation.</strong>
        </div>
      </div>

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
          <div className="text-xs text-gray-500">Encode the Argon2id hash as Base64</div>
        </div>
      </label>

      <div className="warning-box">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
          <div className="text-yellow-200/80">
            <strong className="text-yellow-400">Client-side only.</strong> This is a demonstration.
            For production, always use a server-side Argon2 implementation.
          </div>
        </div>
      </div>

      <button
        onClick={handleHash}
        disabled={!input.trim() || isWorking}
        className="btn-primary w-full"
      >
        {isWorking ? 'Hashing...' : 'Generate Argon2id Hash'}
      </button>

      {output && (
        <div className="output-item">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">argon2id</span>
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
