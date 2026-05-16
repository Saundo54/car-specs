import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/ui/Button';
import styles from './SplashScreen.module.css';

export const SplashScreen: React.FC = () => {
  const enterApp = useAppStore(state => state.enterApp);
  const [isDark, setIsDark] = useState<boolean>(() => typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Use a transparent PNG so the logo blends with the page background
  // Transparent asset covers both light and dark backgrounds and avoids a white box
  const logoSrc = isDark ? '/images/logo/splash_logo_black.png' : '/images/logo/splash_logo_white.png';

  return (
    <div className={styles.container}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={styles.logoContainer}
      >
        <img src={logoSrc} alt="CarSpecs Logo" className={styles.logoImage} />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className={styles.footer}
      >
        <Button label="View & Compare Specs" onClick={enterApp} variant="filled" />
      </motion.div>
    </div>
  );
};
