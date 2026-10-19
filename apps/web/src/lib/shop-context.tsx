"use client";

import {
  addCredit,
  addProduct,
  createDemoStore,
  deleteProduct,
  markCreditPaid,
  recordSale,
  toInsightShopData,
  updateProduct,
  type CreateCreditInput,
  type CreateProductInput,
  type CreateSaleInput,
  type ShopStore,
  type UpdateProductInput,
} from "@vyomai/api-client";
import { profitSummary, runAllInsights, type Alert } from "@vyomai/insights";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "vyomai.shop.v2";

type ShopContextValue = {
  ready: boolean;
  store: ShopStore;
  alerts: Alert[];
  summary: ReturnType<typeof profitSummary>;
  resetDemo: (shopName?: string) => void;
  setShopName: (name: string) => void;
  createProduct: (input: CreateProductInput) => void;
  editProduct: (id: string, input: UpdateProductInput) => void;
  removeProduct: (id: string) => void;
  sell: (input: CreateSaleInput) => string | null;
  lend: (input: CreateCreditInput) => void;
  settleCredit: (id: string) => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

function loadStore(): ShopStore {
  if (typeof window === "undefined") return createDemoStore("VYOMAI Demo Shop");
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ShopStore;
  } catch {
    /* ignore corrupt storage */
  }
  return createDemoStore("VYOMAI Demo Shop");
}

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<ShopStore>(() =>
    createDemoStore("VYOMAI Demo Shop")
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setStore(loadStore());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [store, ready]);

  const insightData = useMemo(() => toInsightShopData(store), [store]);
  const alerts = useMemo(() => runAllInsights(insightData), [insightData]);
  const summary = useMemo(() => profitSummary(insightData), [insightData]);

  const resetDemo = useCallback((shopName?: string) => {
    setStore(createDemoStore(shopName || "VYOMAI Demo Shop"));
  }, []);

  const setShopName = useCallback((name: string) => {
    setStore((prev) => ({
      ...prev,
      shop: { ...prev.shop, name: name.trim() || prev.shop.name },
    }));
  }, []);

  const createProduct = useCallback((input: CreateProductInput) => {
    setStore((prev) => addProduct(prev, input));
  }, []);

  const editProduct = useCallback((id: string, input: UpdateProductInput) => {
    setStore((prev) => updateProduct(prev, id, input));
  }, []);

  const removeProduct = useCallback((id: string) => {
    setStore((prev) => deleteProduct(prev, id));
  }, []);

  const sell = useCallback((input: CreateSaleInput) => {
    let error: string | null = null;
    setStore((prev) => {
      const result = recordSale(prev, input);
      error = result.error ?? null;
      return result.store;
    });
    return error;
  }, []);

  const lend = useCallback((input: CreateCreditInput) => {
    setStore((prev) => addCredit(prev, input));
  }, []);

  const settleCredit = useCallback((id: string) => {
    setStore((prev) => markCreditPaid(prev, id));
  }, []);

  const value: ShopContextValue = {
    ready,
    store,
    alerts,
    summary,
    resetDemo,
    setShopName,
    createProduct,
    editProduct,
    removeProduct,
    sell,
    lend,
    settleCredit,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
