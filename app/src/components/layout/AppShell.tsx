import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PAGE_TRANSITIONS } from '../../constants/animations';
import { ComparisonBubble } from '../ui/ComparisonBubble';
import styles from './AppShell.module.css';

export const AppShell: React.FC = () => {
  const location = useLocation();

  return (
    <div className={styles.container}>
      <ComparisonBubble />
      {/* Navigation Rail (Tablet+) */}
      <nav className={styles.navRail}>
        <div className={styles.railHeader}>
          <span className="material-symbols-outlined">directions_car</span>
        </div>
        <div className={styles.railLinks}>
          <RailItem to="/" icon="search" label="Search" />
          <RailItem to="/compare" icon="compare_arrows" label="Compare" id="nav-compare-rail" />
          <RailItem to="/saved" icon="star" label="Saved" />
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
