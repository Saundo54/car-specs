import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { TopBar } from '../../components/layout/TopBar';
import { Button } from '../../components/ui/Button';
import { DiffToggle } from '../../components/ui/DiffToggle';
import { bestInClassCalculator } from '../../services/BestInClassCalculator';
import { SpecHighlightBadge } from '../../components/ui/SpecHighlightBadge';
import { BootVisualizer } from '../../components/ui/BootVisualizer';
import { MethodologyModal } from '../../components/ui/MethodologyModal';
import { TermTooltip } from '../../components/ui/TermTooltip';
import { ANCAPContextDisplay } from '../../components/ui/ANCAPContextDisplay';
import { AIInsightsModal } from '../../components/ui/AIInsightsModal';
import { glossaryManager } from '../../services/GlossaryManager';
import styles from './ComparisonScreen.module.css';

export const ComparisonScreen: React.FC = () => {
  const { vehicles, comparisonList, removeFromComparison } = useAppStore();
// ... (omitting state for brevity in instruction, will provide full in new_string)
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);
  const [activeTab, setActiveTab] = useState('mechanical');
  const [showLegend, setShowLegend] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  const comparedVehicles = vehicles
    .filter(v => comparisonList.includes(v.id))
    .sort((a, b) => {
      // Requirement 7.6: Sort by ANCAP rating and then test year when safety tab is active
      if (activeTab === 'safety') {
        if (b.ancap_rating !== a.ancap_rating) {
          return b.ancap_rating - a.ancap_rating;
        }
        return (b.ancap_test_year || 0) - (a.ancap_test_year || 0);
      }
      return 0; // Maintain comparison list order otherwise
    });

  const renderValueWithTooltips = (value: string) => {
    const terms = glossaryManager.getAllTerms();
    if (terms.length === 0) return value;

    // Create regex pattern to match any term (case-insensitive)
    // Sort terms by length descending to match longer phrases first
    const sortedTerms = [...terms].sort((a, b) => b.length - a.length);
    const pattern = new RegExp(`\\b(${sortedTerms.join('|')})\\b`, 'gi');

    const parts = value.split(pattern);
    return parts.map((part, i) => {
      const isTerm = sortedTerms.some(t => t.toLowerCase() === part.toLowerCase());
      if (isTerm) {
        return <TermTooltip key={i} term={part}>{part}</TermTooltip>;
      }
      return part;
    });
  };

  const tabs = [
    { id: 'mechanical', label: 'Mechanical' },
    { id: 'dimensions', label: 'Dimensions' },
    { id: 'safety', label: 'Safety' },
    { id: 'tech', label: 'Tech' },
    { id: 'interior', label: 'Interior' },
  ];

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
            <Button
              label="Automated Insights"
              variant="tonal"
              icon="auto_awesome"
              onClick={() => setShowInsights(true)}
              disabled={comparedVehicles.length < 2}
            />
            <button className={styles.infoButton} onClick={() => setShowLegend(!showLegend)}>
              <span className="material-symbols-outlined">info</span>
            </button>
            <Button label="Add" variant="text" icon="add" />
          </div>
        }
      />
      {showInsights && (
        <AIInsightsModal
          vehicles={comparedVehicles}
          onClose={() => setShowInsights(false)}
        />
      )}

      <div className={styles.stickyControls}>
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

        <DiffToggle 
          enabled={showDifferencesOnly}
          onToggle={setShowDifferencesOnly}
          differenceCount={differentCount}
          identicalCount={sameCount}
        />
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

      <div className={styles.tableWrapper}>
        <div className={styles.grid}>
          {/* Header Row */}
          <div className={styles.stickyHeaderRow}>
            <div className={styles.labelCell}>
              {/* Empty space for label column */}
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
          <div className={styles.specRowsContainer}>
            <AnimatePresence mode="popLayout">
              {(() => {
                const cat = tabs.find(t => t.id === activeTab)!;
                const keys = [...new Set(comparedVehicles.flatMap(v => Object.keys((v.specs as any)[cat.id] || {})))];
                
                if (keys.length === 0) return (
                  <div className={styles.noData}>No specifications for this category.</div>
                );

                const visibleRows = keys.map(key => {
                  const different = hasDifference(cat.id, key);
                  if (showDifferencesOnly && !different) return null;

                  const bestVehicleIds = cat.id === 'mechanical' 
                    ? bestInClassCalculator.calculateBest(
                        cat.id, 
                        key, 
                        comparedVehicles.map(v => ({ vehicleId: v.id, value: (v.specs as any)[cat.id][key] || '' }))
                      )
                    : [];

                  return (
                    <motion.div 
                      key={key} 
                      className={styles.specRow}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.labelCell}>
                        <span className="body-medium secondary-text">{key}</span>
                      </div>
                      {comparedVehicles.map((v, idx) => {
                        const val = (v.specs as any)[cat.id][key] || '-';
                        const isBest = bestVehicleIds.includes(v.id);
                        const isBootCapacity = key.toLowerCase().includes('boot capacity');
                        const bootLitres = isBootCapacity ? parseInt(val.replace(/[^0-9]/g, '')) : 0;
                        const isANCAP = key.toLowerCase().includes('ancap');

                        return (
                          <div 
                            key={v.id} 
                            className={`${styles.valueCell} ${getHighlight(cat.id, key, val, idx)} ${isBest ? styles.bestInClass : ''}`}
                          >
                            <div className={styles.valueContent}>
                              {isANCAP ? (
                                <ANCAPContextDisplay 
                                  rating={v.ancap_rating} 
                                  testYear={v.ancap_test_year} 
                                />
                              ) : (
                                <>
                                  <span className="body-large">{renderValueWithTooltips(val)}</span>
                                  <SpecHighlightBadge isBestInClass={isBest} />
                                </>
                              )}
                            </div>
                            {isBootCapacity && bootLitres > 0 && (
                              <BootVisualizer 
                                litres={bootLitres} 
                                onShowInfo={() => setShowMethodology(true)} 
                              />
                            )}
                          </div>
                        );
                      })}
                    </motion.div>
                  );
                });

                const summaryIndicator = showDifferencesOnly && sameCount > 0 ? (
                  <motion.div 
                    key="summary-indicator"
                    className={styles.summaryIndicator}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <span className="label-medium">{sameCount} identical specification{sameCount === 1 ? '' : 's'} hidden</span>
                  </motion.div>
                ) : null;

                return [summaryIndicator, ...visibleRows];
              })()}
            </AnimatePresence>
          </div>
        </div>
      </div>
      {showMethodology && <MethodologyModal onClose={() => setShowMethodology(false)} />}
    </div>
  );
};


