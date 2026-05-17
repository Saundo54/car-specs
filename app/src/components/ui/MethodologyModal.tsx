import React from 'react';
import { bootHeuristicService } from '../../services/BootHeuristicService';
import styles from './MethodologyModal.module.css';

/**
 * MethodologyModal component for explaining the boot heuristic calculation
 * Requirement: 3.4, 3.5, 9.8
 */
interface MethodologyModalProps {
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ onClose }) => {
  const methodology = bootHeuristicService.getMethodology();
  
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className="headline-small">Cargo Capacity Methodology</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className={styles.content}>
          <p className="body-medium">
            Practical cargo capacity is estimated using a heuristic model cross-referenced with the 
            <strong> {methodology.dataSource}</strong>. This helps translate abstract litre measurements into relatable everyday objects.
          </p>
          
          <div className={styles.section}>
            <h3 className="title-medium">Reference Units</h3>
            <ul className={styles.unitList}>
              <li>
                <span className="material-symbols-outlined">luggage</span>
                <div>
                  <strong>Large Suitcase:</strong>
                  <p className="body-small secondary-text">Approx. {methodology.averageConversionRatio.litresPerSuitcase}L per unit</p>
                </div>
              </li>
              <li>
                <span className="material-symbols-outlined">stroller</span>
                <div>
                  <strong>Pram / Stroller:</strong>
                  <p className="body-small secondary-text">Approx. {methodology.averageConversionRatio.litresPerPram}L per unit</p>
                </div>
              </li>
              <li>
                <span className="material-symbols-outlined">shopping_bag</span>
                <div>
                  <strong>Grocery Bag:</strong>
                  <p className="body-small secondary-text">Approx. {methodology.averageConversionRatio.litresPerGroceryBag}L per unit</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className={styles.footer}>
            <p className="label-small secondary-text">
              Calculation Confidence: <span className={`${styles.confidence} ${styles[methodology.confidenceLevel]}`}>{methodology.confidenceLevel.toUpperCase()}</span>
            </p>
            <p className="label-small secondary-text">Data source: https://babydrive.com.au/</p>
          </div>
        </div>
      </div>
    </div>
  );
};
