import { create } from "zustand";
import type { Product, TrackingEvent } from "../types";

interface SupplyLinkStore {
  products: Product[];
  events: TrackingEvent[];
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;
  addProduct: (product: Product) => void;
  addEvent: (event: TrackingEvent) => void;
}

export const useStore = create<SupplyLinkStore>((set) => ({
  products: [],
  events: [],
  walletAddress: null,
  setWalletAddress: (address) => set({ walletAddress: address }),
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
  addEvent: (event) =>
    set((state) => ({ events: [...state.events, event] })),
}));
