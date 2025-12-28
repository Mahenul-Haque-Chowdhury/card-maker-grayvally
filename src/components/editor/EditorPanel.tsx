"use client";

import React, { useRef, useState, useMemo } from 'react';
import Image from 'next/image';
import type { BusinessCardState, CardData, DesignSettings, TemplateId, LogoPosition, CardSide } from '@/types';
import { Icon } from '@/components/ui/Icon';
import { TEMPLATE_CATEGORIES, TEMPLATES, getTemplateById } from '@/lib/templates';
import { BACKGROUND_VARIANTS, BACKGROUND_PRESETS, computeBaseBackground, variantLabel } from '@/lib/backgrounds';
import type { SavedVersion } from '@/lib/versions';
import QRCode from 'qrcode';

function thumbFontFamily(pairing: DesignSettings['font']) {
  switch (pairing) {
    case 'geist':
      return 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif';
    case 'inter':
      return '"Inter", ui-sans-serif, system-ui, sans-serif';
    case 'roboto':
      return '"Roboto", ui-sans-serif, Arial, sans-serif';
    case 'open-sans':
      return '"Open Sans", ui-sans-serif, Arial, sans-serif';
    case 'lato':
      return '"Lato", ui-sans-serif, Arial, sans-serif';
    case 'montserrat':
      return '"Montserrat", ui-sans-serif, Arial, sans-serif';
    case 'poppins':
      return '"Poppins", ui-sans-serif, Arial, sans-serif';
    case 'nunito':
      return '"Nunito", ui-sans-serif, Arial, sans-serif';
    case 'raleway':
      return '"Raleway", ui-sans-serif, Arial, sans-serif';
    case 'ubuntu':
      return '"Ubuntu", ui-sans-serif, Arial, sans-serif';
    case 'work-sans':
      return '"Work Sans", ui-sans-serif, Arial, sans-serif';
    case 'dm-sans':
      return '"DM Sans", ui-sans-serif, Arial, sans-serif';
    // Serif
    case 'times-new-roman':
      return '"Times New Roman", Times, ui-serif, serif';
    case 'georgia':
      return 'Georgia, ui-serif, serif';
    case 'playfair':
      return '"Playfair Display", ui-serif, Georgia, serif';
    case 'merriweather':
      return '"Merriweather", ui-serif, Georgia, serif';
    case 'lora':
      return '"Lora", ui-serif, Georgia, serif';
    case 'crimson':
      return '"Crimson Text", ui-serif, Georgia, serif';
    case 'source-serif':
      return '"Source Serif 4", ui-serif, Georgia, serif';
    // Monospace
    case 'jetbrains-mono':
      return '"JetBrains Mono", var(--font-geist-mono), monospace';
    case 'fira-code':
      return '"Fira Code", var(--font-geist-mono), monospace';
    case 'source-code':
      return '"Source Code Pro", var(--font-geist-mono), monospace';
    // Display
    case 'oswald':
      return '"Oswald", ui-sans-serif, Arial, sans-serif';
    case 'bebas':
      return '"Bebas Neue", ui-sans-serif, Arial, sans-serif';
    case 'archivo-black':
      return '"Archivo Black", ui-sans-serif, Arial, sans-serif';
    default:
      return 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif';
  }
}

interface EditorPanelProps {
  state: BusinessCardState;
  updateData: (field: keyof CardData, value: string) => void;
  updateDesign: (field: keyof DesignSettings, value: DesignSettings[keyof DesignSettings]) => void;
  patchDesign: (partial: Partial<DesignSettings>) => void;
  patchData: (partial: Partial<CardData>) => void;

  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  versions: SavedVersion[];
  saveVersion: (name: string) => void;
  loadVersion: (id: string) => void;
  duplicateCurrent: () => void;
}

function IconButton({
  children,
  onClick,
  disabled,
  title,
  active,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-xl px-3 py-2.5 transition-all hover-lift ${
        disabled 
          ? 'opacity-40 cursor-not-allowed' 
          : active
            ? 'ui-shadow-glow bg-linear-to-br from-indigo-500/10 to-purple-500/10'
            : 'ui-surface-2 hover:ui-shadow hover:border-indigo-500/20'
      }`}
      style={{ borderColor: active ? 'rgba(99, 102, 241, 0.3)' : undefined }}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-xs font-semibold tracking-wide uppercase" style={{ color: 'var(--muted)', letterSpacing: '0.05em' }}>
          {label}
        </label>
        {hint ? (
          <div className="text-[10px] font-medium" style={{ color: 'var(--muted-3)' }}>
            {hint}
          </div>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="ui-input"
    />
  );
}

function Chip({
  active,
  label,
  icon,
  onClick,
  required,
  disabled,
}: {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (disabled) return;
        onClick();
      }}
      aria-pressed={active}
      aria-disabled={disabled}
      className={`group inline-flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all ${
        disabled
          ? 'opacity-45 cursor-not-allowed ui-surface'
          : active
            ? 'ui-shadow-glow bg-linear-to-br from-indigo-500/8 to-purple-500/8 border-indigo-500/25'
            : 'ui-surface hover:ui-shadow hover-lift'
      }`}
      style={{ 
        borderColor: active && !disabled ? 'rgba(99, 102, 241, 0.30)' : undefined,
        background: active && !disabled ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.06))' : undefined
      }}
    >
      <span className="relative inline-flex items-center justify-center h-8 w-8 rounded-xl transition-all" style={{ border: '1px solid var(--border)', background: active ? 'rgba(99,102,241,0.08)' : 'var(--surface-2)' }}>
        <span className="relative" style={{ color: active ? 'rgb(99, 102, 241)' : 'var(--muted)' }}>
          {icon}
        </span>
        <span
          className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center h-4.5 w-4.5 rounded-full transition-all"
          style={{
            border: '1.5px solid var(--surface)',
            background: active 
              ? 'linear-gradient(135deg, rgb(99, 102, 241), rgb(139, 92, 246))' 
              : disabled 
                ? 'rgba(148,163,184,0.35)' 
                : 'rgba(148,163,184,0.65)',
            color: active ? 'white' : 'rgba(15,23,42,0.75)',
            boxShadow: active ? '0 2px 6px rgba(99, 102, 241, 0.35)' : 'none',
          }}
          title={required ? 'Required' : active ? 'Added' : 'Add'}
        >
          {active ? (
            <Icon name="Check" size={10} decorative />
          ) : (
            <Icon name="CirclePlus" size={10} decorative />
          )}
        </span>
      </span>
      <span style={{ color: active ? 'var(--foreground)' : 'var(--muted)' }}>{label}</span>
    </button>
  );
}

function Select({
  value,
  onChange,
  children,
  className,
  style,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={style}
      className={"ui-input cursor-pointer " + (className ?? "")}
    >
      {children}
    </select>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="group inline-flex items-center gap-2.5 rounded-xl px-3 py-2.5 ui-surface hover:ui-shadow transition-all hover-lift"
    >
      <span
        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-200 ${
          checked 
            ? 'bg-linear-to-r from-indigo-500 to-purple-500' 
            : 'bg-surface-3'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </span>
      <span className="text-xs font-semibold" style={{ color: checked ? 'var(--foreground)' : 'var(--muted-2)' }}>
        {label}
      </span>
    </button>
  );
}

function CollapsibleSection({
  title,
  icon,
  open,
  onToggle,
  children,
  subtitle,
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`ui-surface rounded-2xl overflow-hidden transition-all duration-300 ${open ? 'ui-shadow-lg' : 'ui-shadow hover:ui-shadow-lg'}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-4 flex items-center justify-between gap-3 hover:bg-linear-to-r hover:from-indigo-500/3 hover:to-purple-500/3 transition-all"
      >
        <div className="flex items-center gap-3">
          <div 
            className="h-10 w-10 rounded-xl grid place-items-center transition-all"
            style={{ 
              background: open 
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.08))' 
                : 'var(--surface-2)',
              border: '1px solid var(--border)',
              color: open ? 'rgb(99, 102, 241)' : 'var(--muted)'
            }}
          >
            {icon}
          </div>
          <div className="text-left leading-tight">
            <div className="text-sm font-bold tracking-tight">{title}</div>
            {subtitle ? (
              <div className="text-[11px] font-medium mt-0.5" style={{ color: 'var(--muted-2)' }}>
                {subtitle}
              </div>
            ) : null}
          </div>
        </div>

        <div 
          className="h-8 w-8 rounded-lg grid place-items-center transition-all"
          style={{ 
            background: open ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            color: open ? 'rgb(99, 102, 241)' : 'var(--muted-2)'
          }}
        >
          {open ? <Icon name="ChevronUp" size="button" decorative /> : <Icon name="ChevronDown" size="button" decorative />}
        </div>
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4">
            <div className="ui-divider my-3" />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.includes('.') && !trimmed.includes(' ')) return `https://${trimmed}`;
  return trimmed;
}

// Background Section Component with Front/Back sides
function BackgroundSection({
  state,
  updateDesign,
}: {
  state: BusinessCardState;
  updateDesign: <K extends keyof DesignSettings>(field: K, value: DesignSettings[K]) => void;
}) {
  const [activeSide, setActiveSide] = useState<CardSide>('front');
  const [presetCategory, setPresetCategory] = useState<'all' | 'gradient' | 'mesh' | 'pattern' | 'artistic'>('all');
  const [showAllPresets, setShowAllPresets] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const backImageInputRef = useRef<HTMLInputElement>(null);

  const filteredPresets = useMemo(() => {
    if (presetCategory === 'all') return BACKGROUND_PRESETS;
    return BACKGROUND_PRESETS.filter(p => p.category === presetCategory);
  }, [presetCategory]);

  const displayedPresets = showAllPresets ? filteredPresets : filteredPresets.slice(0, 12);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, side: CardSide) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (side === 'front') {
        updateDesign('backgroundImage', dataUrl);
        updateDesign('backgroundStyle', 'image');
      } else {
        updateDesign('backBackgroundImage', dataUrl);
        updateDesign('backBackgroundStyle', 'image');
      }
    };
    reader.readAsDataURL(file);
  };

  const clearImage = (side: CardSide) => {
    if (side === 'front') {
      updateDesign('backgroundImage', undefined);
      updateDesign('backgroundStyle', 'solid');
    } else {
      updateDesign('backBackgroundImage', undefined);
      updateDesign('backBackgroundStyle', 'solid');
    }
  };

  // Get current values based on active side
  const currentStyle = activeSide === 'front' ? state.design.backgroundStyle : state.design.backBackgroundStyle;
  const currentPreset = activeSide === 'front' ? state.design.backgroundPreset : state.design.backBackgroundPreset;
  const currentImage = activeSide === 'front' ? state.design.backgroundImage : state.design.backBackgroundImage;
  const currentColor = activeSide === 'front' ? state.design.backgroundColor : state.design.backBackgroundColor;
  const currentIntensity = activeSide === 'front' ? state.design.backgroundIntensity : state.design.backBackgroundIntensity;
  const currentVariant = activeSide === 'front' ? state.design.backgroundVariant : state.design.backBackgroundVariant;

  const updateSideDesign = <K extends keyof DesignSettings>(field: K, value: DesignSettings[K]) => {
    if (activeSide === 'front') {
      updateDesign(field, value);
    } else {
      // Map front fields to back fields
      const backFieldMap: Record<string, keyof DesignSettings> = {
        backgroundStyle: 'backBackgroundStyle',
        backgroundPreset: 'backBackgroundPreset',
        backgroundImage: 'backBackgroundImage',
        backgroundColor: 'backBackgroundColor',
        backgroundIntensity: 'backBackgroundIntensity',
        backgroundVariant: 'backBackgroundVariant',
      };
      const backField = backFieldMap[field as string];
      if (backField) {
        updateDesign(backField, value as DesignSettings[typeof backField]);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Front/Back Side Toggle */}
      <div className="ui-surface-2 rounded-2xl p-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSide('front')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              activeSide === 'front'
                ? 'bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                : 'ui-surface hover:ui-shadow text-muted'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Icon name="FlipHorizontal" size="input" decorative />
              Front Side
            </div>
          </button>
          <button
            type="button"
            onClick={() => setActiveSide('back')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              activeSide === 'back'
                ? 'bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                : 'ui-surface hover:ui-shadow text-muted'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Icon name="FlipHorizontal" size="input" className="scale-x-[-1]" decorative />
              Back Side
            </div>
          </button>
        </div>
      </div>

      {/* Background Type Selection */}
      <div className="ui-surface-2 rounded-2xl p-4">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="text-xs font-bold">Background Type</div>
          <div className="text-[10px] font-medium px-2 py-1 rounded-full" style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'rgb(139, 92, 246)' }}>
            {activeSide === 'front' ? 'Front' : 'Back'}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[ 
            { id: 'solid', label: 'Solid', iconName: 'Square' },
            { id: 'preset', label: 'Presets', iconName: 'Grid3X3' },
            { id: 'gradient', label: 'Dynamic', iconName: 'Sparkles' },
            { id: 'image', label: 'Image', iconName: 'Image' },
          ].map((type) => {
            const selected = currentStyle === type.id || 
              (type.id === 'gradient' && ['gradient', 'abstract', 'geometric', 'noise', 'glass'].includes(currentStyle));
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => {
                  if (type.id === 'gradient') {
                    updateSideDesign('backgroundStyle', 'gradient');
                  } else {
                    updateSideDesign('backgroundStyle', type.id as DesignSettings['backgroundStyle']);
                  }
                }}
                className={`py-3 px-2 rounded-xl text-center transition-all ${
                  selected
                    ? 'bg-linear-to-br from-indigo-500/10 to-purple-500/10 ring-2 ring-indigo-500/30'
                    : 'ui-surface hover:ui-shadow'
                }`}
              >
                <div className="mb-1 grid place-items-center">
                  <Icon name={type.iconName as never} size="toolbar" decorative />
                </div>
                <div className="text-[10px] font-semibold">{type.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Solid Color Picker */}
      {currentStyle === 'solid' && (
        <div className="ui-surface-2 rounded-2xl p-4">
          <div className="text-xs font-bold mb-3">Solid Color</div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="color"
                value={currentColor}
                onChange={(e) => updateSideDesign('backgroundColor', e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div 
                className="w-14 h-14 rounded-xl border-2 border-white shadow-lg transition-transform hover:scale-105"
                style={{ background: currentColor }}
              />
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-medium mb-1.5" style={{ color: 'var(--muted-2)' }}>HEX Color</div>
              <input
                type="text"
                value={currentColor}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                    updateSideDesign('backgroundColor', val);
                  }
                }}
                className="ui-input text-xs font-mono w-full"
                placeholder="#ffffff"
              />
            </div>
          </div>
          {/* Quick color palette */}
          <div className="mt-3 grid grid-cols-8 gap-1.5">
            {['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#1e293b', '#0f172a', '#020617', '#000000',
              '#ef4444', '#f97316', '#f59e0b', '#eab308', '#22c55e', '#14b8a6', '#0ea5e9', '#6366f1'].map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => updateSideDesign('backgroundColor', color)}
                className={`w-full aspect-square rounded-lg transition-transform hover:scale-110 ${
                  currentColor === color ? 'ring-2 ring-indigo-500 ring-offset-1' : ''
                }`}
                style={{ background: color, border: '1px solid var(--border)' }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Preset Backgrounds - 250 unique styles */}
      {currentStyle === 'preset' && (
        <div className="ui-surface-2 rounded-2xl p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="text-xs font-bold">250 Unique Backgrounds</div>
            <div className="text-[10px] font-medium px-2 py-1 rounded-full" style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'rgb(34, 197, 94)' }}>
              {filteredPresets.length} options
            </div>
          </div>
          
          {/* Category filter */}
          <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'gradient', label: 'Gradients' },
              { id: 'mesh', label: 'Mesh' },
              { id: 'pattern', label: 'Patterns' },
              { id: 'artistic', label: 'Artistic' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setPresetCategory(cat.id as typeof presetCategory);
                  setShowAllPresets(false);
                }}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                  presetCategory === cat.id
                    ? 'bg-linear-to-r from-indigo-500 to-purple-500 text-white'
                    : 'ui-surface hover:ui-shadow'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Preset grid */}
          <div className="grid grid-cols-3 gap-2">
            {displayedPresets.map((preset) => {
              const selected = currentPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    updateSideDesign('backgroundPreset', preset.id);
                    updateSideDesign('backgroundStyle', 'preset');
                  }}
                  className={`group rounded-xl p-1.5 transition-all ${
                    selected
                      ? 'ring-2 ring-indigo-500/50 bg-linear-to-br from-indigo-500/5 to-purple-500/5'
                      : 'hover:ring-1 hover:ring-indigo-500/20'
                  }`}
                >
                  <div
                    className="w-full aspect-7/4 rounded-lg transition-transform group-hover:scale-[1.02]"
                    style={{ background: preset.background, backgroundSize: '200% 200%' }}
                  />
                  <div className="mt-1.5 text-[9px] font-semibold truncate px-0.5">{preset.name}</div>
                </button>
              );
            })}
          </div>

          {/* Show more/less */}
          {filteredPresets.length > 12 && (
            <button
              type="button"
              onClick={() => setShowAllPresets(!showAllPresets)}
              className="w-full mt-3 py-2 rounded-xl ui-surface hover:ui-shadow text-[11px] font-semibold transition-all"
            >
              {showAllPresets ? 'Show Less' : `Show All ${filteredPresets.length} Presets`}
            </button>
          )}
        </div>
      )}

      {/* Dynamic Gradients - existing functionality */}
      {['gradient', 'abstract', 'geometric', 'noise', 'glass'].includes(currentStyle) && (
        <>
          <div className="ui-surface-2 rounded-2xl p-4">
            <div className="text-xs font-bold mb-3">Dynamic Style</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'gradient', label: 'Gradient' },
                { id: 'abstract', label: 'Abstract' },
                { id: 'geometric', label: 'Geometric' },
                { id: 'noise', label: 'Noise' },
                { id: 'glass', label: 'Glass' },
              ].map((s) => {
                const selected = currentStyle === s.id;
                const bg = computeBaseBackground(
                  {
                    primaryColor: state.design.primaryColor,
                    secondaryColor: state.design.secondaryColor,
                    accentColor: state.design.accentColor,
                    backgroundStyle: s.id as DesignSettings['backgroundStyle'],
                    backgroundIntensity: currentIntensity,
                    backgroundVariant: currentVariant,
                  },
                  state.design.template,
                );
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => updateSideDesign('backgroundStyle', s.id as DesignSettings['backgroundStyle'])}
                    className={`group rounded-xl p-2 transition-all ${
                      selected
                        ? 'ring-2 ring-indigo-500/40 bg-linear-to-br from-indigo-500/5 to-purple-500/5'
                        : 'ui-surface hover:ui-shadow'
                    }`}
                  >
                    <div className="h-10 w-full rounded-lg transition-transform group-hover:scale-[1.02]" style={{ background: bg, border: '1px solid var(--border)' }} />
                    <div className="mt-1.5 text-[10px] font-semibold">{s.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="ui-surface-2 rounded-2xl p-3">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="text-xs font-semibold">Variant</div>
              <div className="text-[10px]" style={{ color: 'var(--muted-2)' }}>
                {variantLabel(currentStyle, currentVariant)}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {BACKGROUND_VARIANTS.map((v) => {
                const selected = currentVariant === v;
                const bg = computeBaseBackground(
                  {
                    primaryColor: state.design.primaryColor,
                    secondaryColor: state.design.secondaryColor,
                    accentColor: state.design.accentColor,
                    backgroundStyle: currentStyle,
                    backgroundIntensity: currentIntensity,
                    backgroundVariant: v,
                  },
                  state.design.template,
                );
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => updateSideDesign('backgroundVariant', v)}
                    className={`rounded-xl p-1.5 transition-all ${
                      selected ? 'ring-2 ring-indigo-500/35' : 'hover:ring-1 hover:ring-indigo-500/20'
                    }`}
                  >
                    <div className="h-9 w-full rounded-lg" style={{ background: bg, border: '1px solid var(--border)' }} />
                    <div className="mt-1 text-[9px] font-semibold">{variantLabel(currentStyle, v)}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <Field label={`Intensity · ${currentIntensity}%`}>
            <input
              type="range"
              min={0}
              max={100}
              value={currentIntensity}
              onChange={(e) => updateSideDesign('backgroundIntensity', parseInt(e.target.value))}
              className="w-full"
            />
          </Field>

          {currentStyle === 'glass' && (
            <Field label={`Glass blur · ${state.design.glassBlur}px`}>
              <input
                type="range"
                min={8}
                max={24}
                value={state.design.glassBlur}
                onChange={(e) => updateDesign('glassBlur', parseInt(e.target.value))}
                className="w-full"
              />
            </Field>
          )}
        </>
      )}

      {/* Custom Image Upload */}
      {currentStyle === 'image' && (
        <div className="ui-surface-2 rounded-2xl p-4">
          <div className="text-xs font-bold mb-3">Custom Background Image</div>
          
          <input
            ref={activeSide === 'front' ? imageInputRef : backImageInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, activeSide)}
            className="hidden"
          />

          {currentImage ? (
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden aspect-7/4">
                <Image
                  src={currentImage}
                  alt="Background preview"
                  fill
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => clearImage(activeSide)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-all"
                >
                  <Icon name="X" size="input" className="text-white" decorative />
                </button>
              </div>
              <button
                type="button"
                onClick={() => (activeSide === 'front' ? imageInputRef : backImageInputRef).current?.click()}
                className="w-full py-2.5 rounded-xl ui-surface hover:ui-shadow text-[11px] font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Icon name="Upload" size="input" decorative />
                Change Image
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => (activeSide === 'front' ? imageInputRef : backImageInputRef).current?.click()}
              className="w-full py-8 rounded-xl border-2 border-dashed border-border-strong hover:border-indigo-400 dark:hover:border-indigo-500 transition-all flex flex-col items-center justify-center gap-2"
            >
              <Icon name="Upload" size="action" className="text-muted-2" decorative />
              <div className="text-xs font-semibold text-muted">Click to upload image</div>
              <div className="text-[10px] text-muted-2">JPG, PNG, WebP supported</div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  state,
  updateData,
  updateDesign,
  patchDesign,
  patchData,
  undo,
  redo,
  canUndo,
  canRedo,
  versions,
  saveVersion,
  loadVersion,
  duplicateCurrent,
}) => {
  const [open, setOpen] = useState({
    identity: true,
    contact: true,
    branding: true,
    layout: true,
    background: false,
  });
  const [versionName, setVersionName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const designSectionRef = useRef<HTMLDivElement>(null);

  // Random name/title/company generators
  const RANDOM_NAMES = ['Alex Morgan', 'Jordan Chen', 'Sam Rivera', 'Taylor Kim', 'Casey Brooks', 'Drew Martinez', 'Morgan Lee', 'Riley Johnson', 'Avery Williams', 'Quinn Davis'];
  const RANDOM_TITLES = ['Creative Director', 'Founder & CEO', 'Lead Designer', 'Product Manager', 'Software Engineer', 'Marketing Director', 'Brand Strategist', 'UX Designer', 'Tech Lead', 'Art Director'];
  const RANDOM_COMPANIES = ['Pixel Studio', 'Nova Labs', 'Craft & Co', 'Bright Ideas', 'Future Works', 'Design Hub', 'Tech Forge', 'Creative Minds', 'Innovation Inc', 'Spark Agency'];
  const RANDOM_TAGLINES = ['Building the future', 'Design with purpose', 'Innovation at heart', 'Creating possibilities', 'Ideas into reality', 'Excellence delivered', 'Crafting experiences', 'Where ideas grow', 'Transforming visions', 'Quality first'];

  const generateRandomCard = () => {
    // Pick random template
    const randomTemplate = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
    
    // Pick random data
    const randomName = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
    const randomTitle = RANDOM_TITLES[Math.floor(Math.random() * RANDOM_TITLES.length)];
    const randomCompany = RANDOM_COMPANIES[Math.floor(Math.random() * RANDOM_COMPANIES.length)];
    const randomTagline = RANDOM_TAGLINES[Math.floor(Math.random() * RANDOM_TAGLINES.length)];
    
    // Apply template
    patchDesign({
      template: randomTemplate.id,
      font: randomTemplate.font,
      iconStyle: randomTemplate.iconStyle,
      backgroundStyle: randomTemplate.backgroundStyle,
      backgroundVariant: randomTemplate.backgroundVariant ?? 'v1',
      padding: randomTemplate.padding,
      spacing: randomTemplate.spacing,
      borderRadius: randomTemplate.borderRadius,
      backgroundIntensity: randomTemplate.intensity,
    });
    
    // Apply random data
    patchData({
      fullName: randomName,
      jobTitle: randomTitle,
      companyName: randomCompany,
      tagline: randomTagline,
    });
  };

  const scrollToDesignSection = () => {
    setOpen(o => ({ ...o, layout: true }));
    setTimeout(() => {
      designSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Templates pagination: show 10 templates at a time, with "Load More" functionality
  const TEMPLATES_PER_PAGE = 10;
  const [visibleTemplateCount, setVisibleTemplateCount] = useState(TEMPLATES_PER_PAGE);
  
  // Sorted templates by category for efficient pagination
  const sortedTemplates = useMemo(() => {
    const byCategory: Record<string, typeof TEMPLATES> = {};
    for (const category of TEMPLATE_CATEGORIES) {
      byCategory[category] = TEMPLATES.filter((t) => t.category === category);
    }
    return byCategory;
  }, []);

  // Total templates count
  const totalTemplatesCount = TEMPLATES.length;

  const applyTemplate = (id: TemplateId) => {
    const t = getTemplateById(id);
    patchDesign({
      template: t.id,
      font: t.font,
      iconStyle: t.iconStyle,
      backgroundStyle: t.backgroundStyle,
      backgroundVariant: t.backgroundVariant ?? 'v1',
      padding: t.padding,
      spacing: t.spacing,
      borderRadius: t.borderRadius,
      backgroundIntensity: t.intensity,
    });
  };

  const updateQr = async (nextValue: string) => {
    const value = nextValue.trim();
    if (!value) {
      patchData({ qrValue: '', qrImage: undefined });
      return;
    }
    try {
      const url = await QRCode.toDataURL(value, {
        margin: 0,
        width: 240,
        color: { dark: '#0b1220', light: '#ffffff' },
      });
      patchData({ qrValue: value, qrImage: url });
    } catch {
      patchData({ qrValue: value, qrImage: undefined });
    }
  };

  const handleUploadLogo = async (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      patchData({ logo: result });
    };
    reader.readAsDataURL(file);
  };

  const logoPositions: { id: LogoPosition; label: string; fullName: string }[] = [
    { id: 'top-left', label: 'TL', fullName: 'Top Left' },
    { id: 'top-right', label: 'TR', fullName: 'Top Right' },
    { id: 'center', label: 'C', fullName: 'Center' },
    { id: 'bottom-left', label: 'BL', fullName: 'Bottom Left' },
    { id: 'bottom-right', label: 'BR', fullName: 'Bottom Right' },
  ];

  const OPTIONAL_LIMIT = 3;
  const enabledOptionalCount = () => {
    const v = state.design.contactVisibility;
    return (
      Number(Boolean(v.phone)) +
      Number(Boolean(v.mobile)) +
      Number(Boolean(v.fax)) +
      Number(Boolean(v.website)) +
      Number(Boolean(v.address)) +
      Number(Boolean(v.facebook)) +
      Number(Boolean(v.twitter)) +
      Number(Boolean(v.linkedin)) +
      Number(Boolean(v.instagram)) +
      Number(Boolean(v.youtube)) +
      Number(Boolean(v.github))
    );
  };

  const optionalSelected = enabledOptionalCount();
  const limitReached = optionalSelected >= OPTIONAL_LIMIT;

  const toggleOptional = (key: keyof DesignSettings['contactVisibility']) => {
    if (key === 'email') return; // required
    const current = state.design.contactVisibility[key];
    if (!current && enabledOptionalCount() >= OPTIONAL_LIMIT) return;
    updateDesign('contactVisibility', {
      ...state.design.contactVisibility,
      email: true,
      [key]: !current,
    } as DesignSettings['contactVisibility']);
  };

  return (
    <div className="w-full h-full overflow-y-auto p-4 lg:p-5">
      {/* Header */}
      <div className="ui-glass-strong ui-shadow-lg rounded-2xl px-5 py-5 mb-5 animate-slide-down">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500" />
              <div className="absolute inset-0 h-12 w-12 rounded-2xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 blur-xl opacity-40" />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-bold tracking-tight">CardCraft Pro</div>
              <div className="text-xs font-medium mt-0.5" style={{ color: 'var(--muted-2)' }}>
                Professional Business Card Designer
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="ui-badge">
                  <Icon name="Sparkles" size={10} decorative />
                  Premium
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <IconButton title="Undo" onClick={undo} disabled={!canUndo}>
              <Icon name="Undo" size="button" decorative />
            </IconButton>
            <IconButton title="Redo" onClick={redo} disabled={!canRedo}>
              <Icon name="Redo" size="button" decorative />
            </IconButton>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="ui-surface rounded-2xl p-4 hover-lift transition-all">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg grid place-items-center" style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(34, 197, 94, 0.06))', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                  <Icon name="BadgeCheck" size="input" style={{ color: 'rgb(34, 197, 94)' }} decorative />
                </div>
                <div className="text-xs font-bold">Saved Versions</div>
              </div>
              <button
                type="button"
                onClick={duplicateCurrent}
                className="inline-flex items-center gap-2 text-xs font-semibold rounded-lg px-2.5 py-1.5 hover:bg-surface-3 transition-colors"
                style={{ color: 'var(--muted)' }}
              >
                <Icon name="Copy" size="input" decorative /> Duplicate
              </button>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2">
              <Select value="" onChange={(v) => v && loadVersion(v)}>
                <option value="">Load a saved version…</option>
                {versions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </Select>

              <div className="flex items-center gap-2">
                <input
                  value={versionName}
                  onChange={(e) => setVersionName(e.target.value)}
                  placeholder="Version name…"
                  className="ui-input flex-1"
                />
                <button
                  type="button"
                  onClick={() => {
                    saveVersion(versionName || `Version · ${new Date().toLocaleString()}`);
                    setVersionName('');
                  }}
                  className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition-all hover-lift"
                  style={{ boxShadow: '0 2px 8px rgba(99, 102, 241, 0.35)' }}
                >
                  <Icon name="Save" size="button" decorative /> Save
                </button>
              </div>
            </div>
          </div>

          <div className="ui-surface rounded-2xl p-4 hover-lift transition-all">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg grid place-items-center" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(139, 92, 246, 0.06))', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                  <Icon name="Sparkles" size="input" style={{ color: 'rgb(139, 92, 246)' }} decorative />
                </div>
                <div className="text-xs font-bold">Quick Actions</div>
              </div>
              <div className="text-[10px] font-medium px-2 py-1 rounded-full" style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'rgb(139, 92, 246)' }}>
                Pro
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  const t = getTemplateById(state.design.template);
                  patchDesign({ padding: t.padding, spacing: t.spacing });
                }}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold ui-surface-2 hover:ui-shadow transition-all hover-lift"
              >
                <Icon name="Sparkles" size="input" decorative /> AI Optimize
              </button>
              <button
                type="button"
                onClick={() => {
                  const snappedPadding = Math.round(state.design.padding / 4) * 4;
                  const snappedSpacing = Math.round(state.design.spacing / 2) * 2;
                  patchDesign({ padding: snappedPadding, spacing: snappedSpacing, snapToGrid: true });
                }}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold ui-surface-2 hover:ui-shadow transition-all hover-lift"
              >
                <Icon name="Grid" size="input" decorative /> Grid Snap
              </button>
              <button
                type="button"
                onClick={() => patchDesign({ logoPosition: 'top-left', showGrid: true })}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold ui-surface-2 hover:ui-shadow transition-all hover-lift"
              >
                <Icon name="AlignCenter" size="input" decorative /> Auto Align
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Buttons */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={generateRandomCard}
          className="group flex items-center justify-center gap-3 rounded-2xl px-5 py-4 text-sm font-bold text-white transition-all hover-lift"
          style={{
            background: 'linear-gradient(135deg, rgb(99, 102, 241), rgb(139, 92, 246))',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
          }}
        >
          <Icon name="Dices" size="button" className="group-hover:rotate-180 transition-transform duration-500" decorative />
          Generate Random Card
        </button>
        <button
          type="button"
          onClick={scrollToDesignSection}
          className="group flex items-center justify-center gap-3 rounded-2xl px-5 py-4 text-sm font-bold transition-all hover-lift ui-surface hover:ui-shadow-lg"
          style={{ border: '1px solid var(--border)' }}
        >
          <Icon name="Palette" size="button" style={{ color: 'rgb(99, 102, 241)' }} decorative />
          <span>Customize Your Own</span>
        </button>
      </div>

      <div className="space-y-3">
        <CollapsibleSection
          title="Identity"
          subtitle="Name, title, company, tagline"
          icon={<Icon name="SlidersHorizontal" size="button" decorative />}
          open={open.identity}
          onToggle={() => setOpen((o) => ({ ...o, identity: !o.identity }))}
        >
          <div className="space-y-3">
            <Field label="Full name">
              <TextInput value={state.data.fullName} onChange={(v) => updateData('fullName', v)} placeholder="Alex Morgan" />
            </Field>
            <Field label="Job title">
              <TextInput value={state.data.jobTitle} onChange={(v) => updateData('jobTitle', v)} placeholder="Founder / Creative Director" />
            </Field>
            <Field label="Company name">
              <TextInput value={state.data.companyName} onChange={(v) => updateData('companyName', v)} placeholder="Design Studio" />
            </Field>
            <Field label="Tagline (optional)" hint="Shown in some templates">
              <TextInput value={state.data.tagline} onChange={(v) => updateData('tagline', v)} placeholder="Designing the Future" />
            </Field>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="Contact Info"
          subtitle="Choose what appears on the card"
          icon={<Icon name="ArrowLeftRight" size="button" decorative />}
          open={open.contact}
          onToggle={() => setOpen((o) => ({ ...o, contact: !o.contact }))}
        >
          <div className="space-y-4">
            <div className="ui-surface-2 rounded-2xl p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-bold">Contact Methods</div>
                <div className="flex items-center gap-2">
                  <div className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${optionalSelected >= OPTIONAL_LIMIT ? 'bg-amber-500/15 text-amber-600' : 'bg-indigo-500/10 text-indigo-600'}`}>
                    {optionalSelected}/{OPTIONAL_LIMIT} selected
                  </div>
                </div>
              </div>
              <div className="mt-2 text-[11px]" style={{ color: 'var(--muted-2)' }}>
                Email is required. Choose up to {OPTIONAL_LIMIT} additional fields.
              </div>
              {limitReached ? (
                <div className="mt-3 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2" style={{ background: 'rgba(234, 179, 8, 0.1)', color: 'rgb(202, 138, 4)', border: '1px solid rgba(234, 179, 8, 0.2)' }}>
                  <Icon name="TriangleAlert" size="input" decorative /> Limit reached — remove a field to add another.
                </div>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2">
                <Chip
                  active={state.design.contactVisibility.email}
                  label="Email"
                  icon={<Icon name="Mail" size="input" decorative />}
                  required
                  onClick={() => {
                    // email stays on
                    updateDesign('contactVisibility', { ...state.design.contactVisibility, email: true });
                  }}
                />
                <Chip
                  active={state.design.contactVisibility.phone}
                  label="Phone"
                  icon={<Icon name="Phone" size="input" decorative />}
                  disabled={limitReached && !state.design.contactVisibility.phone}
                  onClick={() => toggleOptional('phone')}
                />
                <Chip
                  active={state.design.contactVisibility.mobile}
                  label="Mobile"
                  icon={<Icon name="Smartphone" size="input" decorative />}
                  disabled={limitReached && !state.design.contactVisibility.mobile}
                  onClick={() => toggleOptional('mobile')}
                />
                <Chip
                  active={state.design.contactVisibility.website}
                  label="Website"
                  icon={<Icon name="Globe" size="input" decorative />}
                  disabled={limitReached && !state.design.contactVisibility.website}
                  onClick={() => toggleOptional('website')}
                />
                <Chip
                  active={state.design.contactVisibility.address}
                  label="Address"
                  icon={<Icon name="MapPin" size="input" decorative />}
                  disabled={limitReached && !state.design.contactVisibility.address}
                  onClick={() => toggleOptional('address')}
                />
                <Chip
                  active={state.design.contactVisibility.facebook}
                  label="Facebook"
                  icon={<Icon name="Facebook" size="input" decorative />}
                  disabled={limitReached && !state.design.contactVisibility.facebook}
                  onClick={() => toggleOptional('facebook')}
                />
                <Chip
                  active={state.design.contactVisibility.twitter}
                  label="Twitter"
                  icon={<Icon name="Twitter" size="input" decorative />}
                  disabled={limitReached && !state.design.contactVisibility.twitter}
                  onClick={() => toggleOptional('twitter')}
                />
                <Chip
                  active={state.design.contactVisibility.linkedin}
                  label="LinkedIn"
                  icon={<Icon name="Linkedin" size="input" decorative />}
                  disabled={limitReached && !state.design.contactVisibility.linkedin}
                  onClick={() => toggleOptional('linkedin')}
                />
                <Chip
                  active={state.design.contactVisibility.instagram}
                  label="Instagram"
                  icon={<Icon name="Instagram" size="input" decorative />}
                  disabled={limitReached && !state.design.contactVisibility.instagram}
                  onClick={() => toggleOptional('instagram')}
                />
                <Chip
                  active={state.design.contactVisibility.fax}
                  label="Fax"
                  icon={<Icon name="Printer" size="input" decorative />}
                  disabled={limitReached && !state.design.contactVisibility.fax}
                  onClick={() => toggleOptional('fax')}
                />
                <Chip
                  active={state.design.contactVisibility.youtube}
                  label="YouTube"
                  icon={<Icon name="Youtube" size="input" decorative />}
                  disabled={limitReached && !state.design.contactVisibility.youtube}
                  onClick={() => toggleOptional('youtube')}
                />
                <Chip
                  active={state.design.contactVisibility.github}
                  label="Github"
                  icon={<Icon name="Github" size="input" decorative />}
                  disabled={limitReached && !state.design.contactVisibility.github}
                  onClick={() => toggleOptional('github')}
                />
              </div>
            </div>

            <Field label="Email">
              <TextInput value={state.data.email} onChange={(v) => updateData('email', v)} placeholder="alex@company.com" type="email" />
            </Field>
            {state.design.contactVisibility.phone ? (
              <Field label="Phone">
                <TextInput value={state.data.phone} onChange={(v) => updateData('phone', v)} placeholder="+1 (555) 123-4567" />
              </Field>
            ) : null}
            {state.design.contactVisibility.mobile ? (
              <Field label="Mobile">
                <TextInput value={state.data.mobile} onChange={(v) => updateData('mobile', v)} placeholder="+1 (555) 222-0000" />
              </Field>
            ) : null}
            {state.design.contactVisibility.fax ? (
              <Field label="Fax">
                <TextInput value={state.data.fax} onChange={(v) => updateData('fax', v)} placeholder="+1 (555) 987-6543" />
              </Field>
            ) : null}
            {state.design.contactVisibility.website ? (
              <Field label="Website">
                <TextInput
                  value={state.data.website}
                  onChange={(v) => {
                    updateData('website', v);
                    const next = normalizeUrl(v);
                    if (state.design.showQr) {
                      void updateQr(next);
                    } else {
                      patchData({ qrValue: next });
                    }
                  }}
                  placeholder="www.company.com"
                />
              </Field>
            ) : null}
            {state.design.contactVisibility.address ? (
              <Field label="Address">
                <TextInput value={state.data.address} onChange={(v) => updateData('address', v)} placeholder="City, Country" />
              </Field>
            ) : null}
            {state.design.contactVisibility.facebook ? (
              <Field label="Facebook">
                <TextInput value={state.data.facebook} onChange={(v) => updateData('facebook', v)} placeholder="facebook.com/yourpage" />
              </Field>
            ) : null}
            {state.design.contactVisibility.twitter ? (
              <Field label="Twitter">
                <TextInput value={state.data.twitter} onChange={(v) => updateData('twitter', v)} placeholder="@yourhandle" />
              </Field>
            ) : null}
            {state.design.contactVisibility.linkedin ? (
              <Field label="LinkedIn">
                <TextInput value={state.data.linkedin} onChange={(v) => updateData('linkedin', v)} placeholder="linkedin.com/in/you" />
              </Field>
            ) : null}
            {state.design.contactVisibility.instagram ? (
              <Field label="Instagram">
                <TextInput value={state.data.instagram} onChange={(v) => updateData('instagram', v)} placeholder="@yourbrand" />
              </Field>
            ) : null}
            {state.design.contactVisibility.youtube ? (
              <Field label="YouTube">
                <TextInput value={state.data.youtube} onChange={(v) => updateData('youtube', v)} placeholder="youtube.com/@channel" />
              </Field>
            ) : null}
            {state.design.contactVisibility.github ? (
              <Field label="GitHub">
                <TextInput value={state.data.github} onChange={(v) => updateData('github', v)} placeholder="github.com/you" />
              </Field>
            ) : null}

            <div className="ui-surface-2 rounded-2xl p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Icon name="QrCode" size="input" decorative />
                  <div className="text-xs font-semibold">QR Code</div>
                </div>
                <Toggle
                  checked={state.design.showQr}
                  onChange={(v) => {
                    updateDesign('showQr', v);
                    const next = (state.data.qrValue || normalizeUrl(state.data.website || '')).trim();
                    if (v) {
                      void updateQr(next);
                    } else {
                      patchData({ qrImage: undefined });
                    }
                  }}
                  label={state.design.showQr ? 'On' : 'Off'}
                />
              </div>
              <div className="mt-2">
                <Field label="QR value" hint="Defaults to website">
                  <TextInput
                    value={state.data.qrValue || ''}
                    onChange={(v) => {
                      if (state.design.showQr) {
                        void updateQr(v);
                      } else {
                        patchData({ qrValue: v });
                      }
                    }}
                    placeholder="https://example.com"
                  />
                </Field>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="Branding"
          subtitle="Logo, palette, font pairing"
          icon={<Icon name="Image" size="button" decorative />}
          open={open.branding}
          onToggle={() => setOpen((o) => ({ ...o, branding: !o.branding }))}
        >
          <div className="space-y-3">
            <div className="ui-surface-2 rounded-2xl p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-semibold">Logo</div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ui-surface hover:ui-shadow transition-all"
                  >
                      <Icon name="Image" size="input" decorative /> Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => patchData({ logo: undefined })}
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ui-surface hover:ui-shadow transition-all"
                    disabled={!state.data.logo}
                  >
                    <Icon name="Trash" size="input" decorative /> Remove
                  </button>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleUploadLogo(e.target.files?.[0] ?? null)}
              />

              {state.data.logo ? (
                <div className="mt-3 ui-surface rounded-2xl p-3 flex items-center gap-3">
                  <Image
                    src={state.data.logo}
                    alt="Logo preview"
                    width={40}
                    height={40}
                    unoptimized
                    className="h-10 w-10 rounded-xl object-contain bg-white/40"
                  />
                  <div className="text-xs" style={{ color: 'var(--muted-2)' }}>
                    Logo uploaded · Position below
                  </div>
                </div>
              ) : (
                <div className="mt-3 text-xs" style={{ color: 'var(--muted-2)' }}>
                  Upload an SVG/PNG logo for a more premium card.
                </div>
              )}
            </div>

            <div className="ui-surface-2 rounded-2xl p-4">
              <div className="text-xs font-semibold mb-3">Logo position</div>
              <div className="grid grid-cols-5 gap-3">
                {logoPositions.map((p) => {
                  const selected = state.design.logoPosition === p.id;
                  const markerPos: React.CSSProperties =
                    p.id === 'top-left'
                      ? { top: 6, left: 6 }
                      : p.id === 'top-right'
                        ? { top: 6, right: 6 }
                        : p.id === 'bottom-left'
                          ? { bottom: 6, left: 6 }
                          : p.id === 'bottom-right'
                            ? { bottom: 6, right: 6 }
                            : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => updateDesign('logoPosition', p.id)}
                      aria-label={`Logo position ${p.fullName}`}
                      className={`group rounded-2xl p-2 transition-all ${
                        selected 
                          ? 'ui-shadow-glow ring-2 ring-indigo-500/40 bg-linear-to-br from-indigo-500/8 to-purple-500/6' 
                          : 'ui-surface hover:ui-shadow'
                      }`}
                    >
                      <div
                        className="relative w-full aspect-7/4 rounded-lg overflow-hidden"
                        style={{
                          background: 'var(--surface-2)',
                          border: selected ? '1.5px solid rgba(99, 102, 241, 0.3)' : '1px solid var(--border)',
                        }}
                      >
                        {/* Card lines to show layout */}
                        <div className="absolute top-[35%] left-[20%] right-[20%] h-0.5 rounded-full" style={{ background: 'var(--border)' }} />
                        <div className="absolute top-[50%] left-[25%] right-[35%] h-[1.5px] rounded-full" style={{ background: 'var(--muted-3)', opacity: 0.5 }} />
                        
                        {/* Logo marker */}
                        <div
                          className="absolute rounded transition-all"
                          style={{
                            ...markerPos,
                            width: 12,
                            height: 12,
                            background: selected 
                              ? 'linear-gradient(135deg, rgb(99, 102, 241), rgb(139, 92, 246))' 
                              : 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(139, 92, 246, 0.18))',
                            boxShadow: selected ? '0 2px 6px rgba(99, 102, 241, 0.4)' : 'none',
                          }}
                        />
                      </div>
                      <div 
                        className="mt-1.5 text-[9px] font-semibold text-center truncate"
                        style={{ color: selected ? 'rgb(99, 102, 241)' : 'var(--muted-2)' }}
                      >
                        {p.fullName}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="ui-surface-2 rounded-2xl p-4">
              <div className="text-xs font-semibold mb-3">Brand palette</div>
              <div className="space-y-3">
                {(
                  [
                    { key: 'primaryColor', label: 'Primary', desc: 'Main brand color' },
                    { key: 'secondaryColor', label: 'Secondary', desc: 'Supporting color' },
                    { key: 'accentColor', label: 'Accent', desc: 'Highlight color' },
                  ] as const
                ).map((c) => (
                  <div key={c.key} className="ui-surface rounded-2xl p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold">{c.label}</div>
                        <div className="text-[10px] mt-0.5" style={{ color: 'var(--muted-3)' }}>{c.desc}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <input
                            type="color"
                            value={state.design[c.key]}
                            onChange={(e) => updateDesign(c.key, e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div 
                            className="h-10 w-10 rounded-xl cursor-pointer transition-all hover:scale-105 ring-2 ring-white/20"
                            style={{ 
                              background: state.design[c.key],
                              boxShadow: `0 4px 12px ${state.design[c.key]}40`,
                            }}
                          />
                        </div>
                        <input
                          value={state.design[c.key]}
                          onChange={(e) => updateDesign(c.key, e.target.value)}
                          className="w-24 rounded-xl px-3 py-2.5 text-xs font-mono font-medium ui-surface-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 uppercase"
                          style={{ letterSpacing: '0.02em' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ui-surface-2 rounded-2xl p-4">
              <div className="text-xs font-semibold mb-3">Font Family</div>
              <Select
                value={state.design.font}
                onChange={(v) => updateDesign('font', v as DesignSettings['font'])}
                style={{ fontFamily: thumbFontFamily(state.design.font) }}
              >
                <optgroup label="Sans-Serif">
                  <option value="geist" style={{ fontFamily: thumbFontFamily('geist') }}>Geist — Modern SaaS</option>
                  <option value="inter" style={{ fontFamily: thumbFontFamily('inter') }}>Inter — UI Design</option>
                  <option value="roboto" style={{ fontFamily: thumbFontFamily('roboto') }}>Roboto — Google Standard</option>
                  <option value="open-sans" style={{ fontFamily: thumbFontFamily('open-sans') }}>Open Sans — Friendly</option>
                  <option value="lato" style={{ fontFamily: thumbFontFamily('lato') }}>Lato — Elegant</option>
                  <option value="montserrat" style={{ fontFamily: thumbFontFamily('montserrat') }}>Montserrat — Geometric</option>
                  <option value="poppins" style={{ fontFamily: thumbFontFamily('poppins') }}>Poppins — Rounded</option>
                  <option value="nunito" style={{ fontFamily: thumbFontFamily('nunito') }}>Nunito — Soft</option>
                  <option value="raleway" style={{ fontFamily: thumbFontFamily('raleway') }}>Raleway — Stylish</option>
                  <option value="ubuntu" style={{ fontFamily: thumbFontFamily('ubuntu') }}>Ubuntu — Tech</option>
                  <option value="work-sans" style={{ fontFamily: thumbFontFamily('work-sans') }}>Work Sans — Clean</option>
                  <option value="dm-sans" style={{ fontFamily: thumbFontFamily('dm-sans') }}>DM Sans — Minimal</option>
                </optgroup>
                <optgroup label="Serif">
                  <option value="times-new-roman" style={{ fontFamily: thumbFontFamily('times-new-roman') }}>Times New Roman — Classic</option>
                  <option value="georgia" style={{ fontFamily: thumbFontFamily('georgia') }}>Georgia — Traditional</option>
                  <option value="playfair" style={{ fontFamily: thumbFontFamily('playfair') }}>Playfair Display — Luxury</option>
                  <option value="merriweather" style={{ fontFamily: thumbFontFamily('merriweather') }}>Merriweather — Readable</option>
                  <option value="lora" style={{ fontFamily: thumbFontFamily('lora') }}>Lora — Elegant Serif</option>
                  <option value="crimson" style={{ fontFamily: thumbFontFamily('crimson') }}>Crimson Text — Editorial</option>
                  <option value="source-serif" style={{ fontFamily: thumbFontFamily('source-serif') }}>Source Serif — Professional</option>
                </optgroup>
                <optgroup label="Monospace">
                  <option value="jetbrains-mono" style={{ fontFamily: thumbFontFamily('jetbrains-mono') }}>JetBrains Mono — Developer</option>
                  <option value="fira-code" style={{ fontFamily: thumbFontFamily('fira-code') }}>Fira Code — Coding</option>
                  <option value="source-code" style={{ fontFamily: thumbFontFamily('source-code') }}>Source Code Pro — Tech</option>
                </optgroup>
                <optgroup label="Display">
                  <option value="oswald" style={{ fontFamily: thumbFontFamily('oswald') }}>Oswald — Bold Headlines</option>
                  <option value="bebas" style={{ fontFamily: thumbFontFamily('bebas') }}>Bebas Neue — Impact</option>
                  <option value="archivo-black" style={{ fontFamily: thumbFontFamily('archivo-black') }}>Archivo Black — Heavy</option>
                </optgroup>
              </Select>
            </div>
          </div>
        </CollapsibleSection>

        <div ref={designSectionRef}>
          <CollapsibleSection
            title="Design & Layout"
            subtitle="Templates, spacing, icons"
            icon={<Icon name="LayoutGrid" size="button" decorative />}
            open={open.layout}
            onToggle={() => setOpen((o) => ({ ...o, layout: !o.layout }))}
          >
            <div className="space-y-4">
              <div className="ui-surface-2 rounded-2xl p-4">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg grid place-items-center" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(99, 102, 241, 0.06))', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                      <Icon name="Sparkles" size="input" style={{ color: 'rgb(99, 102, 241)' }} decorative />
                    </div>
                    <div className="text-xs font-bold">Premium Templates</div>
                  </div>
                  <div className="flex items-center gap-2">
                  <div className="text-[10px] font-medium px-2 py-1 rounded-full" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.08))', color: 'rgb(99, 102, 241)' }}>
                    {Math.min(visibleTemplateCount, totalTemplatesCount)} / {totalTemplatesCount}
                  </div>
                </div>
              </div>
              
              {/* Templates Grid with Pagination */}
              <div className="space-y-4">
                {(() => {
                  // Flatten all templates and show only the visible count
                  const allTemplates = TEMPLATE_CATEGORIES.flatMap(cat => sortedTemplates[cat] || []);
                  const visibleItems = allTemplates.slice(0, visibleTemplateCount);
                  
                  // Group visible items by category for display
                  const visibleByCategory: Record<string, typeof TEMPLATES> = {};
                  for (const t of visibleItems) {
                    if (!visibleByCategory[t.category]) {
                      visibleByCategory[t.category] = [];
                    }
                    visibleByCategory[t.category].push(t);
                  }
                  
                  return TEMPLATE_CATEGORIES.map((category) => {
                    const items = visibleByCategory[category];
                    if (!items || items.length === 0) return null;
                    
                    return (
                      <div key={category}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted-2)', letterSpacing: '0.08em' }}>
                            {category}
                          </div>
                          <div className="text-[10px] font-medium px-1.5 py-0.5 rounded-md" style={{ background: 'var(--surface)', color: 'var(--muted-2)' }}>
                            {items.length} / {sortedTemplates[category]?.length || 0}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {items.map((t) => {
                            const selected = state.design.template === t.id;
                            const bgBoost =
                              t.backgroundStyle === 'solid' && (t.backgroundVariant === 'v4' || t.backgroundVariant === 'v5')
                                ? 85
                                : t.intensity;
                            const thumbBackground = computeBaseBackground(
                              {
                                primaryColor: state.design.primaryColor,
                                secondaryColor: state.design.secondaryColor,
                                accentColor: state.design.accentColor,
                                backgroundStyle: t.backgroundStyle,
                                backgroundIntensity: bgBoost,
                                backgroundVariant: t.backgroundVariant ?? 'v1',
                              },
                              t.id,
                            );
                            const isDark = t.backgroundStyle === 'noise' || t.backgroundStyle === 'gradient' || t.category === 'Dark Mode';
                            const textColor = isDark ? 'rgba(255,255,255,0.9)' : 'rgba(15,23,42,0.85)';
                            const subtextColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(15,23,42,0.5)';
                            const lineColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(15,23,42,0.12)';
                            const accentDot = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(99,102,241,0.6)';

                            return (
                              <button
                                key={t.id}
                                type="button"
                                onClick={() => applyTemplate(t.id)}
                                className={`group relative rounded-2xl p-2.5 text-left transition-all hover-lift ${
                                  selected 
                                    ? 'ui-shadow-glow ring-2 ring-indigo-500/40 bg-linear-to-br from-indigo-500/8 to-purple-500/6' 
                                    : 'ui-surface hover:ui-shadow-lg'
                                }`}
                              >
                                {/* Card Preview - Actual card aspect ratio */}
                                <div 
                                  className="w-full overflow-hidden transition-transform group-hover:scale-[1.02]"
                                  style={{ 
                                    aspectRatio: '3.5/2',
                                    borderRadius: Math.min(12, t.borderRadius),
                                  }}
                                >
                                  <div
                                    className="relative w-full h-full"
                                    style={{
                                      background: thumbBackground,
                                      borderRadius: Math.min(12, t.borderRadius),
                                      fontFamily: thumbFontFamily(t.font),
                                      boxShadow: '0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.1)',
                                    }}
                                  >
                                    {/* Subtle overlay */}
                                    <div className="absolute inset-0 rounded-[inherit]" style={{ 
                                      background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%)',
                                    }} />
                                    
                                    {/* Card content - simplified visual representation */}
                                    <div 
                                      className="relative h-full w-full flex flex-col"
                                      style={{ padding: Math.max(10, Math.min(14, t.padding / 2)) }}
                                    >
                                      {t.layout === 'center' ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center gap-2">
                                          {/* Name placeholder */}
                                          <div className="w-[60%] h-2.5 rounded-full" style={{ background: textColor }} />
                                          {/* Title placeholder */}
                                          <div className="w-[45%] h-1.5 rounded-full" style={{ background: subtextColor }} />
                                          {/* Company placeholder */}
                                          <div className="w-[35%] h-1.5 rounded-full mt-1" style={{ background: subtextColor }} />
                                          {/* Contact lines */}
                                          <div className="mt-3 space-y-1.5 w-full flex flex-col items-center">
                                            <div className="flex items-center gap-1.5">
                                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: accentDot }} />
                                              <div className="w-16 h-1 rounded-full" style={{ background: subtextColor }} />
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: accentDot }} />
                                              <div className="w-12 h-1 rounded-full" style={{ background: subtextColor }} />
                                            </div>
                                          </div>
                                        </div>
                                      ) : t.layout === 'editorial' ? (
                                        <div className="h-full flex flex-col justify-between">
                                          <div className="flex justify-between items-start">
                                            <div className="space-y-1.5">
                                              <div className="w-14 h-2 rounded-full" style={{ background: textColor }} />
                                              <div className="w-10 h-1.5 rounded-full" style={{ background: subtextColor }} />
                                            </div>
                                            <div className="w-8 h-1.5 rounded-full" style={{ background: subtextColor }} />
                                          </div>
                                          {/* Accent line */}
                                          <div className="w-0.5 h-6 rounded-full self-start" style={{ background: accentDot }} />
                                          <div className="space-y-1.5">
                                            <div className="flex items-center gap-1.5">
                                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: accentDot }} />
                                              <div className="w-14 h-1 rounded-full" style={{ background: subtextColor }} />
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: accentDot }} />
                                              <div className="w-10 h-1 rounded-full" style={{ background: subtextColor }} />
                                            </div>
                                          </div>
                                        </div>
                                      ) : t.layout === 'bold' ? (
                                        <div className="h-full flex flex-col justify-between">
                                          <div>
                                            {/* Company badge */}
                                            <div className="inline-block px-2 py-1 rounded" style={{ background: lineColor }}>
                                              <div className="w-8 h-1 rounded-full" style={{ background: subtextColor }} />
                                            </div>
                                            {/* Large name */}
                                            <div className="w-[70%] h-3 rounded-full mt-2" style={{ background: textColor }} />
                                            <div className="w-[50%] h-1.5 rounded-full mt-1.5" style={{ background: subtextColor }} />
                                          </div>
                                          <div className="space-y-1.5">
                                            <div className="flex items-center gap-1.5">
                                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: accentDot }} />
                                              <div className="w-14 h-1 rounded-full" style={{ background: subtextColor }} />
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: accentDot }} />
                                              <div className="w-10 h-1 rounded-full" style={{ background: subtextColor }} />
                                            </div>
                                          </div>
                                        </div>
                                      ) : t.layout === 'stack' ? (
                                        <div className="h-full flex flex-col justify-between">
                                          <div className="space-y-1.5">
                                            <div className="w-14 h-2 rounded-full" style={{ background: textColor }} />
                                            <div className="w-10 h-1.5 rounded-full" style={{ background: subtextColor }} />
                                            <div className="w-8 h-1.5 rounded-full" style={{ background: subtextColor }} />
                                          </div>
                                          {/* Divider line */}
                                          <div className="w-full h-px" style={{ background: lineColor }} />
                                          <div className="space-y-1.5">
                                            <div className="flex items-center gap-1.5">
                                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: accentDot }} />
                                              <div className="w-14 h-1 rounded-full" style={{ background: subtextColor }} />
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: accentDot }} />
                                              <div className="w-10 h-1 rounded-full" style={{ background: subtextColor }} />
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        /* split layout - default */
                                        <div className="h-full flex flex-col justify-between">
                                          <div className="space-y-1.5">
                                            <div className="w-14 h-2 rounded-full" style={{ background: textColor }} />
                                            <div className="w-10 h-1.5 rounded-full" style={{ background: subtextColor }} />
                                            <div className="w-8 h-1.5 rounded-full" style={{ background: subtextColor }} />
                                          </div>
                                          <div className="space-y-1.5">
                                            <div className="flex items-center gap-1.5">
                                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: accentDot }} />
                                              <div className="w-14 h-1 rounded-full" style={{ background: subtextColor }} />
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: accentDot }} />
                                              <div className="w-10 h-1 rounded-full" style={{ background: subtextColor }} />
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: accentDot }} />
                                              <div className="w-12 h-1 rounded-full" style={{ background: subtextColor }} />
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Template Info */}
                                <div className="mt-2.5 flex items-center justify-between gap-2">
                                  <div className="min-w-0">
                                    <div className="text-xs font-bold truncate">{t.name}</div>
                                    <div className="text-[10px] font-medium truncate" style={{ color: 'var(--muted-2)' }}>
                                      {t.layout} · {t.backgroundStyle}
                                    </div>
                                  </div>
                                  {selected && (
                                    <div className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full" style={{ background: 'linear-gradient(135deg, rgb(99, 102, 241), rgb(139, 92, 246))' }}>
                                      <Icon name="Check" size={12} style={{ color: 'white' }} decorative />
                                    </div>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
              
              {/* Load More Button */}
              {visibleTemplateCount < totalTemplatesCount && (
                <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                  <button
                    type="button"
                    onClick={() => setVisibleTemplateCount(prev => Math.min(prev + TEMPLATES_PER_PAGE, totalTemplatesCount))}
                    className="w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all hover-lift ui-surface hover:ui-shadow"
                    style={{ border: '1px solid var(--border)' }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Icon name="CirclePlus" size="input" decorative />
                      <span>Load More Templates</span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>
                        +{Math.min(TEMPLATES_PER_PAGE, totalTemplatesCount - visibleTemplateCount)} more
                      </span>
                    </div>
                  </button>
                  <div className="text-center text-[10px] mt-2" style={{ color: 'var(--muted-2)' }}>
                    Showing {visibleTemplateCount} of {totalTemplatesCount} premium templates
                  </div>
                </div>
              )}
              
              {/* Show All / Show Less toggle when all loaded */}
              {visibleTemplateCount >= totalTemplatesCount && totalTemplatesCount > TEMPLATES_PER_PAGE && (
                <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                  <button
                    type="button"
                    onClick={() => setVisibleTemplateCount(TEMPLATES_PER_PAGE)}
                    className="w-full rounded-xl px-4 py-2.5 text-xs font-medium transition-all hover:bg-(--surface-2)"
                    style={{ color: 'var(--muted)' }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Icon name="ChevronUp" size="input" decorative />
                      <span>Show Less</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <div className="ui-surface-2 rounded-2xl p-4">
              <div className="text-xs font-bold mb-3">Icon style</div>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    {
                      id: 'minimal',
                      label: 'Minimal',
                      desc: 'Dot markers, clean',
                    },
                    {
                      id: 'line',
                      label: 'Line',
                      desc: 'Classic outline',
                    },
                    {
                      id: 'bold',
                      label: 'Bold',
                      desc: 'Heavier stroke',
                    },
                    {
                      id: 'solid',
                      label: 'Solid',
                      desc: 'Icon tiles',
                    },
                  ] as const
                ).map((s) => {
                  const selected = state.design.iconStyle === s.id;
                  const strokeWidth = s.id === 'bold' ? 2.6 : s.id === 'solid' ? 2.2 : s.id === 'line' ? 2.0 : 1.6;

                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => updateDesign('iconStyle', s.id)}
                      className={`group rounded-2xl p-3 text-left transition-all hover-lift ${
                        selected
                          ? 'ui-shadow-glow ring-2 ring-indigo-500/35 bg-linear-to-br from-indigo-500/8 to-purple-500/6'
                          : 'ui-surface hover:ui-shadow'
                      }`}
                      style={{ border: selected ? '1px solid rgba(99, 102, 241, 0.28)' : '1px solid var(--border)' }}
                      aria-pressed={selected}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-bold" style={{ color: selected ? 'var(--foreground)' : 'var(--muted)' }}>
                            {s.label}
                          </div>
                          <div className="text-[10px] mt-0.5" style={{ color: 'var(--muted-2)' }}>
                            {s.desc}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {s.id === 'minimal' ? (
                            <span
                              className="inline-block h-2.5 w-2.5 rounded-full"
                              style={{ background: 'rgba(99, 102, 241, 0.75)' }}
                            />
                          ) : (
                            <span
                              className="inline-flex items-center justify-center h-9 w-9 rounded-xl"
                              style={
                                s.id === 'solid'
                                  ? { background: 'rgba(99, 102, 241, 0.14)', border: '1px solid var(--border)' }
                                  : { background: 'var(--surface-2)', border: '1px solid var(--border)' }
                              }
                            >
                              <Icon
                                name="Mail"
                                size="button"
                                strokeWidth={strokeWidth}
                                style={{ color: selected ? 'rgb(99, 102, 241)' : 'var(--muted)' }}
                                decorative
                              />
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 text-[10px]" style={{ color: 'var(--muted-3)' }}>
                Card size is fixed to standard 3.5&quot; × 2&quot;.
              </div>
            </div>

            <div className="ui-surface-2 rounded-2xl p-4 space-y-4">
              <Field label={`Border radius · ${state.design.borderRadius}px`}>
                <input
                  type="range"
                  min={0}
                  max={28}
                  value={state.design.borderRadius}
                  onChange={(e) => updateDesign('borderRadius', parseInt(e.target.value))}
                  className="w-full"
                />
              </Field>
              <Field label={`Padding · ${state.design.padding}px`}>
                <input
                  type="range"
                  min={12}
                  max={40}
                  value={state.design.padding}
                  onChange={(e) => updateDesign('padding', parseInt(e.target.value))}
                  className="w-full"
                />
              </Field>
              <Field label={`Spacing · ${state.design.spacing}px`}>
                <input
                  type="range"
                  min={6}
                  max={18}
                  value={state.design.spacing}
                  onChange={(e) => updateDesign('spacing', parseInt(e.target.value))}
                  className="w-full"
                />
              </Field>
            </div>

            <div className="ui-surface-2 rounded-2xl p-3">
              <div className="text-xs font-semibold mb-2">Overlays & export indicators</div>
              <div className="flex flex-wrap gap-2">
                <Toggle checked={state.design.showSafeMargins} onChange={(v) => updateDesign('showSafeMargins', v)} label="Safe margins" />
                <Toggle checked={state.design.showBleed} onChange={(v) => updateDesign('showBleed', v)} label="Bleed" />
                <Toggle checked={state.design.showGrid} onChange={(v) => updateDesign('showGrid', v)} label="Grid" />
                <Toggle checked={state.design.snapToGrid} onChange={(v) => updateDesign('snapToGrid', v)} label="Snap" />
              </div>
            </div>
          </div>
          </CollapsibleSection>
        </div>

        <CollapsibleSection
          title="Background & Patterns"
          subtitle="Front & back side backgrounds"
          icon={<Icon name="Sparkles" size="button" decorative />}
          open={open.background}
          onToggle={() => setOpen((o) => ({ ...o, background: !o.background }))}
        >
          <BackgroundSection state={state} updateDesign={updateDesign} />
        </CollapsibleSection>
      </div>
    </div>
  );
};
