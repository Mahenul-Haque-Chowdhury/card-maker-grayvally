'use client';

import React, { useMemo, useState } from 'react';
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
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    accentColor: '#3b82f6',
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
  },
};

export default function EditorPage() {
  const history = useHistoryState<BusinessCardState>(INITIAL_STATE);
  const state = history.present;
  const [mobileView, setMobileView] = useState<'controls' | 'preview'>('controls');
  const [versions, setVersions] = useState<SavedVersion[]>(() => loadVersions());

  const updateData = (field: keyof CardData, value: string) => {
    history.set((prev) => ({
      ...prev,
      data: { ...prev.data, [field]: value },
    }));
  };

  const updateDesign = (field: keyof DesignSettings, value: DesignSettings[keyof DesignSettings]) => {
    history.set((prev) => ({
      ...prev,
      design: { ...prev.design, [field]: value },
    }));
  };

  const patchDesign = (partial: Partial<DesignSettings>) => {
    history.set((prev) => ({
      ...prev,
      design: { ...prev.design, ...partial },
    }));
  };

  const patchData = (partial: Partial<CardData>) => {
    history.set((prev) => ({
      ...prev,
      data: { ...prev.data, ...partial },
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
  };

  const handleDuplicateCurrent = () => {
    const nextName = `${state.data.fullName || 'Design'} (Copy)`;
    const next = [createVersion(nextName, state), ...versions];
    setVersions(next);
    saveVersions(next);
  };

  const header = useMemo(() => {
    return (
      <div className="ui-glass-strong ui-shadow-lg sticky top-0 z-30 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-2xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 animate-float" />
              <div className="absolute inset-0 h-10 w-10 rounded-2xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 blur-lg opacity-40" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
                CardCraft Pro
              </div>
              <div className="text-[11px] font-medium" style={{ color: 'var(--muted-2)' }}>
                Professional Card Designer
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2">
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
                  ? 'bg-linear-to-r from-indigo-500/15 to-purple-500/15 text-indigo-600 dark:text-indigo-300 ui-shadow'
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
                  ? 'bg-linear-to-r from-indigo-500/15 to-purple-500/15 text-indigo-600 dark:text-indigo-300 ui-shadow'
                  : 'hover:bg-surface-2'
              }`}
            >
              <Icon name="Eye" size="button" className="group-hover:scale-[1.03]" decorative /> Preview
            </button>
            </div>
          </div>
        </div>

        <div
          className="mt-3 h-px w-full"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(var(--accent-from), 0.25), rgba(var(--accent-via), 0.18), transparent)',
          }}
        />
      </div>
    );
  }, [mobileView]);

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
            undo={history.undo}
            redo={history.redo}
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
          <PreviewPanel state={state} patchDesign={patchDesign} />
        </div>
      </div>
    </main>
  );
}
