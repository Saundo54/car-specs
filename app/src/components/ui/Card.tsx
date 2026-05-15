import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  variant?: 'filled' | 'outlined' | 'elevated';
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, variant = 'filled', onClick, className }) => {
  return (
    <div 
      className={`${styles.card} ${styles[variant]} ${onClick ? styles.clickable : ''} ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
