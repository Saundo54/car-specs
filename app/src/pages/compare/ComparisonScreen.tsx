import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { TopBar } from '../../components/layout/TopBar';
import { Button } from '../../components/ui/Button';
import styles from './ComparisonScreen.module.css';

export const ComparisonScreen: React.FC = () => {
  const { vehicles, comparisonList, removeFromComparison } = useAppStore();
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);
  const [activeTab, setActiveTab] = useState('mechanical');
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [showLegend, setShowLegend] = useState(false);

  const comparedVehicles = vehicles.filter(v => comparisonList.includes(v.id));

  const tabs = [
    { id: 'mechanical', label: 'Mechanical' },
    { id: 'dimensions', label: 'Dimensions' },
    { id: 'safety', label: 'Safety' },
    { id: 'tech', label: 'Tech' },
    { id: 'interior', label: 'Interior' },
  ];

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    setTouchStartX(event.clientX);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;
    const deltaX = event.clientX - touchStartX;
    setTouchStartX(null);

    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (Math.abs(deltaX) < 60) return;
    if (deltaX < 0 && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
    if (deltaX > 0 && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const hasDifference = (category: string, key: string) => {
    if (comparedVehicles.length < 2) return false;
    const baseValue = (comparedVehicles[0].specs as any)[category][key];
    const otherValues = comparedVehicles.slice(1).map(v => (v.specs as any)[category][key]);
    return otherValues.some(val => val !== baseValue);
  };

  const getCurrentKeys = () => {
    return [...new Set(comparedVehicles.flatMap(v => Object.keys((v.specs as any)[activeTab] || {})))];
  };

  const currentKeys = getCurrentKeys();
  const differentCount = currentKeys.filter(key => hasDifference(activeTab, key)).length;
  const sameCount = currentKeys.length - differentCount;

  if (comparedVehicles.length === 0) {
    return (
      <div className={styles.empty}>
        <TopBar title="Compare" />
        <div className={styles.emptyContent}>
          <span className="material-symbols-outlined">compare_arrows</span>
          <h2 className="headline-small">No vehicles to compare</h2>
          <p className="body-medium secondary-text">Add vehicles from search to see them side-by-side.</p>
        </div>
      </div>
    );
  }

  // Helper to check if a row has differences relative to the base case (Vehicle 1)
  const hasDifference = (category: string, key: string) => {
    if (comparedVehicles.length < 2) return false;
    const baseValue = (comparedVehicles[0].specs as any)[category][key];
    const otherValues = comparedVehicles.slice(1).map(v => (v.specs as any)[category][key]);
    return otherValues.some(val => val !== baseValue);
  };

  // Helper to determine highlight color relative to base case
  const getHighlight = (category: string, key: string, value: string, index: number) => {
    if (index === 0) return ''; // Base case never highlighted as "different"
    if (!hasDifference(category, key)) return '';
    if (!value) return '';
    
    // Simple logic for prototype: higher power/boot is better, lower consumption is better
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(numericValue)) return styles.diff;

    const allValues = comparedVehicles
      .map(v => parseFloat(((v.specs as any)[category][key] || '').replace(/[^0-9.]/g, '')))
      .filter(v => !isNaN(v));
      
    if (allValues.length === 0) return '';
    const max = Math.max(...allValues);
    const min = Math.min(...allValues);

    if (key.includes('Power') || key.includes('Torque') || key.includes('Capacity') || key.includes('ANCAP')) {
      if (numericValue === max) return styles.better;
      if (numericValue === min) return styles.worse;
    }

    if (key.includes('Consumption')) {
      if (numericValue === min) return styles.better;
      if (numericValue === max) return styles.worse;
    }

    return styles.diff;
  };

  return (
    <div className={styles.container}>
      <TopBar
        title="Compare"
        actions={
          <div className={styles.topActions}>
            <button className={styles.infoButton} onClick={() => setShowLegend(!showLegend)}>
              <span className="material-symbols-outlined">info</span>
            </button>
            <Button label="Add" variant="text" icon="add" />
          </div>
        }
      />

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabRow}>
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="label-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.compareSummary}>
        <span className="label-small">{currentKeys.length} specs — {differentCount} difference{differentCount === 1 ? '' : 's'}, {sameCount} match{sameCount === 1 ? '' : 'es'}</span>
      </div>

      {showLegend && (
        <div className={styles.legendCard}>
          <div className={styles.legendRow}>
            <span className={styles.legendSwatch} />
            <span>Green: Best value among the compared vehicles where higher is better.</span>
          </div>
          <div className={styles.legendRow}>
            <span className={`${styles.legendSwatch} ${styles.worse}`} />
            <span>Red: Worse value than the base vehicle or poorer performance where higher is better.</span>
          </div>
          <div className={styles.legendRow}>
            <span className={`${styles.legendSwatch} ${styles.diff}`} />
            <span>Blue: This value differs from the first vehicle in the current comparison (the base case).</span>
          </div>
          <div className={styles.legendRow}>
            <span className={styles.legendNotice} />
            <span>The first listed vehicle in the comparison is treated as the base case.</span>
          </div>
        </div>
      )}

      <div className={styles.tableWrapper} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
        <div className={styles.grid}>
          {/* Header Row */}
          <div className={styles.stickyHeaderRow}>
            <div className={styles.labelCell}>
              <div className={styles.toggleRow}>
                <span className="label-medium">Show differences only</span>
                <input 
                  type="checkbox" 
                  checked={showDifferencesOnly} 
                  onChange={(e) => setShowDifferencesOnly(e.target.checked)} 
                />
              </div>
            </div>
            {comparedVehicles.map((v, index) => (
              <div key={v.id} className={styles.vehicleHeader}>
                <div className={styles.headerTop}>
                  <h3 className="label-large">{v.make} {v.model}</h3>
                  {index === 0 && <span className={`${styles.baseBadge} label-small`}>Base Case</span>}
                </div>
                <p className="label-small secondary-text">{v.variant}</p>
                <button 
                  className={styles.removeButton} 
                  onClick={() => removeFromComparison(v.id)}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            ))}
          </div>

          {/* Spec Content for Active Tab */}
          {(() => {
            const cat = tabs.find(t => t.id === activeTab)!;
            const keys = [...new Set(comparedVehicles.flatMap(v => Object.keys((v.specs as any)[cat.id] || {})))];
            
            if (keys.length === 0) return (
              <div className={styles.noData}>No specifications for this category.</div>
            );

            return keys.map(key => {
              const different = hasDifference(cat.id, key);
              if (showDifferencesOnly && !different) return null;

              return (
                <div key={key} className={styles.specRow}>
                  <div className={styles.labelCell}>
                    <span className="body-medium secondary-text">{key}</span>
                  </div>
                  {comparedVehicles.map((v, idx) => {
                    const val = (v.specs as any)[cat.id][key] || '-';
                    return (
                      <div key={v.id} className={`${styles.valueCell} ${getHighlight(cat.id, key, val, idx)}`}>
                        <span className="body-large">{val}</span>
                      </div>
                    );
                  })}
                </div>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
};
