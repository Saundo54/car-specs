import React from 'react';
import styles from './TopBar.module.css';

interface TopBarProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export const TopBar: React.FC<TopBarProps> = ({ title, showBack, onBack, actions }) => {
  return (
    <header className={styles.topBar}>
      <div className={styles.leading}>
        {showBack ? (
          <button className={styles.iconButton} onClick={onBack}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        ) : (
          <div className={styles.spacer} />
        )}
      </div>
      <h1 className="title-large">{title}</h1>
      <div className={styles.trailing}>
        {actions || (
          <button className={styles.iconButton}>
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        )}
      </div>
    </header>
  );
};
