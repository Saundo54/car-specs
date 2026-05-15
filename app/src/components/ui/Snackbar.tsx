import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Snackbar.module.css';

interface SnackbarProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

export const Snackbar: React.FC<SnackbarProps> = ({ message, isOpen, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, duration]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className={styles.container}
        >
          <span className="body-medium">{message}</span>
          <button onClick={onClose} className={styles.closeBtn}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
