import { useState } from 'react';
import { AlertTriangle, Hash } from 'lucide-react';
import type { HistoryItem } from '../../../types';
import { CopyButton } from '../../shared/CopyButton';

interface SHA256PanelProps {
  onGenerate: (item: HistoryItem) => void;
}

const ALGORITHMS = [
  { id: 'SHA-1', label: 'SHA-1', description: 'Legacy (160-bit)' },
  { id: 'SHA-256', label: 'SHA-256', description: 'Standard (256-bit)' },
  { id: 'SHA-384', label: 'SHA-384', description: 'Medium (384-bit)' },
  { id: 'SHA-512', label: 'SHA-512', description: 'Maximum (512-bit)' },
  { id: 'MD5', label: 'MD5', description: 'Legacy (128-bit)' },
];

async function computeHash(algorithm: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);

  if (algorithm === 'MD5') {
    // MD5 via custom implementation since Web Crypto doesn't support it
    return md5(message);
  }

  const webCryptoAlgo = algorithm.replace('-', '-');
  const hashBuffer = await crypto.subtle.digest(webCryptoAlgo as AlgorithmIdentifier, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// MD5 implementation
function md5(input: string): string {
  const hc = '0123456789abcdef';
  function rh(n: number) { let j, s = ''; for (j = 0; j <= 3; j++) s += hc.charAt((n >> (j * 8 + 4)) & 0x0F) + hc.charAt((n >> (j * 8)) & 0x0F); return s; }
  function ad(x: number, y: number) { const l = (x & 0xFFFF) + (y & 0xFFFF); const m = (x >> 16) + (y >> 16) + (l >> 16); return (m << 16) | (l & 0xFFFF); }
  function rl(n: number, c: number) { return (n << c) | (n >>> (32 - c)); }
  function cm(q: number, a: number, b: number, x: number, s: number, t: number) { return ad(rl(ad(ad(a, q), ad(x, t)), s), b); }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cm((b & c) | ((~b) & d), a, b, x, s, t); }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cm((b & d) | (c & (~d)), a, b, x, s, t); }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cm(b ^ c ^ d, a, b, x, s, t); }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cm(c ^ (b | (~d)), a, b, x, s, t); }

  const x = str2blks(input);
  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;

  for (let i = 0; i < x.length; i += 16) {
    const olda = a, oldb = b, oldc = c, oldd = d;
    a = ff(a, b, c, d, x[i + 0], 7, -680876936);
    d = ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = ff(c, d, a, b, x[i + 10], 17, -42063);
    b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = gg(b, c, d, a, x[i + 0], 20, -373897302);
    a = gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = hh(a, b, c, d, x[i + 5], 4, -378558);
    d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = hh(d, a, b, c, x[i + 0], 11, -358537222);
    c = hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = ii(a, b, c, d, x[i + 0], 6, -198630844);
    d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = ad(a, olda);
    b = ad(b, oldb);
    c = ad(c, oldc);
    d = ad(d, oldd);
  }
  return rh(a) + rh(b) + rh(c) + rh(d);
}

function str2blks(input: string): number[] {
  const nblk = ((input.length + 8) >> 6) + 1;
  const blks: number[] = new Array(nblk * 16);
  for (let i = 0; i < nblk * 16; i++) blks[i] = 0;
  for (let i = 0; i < input.length; i++) {
    blks[i >> 2] |= input.charCodeAt(i) << ((i % 4) * 8);
  }
  blks[input.length >> 2] |= 0x80 << ((input.length % 4) * 8);
  blks[nblk * 16 - 2] = input.length * 8;
  return blks;
}

export function SHA256Panel({ onGenerate }: SHA256PanelProps) {
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState('SHA-256');
  const [base64Output, setBase64Output] = useState(false);
  const [salt, setSalt] = useState('');
  const [output, setOutput] = useState('');
  const [isWorking, setIsWorking] = useState(false);

  const handleHash = async () => {
    setIsWorking(true);
    const dataToHash = salt ? salt + input : input;
    let result = await computeHash(algorithm, dataToHash);

    if (base64Output) {
      // Convert hex to bytes, then to base64
      const bytes = new Uint8Array(result.length / 2);
      for (let i = 0; i < result.length; i += 2) {
        bytes[i / 2] = parseInt(result.slice(i, i + 2), 16);
      }
      result = btoa(String.fromCharCode(...bytes));
    }

    setOutput(result);
    setIsWorking(false);
    onGenerate({
      value: result,
      type: 'hash',
      metadata: { algorithm, inputLength: input.length, base64Output, salted: !!salt },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-gray-300 mb-2 block">
          String to Hash
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to hash..."
          rows={4}
          className="input-field-mono resize-y"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-300 mb-2 block">Algorithm</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ALGORITHMS.map((algo) => (
            <button
              key={algo.id}
              onClick={() => { setAlgorithm(algo.id); setOutput(''); }}
              className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                algorithm === algo.id
                  ? 'border-blue-500 bg-blue-900/20'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
            >
              <div className={`font-semibold text-sm ${algorithm === algo.id ? 'text-blue-400' : 'text-gray-300'}`}>
                {algo.label}
              </div>
              <div className={`text-[10px] ${algorithm === algo.id ? 'text-blue-300/60' : 'text-gray-600'}`}>
                {algo.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-300">Salt (optional)</label>
          <button
            onClick={() => {
              const randomSalt = Array.from(crypto.getRandomValues(new Uint8Array(16)))
                .map(b => b.toString(16).padStart(2, '0')).join('');
              setSalt(randomSalt);
              setOutput('');
            }}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            Generate Random Salt
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={salt}
            onChange={(e) => { setSalt(e.target.value); setOutput(''); }}
            placeholder="Enter salt or generate one..."
            className="input-field font-mono text-sm"
          />
          {salt && (
            <button
              onClick={() => { setSalt(''); setOutput(''); }}
              className="px-3 py-2 rounded-xl bg-gray-800 text-gray-500 hover:text-red-400 hover:bg-red-900/20 transition-all"
              title="Clear salt"
            >
              ×
            </button>
          )}
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Salt is prepended to input before hashing: hash(salt + input)
        </p>
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
          <div className="text-xs text-gray-500">Encode the hash result as Base64 instead of hex</div>
        </div>
      </label>

      <div className="warning-box">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
          <div className="text-yellow-200/80">
            <strong className="text-yellow-400">Not for password storage.</strong>{' '}
            {algorithm === 'MD5' && <span className="text-red-400 font-semibold">MD5 is cryptographically broken. </span>}
            These are fast hashes unsuitable for password storage. Use Bcrypt or Argon2id for passwords.
          </div>
        </div>
      </div>

      <button
        onClick={handleHash}
        disabled={isWorking}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <Hash size={18} />
        {isWorking ? 'Hashing...' : `Generate ${algorithm} Hash`}
      </button>

      {output && (
        <div className="output-item">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-yellow-400">
                {algorithm}
              </span>
              {salt && (
                <span className="text-[10px] bg-emerald-900/50 text-emerald-400 px-2 py-0.5 rounded">Salted</span>
              )}
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
