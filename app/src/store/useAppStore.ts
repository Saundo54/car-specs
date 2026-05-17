import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FilterState {
  bodyTypes: string[];
  fuelTypes: string[];
  yearRange: [number, number];
  transmissions: string[];
  driveTypes: string[];
  cylinders: number[];
  powerRange: [number | 'Any', number | 'Any'];
  inductions: string[];
  features: string[];
}

interface AppState {
  vehicles: any[];
  isLoading: boolean;
  searchQuery: string;
  filters: FilterState;
  comparisonList: string[]; // vehicle IDs
  favorites: string[]; // vehicle IDs
  lastAddedVehicle: { id: string, image: string, x: number, y: number } | null;
  comparisonError: string | null;
  hasEnteredApp: boolean; // For splash screen
  quizResults: Record<string, string> | null;

  fetchVehicles: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  addToComparison: (id: string, origin?: { x: number, y: number }) => void;
  removeFromComparison: (id: string) => void;
  toggleFavorite: (id: string) => void;
  clearFilters: () => void;
  clearComparison: () => void;
  setLastAddedVehicle: (v: { id: string, image: string, x: number, y: number } | null) => void;
  setComparisonError: (error: string | null) => void;
  enterApp: () => void;
  resetApp: () => void;
  setQuizResults: (results: Record<string, string> | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      vehicles: [],
      isLoading: false,
      searchQuery: '',
      filters: {
        bodyTypes: [],
        fuelTypes: [],
        yearRange: [2018, 2026],
        transmissions: [],
        driveTypes: [],
        cylinders: [],
        powerRange: ['Any', 'Any'],
        inductions: [],
        features: [],
      },
      comparisonList: [],
      favorites: [],
      lastAddedVehicle: null,
      comparisonError: null,
      hasEnteredApp: false,
      quizResults: null,

      fetchVehicles: async () => {
        set({ isLoading: true });
        try {
          const response = await fetch('/data/vehicles.json');
          const data = await response.json();
          set({ vehicles: data, isLoading: false });
        } catch (err) {
          console.error('Failed to fetch vehicles:', err);
          set({ isLoading: false });
        }
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters }
      })),

      addToComparison: (id, origin) => {
        const state = get();
        if (state.comparisonList.includes(id)) return;
        
        if (state.comparisonList.length >= 3) {
          set({ comparisonError: 'Comparison limit reached (max 3 vehicles)' });
          return;
        }

        const vehicle = state.vehicles.find(v => v.id === id);
        if (vehicle && origin) {
          set({ lastAddedVehicle: { id, image: vehicle.image, ...origin } });
        }

        set((state) => ({ comparisonList: [...state.comparisonList, id] }));
      },

      removeFromComparison: (id) => set((state) => ({
        comparisonList: state.comparisonList.filter((cid) => cid !== id)
      })),

      toggleFavorite: (id) => set((state) => ({
        favorites: state.favorites.includes(id)
          ? state.favorites.filter((fid) => fid !== id)
          : [...state.favorites, id]
      })),

      clearFilters: () => set({
        filters: {
          bodyTypes: [],
          fuelTypes: [],
          yearRange: [2018, 2026],
          transmissions: [],
          driveTypes: [],
          cylinders: [],
          powerRange: ['Any', 'Any'],
          inductions: [],
          features: [],
        }
      }),

      clearComparison: () => set({ comparisonList: [] }),

      setLastAddedVehicle: (v) => set({ lastAddedVehicle: v }),

      setComparisonError: (error) => set({ comparisonError: error }),

      enterApp: () => set({ hasEnteredApp: true }),

      resetApp: () => set({ hasEnteredApp: false }),

      setQuizResults: (results) => set({ quizResults: results }),
    }),
    {
      name: 'carspec-storage',
      partialize: (state) => ({
        comparisonList: state.comparisonList,
        favorites: state.favorites,
        filters: state.filters,
        quizResults: state.quizResults,
      }),
    }
  )
);
