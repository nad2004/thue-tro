import { create } from 'zustand';

interface QueryState {
  searchText?: string;
  categoryId?: string;
  status?: string;
  page: number;
  limit: number;
  selectedTags: string[];
  activeTab: string;
  priceRange: {
    min?: number;
    max?: number;
  };
  areaRange: {
    min?: number;
    max?: number;
  };
  setSearchText: (searchText: string) => void;
  setCategoryId: (categoryId: string | null) => void;
  setStatus: (status: string) => void;
  setSelectedTags: (tagsId: string[]) => void;
  setActiveTab: (tab: string) => void;
  setPage: (page: number) => void;
  setPriceRange: (data: { min?: number; max?: number }) => void;
  setAreaRange: (data: { min?: number; max?: number }) => void;
  resetFilters: () => void;
}

export const useQueryStore = create<QueryState>()((set) => ({
  searchText: undefined,
  categoryId: undefined,
  status: undefined,
  page: 1,
  limit: 12,
  selectedTags: [],
  activeTab: 'all',
  priceRange: {
    min: undefined,
    max: undefined,
  },
  areaRange: {
    min: undefined,
    max: undefined,
  },

  setSearchText: (searchText: string) => {
    set({ searchText: searchText || undefined, page: 1 });
  },

  setCategoryId: (categoryId: string | null) => {
    set({ categoryId: categoryId || undefined, page: 1 });
  },

  setStatus: (status: string) => {
    set({ status: status || undefined, page: 1 });
  },

  setSelectedTags: (tagsId: string[]) => {
    set({ selectedTags: tagsId, page: 1 });
  },

  setActiveTab: (tab: string) => {
    set({ activeTab: tab, page: 1 });
  },

  setPage: (page: number) => {
    set({ page });
  },

  setPriceRange: (data) =>
    set((state) => ({
      priceRange: {
        ...state.priceRange,
        ...data,
      },
      page: 1,
    })),

  setAreaRange: (data) =>
    set((state) => ({
      areaRange: {
        ...state.areaRange,
        ...data,
      },
      page: 1,
    })),

  resetFilters: () =>
    set({
      searchText: undefined,
      categoryId: undefined,
      status: undefined,
      selectedTags: [],
      activeTab: 'all',
      priceRange: { min: undefined, max: undefined },
      areaRange: { min: undefined, max: undefined },
      page: 1,
      limit: 12,
    }),
}));
