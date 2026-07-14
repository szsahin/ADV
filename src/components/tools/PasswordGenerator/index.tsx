import { useState, useCallback } from 'react';
import { Shield, Sparkles, BookOpen, Upload, Download } from 'lucide-react';
import type { HistoryItem } from '../../../types';
import { usePasswordGenerator } from '../../../hooks/usePasswordGenerator';
import { useEntropy } from '../../../hooks/useEntropy';
import { LengthSlider } from '../../shared/LengthSlider';
import { CheckboxGroup } from '../../shared/CheckboxGroup';
import { EntropyDisplay } from '../../shared/EntropyDisplay';
import { CopyButton } from '../../shared/CopyButton';
import { COMMON_WORDS, EFF_WORDS, getRandomWords } from '../../../lib/wordlists';

type GenerationMode = 'character' | 'passphrase';
type SeparatorType = 'character' | 'random' | 'both';
type Capitalization = 'none' | 'first' | 'random' | 'random-char';

interface PasswordGeneratorProps {
  onGenerate: (item: HistoryItem) => void;
}

function generateRandomNumber(length: number): string {
  const digits = '0123456789';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array).map(n => digits[n % 10]).join('');
}

function applyCapitalization(words: string[], style: Capitalization): string[] {
  if (style === 'none') return words;
  if (style === 'first') return words.map(w => w.charAt(0).toUpperCase() + w.slice(1));
  if (style === 'random') {
    return words.map(w => {
      const array = new Uint8Array(1);
      crypto.getRandomValues(array);
      return array[0] % 2 === 0 ? w.toUpperCase() : w;
    });
  }
  if (style === 'random-char') {
    return words.map(w => {
      return w.split('').map(c => {
        const array = new Uint8Array(1);
        crypto.getRandomValues(array);
        return array[0] % 2 === 0 ? c.toUpperCase() : c.toLowerCase();
      }).join('');
    });
  }
  return words;
}

function buildPassphrase(
  words: string[],
  separatorType: SeparatorType,
  separatorChar: string,
  randomNumberLength: number
): string {
  if (separatorType === 'character') {
    return words.join(separatorChar);
  }

  if (separatorType === 'random') {
    return words.map(w => w + generateRandomNumber(randomNumberLength)).join('');
  }

  // both: character + random numbers
  return words.map(w => w + generateRandomNumber(randomNumberLength)).join(separatorChar);
}

export function PasswordGenerator({ onGenerate }: PasswordGeneratorProps) {
  const [mode, setMode] = useState<GenerationMode>('character');

  // Character mode state
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [digits, setDigits] = useState(true);
  const [special, setSpecial] = useState(false);
  const [customCharset, setCustomCharset] = useState('');

  // Passphrase mode state
  const [wordCount, setWordCount] = useState(4);
  const [wordlistSource, setWordlistSource] = useState<'builtin' | 'eff'>('eff');
  const [customWordlist, setCustomWordlist] = useState<string[]>([]);
  const [separatorType, setSeparatorType] = useState<SeparatorType>('character');
  const [separatorChar, setSeparatorChar] = useState('-');
  const [randomNumberLength, setRandomNumberLength] = useState(2);
  const [capitalization, setCapitalization] = useState<Capitalization>('none');

  // Shared state
  const [batchSize, setBatchSize] = useState(1);
  const [generated, setGenerated] = useState<string[]>([]);

  const { generatePasswords } = usePasswordGenerator();
  const { bits, crackTime, strength } = useEntropy(length, uppercase, lowercase, digits, special, customCharset);

  const getWordlist = useCallback((): string[] => {
    if (customWordlist.length > 0) return customWordlist;
    return wordlistSource === 'eff' ? EFF_WORDS : COMMON_WORDS;
  }, [customWordlist, wordlistSource]);

  const calculatePassphraseEntropy = useCallback((): number => {
    const wordlist = getWordlist();
    const wordEntropy = Math.log2(wordlist.length);
    let separatorEntropy = 0;

    if (separatorType === 'random' || separatorType === 'both') {
      separatorEntropy = wordCount * Math.log2(Math.pow(10, randomNumberLength));
    }

    let capEntropy = 0;
    if (capitalization === 'first') capEntropy = wordCount;
    if (capitalization === 'random') capEntropy = wordCount;

    return wordCount * wordEntropy + separatorEntropy + capEntropy;
  }, [getWordlist, wordCount, separatorType, randomNumberLength, capitalization]);

  const handleGenerate = () => {
    if (mode === 'character') {
      const passwords = generatePasswords(length, uppercase, lowercase, digits, special, customCharset, batchSize);
      setGenerated(passwords);
      passwords.forEach((pwd) => {
        onGenerate({
          value: pwd,
          type: 'password',
          metadata: { mode: 'character', length, uppercase, lowercase, digits, special, entropy: bits },
        });
      });
    } else {
      const wordlist = getWordlist();
      const passwords: string[] = [];

      for (let i = 0; i < batchSize; i++) {
        const words = getRandomWords(wordlist, wordCount);
        const capitalized = applyCapitalization(words, capitalization);
        const passphrase = buildPassphrase(capitalized, separatorType, separatorChar, randomNumberLength);
        passwords.push(passphrase);
      }

      setGenerated(passwords);
      const entropy = calculatePassphraseEntropy();
      passwords.forEach((pwd) => {
        onGenerate({
          value: pwd,
          type: 'password',
          metadata: { mode: 'passphrase', wordCount, wordlistSize: wordlist.length, separatorType, entropy },
        });
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const words = text.split(/\r?\n/).map(w => w.trim()).filter(w => w.length > 0);
      setCustomWordlist(words);
      setWordlistSource('builtin');
    };
    reader.readAsText(file);
  };

  const downloadEffWordlist = () => {
    const blob = new Blob([EFF_WORDS.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'eff_large_wordlist.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const checkboxOptions = [
    { id: 'uppercase', label: 'Uppercase Letters', checked: uppercase },
    { id: 'lowercase', label: 'Lowercase Letters', checked: lowercase },
    { id: 'digits', label: 'Numeric Digits', checked: digits },
    { id: 'special', label: 'Special Characters', checked: special },
  ];

  const handleCheckboxChange = (id: string, checked: boolean) => {
    switch (id) {
      case 'uppercase': setUppercase(checked); break;
      case 'lowercase': setLowercase(checked); break;
      case 'digits': setDigits(checked); break;
      case 'special': setSpecial(checked); break;
    }
  };

  const currentWordlist = getWordlist();
  const passphraseEntropy = calculatePassphraseEntropy();

  return (
    <div className="tool-panel animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
          <Shield size={28} className="text-blue-400" />
          Advanced Password Generator
        </h2>
        <p className="text-gray-400 italic">A modular, high-entropy security tool.</p>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button
          onClick={() => { setMode('character'); setGenerated([]); }}
          className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
            mode === 'character'
              ? 'border-blue-500 bg-blue-900/20'
              : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
          }`}
        >
          <div className={`font-semibold mb-1 ${mode === 'character' ? 'text-blue-400' : 'text-gray-300'}`}>
            Character
          </div>
          <div className={`text-xs ${mode === 'character' ? 'text-blue-300/70' : 'text-gray-500'}`}>
            Random characters with custom sets
          </div>
        </button>
        <button
          onClick={() => { setMode('passphrase'); setGenerated([]); }}
          className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
            mode === 'passphrase'
              ? 'border-blue-500 bg-blue-900/20'
              : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
          }`}
        >
          <div className={`font-semibold mb-1 ${mode === 'passphrase' ? 'text-blue-400' : 'text-gray-300'}`}>
            Passphrase
          </div>
          <div className={`text-xs ${mode === 'passphrase' ? 'text-blue-300/70' : 'text-gray-500'}`}>
            XKCD-style memorable words
          </div>
        </button>
      </div>

      {mode === 'character' ? (
        <div className="space-y-6">
          <LengthSlider value={length} onChange={setLength} label="Password Length" />

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Character Set Selection</h3>
            <CheckboxGroup options={checkboxOptions} onChange={handleCheckboxChange} columns={2} />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Custom Character Set</label>
            <input
              type="text"
              value={customCharset}
              onChange={(e) => setCustomCharset(e.target.value)}
              placeholder="Add custom characters..."
              className="input-field"
            />
          </div>

          <EntropyDisplay bits={bits} crackTime={crackTime} strength={strength} />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Word Count */}
          <LengthSlider value={wordCount} onChange={setWordCount} label="Number of Words" min={2} max={10} />

          {/* Wordlist Source */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Wordlist Source</label>

            {customWordlist.length === 0 ? (
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => { setWordlistSource('builtin'); }}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    wordlistSource === 'builtin'
                      ? 'border-blue-500 bg-blue-900/20 text-blue-400'
                      : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <BookOpen size={16} className="mx-auto mb-1" />
                  Built-in
                  <div className="text-[10px] text-gray-600 mt-0.5">{COMMON_WORDS.length} words</div>
                </button>
                <button
                  onClick={() => { setWordlistSource('eff'); }}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    wordlistSource === 'eff'
                      ? 'border-blue-500 bg-blue-900/20 text-blue-400'
                      : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <BookOpen size={16} className="mx-auto mb-1" />
                  EFF Large
                  <div className="text-[10px] text-gray-600 mt-0.5">{EFF_WORDS.length} words</div>
                </button>
                <label className={`p-3 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${
                  'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                }`}>
                  <input
                    type="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Upload size={16} className="mx-auto mb-1" />
                  Custom
                  <div className="text-[10px] text-gray-600 mt-0.5">Upload .txt</div>
                </label>
              </div>
            ) : (
              <div className="p-3 bg-blue-900/20 border border-blue-800/50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload size={16} className="text-blue-400" />
                  <span className="text-sm text-blue-300">{customWordlist.length} custom words loaded</span>
                </div>
                <button
                  onClick={() => setCustomWordlist([])}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded hover:bg-red-900/20"
                >
                  Remove
                </button>
              </div>
            )}

            {/* EFF info + download */}
            <div className="mt-3 flex items-center gap-3">
              <a
                href="https://www.eff.org/files/2016/07/18/eff_large_wordlist.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-blue-400 transition-colors"
              >
                Download latest EFF wordlist →
              </a>
              <button
                onClick={downloadEffWordlist}
                className="text-xs text-gray-500 hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                <Download size={12} />
                Save bundled copy
              </button>
            </div>
          </div>

          {/* Separator Type */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Separator Mode</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'character' as SeparatorType, label: 'Character', desc: 'Custom separator' },
                { id: 'random' as SeparatorType, label: 'Random Numbers', desc: 'Digits between words' },
                { id: 'both' as SeparatorType, label: 'Both', desc: 'Char + numbers' },
              ].map((sep) => (
                <button
                  key={sep.id}
                  onClick={() => setSeparatorType(sep.id)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    separatorType === sep.id
                      ? 'border-blue-500 bg-blue-900/20 text-blue-400'
                      : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {sep.label}
                  <div className="text-[10px] text-gray-600 mt-0.5">{sep.desc}</div>
                </button>
              ))}
            </div>

            {/* Separator Options */}
            {(separatorType === 'character' || separatorType === 'both') && (
              <div className="mt-3">
                <label className="text-sm font-medium text-gray-300 mb-2 block">Separator String</label>
                <input
                  type="text"
                  value={separatorChar}
                  onChange={(e) => setSeparatorChar(e.target.value)}
                  placeholder="e.g., -, _, space"
                  className="input-field font-mono text-sm"
                />
              </div>
            )}

            {(separatorType === 'random' || separatorType === 'both') && (
              <div className="mt-3">
                <label className="text-sm font-medium text-gray-300 mb-2 block">Random Number Length</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setRandomNumberLength(Math.max(1, randomNumberLength - 1))}
                    className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-lg font-mono font-semibold text-blue-400 w-8 text-center">{randomNumberLength}</span>
                  <button
                    onClick={() => setRandomNumberLength(Math.min(6, randomNumberLength + 1))}
                    className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                  >
                    +
                  </button>
                  <span className="text-xs text-gray-500">digits between words</span>
                </div>
              </div>
            )}
          </div>

          {/* Capitalization */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Capitalization Style</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'none' as Capitalization, label: 'None', desc: 'all lowercase' },
                { id: 'first' as Capitalization, label: 'First Letter', desc: 'Title Case' },
                { id: 'random' as Capitalization, label: 'Random Word', desc: 'WORD or word' },
                { id: 'random-char' as Capitalization, label: 'Random Char', desc: 'pAsSwOrD' },
              ].map((cap) => (
                <button
                  key={cap.id}
                  onClick={() => setCapitalization(cap.id)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    capitalization === cap.id
                      ? 'border-blue-500 bg-blue-900/20 text-blue-400'
                      : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {cap.label}
                  <div className="text-[10px] text-gray-600 mt-0.5">{cap.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Passphrase Entropy Display */}
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-gray-300">
                Wordlist: <span className="font-mono font-semibold text-blue-400">{currentWordlist.length} words</span>
              </span>
              <span className="text-gray-600">|</span>
              <span className="flex items-center gap-1.5 text-gray-300">
                Entropy: <span className="font-mono font-semibold text-blue-400">{passphraseEntropy.toFixed(2)} bits</span>
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden mt-3">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out bg-blue-500"
                style={{ width: `${Math.min((passphraseEntropy / 128) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Batch Size */}
      <div>
        <label className="text-sm font-medium text-gray-300 mb-2 block">Batch Size</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setBatchSize(Math.max(1, batchSize - 1))}
            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            -
          </button>
          <span className="text-lg font-mono font-semibold text-blue-400 w-8 text-center">{batchSize}</span>
          <button
            onClick={() => setBatchSize(Math.min(50, batchSize + 1))}
            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Generate Button */}
      <button onClick={handleGenerate} className="btn-primary flex items-center gap-2">
        <Sparkles size={18} />
        Generate {batchSize > 1 ? `${batchSize} ${mode === 'character' ? 'Passwords' : 'Passphrases'}` : mode === 'character' ? 'Password' : 'Passphrase'}
      </button>

      {/* Output */}
      {generated.length > 0 && (
        <div className="space-y-2 mt-6">
          {generated.map((pwd, i) => (
            <div key={i} className="output-item">
              <code className="flex-1 font-mono text-sm text-white break-all">{pwd}</code>
              <CopyButton text={pwd} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
