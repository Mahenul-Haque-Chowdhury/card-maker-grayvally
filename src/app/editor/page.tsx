'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { EditorPanel } from '@/components/editor/EditorPanel';
import { PreviewPanel } from '@/components/preview/PreviewPanel';
import { BusinessCardState, CardData, DesignSettings } from '@/types';
import { useHistoryState } from '@/hooks/useHistoryState';
import { createVersion, loadVersions, saveVersions, type SavedVersion } from '@/lib/versions';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Icon } from '@/components/ui/Icon';

const INITIAL_STATE: BusinessCardState = {
  data: {
    fullName: 'Alex Morgan',
    jobTitle: 'Creative Director',
    companyName: 'Design Studio',
    email: 'alex@designstudio.com',
    phone: '+1 (555) 123-4567',
    mobile: '',
    fax: '',
    website: 'www.designstudio.com',
    address: '123 Creative Ave, New York, NY',
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    youtube: '',
    github: '',
    tagline: 'Designing the Future',
    qrValue: 'https://www.designstudio.com',
  },
  design: {
    primaryColor: '#0d9488',
    secondaryColor: '#0f766e',
    accentColor: '#f97316',
    font: 'geist',
    orientation: 'horizontal',
    borderRadius: 14,
    iconStyle: 'minimal',
    template: 'whisper',
    showBleed: false,

    padding: 26,
    spacing: 10,

    backgroundStyle: 'solid',
    backgroundIntensity: 40,
    backgroundVariant: 'v1',
    backgroundPreset: 'sunset-vibes',
    backgroundImage: undefined,
    backgroundColor: '#ffffff',
    glassBlur: 14,

    logoPosition: 'top-left',
    contactVisibility: {
      email: true,
      phone: true,
      mobile: false,
      fax: false,
      website: true,
      address: false,
      facebook: false,
      twitter: false,
      linkedin: false,
      instagram: false,
      youtube: false,
      github: false,
    },

    showSafeMargins: false,
    showGrid: false,
    snapToGrid: true,
    showQr: false,

    // Back side settings
    backBackgroundStyle: 'solid',
    backBackgroundPreset: 'sunset-vibes',
    backBackgroundImage: undefined,
    backBackgroundColor: '#f8fafc',
    backBackgroundIntensity: 40,
    backBackgroundVariant: 'v1',

    layout: {
      front: { elements: {} },
      back: { elements: {} },
    },
  },
};

const AUTOSAVE_KEY = 'grayvally.autosave.v1';

type AutosavePayload = {
  state: BusinessCardState;
  savedAt: number;
};

function formatTimeAgo(timestamp: number) {
  const diff = Date.now() - timestamp;
  if (diff < 60000) return 'just now';
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

function isEditableTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
}

function loadAutosave(): AutosavePayload | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(AUTOSAVE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AutosavePayload;
    return parsed?.state ? parsed : null;
  } catch {
    return null;
  }
}

export default function EditorPage() {
  const history = useHistoryState<BusinessCardState>(INITIAL_STATE);
  const state = history.present;
  const { undo, redo } = history;
  const [mobileView, setMobileView] = useState<'controls' | 'preview'>('controls');
  const [versions, setVersions] = useState<SavedVersion[]>(() => loadVersions());
  const [autosaveMeta, setAutosaveMeta] = useState(() => {
    const draft = loadAutosave();
    return {
      restoreDraft: draft,
      autosaveEnabled: !draft,
      lastSavedAt: draft?.savedAt ?? null,
    };
  });
  const { restoreDraft, autosaveEnabled, lastSavedAt } = autosaveMeta;
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const autosaveTimer = useRef<number | null>(null);

  const markAutosavePending = useCallback(() => {
    if (!autosaveEnabled) return;
    if (autosaveStatus !== 'saving') {
      setAutosaveStatus('saving');
    }
  }, [autosaveEnabled, autosaveStatus]);

  const updateData = (field: keyof CardData, value: string) => {
    markAutosavePending();
    history.set((prev) => ({
      ...prev,
      data: { ...prev.data, [field]: value },
    }));
  };

  const updateDesign = (field: keyof DesignSettings, value: DesignSettings[keyof DesignSettings]) => {
    markAutosavePending();
    history.set((prev) => ({
      ...prev,
      design: { ...prev.design, [field]: value },
    }));
  };

  const patchDesign = (partial: Partial<DesignSettings>) => {
    markAutosavePending();
    history.set((prev) => ({
      ...prev,
      design: { ...prev.design, ...partial },
    }));
  };

  const patchData = (partial: Partial<CardData>) => {
    markAutosavePending();
    history.set((prev) => ({
      ...prev,
      data: { ...prev.data, ...partial },
    }));
  };

  useEffect(() => {
    if (!autosaveEnabled) return;
    if (autosaveTimer.current) {
      window.clearTimeout(autosaveTimer.current);
    }
    autosaveTimer.current = window.setTimeout(() => {
      const payload: AutosavePayload = { state, savedAt: Date.now() };
      window.localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(payload));
      setAutosaveMeta((prev) => ({ ...prev, lastSavedAt: payload.savedAt }));
      setAutosaveStatus('saved');
    }, 800);

    return () => {
      if (autosaveTimer.current) {
        window.clearTimeout(autosaveTimer.current);
      }
    };
  }, [autosaveEnabled, state]);

  const handleUndo = useCallback(() => {
    undo();
    markAutosavePending();
  }, [markAutosavePending, undo]);

  const handleRedo = useCallback(() => {
    redo();
    markAutosavePending();
  }, [markAutosavePending, redo]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;
      if (!(event.metaKey || event.ctrlKey)) return;

      const key = event.key.toLowerCase();
      if (key === 'z') {
        event.preventDefault();
        if (event.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if (key === 'y') {
        event.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleRedo, handleUndo]);

  const handleRestoreDraft = () => {
    if (!restoreDraft) return;
    history.replace(restoreDraft.state);
    history.clearHistory();
    setAutosaveStatus('saved');
    setAutosaveMeta((prev) => ({
      ...prev,
      restoreDraft: null,
      autosaveEnabled: true,
      lastSavedAt: restoreDraft.savedAt,
    }));
  };

  const handleDismissDraft = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTOSAVE_KEY);
    }
    setAutosaveStatus('idle');
    setAutosaveMeta((prev) => ({
      ...prev,
      restoreDraft: null,
      autosaveEnabled: true,
      lastSavedAt: null,
    }));
  };

  const handleSaveVersion = (name: string) => {
    const next = [createVersion(name, state), ...versions];
    setVersions(next);
    saveVersions(next);
  };

  const handleLoadVersion = (id: string) => {
    const found = versions.find((v) => v.id === id);
    if (!found) return;
    history.replace(found.state);
    history.clearHistory();
    markAutosavePending();
  };

  const handleDuplicateCurrent = () => {
    const nextName = `${state.data.fullName || 'Design'} (Copy)`;
    const next = [createVersion(nextName, state), ...versions];
    setVersions(next);
    saveVersions(next);
  };

  const autosaveLabel = autosaveEnabled
    ? autosaveStatus === 'saving'
      ? 'Saving...'
      : lastSavedAt
        ? `Saved ${formatTimeAgo(lastSavedAt)}`
        : 'Autosave on'
    : null;

  const header = (
    <div className="ui-glass-strong ui-shadow-lg sticky top-0 z-30 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="/GrayVally.png"
              alt="GrayVally logo"
              className="h-10 w-10 rounded-2xl object-cover ui-shadow"
            />
            <div className="absolute inset-0 h-10 w-10 rounded-2xl bg-linear-to-br from-teal-500 via-sky-500 to-orange-500 blur-lg opacity-40" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
              GrayVally Business Card Maker
            </div>
            <div className="text-[11px] font-medium" style={{ color: 'var(--muted-2)' }}>
              Professional Card Designer
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2">
          {autosaveLabel ? (
            <div className="hidden xl:flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ui-surface-2 text-muted">
              <Icon name="Save" size="input" className={autosaveStatus === 'saving' ? 'animate-pulse' : ''} decorative />
              <span>{autosaveLabel}</span>
            </div>
          ) : null}

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all focus:outline-none text-muted hover:text-foreground hover:bg-surface-2 active:bg-surface-3 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Icon name="ArrowLeft" size="button" className="group-hover:scale-[1.03]" decorative /> Home
          </Link>

          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle className="shrink-0" />

          <div className="flex items-center gap-1.5 p-1 rounded-2xl ui-surface-2">
          <button
            type="button"
            onClick={() => setMobileView('controls')}
            className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
              mobileView === 'controls'
                ? 'bg-linear-to-r from-teal-500/15 to-sky-500/15 text-teal-600 dark:text-teal-300 ui-shadow'
                : 'hover:bg-surface-2'
            }`}
          >
            <Icon name="SlidersHorizontal" size="button" className="group-hover:scale-[1.03]" decorative /> Edit
          </button>
          <button
            type="button"
            onClick={() => setMobileView('preview')}
            className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
              mobileView === 'preview'
                ? 'bg-linear-to-r from-teal-500/15 to-sky-500/15 text-teal-600 dark:text-teal-300 ui-shadow'
                : 'hover:bg-surface-2'
            }`}
          >
            <Icon name="Eye" size="button" className="group-hover:scale-[1.03]" decorative /> Preview
          </button>
          </div>
        </div>
      </div>

      {restoreDraft ? (
        <div className="mt-3 rounded-2xl ui-surface-2 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-2xl bg-linear-to-br from-teal-500/15 to-sky-500/15 flex items-center justify-center text-teal-600 dark:text-teal-300">
              <Icon name="Save" size="action" decorative />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Resume your last draft</div>
              <div className="text-xs text-muted">
                Saved {formatTimeAgo(restoreDraft.savedAt)}. Your autosave is ready to restore.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:ml-auto">
            <button
              type="button"
              onClick={handleRestoreDraft}
              className="ui-btn ui-btn-primary"
            >
              Restore draft
            </button>
            <button
              type="button"
              onClick={handleDismissDraft}
              className="ui-btn ui-surface-2 hover:ui-shadow"
              style={{ border: '1px solid var(--border)' }}
            >
              Start fresh
            </button>
          </div>
        </div>
      ) : null}

      <div
        className="mt-3 h-px w-full"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(var(--accent-from), 0.25), rgba(var(--accent-via), 0.18), transparent)',
        }}
      />
    </div>
  );

  return (
    <main className="h-dvh w-dvw overflow-hidden flex flex-col">
      {header}

      <div className="flex-1 min-h-0 w-full grid grid-cols-1 lg:grid-cols-[minmax(500px,580px)_1fr] lg:gap-0">
        <div
          className={`h-full overflow-hidden transition-all duration-300 ${
            mobileView === 'controls' ? 'block' : 'hidden'
          } lg:block lg:border-r`}
          style={{ borderColor: 'var(--border)' }}
        >
          <EditorPanel
            state={state}
            updateData={updateData}
            updateDesign={updateDesign}
            patchDesign={patchDesign}
            patchData={patchData}
            undo={handleUndo}
            redo={handleRedo}
            canUndo={history.canUndo}
            canRedo={history.canRedo}
            versions={versions}
            saveVersion={handleSaveVersion}
            loadVersion={handleLoadVersion}
            duplicateCurrent={handleDuplicateCurrent}
          />
        </div>

        <div
          className={`h-full overflow-hidden transition-all duration-300 ${
            mobileView === 'preview' ? 'block' : 'hidden'
          } lg:block`}
        >
          <PreviewPanel
            state={state}
            patchDesign={patchDesign}
            patchData={patchData}
            undo={handleUndo}
            redo={handleRedo}
            canUndo={history.canUndo}
            canRedo={history.canRedo}
          />
        </div>
      </div>
    </main>
  );
}

