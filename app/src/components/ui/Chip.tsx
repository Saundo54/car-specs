import React from 'react';
import styles from './Chip.module.css';

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  icon?: string;
}

export const Chip: React.FC<ChipProps> = ({ label, selected, onClick, icon }) => {
  return (
    <button 
      className={`${styles.chip} ${selected ? styles.selected : ''}`}
      onClick={onClick}
    >
      {icon && <span className={`material-symbols-outlined ${styles.icon}`}>{icon}</span>}
      <span className="label-medium">{label}</span>
    </button>
  );
};
