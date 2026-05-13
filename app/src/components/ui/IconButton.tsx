import React from 'react';
import styles from './IconButton.module.css';

interface IconButtonProps {
  icon: string;
  onClick?: () => void;
  variant?: 'standard' | 'filled' | 'tonal' | 'outlined';
}

export const IconButton: React.FC<IconButtonProps> = ({ icon, onClick, variant = 'standard' }) => {
  return (
    <button className={`${styles.iconButton} ${styles[variant]}`} onClick={onClick}>
      <span className="material-symbols-outlined">{icon}</span>
    </button>
  );
};
