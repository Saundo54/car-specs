import React from 'react';
import { ancapService } from '../../services/ANCAPService';
import styles from './ANCAPContextDisplay.module.css';

/**
 * ANCAPContextDisplay component for safety ratings with test year context
 * Requirement: 7.1, 7.2, 7.3, 7.4, 7.5
 */
interface ANCAPContextDisplayProps {
  rating: number;
  testYear: number | undefined;
}

export const ANCAPContextDisplay: React.FC<ANCAPContextDisplayProps> = ({ rating, testYear }) => {
  const warningLevel = ancapService.getWarningLevel(testYear);
  const explanation = ancapService.getAgeExplanation(testYear);
  const shouldEmphasize = ancapService.shouldEmphasize(testYear);
  
  return (
    <div 
      className={`
        ${styles.container} 
        ${styles[warningLevel]} 
        ${shouldEmphasize ? styles.emphasize : ''}
      `} 
      title={explanation}
    >
      <div className={styles.stars}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span 
            key={i} 
            className={`material-symbols-outlined ${i < rating ? styles.activeStar : styles.inactiveStar}`}
          >
            star
          </span>
        ))}
      </div>
      <div className={styles.context}>
        {testYear ? (
          <span className="label-small">Tested {testYear}</span>
        ) : (
          <span className="label-small opacity-50">Year unknown</span>
        )}
        {warningLevel !== 'none' && (
          <span className={`material-symbols-outlined ${styles.warningIcon}`}>
            {warningLevel === 'warning' ? 'report' : 'info'}
          </span>
        )}
      </div>
    </div>
  );
};
