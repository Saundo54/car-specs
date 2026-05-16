import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PAGE_TRANSITIONS } from '../../constants/animations';
import { ComparisonBubble } from '../ui/ComparisonBubble';
import { Snackbar } from '../ui/Snackbar';
import { applyThemeMode, getStoredThemeMode } from '../../theme';
import styles from './AppShell.module.css';

export const AppShell: React.FC = () => {
  const location = useLocation();
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>(getStoredThemeMode());
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSnackbarMessage('Back online');
      setShowSnackbar(true);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSnackbarMessage('You are offline. App data is available locally.');
      setShowSnackbar(true);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleTheme = () => {
    const nextMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(nextMode);
    applyThemeMode(nextMode);
  };

  return (
    <div className={styles.container}>
      <ComparisonBubble />
      {/* Navigation Rail (Tablet+) */}
      <nav className={styles.navRail}>
        <div className={styles.railHeader}>
          <span className="material-symbols-outlined">directions_car</span>
          <button className={styles.themeButton} onClick={toggleTheme} aria-label="Toggle theme">
            <span className="material-symbols-outlined">{themeMode === 'dark' ? 'light_mode' : 'dark_mode'}</span>
          </button>
        </div>
        <div className={styles.railLinks}>
          <RailItem to="/" icon="search" label="Search" />
          <RailItem to="/compare" icon="compare_arrows" label="Compare" id="nav-compare-rail" />
          <RailItem to="/saved" icon="star" label="Saved" />
        </div>
        <div className={styles.onlineBadge}>
          <span className="label-small">{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className={styles.main}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={PAGE_TRANSITIONS.initial}
            animate={PAGE_TRANSITIONS.animate}
            exit={PAGE_TRANSITIONS.exit}
            transition={PAGE_TRANSITIONS.transition}
            className={styles.pageWrapper}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className={styles.bottomNav}>
        <BottomNavItem to="/" icon="search" label="Search" />
        <BottomNavItem to="/compare" icon="compare_arrows" label="Compare" id="nav-compare-bottom" />
        <BottomNavItem to="/saved" icon="star" label="Saved" />
      </nav>
      <Snackbar
        message={snackbarMessage}
        isOpen={showSnackbar}
        onClose={() => setShowSnackbar(false)}
        duration={4000}
      />
    </div>
  );
};

const RailItem = ({ to, icon, label, id }: { to: string; icon: string; label: string; id?: string }) => (
  <NavLink id={id} to={to} className={({ isActive }) => `${styles.railItem} ${isActive ? styles.active : ''}`}>
    <span className="material-symbols-outlined">{icon}</span>
    <span className="label-medium">{label}</span>
  </NavLink>
);

const BottomNavItem = ({ to, icon, label, id }: { to: string; icon: string; label: string; id?: string }) => (
  <NavLink id={id} to={to} className={({ isActive }) => `${styles.bottomNavItem} ${isActive ? styles.active : ''}`}>
    <div className={styles.iconContainer}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <span className="label-medium">{label}</span>
  </NavLink>
);
