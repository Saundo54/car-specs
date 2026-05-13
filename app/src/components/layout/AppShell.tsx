import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import styles from './AppShell.module.css';

export const AppShell: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Navigation Rail (Tablet+) */}
      <nav className={styles.navRail}>
        <div className={styles.railHeader}>
          <span className="material-symbols-outlined">directions_car</span>
        </div>
        <div className={styles.railLinks}>
          <RailItem to="/" icon="search" label="Search" />
          <RailItem to="/compare" icon="compare_arrows" label="Compare" />
          <RailItem to="/saved" icon="star" label="Saved" />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className={styles.main}>
        <Outlet />
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className={styles.bottomNav}>
        <BottomNavItem to="/" icon="search" label="Search" />
        <BottomNavItem to="/compare" icon="compare_arrows" label="Compare" />
        <BottomNavItem to="/saved" icon="star" label="Saved" />
      </nav>
    </div>
  );
};

const RailItem = ({ to, icon, label }: { to: string; icon: string; label: string }) => (
  <NavLink to={to} className={({ isActive }) => `${styles.railItem} ${isActive ? styles.active : ''}`}>
    <span className="material-symbols-outlined">{icon}</span>
    <span className="label-medium">{label}</span>
  </NavLink>
);

const BottomNavItem = ({ to, icon, label }: { to: string; icon: string; label: string }) => (
  <NavLink to={to} className={({ isActive }) => `${styles.bottomNavItem} ${isActive ? styles.active : ''}`}>
    <div className={styles.iconContainer}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <span className="label-medium">{label}</span>
  </NavLink>
);
