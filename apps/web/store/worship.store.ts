// apps/web/store/worship.store.ts
'use client';

import { create } from 'zustand';

interface WorshipState {
  selectedKeyOffset: number;
  setSelectedKeyOffset: (offset: number) => void;
}

export const useWorshipStore = create<WorshipState>((set) => ({
  selectedKeyOffset: 0,
  setSelectedKeyOffset: (offset) => set({ selectedKeyOffset: offset }),
}));
