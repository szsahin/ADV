import { useState } from 'react';
import type { HistoryItem } from '../../../types';
import { useBase64 } from '../../../hooks/useBase64';
import { CopyButton } from '../../shared/CopyButton';

interface Base64PanelProps {
  onGenerate: (item: HistoryItem) => void;
}

export function Base64Panel({ onGenerate }: Base64PanelProps) {
  const [input, setInput] = useState('');
  const [direction, setDirection] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const { encode, decode } = useBase64();

  const handleConvert = () => {
    setError('');
    try {
      const result = direction === 'encode' ? encode(input) : decode(input);
      setOutput(result);
      onGenerate({
        value: result,
        type: 'encoded',
        metadata: { algorithm: 'base64', direction, inputLength: input.length },
      });
    } catch (err) {
      setError(
        direction === 'decode'
          ? 'Invalid Base64 string. Check for correct padding and characters (A-Z, a-z, 0-9, +, /, =).'
          : 'Encoding failed. Input may contain characters unsupported by standard Base64.'
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex bg-gray-800 rounded-xl p-1">
        <button
          onClick={() => { setDirection('encode'); setError(''); setOutput(''); }}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            direction === 'encode'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Encode → Base64
        </button>
        <button
          onClick={() => { setDirection('decode'); setError(''); setOutput(''); }}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            direction === 'decode'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Decode ← Base64
        </button>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-300 mb-2 block">
          {direction === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
        </label>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(''); }}
          rows={5}
          placeholder={direction === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string...'}
          className="input-field-mono resize-y"
        />
      </div>

      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      <button
        onClick={handleConvert}
        disabled={!input.trim()}
        className="btn-emerald w-full"
      >
        {direction === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
      </button>

      {output && (
        <div className="output-item">
          <code className="flex-1 font-mono text-sm text-white break-all">{output}</code>
          <CopyButton text={output} />
        </div>
      )}
    </div>
  );
}
