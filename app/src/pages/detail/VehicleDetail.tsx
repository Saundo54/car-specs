import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { TopBar } from '../../components/layout/TopBar';
import { Button } from '../../components/ui/Button';
import { Chip } from '../../components/ui/Chip';
import { Snackbar } from '../../components/ui/Snackbar';
import { SPRING_CONFIGS } from '../../constants/animations';
import styles from './VehicleDetail.module.css';

export const VehicleDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    vehicles, 
    comparisonList, 
    addToComparison, 
    toggleFavorite, 
    favorites,
    comparisonError,
    setComparisonError
  } = useAppStore();
  const [activeTab, setActiveTab] = useState('mechanical');
  const [direction, setDirection] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const vehicle = vehicles.find(v => v.id === id);

  if (!vehicle) {
    return (
      <div className={styles.error}>
        <h2 className="headline-medium">Vehicle not found</h2>
        <Button label="Go Back" onClick={() => navigate(-1)} />
      </div>
    );
  }

  const isFavorite = favorites.includes(vehicle.id);
  const isCompared = comparisonList.includes(vehicle.id);

  const tabs = [
    { id: 'mechanical', label: 'Mechanical', icon: 'settings' },
    { id: 'dimensions', label: 'Dimensions', icon: 'straighten' },
    { id: 'safety', label: 'Safety', icon: 'security' },
    { id: 'tech', label: 'Tech', icon: 'devices' },
    { id: 'interior', label: 'Interior', icon: 'chair' },
  ];

  const handleTabChange = (tabId: string) => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    const nextIndex = tabs.findIndex(t => t.id === tabId);
    setDirection(nextIndex > currentIndex ? 1 : -1);
    setActiveTab(tabId);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    setTouchStartX(event.clientX);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;
    const deltaX = event.clientX - touchStartX;
    setTouchStartX(null);

    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    if (Math.abs(deltaX) < 60) return;
    if (deltaX < 0 && currentIndex < tabs.length - 1) {
      handleTabChange(tabs[currentIndex + 1].id);
    }
    if (deltaX > 0 && currentIndex > 0) {
      handleTabChange(tabs[currentIndex - 1].id);
    }
  };

  const variants = {
    initial: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: SPRING_CONFIGS.standard
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      transition: SPRING_CONFIGS.standard
    })
  };

  return (
    <div className={styles.container}>
      <TopBar 
        title={`${vehicle.make} ${vehicle.model}`} 
        showBack 
        onBack={() => navigate(-1)}
        actions={
          <button 
            className={styles.favoriteButton} 
            onClick={() => toggleFavorite(vehicle.id)}
          >
            <span className={`material-symbols-outlined ${isFavorite ? styles.filled : ''}`}>
              {isFavorite ? 'star' : 'star_outline'}
            </span>
          </button>
        }
      />

      <div className={styles.content}>
        {/* Hero Section */}
        <div className={styles.hero}>
          {vehicle.image ? (
            <img src={vehicle.image} alt={`${vehicle.make} ${vehicle.model}`} className={styles.heroImage} />
          ) : (
            <div className={styles.imagePlaceholder}>
              <span className="material-symbols-outlined">directions_car</span>
              <p className="label-medium">Vehicle Image Placeholder</p>
            </div>
          )}
        </div>

        <div className={styles.headerInfo}>
          <h1 className="display-medium">{vehicle.make} {vehicle.model}</h1>
          <p className="headline-small secondary-text">{vehicle.variant} · {vehicle.year}</p>
          
          <div className={styles.quickActions}>
            <Button 
              label={isCompared ? "Added to Compare" : "Add to Compare"} 
              variant={isCompared ? "tonal" : "outlined"}
              icon="compare_arrows"
              onClick={(e) => addToComparison(vehicle.id, { x: e.clientX, y: e.clientY })}
            />
            <Button label="View Source" variant="text" icon="open_in_new" />
          </div>

          <div className={styles.factChips}>
            <Chip label={vehicle.fuel_type || (vehicle.specs.mechanical && (vehicle.specs.mechanical['Fuel type'] || vehicle.specs.mechanical['Fuel Type'])) || 'Unknown Fuel'} selected />
            <Chip label={vehicle.drivetrain || (vehicle.specs.mechanical && (vehicle.specs.mechanical['Drive'] || vehicle.specs.mechanical['Drivetrain'])) || 'FWD'} selected />
            <Chip label={vehicle.body_type || 'Sedan'} selected />
            {vehicle.ancap_rating && <Chip label={`${vehicle.ancap_rating} Star ANCAP`} selected icon="stars" />}
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabRow}>
            {tabs.map(tab => (
              <button 
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                onClick={() => handleTabChange(tab.id)}
              >
                <span className="material-symbols-outlined">{tab.icon}</span>
                <span className="label-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Spec Content */}
        <div className={styles.specContentWrapper} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div 
              key={activeTab}
              custom={direction}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={styles.specContent}
            >
              <h2 className="title-large">{tabs.find(t => t.id === activeTab)?.label}</h2>
              <div className={styles.specGrid}>
                {Object.entries((vehicle.specs as any)[activeTab]).map(([label, value]) => (
                  <div key={label} className={styles.specRow}>
                    <span className="body-medium secondary-text">{label}</span>
                    <span className="body-large">{value as string}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <Snackbar 
        message={comparisonError || ''} 
        isOpen={!!comparisonError} 
        onClose={() => setComparisonError(null)} 
      />
    </div>
  );
};
