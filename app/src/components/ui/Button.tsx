import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  label: string;
  variant?: 'filled' | 'outlined' | 'text' | 'tonal';
  icon?: string;
  onClick?: (e: React.MouseEvent) => void;
  fullWidth?: boolean;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ label, variant = 'filled', icon, onClick, fullWidth, disabled }) => {
  return (
    <button 
      className={`${styles.button} ${styles[variant]} ${fullWidth ? styles.fullWidth : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className={`material-symbols-outlined ${styles.icon}`}>{icon}</span>}
      <span className="label-large">{label}</span>
    </button>
  );
};
