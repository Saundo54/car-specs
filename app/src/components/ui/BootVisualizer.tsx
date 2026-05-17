import React from 'react';
import { bootHeuristicService } from '../../services/BootHeuristicService';
import styles from './BootVisualizer.module.css';

/**
 * BootVisualizer component for practical cargo capacity representation
 * Requirement: 3.1, 3.2, 3.7
 */
interface BootVisualizerProps {
  litres: number;
  onShowInfo: () => void;
}

export const BootVisualizer: React.FC<BootVisualizerProps> = ({ litres, onShowInfo }) => {
  if (isNaN(litres) || litres <= 0) return null;

  const luggage = bootHeuristicService.estimateLuggageCapacity(litres);

  return (
    <div className={styles.container}>
      <div className={styles.icons}>
        {Array.from({ length: luggage.largeSuitcases }).map((_, i) => (
          <span key={`suit-${i}`} className="material-symbols-outlined" title="Large Suitcase">luggage</span>
        ))}
        {Array.from({ length: luggage.prams }).map((_, i) => (
          <span key={`pram-${i}`} className="material-symbols-outlined" title="Pram">stroller</span>
        ))}
        {Array.from({ length: luggage.groceryBags }).map((_, i) => (
          <span key={`bag-${i}`} className="material-symbols-outlined" title="Grocery Bag">shopping_bag</span>
        ))}
      </div>
      <button 
        className={styles.infoButton} 
        onClick={(e) => {
          e.stopPropagation();
          onShowInfo();
        }}
        title="View Methodology"
      >
        <span className="material-symbols-outlined">help_outline</span>
      </button>
    </div>
  );
};
