import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';
import { Button } from '../../components/ui/Button';
import { IconButton } from '../../components/ui/IconButton';
import { FilterBottomSheet } from './FilterBottomSheet';
import styles from './SearchScreen.module.css';

export const SearchScreen: React.FC = () => {
  const navigate = useNavigate();
  const { 
    vehicles, 
    isLoading, 
    fetchVehicles, 
    searchQuery, 
    setSearchQuery, 
    filters, 
    addToComparison, 
    comparisonList 
  } = useAppStore();
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [expandedAlpha, setExpandedAlpha] = useState<string | null>(null);
  const [selectedMake, setSelectedMake] = useState<string | null>(null);
  const [expandedModelAlpha, setExpandedModelAlpha] = useState<string | null>(null);
  const [expandedModel, setExpandedModel] = useState<string | null>(null);

  useEffect(() => {
    if (vehicles.length === 0) {
      fetchVehicles();
    }
  }, []);

  const normalizeFuelType = (v: any) => {
    const raw = v.fuel_type || (v.specs?.mechanical && (v.specs.mechanical['Fuel type'] || v.specs.mechanical['Fuel Type'])) || '';
    const lower = raw.toLowerCase();
    if (lower.includes('petrol')) return 'Petrol';
    if (lower.includes('diesel')) return 'Diesel';
    if (lower.includes('hybrid')) return 'Hybrid';
    if (lower.includes('electric')) return 'Electric';
    return raw || 'Other';
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = 
      v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.year.toString().includes(searchQuery);
    
    const fuelType = normalizeFuelType(v);
    const bodyType = v.body_type || 'Sedan';

    const matchesBodyType = filters.bodyTypes.length === 0 || filters.bodyTypes.includes(bodyType);
    const matchesFuelType = filters.fuelTypes.length === 0 || filters.fuelTypes.includes(fuelType);
    const matchesYear = v.year >= filters.yearRange[0] && v.year <= filters.yearRange[1];

    return matchesSearch && matchesBodyType && matchesFuelType && matchesYear;
  });

  // Top-level A-Z (Makes)
  const makeAlphaGroups = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').reduce((acc, letter) => {
    const makesInGroup = [...new Set(filteredVehicles
      .filter(v => v.make.toUpperCase().startsWith(letter))
      .map(v => v.make))].sort();
    if (makesInGroup.length > 0) acc[letter] = makesInGroup;
    return acc;
  }, {} as Record<string, string[]>);

  // Helper to get models and their letters for a selected make
  const getModelAlphaGroups = (make: string) => {
    const makeVehicles = filteredVehicles.filter(v => v.make === make);
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').reduce((acc, letter) => {
      const modelsInGroup = [...new Set(makeVehicles
        .filter(v => v.model.toUpperCase().startsWith(letter))
        .map(v => v.model))].sort();
      if (modelsInGroup.length > 0) acc[letter] = modelsInGroup;
      return acc;
    }, {} as Record<string, string[]>);
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading vehicles...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.stickyHeader}>
        <div className={styles.searchBar}>
          <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
          <input 
            type="text" 
            placeholder="Search make, model, year..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedMake(null);
            }}
            className={styles.searchInput}
          />
          <IconButton icon="tune" onClick={() => setIsFilterSheetOpen(true)} />
        </div>
        <div className={styles.chipRow}>
          <Chip label="2018" selected icon="event" />
          <Chip label="Body Type" selected={filters.bodyTypes.length > 0} icon="directions_car" onClick={() => setIsFilterSheetOpen(true)} />
          <Chip label="Fuel Type" selected={filters.fuelTypes.length > 0} icon="ev_station" onClick={() => setIsFilterSheetOpen(true)} />
        </div>
      </div>

      <div className={styles.contentArea}>
        {filteredVehicles.length === 0 ? (
          <div className={styles.noResults}>
            <span className="material-symbols-outlined">search_off</span>
            <h2 className="headline-small">No vehicles found</h2>
            <p className="body-medium secondary-text">Try adjusting your filters or search query.</p>
            <Button label="Clear all filters" variant="tonal" onClick={clearFilters} />
          </div>
        ) : selectedMake ? (
          <div className={styles.alphaList}>
            <div className={styles.resultsMeta}>
              <Button label={`← Brands`} variant="text" onClick={() => setSelectedMake(null)} />
              <span className="label-medium">{selectedMake}</span>
            </div>
            {Object.entries(getModelAlphaGroups(selectedMake)).map(([letter, models]) => (
              <div key={letter} className={styles.alphaGroup}>
                <button 
                  className={styles.alphaHeader}
                  onClick={() => setExpandedModelAlpha(expandedModelAlpha === letter ? null : letter)}
                >
                  <span className="title-medium">{letter}</span>
                  <span className="material-symbols-outlined">
                    {expandedModelAlpha === letter ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                {expandedModelAlpha === letter && (
                  <div className={styles.modelList}>
                    {models.map(model => {
                      const modelVariants = filteredVehicles.filter(v => v.make === selectedMake && v.model === model);
                      const repImage = modelVariants.find(v => v.image)?.image;
                      
                      return (
                        <div key={model} className={styles.modelGroup}>
                          <button 
                            className={styles.modelHeader}
                            onClick={() => setExpandedModel(expandedModel === model ? null : model)}
                          >
                            <div className={styles.modelHeaderContent}>
                              {repImage && <img src={repImage} className={styles.modelThumb} alt="" />}
                              <span className="body-large">{model}</span>
                            </div>
                            <span className="material-symbols-outlined">
                              {expandedModel === model ? 'expand_less' : 'expand_more'}
                            </span>
                          </button>
                          
                          {expandedModel === model && (
                            <div className={styles.variantGrid}>
                              {modelVariants.map(v => (
                                <Card 
                                  key={v.id} 
                                  variant="outlined" 
                                  onClick={() => navigate(`/vehicles/${v.id}`)}
                                  className={styles.vehicleCard}
                                >
                                  {v.image && (
                                    <div className={styles.cardImageContainer}>
                                      <img src={v.image} alt={v.variant} className={styles.cardImage} />
                                    </div>
                                  )}
                                  <div className={styles.cardContent}>
                                    <h3 className="title-medium">{v.variant}</h3>
                                    <div className={styles.factRow}>
                                      <span className={`${styles.fact} secondary-text`}>{normalizeFuelType(v)}</span>
                                      <span className={`${styles.dot} secondary-text`}>·</span>
                                      <span className={`${styles.fact} secondary-text`}>{v.body_type || 'Sedan'}</span>
                                    </div>

                                    <div className={styles.cardActions}>
                                      <Button 
                                        label={comparisonList.includes(v.id) ? "Added" : "Compare +"} 
                                        variant={comparisonList.includes(v.id) ? "tonal" : "outlined"}
                                        onClick={(e) => { e.stopPropagation(); addToComparison(v.id); }}
                                      />
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.alphaList}>
            {Object.entries(makeAlphaGroups).map(([letter, makes]) => (
              <div key={letter} className={styles.alphaGroup}>
                <button 
                  className={styles.alphaHeader}
                  onClick={() => setExpandedAlpha(expandedAlpha === letter ? null : letter)}
                >
                  <span className="title-large">{letter}</span>
                  <span className="material-symbols-outlined">
                    {expandedAlpha === letter ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                {expandedAlpha === letter && (
                  <div className={styles.makeList}>
                    {makes.map(make => (
                      <button 
                        key={make} 
                        className={styles.makeItem}
                        onClick={() => setSelectedMake(make)}
                      >
                        <span className="body-large">{make}</span>
                        <span className="material-symbols-outlined">chevron_right</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <FilterBottomSheet 
        isOpen={isFilterSheetOpen} 
        onClose={() => setIsFilterSheetOpen(false)} 
        resultCount={filteredVehicles.length}
      />
    </div>
  );
};
