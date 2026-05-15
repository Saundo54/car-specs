import { useState, useCallback } from 'react';

export type Origin = {
  x: number;
  y: number;
};

export const useInteractionOrigin = () => {
  const [origin, setOrigin] = useState<Origin | null>(null);

  const captureOrigin = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if ('clientX' in e) {
      setOrigin({ x: e.clientX, y: e.clientY });
    } else if ('touches' in e && e.touches.length > 0) {
      setOrigin({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  }, []);

  return { origin, captureOrigin, setOrigin };
};
