import React from 'react';
import styles from './DiffToggle.module.css';

/**
 * DiffToggle component for switching between full and difference-only comparison views
 * Requirement: 1.1
 */
interface DiffToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  differenceCount: number;
  identicalCount: number;
}

export const DiffToggle: React.FC<DiffToggleProps> = ({
  enabled,
  onToggle,
  differenceCount,
  identicalCount
}) => {
  return (
    <div className={styles.container}>
      <label className={styles.toggleWrapper}>
        <div className={styles.switch}>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
          />
          <span className={styles.slider}></span>
        </div>
        <div className={styles.info}>
          <span className="label-large">Show differences only</span>
          <span className="label-small secondary-text">
            {differenceCount} differences, {enabled ? `${identicalCount} identical hidden` : `${identicalCount} identical`}
          </span>
        </div>
      </label>
    </div>
  );
};
