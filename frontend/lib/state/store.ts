import { create } from "zustand";
import type { Product, TrackingEvent } from "../types";

interface SupplyLinkStore {
  products: Product[];
  events: TrackingEvent[];
  walletAddress: string | null;
  xlmBalance: string | null;
  networkMismatch: boolean;
  lastFetched: number | null;
  setWalletAddress: (address: string | null) => void;
  setXlmBalance: (balance: string | null) => void;
  setNetworkMismatch: (mismatch: boolean) => void;
  addProduct: (product: Product) => void;
  addEvent: (event: TrackingEvent) => void;
  setProducts: (products: Product[]) => void;
  setEvents: (events: TrackingEvent[]) => void;
  setLastFetched: (ts: number) => void;
  updateProductOwner: (productId: string, newOwner: string) => void;
}

export const useStore = create<SupplyLinkStore>((set) => ({
  products: [],
  events: [],
  walletAddress: null,
  xlmBalance: null,
  networkMismatch: false,
  lastFetched: null,
  setWalletAddress: (address) => set({ walletAddress: address }),
  setXlmBalance: (balance) => set({ xlmBalance: balance }),
  setNetworkMismatch: (mismatch) => set({ networkMismatch: mismatch }),
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
  addEvent: (event) =>
    set((state) => ({ events: [...state.events, event] })),
  setProducts: (products) => set({ products }),
  setEvents: (events) => set({ events }),
  setLastFetched: (ts) => set({ lastFetched: ts }),
  updateProductOwner: (productId, newOwner) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, owner: newOwner } : p
      ),
    })),
}));
