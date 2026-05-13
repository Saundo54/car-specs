import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  label: string;
  variant?: 'filled' | 'outlined' | 'text' | 'tonal';
  icon?: string;
  onClick?: () => void;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ label, variant = 'filled', icon, onClick, fullWidth }) => {
  return (
    <button 
      className={`${styles.button} ${styles[variant]} ${fullWidth ? styles.fullWidth : ''}`}
      onClick={onClick}
    >
      {icon && <span className={`material-symbols-outlined ${styles.icon}`}>{icon}</span>}
      <span className="label-large">{label}</span>
    </button>
  );
};
