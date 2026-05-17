import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { Chip } from '../../components/ui/Chip';
import { Button } from '../../components/ui/Button';
import { FeatureFilterChecklist } from '../../components/ui/FeatureFilterChecklist';
import { SPRING_CONFIGS } from '../../constants/animations';
import styles from './FilterBottomSheet.module.css';

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  resultCount: number;
}

export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({ isOpen, onClose, resultCount }) => {
  const { filters, setFilters, clearFilters } = useAppStore();

  const toggleArrayFilter = (field: keyof typeof filters, value: any) => {
    const current = filters[field] as any[];
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setFilters({ [field]: next });
  };

  const bodyTypes = ["Sedan", "SUV", "Hatch", "Wagon", "Ute", "Van", "Convertible", "Coupe"];
  const fuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric", "PHEV"];
  const transmissions = ["Automatic", "Manual"];
  const driveTypes = ["Front Wheel Drive", "Rear Wheel Drive", "4X4", "4X2", "All Wheel Drive"];
  const cylinderOptions = [3, 4, 5, 6, 8, 10, 12];
  const inductionOptions = ["Aspirated", "Turbo", "Supercharged"];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlayWrapper}>
          <motion.div 
            className={styles.overlay} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose} 
          />
          <motion.div 
            className={styles.sheet} 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={SPRING_CONFIGS.expressive}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.dragHandle} />
            
            <div className={styles.header}>
              <h2 className="title-large">Advanced Filters</h2>
              <Button label="Reset all" variant="text" onClick={clearFilters} />
            </div>

            <div className={styles.scrollArea}>
              <section className={styles.section}>
                <h3 className="label-large secondary-text">Year Range</h3>
                <div className={styles.yearInputs}>
                  <div className={styles.yearBox}>
                    <span className="label-small">From</span>
                    <input 
                      type="number" min="2018" max="2025"
                      value={filters.yearRange[0]}
                      onChange={(e) => setFilters({ yearRange: [parseInt(e.target.value), filters.yearRange[1]] })}
                      className={styles.numInput}
                    />
                  </div>
                  <div className={styles.yearBox}>
                    <span className="label-small">To</span>
                    <input 
                      type="number" min="2018" max="2025"
                      value={filters.yearRange[1]}
                      onChange={(e) => setFilters({ yearRange: [filters.yearRange[0], parseInt(e.target.value)] })}
                      className={styles.numInput}
                    />
                  </div>
                </div>
              </section>

              <section className={styles.section}>
                <h3 className="label-large secondary-text">Body Type</h3>
                <div className={styles.chipGrid}>
                  {bodyTypes.map(type => (
                    <Chip key={type} label={type} selected={filters.bodyTypes.includes(type)} onClick={() => toggleArrayFilter('bodyTypes', type)} />
                  ))}
                </div>
              </section>

              <section className={styles.section}>
                <h3 className="label-large secondary-text">Fuel Type</h3>
                <div className={styles.chipGrid}>
                  {fuelTypes.map(type => (
                    <Chip key={type} label={type} selected={filters.fuelTypes.includes(type)} onClick={() => toggleArrayFilter('fuelTypes', type)} />
                  ))}
                </div>
              </section>

              <section className={styles.section}>
                <h3 className="label-large secondary-text">Transmission</h3>
                <div className={styles.chipGrid}>
                  {transmissions.map(t => (
                    <Chip key={t} label={t} selected={filters.transmissions.includes(t)} onClick={() => toggleArrayFilter('transmissions', t)} />
                  ))}
                </div>
              </section>

              <section className={styles.section}>
                <h3 className="label-large secondary-text">Drive Type</h3>
                <div className={styles.chipGrid}>
                  {driveTypes.map(t => (
                    <Chip key={t} label={t} selected={filters.driveTypes.includes(t)} onClick={() => toggleArrayFilter('driveTypes', t)} />
                  ))}
                </div>
              </section>

              <section className={styles.section}>
                <h3 className="label-large secondary-text">Cylinders</h3>
                <div className={styles.chipGrid}>
                  {cylinderOptions.map(c => (
                    <Chip key={c} label={c.toString()} selected={filters.cylinders.includes(c)} onClick={() => toggleArrayFilter('cylinders', c)} />
                  ))}
                </div>
              </section>

              <section className={styles.section}>
                <h3 className="label-large secondary-text">Power (kW)</h3>
                <div className={styles.powerInputs}>
                  <div className={styles.powerBox}>
                    <span className="label-small">Min</span>
                    <input 
                      type="number" placeholder="Any"
                      value={filters.powerRange[0] === 'Any' ? '' : filters.powerRange[0]}
                      onChange={(e) => setFilters({ powerRange: [e.target.value === '' ? 'Any' : parseInt(e.target.value), filters.powerRange[1]] })}
                      className={styles.numInput}
                    />
                  </div>
                  <div className={styles.powerBox}>
                    <span className="label-small">Max</span>
                    <input 
                      type="number" placeholder="Any"
                      value={filters.powerRange[1] === 'Any' ? '' : filters.powerRange[1]}
                      onChange={(e) => setFilters({ powerRange: [filters.powerRange[0], e.target.value === '' ? 'Any' : parseInt(e.target.value)] })}
                      className={styles.numInput}
                    />
                  </div>
                </div>
              </section>

              <section className={styles.section}>
                <h3 className="label-large secondary-text">Induction</h3>
                <div className={styles.chipGrid}>
                  {inductionOptions.map(i => (
                    <Chip key={i} label={i} selected={filters.inductions.includes(i)} onClick={() => toggleArrayFilter('inductions', i)} />
                  ))}
                </div>
              </section>

              <section className={styles.section}>
                <FeatureFilterChecklist 
                  selectedFeatures={filters.features}
                  onFeatureToggle={(id) => toggleArrayFilter('features', id)}
                  matchingCount={resultCount}
                />
              </section>
            </div>

            <div className={styles.footer}>
              <Button 
                label={`Show ${resultCount} vehicles`} 
                variant="filled" fullWidth 
                onClick={onClose}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
