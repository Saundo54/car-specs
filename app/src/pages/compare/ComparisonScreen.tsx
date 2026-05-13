import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { MOCK_VEHICLES } from '../../data/vehicles';
import { TopBar } from '../../components/layout/TopBar';
import { Button } from '../../components/ui/Button';
import styles from './ComparisonScreen.module.css';

export const ComparisonScreen: React.FC = () => {
  const { vehicles, comparisonList, removeFromComparison } = useAppStore();
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);

  const comparedVehicles = vehicles.filter(v => comparisonList.includes(v.id));

  const specCategories = [
    { id: 'mechanical', label: 'Mechanical' },
    { id: 'dimensions', label: 'Dimensions' },
    { id: 'safety', label: 'Safety' },
    { id: 'tech', label: 'Tech' },
    { id: 'interior', label: 'Interior' },
  ];

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

  // Helper to check if a row has differences
  const hasDifference = (category: string, key: string) => {
    if (comparedVehicles.length < 2) return false;
    const values = comparedVehicles.map(v => (v.specs as any)[category][key]);
    return !values.every(val => val === values[0]);
  };

  // Helper to determine highlight color
  const getHighlight = (category: string, key: string, value: string) => {
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
      <TopBar title="Compare" actions={<Button label="Add" variant="text" icon="add" />} />

      <div className={styles.tableWrapper}>
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
            {comparedVehicles.map(v => (
              <div key={v.id} className={styles.vehicleHeader}>
                <h3 className="label-large">{v.make} {v.model}</h3>
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

          {/* Spec Categories */}
          {specCategories.map(cat => {
            const keys = [...new Set(comparedVehicles.flatMap(v => Object.keys((v.specs as any)[cat.id] || {})))];
            if (keys.length === 0) return null;

            return (
              <React.Fragment key={cat.id}>
                <div className={styles.categoryRow}>
                  <div className={styles.categoryLabel}>{cat.label}</div>
                </div>
                
                {keys.map(key => {
                  const different = hasDifference(cat.id, key);
                  if (showDifferencesOnly && !different) return null;

                  return (
                    <div key={key} className={styles.specRow}>
                      <div className={styles.labelCell}>
                        <span className="body-medium secondary-text">{key}</span>
                      </div>
                      {comparedVehicles.map(v => {
                        const val = (v.specs as any)[cat.id][key] || '-';
                        return (
                          <div key={v.id} className={`${styles.valueCell} ${getHighlight(cat.id, key, val)}`}>
                            <span className="body-large">{val}</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
