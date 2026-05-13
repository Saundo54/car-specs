import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FilterState {
  bodyTypes: string[];
  fuelTypes: string[];
  yearRange: [number, number];
}

interface AppState {
  vehicles: any[];
  isLoading: boolean;
  searchQuery: string;
  filters: FilterState;
  comparisonList: string[]; // vehicle IDs
  favorites: string[]; // vehicle IDs

  fetchVehicles: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  addToComparison: (id: string) => void;
  removeFromComparison: (id: string) => void;
  toggleFavorite: (id: string) => void;
  clearFilters: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      vehicles: [],
      isLoading: false,
      searchQuery: '',
      filters: {
        bodyTypes: [],
        fuelTypes: [],
        yearRange: [2018, 2026],
      },
      comparisonList: [],
      favorites: [],

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

      addToComparison: (id) => set((state) => {
        if (state.comparisonList.includes(id)) return state;
        if (state.comparisonList.length >= 3) return state; // UX limit
        return { comparisonList: [...state.comparisonList, id] };
      }),

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
        }
      }),
    }),
    {
      name: 'carspec-storage',
    }
  )
);
