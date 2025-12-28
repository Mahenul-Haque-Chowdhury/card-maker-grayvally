import type { BusinessCardState } from "@/types";

export interface SavedVersion {
  id: string;
  name: string;
  createdAt: number;
  state: BusinessCardState;
}

const KEY = "auto-card-maker.versions.v1";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function asRecord(value: unknown): UnknownRecord {
  return isRecord(value) ? value : {};
}

function asBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadVersions(): SavedVersion[] {
  if (typeof window === "undefined") return [];
  const parsed = safeParse<SavedVersion[]>(window.localStorage.getItem(KEY));
  if (!Array.isArray(parsed)) return [];

  return parsed
    .filter((v): v is SavedVersion => Boolean(v && typeof v === 'object' && 'state' in v))
    .map((v) => {
      const next = { ...v };

      const stateRecord = asRecord((next as UnknownRecord).state);
      const designRecord = asRecord(stateRecord.design);
      const dataRecord = asRecord(stateRecord.data);
      const contactVisibilityRecord = asRecord(designRecord.contactVisibility);

      const backgroundVariant = asString(designRecord.backgroundVariant) ?? "v1";

      // ensure new contact fields exist
      const nextData = {
        mobile: '',
        fax: '',
        facebook: '',
        twitter: '',
        linkedin: '',
        instagram: '',
        youtube: '',
        github: '',
        ...dataRecord,
      };

      const nextVisibility = {
        email: asBoolean(contactVisibilityRecord.email) ?? true,
        phone: asBoolean(contactVisibilityRecord.phone) ?? true,
        mobile: asBoolean(contactVisibilityRecord.mobile) ?? false,
        fax: asBoolean(contactVisibilityRecord.fax) ?? false,
        website: asBoolean(contactVisibilityRecord.website) ?? true,
        address: asBoolean(contactVisibilityRecord.address) ?? false,
        facebook: asBoolean(contactVisibilityRecord.facebook) ?? false,
        twitter: asBoolean(contactVisibilityRecord.twitter) ?? false,
        linkedin: asBoolean(contactVisibilityRecord.linkedin) ?? false,
        instagram: asBoolean(contactVisibilityRecord.instagram) ?? false,
        youtube: asBoolean(contactVisibilityRecord.youtube) ?? false,
        github: asBoolean(contactVisibilityRecord.github) ?? false,
      };

      next.state = {
        ...stateRecord,
        data: nextData,
        design: {
          ...designRecord,
          // Cards are standard size only (horizontal).
          orientation: 'horizontal',
          backgroundVariant,
          contactVisibility: nextVisibility,
        },
      } as unknown as SavedVersion["state"];

      return next;
    });
}

export function saveVersions(versions: SavedVersion[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(versions.slice(0, 30)));
}

export function createVersion(name: string, state: BusinessCardState): SavedVersion {
  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return { id, name: name.trim() || "Untitled", createdAt: Date.now(), state };
}
