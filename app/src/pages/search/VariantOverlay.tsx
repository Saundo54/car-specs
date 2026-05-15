import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { SPRING_CONFIGS } from '../../constants/animations';
import type { Origin } from '../../hooks/useInteractionOrigin';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import styles from './VariantOverlay.module.css';

interface VariantOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  origin: Origin | null;
  modelName: string;
  variants: any[];
  onVariantClick: (id: string) => void;
  onAddToCompare: (id: string, origin: { x: number, y: number }) => void;
  comparisonList: string[];
}

export const VariantOverlay: React.FC<VariantOverlayProps> = ({
  isOpen,
  onClose,
  origin,
  modelName,
  variants,
  onVariantClick,
  onAddToCompare,
  comparisonList
}) => {
  const { removeFromComparison } = useAppStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.wrapper}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.backdrop}
            onClick={onClose}
          />
          <motion.div
            initial={{
              opacity: 0,
              scale: 0,
              x: origin ? origin.x - (window.innerWidth / 2) : 0,
              y: origin ? origin.y - (window.innerHeight / 2) : 0,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0,
              x: origin ? origin.x - (window.innerWidth / 2) : 0,
              y: origin ? origin.y - (window.innerHeight / 2) : 0,
            }}
            transition={SPRING_CONFIGS.expressive}
            className={styles.content}
          >
            <div className={styles.header}>
              <h2 className="headline-small">{modelName} Variants</h2>
              <button onClick={onClose} className={styles.closeButton}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className={styles.grid}>
              {variants.map(v => {
                const isAdded = comparisonList.includes(v.id);
                return (
                  <Card 
                    key={v.id} 
                    variant={isAdded ? "filled" : "outlined"} 
                    onClick={(e) => {
                      if (isAdded) {
                        removeFromComparison(v.id);
                        return;
                      }
                      if (comparisonList.length >= 3) return;
                      onAddToCompare(v.id, { x: e.clientX, y: e.clientY });
                    }}
                    className={`${styles.variantCard} ${isAdded ? styles.added : ''}`}
                  >
                    {v.image && (
                      <div className={styles.cardImageContainer}>
                        <img src={v.image} alt={v.variant} className={styles.cardImage} />
                        {isAdded && (
                          <div className={styles.addedOverlay}>
                            <span className="material-symbols-outlined">check_circle</span>
                          </div>
                        )}
                      </div>
                    )}
                    <div className={styles.cardContent}>
                      <h3 className="title-medium">{v.variant}</h3>
                      <div className={styles.cardActions}>
                        <Button 
                          label="Details" 
                          variant="text"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            onVariantClick(v.id); 
                          }}
                        />
                        {!isAdded ? (
                          <Button 
                            label={`Compare (${comparisonList.length}/3)`} 
                            variant="tonal"
                            disabled={comparisonList.length >= 3}
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToCompare(v.id, { x: e.clientX, y: e.clientY });
                            }}
                          />
                        ) : (
                          <Button 
                            label="Remove" 
                            variant="tonal"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromComparison(v.id);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
