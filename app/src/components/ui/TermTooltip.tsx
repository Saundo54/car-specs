import React, { useState, useRef, useEffect } from 'react';
import { glossaryManager } from '../../services/GlossaryManager';
import styles from './TermTooltip.module.css';

/**
 * TermTooltip component for explaining technical automotive terms
 * Requirement: 4.2, 4.3, 4.4, 4.5
 */
interface TermTooltipProps {
  term: string;
  children: React.ReactNode;
}

export const TermTooltip: React.FC<TermTooltipProps> = ({ term, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const entry = glossaryManager.getEntry(term);

  if (!entry) return <>{children}</>;

  const handleMouseEnter = () => {
    // 200ms delay for desktop hover (Requirement 4.2)
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 200);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(!isVisible);
  };

  return (
    <span 
      className={styles.container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleToggle}
    >
      <span className={styles.trigger}>{children}</span>
      {isVisible && (
        <div className={styles.tooltip} onClick={(e) => e.stopPropagation()}>
          <div className={styles.content}>
            <h4 className="label-large">{entry.term}</h4>
            <p className="body-small">{entry.explanation}</p>
            <div className={styles.benefit}>
              <span className="material-symbols-outlined">lightbulb</span>
              <p className="body-small italic"><strong>Benefit:</strong> {entry.practicalBenefit}</p>
            </div>
          </div>
          <div className={styles.arrow} />
        </div>
      )}
    </span>
  );
};
