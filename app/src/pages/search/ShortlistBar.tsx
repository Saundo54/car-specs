import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/ui/Button';
import styles from './ShortlistBar.module.css';

interface ShortlistBarProps {
  onCompare: () => void;
}

export const ShortlistBar: React.FC<ShortlistBarProps> = ({ onCompare }) => {
  const { comparisonList, vehicles, removeFromComparison, clearComparison } = useAppStore();

  const selectedVehicles = comparisonList.map(id => 
    vehicles.find(v => v.id === id)
  ).filter((v): v is any => !!v);

  const getLimitColorClass = () => {
    if (comparisonList.length === 1) return styles.limitLow;
    if (comparisonList.length === 2) return styles.limitMedium;
    return styles.limitHigh;
  };

  return (
    <AnimatePresence>
      {comparisonList.length > 0 && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className={styles.container}
        >
          <div className={styles.content}>
            <div className={styles.info}>
              <div className={`${styles.badge} ${getLimitColorClass()}`}>
                {comparisonList.length}/3
              </div>
              <div className={styles.vehicleList}>
                <AnimatePresence>
                  {selectedVehicles.map(v => (
                    <motion.div 
                      key={v.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={styles.vehicleChip}
                    >
                      <span className="label-small">{v.make} {v.model}</span>
                      <button 
                        onClick={() => removeFromComparison(v.id)}
                        className={styles.removeBtn}
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
            <div className={styles.actions}>
              <Button 
                label="Clear All" 
                variant="text" 
                onClick={clearComparison}
              />
              <Button 
                label="Compare" 
                variant="filled" 
                onClick={onCompare}
                disabled={comparisonList.length < 2}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
