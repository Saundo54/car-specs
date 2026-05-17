import React from 'react';
import { aiService } from '../../services/AIService';
import type { VehicleSpec } from '../../data/vehicles';
import styles from './AIInsightsModal.module.css';

interface AIInsightsModalProps {
  vehicles: VehicleSpec[];
  onClose: () => void;
}

export const AIInsightsModal: React.FC<AIInsightsModalProps> = ({ vehicles, onClose }) => {
  const summaryData = aiService.generateSummary(vehicles);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <span className={`material-symbols-outlined ${styles.icon}`}>auto_awesome</span>
            <div>
              <h2 className="headline-small">Automated Insights</h2>
              <p className="body-small secondary-text">AI-generated vehicle comparison highlights.</p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close insights">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.summary}>
            <p className="body-medium">{summaryData.summary}</p>
          </div>

          {summaryData.tradeOffs.length > 0 && (
            <div className={styles.tradeOffs}>
              <h3 className="title-small">Key trade-offs</h3>
              <div className={styles.tradeOffList}>
                {summaryData.tradeOffs.map((tradeOff, index) => (
                  <div key={index} className={styles.tradeOffItem}>
                    <div className={styles.tradeOffHeader}>
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
          )}

          <div className={styles.footer}>
            <p className="label-small secondary-text">Insights are generated from available vehicle specifications. Interpret differences as a guide rather than a definitive ranking.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
