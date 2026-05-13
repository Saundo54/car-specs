import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Chip } from '../../components/ui/Chip';
import { Button } from '../../components/ui/Button';
import styles from './FilterBottomSheet.module.css';

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  resultCount: number;
}

export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({ isOpen, onClose, resultCount }) => {
  const { filters, setFilters, clearFilters } = useAppStore();

  if (!isOpen) return null;

  const toggleBodyType = (type: string) => {
    const next = filters.bodyTypes.includes(type)
      ? filters.bodyTypes.filter(t => t !== type)
      : [...filters.bodyTypes, type];
    setFilters({ bodyTypes: next });
  };

  const toggleFuelType = (type: string) => {
    const next = filters.fuelTypes.includes(type)
      ? filters.fuelTypes.filter(t => t !== type)
      : [...filters.fuelTypes, type];
    setFilters({ fuelTypes: next });
  };

  const bodyTypes = ["Sedan", "SUV", "Hatch", "Wagon", "Ute", "Van"];
  const fuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric", "PHEV"];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.dragHandle} />
        
        <div className={styles.header}>
          <h2 className="title-large">Filters</h2>
          <Button label="Reset all" variant="text" onClick={clearFilters} />
        </div>

        <div className={styles.scrollArea}>
          <section className={styles.section}>
            <h3 className="label-large secondary-text">Body Type</h3>
            <div className={styles.chipGrid}>
              {bodyTypes.map(type => (
                <Chip 
                  key={type} 
                  label={type} 
                  selected={filters.bodyTypes.includes(type)} 
                  onClick={() => toggleBodyType(type)}
                />
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h3 className="label-large secondary-text">Fuel Type</h3>
            <div className={styles.chipGrid}>
              {fuelTypes.map(type => (
                <Chip 
                  key={type} 
                  label={type} 
                  selected={filters.fuelTypes.includes(type)} 
                  onClick={() => toggleFuelType(type)}
                />
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h3 className="label-large secondary-text">Year Range</h3>
            <div className={styles.rangeInfo}>
              <span className="body-large">{filters.yearRange[0]} — {filters.yearRange[1]}</span>
            </div>
            {/* Simple slider implementation for prototype */}
            <input 
              type="range" 
              min="2018" 
              max="2026" 
              value={filters.yearRange[1]}
              onChange={(e) => setFilters({ yearRange: [2018, parseInt(e.target.value)] })}
              className={styles.slider}
            />
          </section>
        </div>

        <div className={styles.footer}>
          <Button 
            label={`Show ${resultCount} vehicles`} 
            variant="filled" 
            fullWidth 
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
};
