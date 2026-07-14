import { useState, useCallback } from 'react';
import bcrypt from 'bcryptjs';

export function useBcrypt() {
  const [isWorking, setIsWorking] = useState(false);

  const hash = useCallback(async (input: string, costFactor: number): Promise<string> => {
    setIsWorking(true);
    try {
      const salt = await bcrypt.genSalt(costFactor);
      const result = await bcrypt.hash(input, salt);
      return result;
    } finally {
      setIsWorking(false);
    }
  }, []);

  return { hash, isWorking };
}
