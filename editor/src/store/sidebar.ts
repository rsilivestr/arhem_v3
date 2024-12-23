import { create } from 'zustand';

type SidebarState = {
  isOpen: boolean;
  toggleOpen(): void;
};

export const useSidebarState = create<SidebarState>((set) => ({
  isOpen: true,
  toggleOpen() {
    set((prev) => ({ isOpen: !prev.isOpen }));
  },
}));
