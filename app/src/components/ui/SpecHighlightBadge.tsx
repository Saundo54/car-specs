import React from 'react';
import styles from './SpecHighlightBadge.module.css';

/**
 * SpecHighlightBadge component for identifying best-in-class values
 * Requirement: 2.2, 2.3, 2.6
 */
interface SpecHighlightBadgeProps {
  isBestInClass: boolean;
}

export const SpecHighlightBadge: React.FC<SpecHighlightBadgeProps> = ({ isBestInClass }) => {
  if (!isBestInClass) return null;
  
  return (
    <span className={styles.badge} title="Best in class">
      ⭐
    </span>
  );
};
