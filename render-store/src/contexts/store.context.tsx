import { createContext, useContext, useEffect, useState } from "react";
import { axiosi } from "../config/axios.config";
import { StorefrontProductProvider } from "./product.context";

interface StorefrontContextType {
  isStoreFront: boolean;
  storeFrontChecked: boolean;
  storeFrontMeta: { name: string; description: string; storeId: string } | null;
}

const StorefrontContext = createContext<StorefrontContextType | undefined>(undefined);

export const StorefrontProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isStoreFront, setIsStoreFront] = useState<boolean>(false);
  const [storeFrontChecked, setStoreFrontChecked] = useState<boolean>(false);
  const [storeFrontMeta, setStoreFrontMeta] = useState<{ name: string; description: string; storeId: string } | null>(null);

  useEffect(() => {
    const hostname = window.location.hostname;
    let parts = hostname.split(".");
    let possibleSub = parts.length > 1 ? parts[0].toLowerCase() : "";
    // Dev: allow VITE_STORE_SUBDOMAIN when running on localhost
    if (!possibleSub && typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_STORE_SUBDOMAIN) {
      possibleSub = ((import.meta as any).env.VITE_STORE_SUBDOMAIN as string).toLowerCase();
    }
    const isAdmin = possibleSub === "admin";

    if (!possibleSub || isAdmin) {
      setStoreFrontChecked(true);
      return;
    }

    (async () => {
      try {
        const { data } = await axiosi.get<{ success: boolean; data?: { storeId: string; name: string; description: string } }>(
          "/store-subdomain/check",
          { params: { subdomain: possibleSub } }
        );
        if (data.success && data.data) {
          setIsStoreFront(true);
          setStoreFrontMeta({ name: data.data.name, description: data.data.description, storeId: data.data.storeId });
        }
      } catch {
        setIsStoreFront(false);
        setStoreFrontMeta(null);
      } finally {
        setStoreFrontChecked(true);
      }
    })();
  }, []);

  const value: StorefrontContextType = {
    isStoreFront,
    storeFrontChecked,
    storeFrontMeta,
  };

  return (
    <StorefrontContext.Provider value={value}>
      <StorefrontProductProvider>{children}</StorefrontProductProvider>
    </StorefrontContext.Provider>
  );
};

export const useStorefront = (): StorefrontContextType => {
  const ctx = useContext(StorefrontContext);
  if (!ctx) throw new Error("useStorefront must be used within a StorefrontProvider");
  return ctx;
};

export default StorefrontContext;
