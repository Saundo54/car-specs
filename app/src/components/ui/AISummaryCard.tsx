import React from 'react';
import { aiService } from '../../services/AIService';
import type { VehicleSpec } from '../../data/vehicles';
import styles from './AISummaryCard.module.css';

/**
 * AISummaryCard component for displaying automated comparison insights
 * Requirement: 8.2, 8.4, 8.5, 8.7, 8.8
 */
interface AISummaryCardProps {
  vehicles: VehicleSpec[];
}

export const AISummaryCard: React.FC<AISummaryCardProps> = ({ vehicles }) => {
  const summaryData = aiService.generateSummary(vehicles);

  if (vehicles.length < 2) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className={`material-symbols-outlined ${styles.aiIcon}`}>auto_awesome</span>
          <h3 className="title-medium">Automated Insights</h3>
        </div>
        <span className={styles.betaBadge}>BETA</span>
      </div>
      
      <div className={styles.content}>
        <p className="body-medium">{summaryData.summary}</p>
        
        <div className={styles.tradeOffList}>
          {summaryData.tradeOffs.map((tradeOff, i) => (
            <div key={i} className={styles.tradeOffItem}>
              <div className={styles.aspectRow}>
                <span className={styles.dot} />
                <span className="label-small secondary-text">{tradeOff.aspect.toUpperCase()}</span>
                <span className={`${styles.magnitude} ${styles[tradeOff.magnitude]}`}>
                  {tradeOff.magnitude}
                </span>
              </div>
              <p className="body-small">{tradeOff.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.footer}>
        <p className="label-small secondary-text">
          Insights are generated based on available specification data.
        </p>
      </div>
    </div>
  );
};
