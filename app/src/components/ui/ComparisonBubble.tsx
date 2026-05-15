/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import styles from './ComparisonBubble.module.css';

export const ComparisonBubble: React.FC = () => {
  const { lastAddedVehicle, setLastAddedVehicle } = useAppStore();
  const [targetPos, setTargetPos] = useState<{ x: number, y: number } | null>(null);

  useEffect(() => {
    if (lastAddedVehicle) {
      // Find the target: either the bottom nav or rail compare icon
      const bottomNav = document.getElementById('nav-compare-bottom');
      const railNav = document.getElementById('nav-compare-rail');
      
      const target = (bottomNav && bottomNav.offsetParent !== null) ? bottomNav : railNav;
      
      if (target) {
        const rect = target.getBoundingClientRect();
        setTargetPos({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
      } else {
        // Fallback to a reasonable spot if nav is hidden (e.g. during transitions)
        setTargetPos({ x: window.innerWidth / 2, y: window.innerHeight - 40 });
      }

      // Auto-clear after animation duration
      const timer = setTimeout(() => {
        setLastAddedVehicle(null);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [lastAddedVehicle, setLastAddedVehicle]);

  return (
    <AnimatePresence>
      {lastAddedVehicle && targetPos && (
        <motion.div
          key={lastAddedVehicle.id}
          initial={{
            opacity: 0,
            scale: 0.5,
            x: lastAddedVehicle.x,
            y: lastAddedVehicle.y,
            position: 'fixed',
            zIndex: 9999,
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1.2, 1, 0.5],
            x: targetPos.x,
            y: targetPos.y,
          }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
          }}
          className={styles.bubble}
        >
          <img src={lastAddedVehicle.image} alt="" className={styles.image} />
          <div className={styles.badge}>
            <span className="material-symbols-outlined">compare_arrows</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
