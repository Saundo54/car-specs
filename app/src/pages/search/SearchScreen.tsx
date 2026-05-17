import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { Chip } from '../../components/ui/Chip';
import { Button } from '../../components/ui/Button';
import { IconButton } from '../../components/ui/IconButton';
import { FilterBottomSheet } from './FilterBottomSheet';
import { VariantOverlay } from './VariantOverlay';
import { ShortlistBar } from './ShortlistBar';
import { SplashScreen } from './SplashScreen';
import { Snackbar } from '../../components/ui/Snackbar';
import { useInteractionOrigin } from '../../hooks/useInteractionOrigin';
import { SPRING_CONFIGS, ACCORDION_TRANSITIONS } from '../../constants/animations';
import { LifestyleQuiz } from '../../components/ui/LifestyleQuiz';
import { QuizInfoModal } from '../../components/ui/QuizInfoModal';
import { featureFilterService } from '../../services/FeatureFilterService';
import styles from './SearchScreen.module.css';

const brandLogos: Record<string, string> = {
  audi: '/images/logo/brands/audi.svg',
  ford: '/images/logo/brands/ford.svg',
  honda: '/images/logo/brands/honda.svg',
  hyundai: '/images/logo/brands/hyundai.svg',
  kia: '/images/logo/brands/kia.svg',
  mazda: '/images/logo/brands/mazda.svg',
  toyota: '/images/logo/brands/toyota.svg',
  volkswagen: '/images/logo/brands/volkswagen.svg',
};

export const SearchScreen: React.FC = () => {
  const navigate = useNavigate();
  const { origin, captureOrigin } = useInteractionOrigin();
  const { 
    vehicles, 
    isLoading, 
    fetchVehicles, 
    searchQuery, 
    setSearchQuery, 
    filters, 
    addToComparison, 
    comparisonList,
    clearFilters,
    comparisonError,
    setComparisonError,
    hasEnteredApp,
    resetApp,
    quizResults
  } = useAppStore();
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [expandedAlpha, setExpandedAlpha] = useState<string | null>(null);
  const [selectedMake, setSelectedMake] = useState<string | null>(null);
  const [expandedModelAlpha, setExpandedModelAlpha] = useState<string | null>(null);
  const [expandedModel, setExpandedModel] = useState<string | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isQuizInfoOpen, setIsQuizInfoOpen] = useState(false);

  useEffect(() => {
    if (vehicles.length === 0) {
      fetchVehicles();
    }
  }, [vehicles.length, fetchVehicles]);

  useEffect(() => {
    resetApp();
  }, [resetApp]);

  const normalizeFuelType = (v: any) => {
    const raw = v.fuel_type || v.specs?.mechanical?.['Fuel type'] || v.specs?.mechanical?.['Fuel Type'] || '';
    const lower = raw.toLowerCase();
    if (lower.includes('petrol')) return 'Petrol';
    if (lower.includes('diesel')) return 'Diesel';
    if (lower.includes('hybrid')) return 'Hybrid';
    if (lower.includes('electric')) return 'Electric';
    return raw || 'Other';
  };

  const filteredVehicles = vehicles.filter(v => {
    const mech = v.specs?.mechanical || {};

    // Basic search matches
    const matchesSearch = 
      v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.year.toString().includes(searchQuery);
    if (!matchesSearch) return false;

    // Year range
    const matchesYear = v.year >= filters.yearRange[0] && v.year <= filters.yearRange[1];
    if (!matchesYear) return false;

    // Body type
    if (filters.bodyTypes.length > 0 && !filters.bodyTypes.includes(v.body_type || 'Sedan')) return false;

    // Fuel type
    const fuelType = normalizeFuelType(v);
    if (filters.fuelTypes.length > 0 && !filters.fuelTypes.includes(fuelType)) return false;

    // Transmission - Check 'Gear Type'
    const trans = mech['Gear Type'] || mech['Transmission'] || '';
    if (filters.transmissions.length > 0) {
      const isManual = trans.toLowerCase().includes('manual');
      const isAuto = !isManual && (trans.toLowerCase().includes('auto') || trans.toLowerCase().includes('cvt') || trans.toLowerCase().includes('dual clutch') || trans.toLowerCase().includes('constantly variable'));
      if (filters.transmissions.includes('Manual') && !isManual) return false;
      if (filters.transmissions.includes('Automatic') && !isAuto) return false;
    }

    // Drive Type
    const drive = mech['Drive'] || '';
    if (filters.driveTypes.length > 0) {
      const match = filters.driveTypes.some((dt: string) => {
        if (dt === '4X4' || dt === '4x4') return drive.includes('4X4') || drive.includes('4x4') || drive.includes('4WD');
        if (dt === '4X2' || dt === '4x2') return drive.includes('4X2') || drive.includes('4x2') || drive.includes('2WD');
        return drive.toLowerCase().includes(dt.toLowerCase());
      });
      if (!match) return false;
    }

    // Cylinders
    const cylStr = mech['Cylinders'] || '';
    const cyl = parseInt(cylStr);
    if (filters.cylinders.length > 0 && !filters.cylinders.includes(cyl)) return false;

    // Power - Check 'Power' key
    const powerStr = mech['Power'] || mech['Maximum Power'] || '';
    const powerMatch = powerStr.match(/(\d+(\.\d+)?)/);
    const power = powerMatch ? parseFloat(powerMatch[1]) : 0;
    if (filters.powerRange[0] !== 'Any' && power < (filters.powerRange[0] as number)) return false;
    if (filters.powerRange[1] !== 'Any' && power > (filters.powerRange[1] as number)) return false;

    // Induction
    const induction = mech['Induction'] || '';
    if (filters.inductions.length > 0) {
        const match = filters.inductions.some((ind: string) => induction.toLowerCase().includes(ind.toLowerCase()));
        if (!match) return false;
    }

    // Feature filters (Requirement 6.3)
    if (filters.features.length > 0) {
      const hasAllFeatures = featureFilterService.filterVehicles([v], filters.features).length > 0;
      if (!hasAllFeatures) return false;
    }

    return true;
  });

  // Top-level A-Z (Makes)
  const makeAlphaGroups = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').reduce((acc, letter) => {
    const makesInGroup = [...new Set(filteredVehicles
      .filter(v => v.make.toUpperCase().startsWith(letter))
      .map(v => v.make))].sort();
    if (makesInGroup.length > 0) acc[letter] = makesInGroup;
    return acc;
  }, {} as Record<string, string[]>);

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

  const listVariants = {
    initial: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: SPRING_CONFIGS.standard
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      transition: SPRING_CONFIGS.standard
    })
  };

  const currentVariants = expandedModel 
    ? filteredVehicles.filter(v => v.make === selectedMake && v.model === expandedModel)
    : [];

  const activeFilterCount = 
    filters.bodyTypes.length + 
    filters.fuelTypes.length + 
    filters.transmissions.length + 
    filters.driveTypes.length + 
    filters.cylinders.length + 
    filters.inductions.length +
    (filters.yearRange[0] > 2018 || filters.yearRange[1] < 2025 ? 1 : 0) +
    (filters.powerRange[0] !== 'Any' || filters.powerRange[1] !== 'Any' ? 1 : 0);

  return (
    <div className={styles.container}>
      <AnimatePresence>
        {!hasEnteredApp && <SplashScreen key="splash" />}
      </AnimatePresence>

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
        
        {activeFilterCount > 0 && (
          <div className={styles.chipRow}>
            {(filters.yearRange[0] > 2018 || filters.yearRange[1] < 2025) && (
              <Chip label={`${filters.yearRange[0]}-${filters.yearRange[1]}`} selected icon="event" onClick={() => setIsFilterSheetOpen(true)} />
            )}
            {filters.bodyTypes.map(t => <Chip key={t} label={t} selected icon="directions_car" onClick={() => setIsFilterSheetOpen(true)} />)}
            {filters.fuelTypes.map(t => <Chip key={t} label={t} selected icon="ev_station" onClick={() => setIsFilterSheetOpen(true)} />)}
            {filters.transmissions.map(t => <Chip key={t} label={t} selected icon="settings_input_component" onClick={() => setIsFilterSheetOpen(true)} />)}
            {filters.driveTypes.map(t => <Chip key={t} label={t} selected icon="grid_view" onClick={() => setIsFilterSheetOpen(true)} />)}
            {filters.powerRange[0] !== 'Any' || filters.powerRange[1] !== 'Any' ? (
              <Chip label={`${filters.powerRange[0]}-${filters.powerRange[1]}kW`} selected icon="bolt" onClick={() => setIsFilterSheetOpen(true)} />
            ) : null}
            {activeFilterCount > 0 && <Button label="Clear All" variant="text" onClick={clearFilters} />}
          </div>
        )}
      </div>

      <div className={styles.contentArea}>
        {isQuizOpen ? (
          <div className={styles.quizWrapper}>
            <LifestyleQuiz 
              onComplete={() => setIsQuizOpen(false)} 
              onCancel={() => setIsQuizOpen(false)} 
            />
          </div>
        ) : !selectedMake && (
          <div className={styles.quizPromotion}>
            <div className={styles.quizPromoText}>
              <h3 className="title-medium">Find your perfect match</h3>
              <p className="body-small secondary-text">Answer 3 questions to see recommended car types.</p>
            </div>
            <div className={styles.quizPromoActions}>
              <button className={styles.quizInfoButton} onClick={() => setIsQuizInfoOpen(true)}>
                <span className="material-symbols-outlined">help_outline</span>
              </button>
              <Button label={quizResults ? "Retake Quiz" : "Start Quiz"} variant="tonal" onClick={() => setIsQuizOpen(true)} />
            </div>
          </div>
        )}

        <AnimatePresence mode="popLayout" initial={false} custom={selectedMake ? 1 : -1}>
          {filteredVehicles.length === 0 ? (
            <motion.div 
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.noResults}
            >
              <span className="material-symbols-outlined">search_off</span>
              <h2 className="headline-small">No vehicles found</h2>
              <p className="body-medium secondary-text">Try adjusting your filters or search query.</p>
              <Button label="Clear all filters" variant="tonal" onClick={clearFilters} />
            </motion.div>
          ) : selectedMake ? (
            <motion.div 
              key={`models-${selectedMake}`}
              custom={1}
              variants={listVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={styles.alphaList}
            >
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
                  <AnimatePresence>
                    {expandedModelAlpha === letter && (
                      <motion.div 
                        {...ACCORDION_TRANSITIONS}
                        style={{ overflow: 'hidden' }}
                        className={styles.modelList}
                      >
                        {models.map(model => {
                          const modelVariants = filteredVehicles.filter(v => v.make === selectedMake && v.model === model);
                          const repImage = modelVariants.find(v => v.image)?.image;
                          
                          return (
                            <div key={model} className={styles.modelGroup}>
                              <button 
                                className={styles.modelHeader}
                                onClick={(e) => {
                                  captureOrigin(e);
                                  setExpandedModel(model);
                                }}
                              >
                                <div className={styles.modelHeaderContent}>
                                  {repImage && <img src={repImage} className={styles.modelThumb} alt="" />}
                                  <span className="body-large">{model}</span>
                                </div>
                                <span className="material-symbols-outlined">chevron_right</span>
                              </button>
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="brands-list"
              custom={-1}
              variants={listVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={styles.alphaList}
            >
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
                  <AnimatePresence>
                    {expandedAlpha === letter && (
                      <motion.div 
                        {...ACCORDION_TRANSITIONS}
                        style={{ overflow: 'hidden' }}
                        className={styles.makeList}
                      >
                        <div className={styles.brandGrid}>
                          {makes.map(make => {
                            const makeCount = filteredVehicles.filter(v => v.make === make).length;
                            const logoSrc = brandLogos[make.toLowerCase()] || '/images/logo/splash_logo_transparent.png';

                            return (
                              <button
                                key={make}
                                className={styles.brandCard}
                                onClick={() => setSelectedMake(make)}
                              >
                                <div className={styles.brandLogoWrapper}>
                                  <img
                                    src={logoSrc}
                                    alt={`${make} logo`}
                                    className={styles.brandLogo}
                                  />
                                </div>
                                <div className={styles.brandCardBody}>
                                  <span className="title-small">{make}</span>
                                  <span className="body-small secondary-text">{makeCount} models</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <VariantOverlay 
        isOpen={!!expandedModel}
        onClose={() => setExpandedModel(null)}
        origin={origin}
        modelName={expandedModel || ''}
        variants={currentVariants}
        onVariantClick={(id) => navigate(`/vehicles/${id}`)}
        onAddToCompare={(id, origin) => addToComparison(id, origin)}
        comparisonList={comparisonList}
      />

      <FilterBottomSheet 
        isOpen={isFilterSheetOpen} 
        onClose={() => setIsFilterSheetOpen(false)} 
        resultCount={filteredVehicles.length}
      />

      <ShortlistBar onCompare={() => navigate('/compare')} />

      <Snackbar 
        message={comparisonError || ''} 
        isOpen={!!comparisonError} 
        onClose={() => setComparisonError(null)} 
      />

      {isQuizInfoOpen && <QuizInfoModal onClose={() => setIsQuizInfoOpen(false)} />}
    </div>
  );
};
