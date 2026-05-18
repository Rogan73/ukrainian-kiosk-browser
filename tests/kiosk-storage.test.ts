import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock AsyncStorage
const store: Record<string, string> = {};
vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn(async (key: string) => store[key] ?? null),
    setItem: vi.fn(async (key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn(async (key: string) => {
      delete store[key];
    }),
  },
}));

import {
  getSites,
  saveSites,
  addSite,
  updateSite,
  deleteSite,
  getLastVisitedId,
  setLastVisitedId,
  type SiteConfig,
} from "../lib/storage";

const makeSite = (overrides: Partial<Omit<SiteConfig, "id">> = {}): Omit<SiteConfig, "id"> => ({
  name: "Test Site",
  url: "https://example.com",
  allowRotation: false,
  isFullscreen: true,
  isSoundEnabled: true,
  isZoomEnabled: false,
  keepScreenAwake: true,
  ...overrides,
});

describe("Kiosk Storage Service", () => {
  beforeEach(() => {
    // Clear the mock store
    Object.keys(store).forEach((k) => delete store[k]);
  });

  it("getSites returns empty array when no data stored", async () => {
    const sites = await getSites();
    expect(sites).toEqual([]);
  });

  it("addSite creates a site with an id", async () => {
    const site = await addSite(makeSite());
    expect(site.id).toBeTruthy();
    expect(site.name).toBe("Test Site");
    expect(site.url).toBe("https://example.com");
  });

  it("getSites returns all added sites", async () => {
    await addSite(makeSite({ name: "Site A" }));
    await addSite(makeSite({ name: "Site B" }));
    const sites = await getSites();
    expect(sites).toHaveLength(2);
    expect(sites.map((s) => s.name)).toContain("Site A");
    expect(sites.map((s) => s.name)).toContain("Site B");
  });

  it("updateSite modifies an existing site", async () => {
    const site = await addSite(makeSite({ name: "Original" }));
    await updateSite({ ...site, name: "Updated" });
    const sites = await getSites();
    const found = sites.find((s) => s.id === site.id);
    expect(found?.name).toBe("Updated");
  });

  it("deleteSite removes a site by id", async () => {
    const site = await addSite(makeSite());
    await deleteSite(site.id);
    const sites = await getSites();
    expect(sites.find((s) => s.id === site.id)).toBeUndefined();
  });

  it("setLastVisitedId and getLastVisitedId work correctly", async () => {
    await setLastVisitedId("abc123");
    const id = await getLastVisitedId();
    expect(id).toBe("abc123");
  });

  it("getLastVisitedId returns null when not set", async () => {
    const id = await getLastVisitedId();
    expect(id).toBeNull();
  });

  it("SiteConfig stores all boolean flags correctly", async () => {
    const site = await addSite(
      makeSite({
        allowRotation: true,
        isFullscreen: false,
        isSoundEnabled: false,
        isZoomEnabled: true,
        keepScreenAwake: false,
      })
    );
    const sites = await getSites();
    const found = sites.find((s) => s.id === site.id)!;
    expect(found.allowRotation).toBe(true);
    expect(found.isFullscreen).toBe(false);
    expect(found.isSoundEnabled).toBe(false);
    expect(found.isZoomEnabled).toBe(true);
    expect(found.keepScreenAwake).toBe(false);
  });
});
