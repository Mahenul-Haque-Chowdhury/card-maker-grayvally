import type { BusinessCardState } from "@/types";

export interface SavedVersion {
  id: string;
  name: string;
  createdAt: number;
  state: BusinessCardState;
}

const KEY = "auto-card-maker.versions.v1";

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
      const design = (next.state as any)?.design ?? {};
      const data = (next.state as any)?.data ?? {};

      if (!design.backgroundVariant) {
        next.state = {
          ...(next.state as any),
          design: {
            ...design,
            backgroundVariant: 'v1',
          },
        } as SavedVersion['state'];
      }

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
        ...data,
      };

      const nextVisibility = {
        email: true,
        phone: Boolean(design?.contactVisibility?.phone ?? true),
        mobile: Boolean(design?.contactVisibility?.mobile ?? false),
        fax: Boolean(design?.contactVisibility?.fax ?? false),
        website: Boolean(design?.contactVisibility?.website ?? true),
        address: Boolean(design?.contactVisibility?.address ?? false),
        facebook: Boolean(design?.contactVisibility?.facebook ?? false),
        twitter: Boolean(design?.contactVisibility?.twitter ?? false),
        linkedin: Boolean(design?.contactVisibility?.linkedin ?? false),
        instagram: Boolean(design?.contactVisibility?.instagram ?? false),
        youtube: Boolean(design?.contactVisibility?.youtube ?? false),
        github: Boolean(design?.contactVisibility?.github ?? false),
      };

      next.state = {
        ...(next.state as any),
        data: nextData,
        design: {
          ...((next.state as any)?.design ?? {}),
          // Cards are standard size only (horizontal).
          orientation: 'horizontal',
          contactVisibility: nextVisibility,
        },
      } as SavedVersion['state'];

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
