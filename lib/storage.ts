import AsyncStorage from "@react-native-async-storage/async-storage";

export interface SiteConfig {
  id: string;
  name: string;
  url: string;
  allowRotation: boolean;
  isFullscreen: boolean;
  isSoundEnabled: boolean;
  isZoomEnabled: boolean;
}

const SITES_KEY = "kiosk_sites";
const LAST_VISITED_KEY = "kiosk_last_visited_id";

export async function getSites(): Promise<SiteConfig[]> {
  try {
    const raw = await AsyncStorage.getItem(SITES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SiteConfig[];
  } catch {
    return [];
  }
}

export async function saveSites(sites: SiteConfig[]): Promise<void> {
  await AsyncStorage.setItem(SITES_KEY, JSON.stringify(sites));
}

export async function addSite(site: Omit<SiteConfig, "id">): Promise<SiteConfig> {
  const sites = await getSites();
  const newSite: SiteConfig = {
    ...site,
    id: Date.now().toString(),
  };
  await saveSites([...sites, newSite]);
  return newSite;
}

export async function updateSite(updated: SiteConfig): Promise<void> {
  const sites = await getSites();
  const newSites = sites.map((s) => (s.id === updated.id ? updated : s));
  await saveSites(newSites);
}

export async function deleteSite(id: string): Promise<void> {
  const sites = await getSites();
  await saveSites(sites.filter((s) => s.id !== id));
}

export async function getLastVisitedId(): Promise<string | null> {
  return AsyncStorage.getItem(LAST_VISITED_KEY);
}

export async function setLastVisitedId(id: string): Promise<void> {
  await AsyncStorage.setItem(LAST_VISITED_KEY, id);
}
