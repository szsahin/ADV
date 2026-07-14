import { useMemo } from 'react';

function calculatePoolSize(
  uppercase: boolean,
  lowercase: boolean,
  digits: boolean,
  special: boolean,
  customCharset: string
): number {
  let pool = 0;
  if (uppercase) pool += 26;
  if (lowercase) pool += 26;
  if (digits) pool += 10;
  if (special) pool += 32;
  if (customCharset) {
    const unique = new Set(customCharset.split(''));
    pool += unique.size;
  }
  return pool || 1;
}

function formatCrackTime(seconds: number): string {
  if (seconds < 1) return 'instantly';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} years`;
  if (seconds < 315360000000) return `${Math.round(seconds / 3153600000)} centuries`;
  return `${Math.round(seconds / 315360000000)} millennia`;
}

export function useEntropy(
  length: number,
  uppercase: boolean,
  lowercase: boolean,
  digits: boolean,
  special: boolean,
  customCharset: string
) {
  return useMemo(() => {
    const poolSize = calculatePoolSize(uppercase, lowercase, digits, special, customCharset);
    const entropy = length * Math.log2(poolSize);

    // Assume 10 billion guesses per second (high-end GPU cluster)
    const guessesPerSecond = 10_000_000_000;
    const combinations = Math.pow(poolSize, length);
    const secondsToCrack = combinations / guessesPerSecond / 2; // average case

    return {
      bits: entropy,
      crackTime: formatCrackTime(secondsToCrack),
      strength: entropy < 40 ? 'weak' : entropy < 60 ? 'fair' : entropy < 80 ? 'good' : entropy < 100 ? 'strong' : 'very-strong',
    };
  }, [length, uppercase, lowercase, digits, special, customCharset]);
}
