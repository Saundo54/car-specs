import React from 'react';
import { FEATURE_FILTER_CONFIG } from '../../data/featureFilters';
import styles from './FeatureFilterChecklist.module.css';

/**
 * FeatureFilterChecklist component for filtering vehicles by convenience features
 * Requirement: 6.1, 6.5, 6.7
 */
interface FeatureFilterChecklistProps {
  selectedFeatures: string[];
  onFeatureToggle: (id: string) => void;
  matchingCount: number;
}

export const FeatureFilterChecklist: React.FC<FeatureFilterChecklistProps> = ({
  selectedFeatures,
  onFeatureToggle,
  matchingCount
}) => {
  return (
    <div className={styles.container}>
      <h3 className="title-medium">Must-Have Features</h3>
      <div className={styles.grid}>
        {FEATURE_FILTER_CONFIG.features.map(feature => {
          const isSelected = selectedFeatures.includes(feature.id);
          return (
            <button
              key={feature.id}
              className={`${styles.featureButton} ${isSelected ? styles.selected : ''}`}
              onClick={() => onFeatureToggle(feature.id)}
            >
              <div className={styles.iconWrapper}>
                <span>{feature.icon}</span>
              </div>
              <span className="label-medium">{feature.label}</span>
              {isSelected && <span className={`material-symbols-outlined ${styles.check}`}>check_circle</span>}
            </button>
          );
        })}
      </div>
      <div className={styles.footer}>
        <span className="label-small secondary-text">{matchingCount} vehicles match selection</span>
      </div>
    </div>
  );
};
