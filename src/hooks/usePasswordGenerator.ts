import { useCallback } from 'react';

const CHARSETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  special: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function generateSinglePassword(
  length: number,
  uppercase: boolean,
  lowercase: boolean,
  digits: boolean,
  special: boolean,
  customCharset: string
): string {
  let chars = '';
  if (uppercase) chars += CHARSETS.uppercase;
  if (lowercase) chars += CHARSETS.lowercase;
  if (digits) chars += CHARSETS.digits;
  if (special) chars += CHARSETS.special;
  if (customCharset) {
    const unique = new Set(customCharset.split(''));
    chars += Array.from(unique).join('');
  }

  if (!chars) chars = CHARSETS.lowercase;

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

export function usePasswordGenerator() {
  const generatePasswords = useCallback(
    (
      length: number,
      uppercase: boolean,
      lowercase: boolean,
      digits: boolean,
      special: boolean,
      customCharset: string,
      batchSize: number
    ): string[] => {
      return Array.from({ length: batchSize }, () =>
        generateSinglePassword(length, uppercase, lowercase, digits, special, customCharset)
      );
    },
    []
  );

  return { generatePasswords };
}
