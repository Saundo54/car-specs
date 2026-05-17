import React from 'react';
import { CATEGORY_MAPPING_RULES } from '../../data/lifestyleQuiz';
import styles from './QuizInfoModal.module.css';

/**
 * QuizInfoModal component for explaining the lifestyle recommendation algorithm
 * Requirement: 5.5, 5.6
 */
interface QuizInfoModalProps {
  onClose: () => void;
}

export const QuizInfoModal: React.FC<QuizInfoModalProps> = ({ onClose }) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className="headline-small">How Recommendations Work</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className={styles.content}>
          <p className="body-medium">
            The Lifestyle Quiz uses a set of rules to map your everyday needs to the most suitable vehicle categories.
          </p>
          
          <div className={styles.ruleList}>
            {CATEGORY_MAPPING_RULES.map((rule, i) => (
              <div key={i} className={styles.rule}>
                <div className={styles.conditions}>
                  {Object.entries(rule.conditions).map(([key, val]) => (
                    <span key={key} className={styles.conditionBadge}>
                      {key}: {val}
                    </span>
                  ))}
                </div>
                <p className="body-medium"><strong>{rule.reasoning}</strong></p>
                <div className={styles.recommendations}>
                  <span className="label-small secondary-text">Suggested: </span>
                  {rule.recommendedBodyTypes.map(type => (
                    <span key={type} className={styles.typeBadge}>{type}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
