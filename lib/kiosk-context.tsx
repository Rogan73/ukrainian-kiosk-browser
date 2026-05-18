import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  SiteConfig,
  addSite,
  deleteSite,
  getLastVisitedId,
  getSites,
  setLastVisitedId,
  updateSite,
} from "./storage";

interface KioskContextValue {
  sites: SiteConfig[];
  activeSite: SiteConfig | null;
  isLoading: boolean;
  loadSites: () => Promise<void>;
  selectSite: (id: string) => void;
  addNewSite: (site: Omit<SiteConfig, "id">) => Promise<SiteConfig>;
  editSite: (site: SiteConfig) => Promise<void>;
  removeSite: (id: string) => Promise<void>;
}

const KioskContext = createContext<KioskContextValue | null>(null);

export function KioskProvider({ children }: { children: React.ReactNode }) {
  const [sites, setSites] = useState<SiteConfig[]>([]);
  const [activeSite, setActiveSite] = useState<SiteConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSites = useCallback(async () => {
    setIsLoading(true);
    try {
      const loaded = await getSites();
      setSites(loaded);
      if (loaded.length > 0) {
        const lastId = await getLastVisitedId();
        const found = lastId ? loaded.find((s) => s.id === lastId) : null;
        setActiveSite(found ?? loaded[0]);
      } else {
        setActiveSite(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSites();
  }, [loadSites]);

  const selectSite = useCallback(
    (id: string) => {
      const site = sites.find((s) => s.id === id);
      if (site) {
        setActiveSite(site);
        setLastVisitedId(id);
      }
    },
    [sites]
  );

  const addNewSite = useCallback(async (site: Omit<SiteConfig, "id">) => {
    const newSite = await addSite(site);
    setSites((prev) => [...prev, newSite]);
    return newSite;
  }, []);

  const editSite = useCallback(async (site: SiteConfig) => {
    await updateSite(site);
    setSites((prev) => prev.map((s) => (s.id === site.id ? site : s)));
    setActiveSite((prev) => (prev?.id === site.id ? site : prev));
  }, []);

  const removeSite = useCallback(async (id: string) => {
    await deleteSite(id);
    setSites((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      setActiveSite((current) => {
        if (current?.id === id) {
          return updated[0] ?? null;
        }
        return current;
      });
      return updated;
    });
  }, []);

  return (
    <KioskContext.Provider
      value={{
        sites,
        activeSite,
        isLoading,
        loadSites,
        selectSite,
        addNewSite,
        editSite,
        removeSite,
      }}
    >
      {children}
    </KioskContext.Provider>
  );
}

export function useKiosk() {
  const ctx = useContext(KioskContext);
  if (!ctx) throw new Error("useKiosk must be used inside KioskProvider");
  return ctx;
}
