"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import type { BusinessCardState, CardData, DesignSettings, ElementBox, ElementTextStyle, CardSide } from '@/types';
import { Icon } from '@/components/ui/Icon';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toPng, toSvg } from 'html-to-image';
import { getTemplateById } from '@/lib/templates';
import { readableTextColor, withAlpha } from '@/lib/color';
import { computeBaseBackground, getPresetBackground, getPresetTextColor } from '@/lib/backgrounds';

interface PreviewPanelProps {
  state: BusinessCardState;
  patchDesign: (partial: Partial<DesignSettings>) => void;
  patchData?: (partial: Partial<CardData>) => void;

  undo?: () => void;
  redo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

function fontFamily(pairing: BusinessCardState['design']['font']) {
  switch (pairing) {
    // Sans-Serif
    case 'geist':
      return 'var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, sans-serif';
    case 'inter':
      return '"Inter", ui-sans-serif, system-ui, -apple-system, sans-serif';
    case 'roboto':
      return '"Roboto", ui-sans-serif, system-ui, Arial, sans-serif';
    case 'open-sans':
      return '"Open Sans", ui-sans-serif, system-ui, Arial, sans-serif';
    case 'lato':
      return '"Lato", ui-sans-serif, system-ui, Arial, sans-serif';
    case 'montserrat':
      return '"Montserrat", ui-sans-serif, system-ui, Arial, sans-serif';
    case 'poppins':
      return '"Poppins", ui-sans-serif, system-ui, Arial, sans-serif';
    case 'nunito':
      return '"Nunito", ui-sans-serif, system-ui, Arial, sans-serif';
    case 'raleway':
      return '"Raleway", ui-sans-serif, system-ui, Arial, sans-serif';
    case 'ubuntu':
      return '"Ubuntu", ui-sans-serif, system-ui, Arial, sans-serif';
    case 'work-sans':
      return '"Work Sans", ui-sans-serif, system-ui, Arial, sans-serif';
    case 'dm-sans':
      return '"DM Sans", ui-sans-serif, system-ui, Arial, sans-serif';
    // Serif
    case 'times-new-roman':
      return '"Times New Roman", Times, ui-serif, Georgia, serif';
    case 'georgia':
      return 'Georgia, ui-serif, "Times New Roman", Times, serif';
    case 'playfair':
      return '"Playfair Display", ui-serif, Georgia, Times, serif';
    case 'merriweather':
      return '"Merriweather", ui-serif, Georgia, Times, serif';
    case 'lora':
      return '"Lora", ui-serif, Georgia, Times, serif';
    case 'crimson':
      return '"Crimson Text", ui-serif, Georgia, Times, serif';
    case 'source-serif':
      return '"Source Serif 4", ui-serif, Georgia, Times, serif';
    // Monospace
    case 'jetbrains-mono':
      return '"JetBrains Mono", var(--font-geist-mono), ui-monospace, monospace';
    case 'fira-code':
      return '"Fira Code", var(--font-geist-mono), ui-monospace, monospace';
    case 'source-code':
      return '"Source Code Pro", var(--font-geist-mono), ui-monospace, monospace';
    // Display
    case 'oswald':
      return '"Oswald", ui-sans-serif, system-ui, Arial, sans-serif';
    case 'bebas':
      return '"Bebas Neue", ui-sans-serif, system-ui, Arial, sans-serif';
    case 'archivo-black':
      return '"Archivo Black", ui-sans-serif, system-ui, Arial, sans-serif';
    default:
      return 'var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, sans-serif';
  }
}

function iconStroke(iconStyle: BusinessCardState['design']['iconStyle']) {
  switch (iconStyle) {
    case 'bold':
      return 2.6;
    case 'line':
      return 2.0;
    case 'solid':
      return 2.2;
    case 'minimal':
    default:
      return 1.6;
  }
}

function ExportModal({
  open,
  onClose,
  onExport,
}: {
  open: boolean;
  onClose: () => void;
  onExport: (format: 'pdf' | 'png' | 'svg') => Promise<void>;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 animate-fade-in">
      <div className="absolute inset-0 ui-overlay backdrop-blur-md" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="ui-glass-strong ui-shadow-lg w-full max-w-xl rounded-3xl p-6 animate-scale-in">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xl font-bold tracking-tight">Export Your Card</div>
              <div className="text-sm mt-1" style={{ color: 'var(--muted-2)' }}>
                Choose your preferred format for download
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-3 py-2.5 ui-surface hover:ui-shadow transition-all hover-lift"
            >
              <Icon name="X" size="button" className="hover:scale-[1.04]" decorative />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => void onExport('pdf')}
              className="group ui-surface rounded-2xl p-4 hover:ui-shadow-lg transition-all text-left hover-lift"
            >
              <div className="h-12 w-12 rounded-xl grid place-items-center mb-3" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(239, 68, 68, 0.06))', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <Icon name="FileText" size={22} style={{ color: 'rgb(239, 68, 68)' }} decorative />
              </div>
              <div className="text-sm font-bold">PDF</div>
              <div className="text-xs mt-1" style={{ color: 'var(--muted-2)' }}>
                Print-ready, best for professional printing
              </div>
            </button>

            <button
              type="button"
              onClick={() => void onExport('png')}
              className="group ui-surface rounded-2xl p-4 hover:ui-shadow-lg transition-all text-left hover-lift"
            >
              <div className="h-12 w-12 rounded-xl grid place-items-center mb-3" style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(34, 197, 94, 0.06))', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                <Icon name="FileImage" size={22} style={{ color: 'rgb(34, 197, 94)' }} decorative />
              </div>
              <div className="text-sm font-bold">PNG</div>
              <div className="text-xs mt-1" style={{ color: 'var(--muted-2)' }}>
                High quality image for web & sharing
              </div>
            </button>

            <button
              type="button"
              onClick={() => void onExport('svg')}
              className="group ui-surface rounded-2xl p-4 hover:ui-shadow-lg transition-all text-left hover-lift relative overflow-hidden"
            >
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(14, 165, 233, 0.1))', color: 'rgb(14, 165, 233)' }}>
                PRO
              </div>
              <div className="h-12 w-12 rounded-xl grid place-items-center mb-3" style={{ background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12), rgba(14, 165, 233, 0.06))', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                <Icon name="VectorSquare" size={22} style={{ color: 'rgb(14, 165, 233)' }} decorative />
              </div>
              <div className="text-sm font-bold">SVG</div>
              <div className="text-xs mt-1" style={{ color: 'var(--muted-2)' }}>
                Vector format, infinitely scalable
              </div>
            </button>
          </div>

          <div className="mt-5 ui-surface-2 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs font-bold" style={{ color: 'var(--muted)' }}>
              <Icon name="Sparkles" size="input" decorative />
              Print Guidelines
            </div>
            <div className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--muted-2)' }}>
              For best results, export as PDF and convert to CMYK in your print workflow. Enable bleed margins if your printer requires them.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  state,
  patchDesign,
  patchData,
  undo,
  redo,
  canUndo,
  canRedo,
}) => {
  const [side, setSide] = useState<'front' | 'back'>('front');
  const zoomStops = [0.75, 1, 1.25] as const;
  const [zoomIndex, setZoomIndex] = useState<number>(1);
  const [exportOpen, setExportOpen] = useState(false);
  const frontExportRef = useRef<HTMLDivElement>(null);
  const backExportRef = useRef<HTMLDivElement>(null);

  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftText, setDraftText] = useState<string>('');
  const [rotationDraft, setRotationDraft] = useState<Record<string, number>>({});

  const frontInnerRef = useRef<HTMLDivElement>(null);
  const backInnerRef = useRef<HTMLDivElement>(null);

  const [frontInnerSize, setFrontInnerSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [backInnerSize, setBackInnerSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    const el = frontInnerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (!cr) return;
      setFrontInnerSize({ w: cr.width, h: cr.height });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = backInnerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (!cr) return;
      setBackInnerSize({ w: cr.width, h: cr.height });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const template = useMemo(() => getTemplateById(state.design.template), [state.design.template]);

  const qrDataUrl = state.data.qrImage || '';

  const zoom = zoomStops[Math.min(zoomStops.length - 1, Math.max(0, zoomIndex))];
  const snap = state.design.snapToGrid;
  const padding = snap ? Math.round(state.design.padding / 4) * 4 : state.design.padding;
  const spacing = snap ? Math.round(state.design.spacing / 2) * 2 : state.design.spacing;

  const baseBackground = useMemo(() => {
    // Handle different background types
    if (state.design.backgroundStyle === 'preset') {
      return getPresetBackground(state.design.backgroundPreset);
    }
    if (state.design.backgroundStyle === 'image' && state.design.backgroundImage) {
      // Render the image as an editable layer; keep base as solid.
      return state.design.backgroundColor || '#ffffff';
    }
    if (state.design.backgroundStyle === 'solid') {
      // Use backgroundColor for solid style
      return state.design.backgroundColor || '#ffffff';
    }
    return computeBaseBackground(state.design, template.id);
  }, [state.design, template.id]);

  // Background for back side
  const backBackground = useMemo(() => {
    if (state.design.backBackgroundStyle === 'preset') {
      return getPresetBackground(state.design.backBackgroundPreset);
    }
    if (state.design.backBackgroundStyle === 'image' && state.design.backBackgroundImage) {
      return state.design.backBackgroundColor || '#f8fafc';
    }
    if (state.design.backBackgroundStyle === 'solid') {
      return state.design.backBackgroundColor || '#f8fafc';
    }
    return computeBaseBackground({
      ...state.design,
      backgroundStyle: state.design.backBackgroundStyle,
      backgroundIntensity: state.design.backBackgroundIntensity,
      backgroundVariant: state.design.backBackgroundVariant,
    }, template.id);
  }, [state.design, template.id]);

  const layoutRoot = useMemo(() => {
    return (
      state.design.layout ?? {
        front: { elements: {} },
        back: { elements: {} },
      }
    );
  }, [state.design.layout]);

  const sideLayout = useMemo(() => {
    return side === 'front' ? layoutRoot.front : layoutRoot.back;
  }, [layoutRoot, side]);

  const manualLayoutActiveFor = useCallback(
    (s: CardSide) => {
      const sl = s === 'front' ? layoutRoot.front : layoutRoot.back;
      return editMode || !!sl?.backgroundImage || Object.keys(sl?.elements ?? {}).length > 0;
    },
    [editMode, layoutRoot]
  );

  const manualFrontActive = manualLayoutActiveFor('front');
  const manualBackActive = manualLayoutActiveFor('back');

  const gridStep = 4;
  const snapNumber = useCallback(
    (value: number) => {
      if (!state.design.snapToGrid) return value;
      return Math.round(value / gridStep) * gridStep;
    },
    [state.design.snapToGrid]
  );

  const getInnerRef = useCallback(
    (s: CardSide) => (s === 'front' ? frontInnerRef : backInnerRef),
    []
  );

  const getScaleForSide = useCallback(
    (s: CardSide, targetW?: number, targetH?: number) => {
      const sl = s === 'front' ? layoutRoot.front : layoutRoot.back;
      const baseW = sl?.baseW;
      const baseH = sl?.baseH;

      const currentW = targetW;
      const currentH = targetH;

      const sx = baseW && currentW ? currentW / baseW : 1;
      const sy = baseH && currentH ? currentH / baseH : 1;
      return { sx, sy, baseW: baseW ?? currentW ?? 0, baseH: baseH ?? currentH ?? 0, currentW: currentW ?? 0, currentH: currentH ?? 0 };
    },
    [layoutRoot]
  );

  const patchLayoutSide = useCallback(
    (s: CardSide, nextSide: typeof layoutRoot.front) => {
      patchDesign({
        layout: {
          ...layoutRoot,
          [s]: nextSide,
        },
      });
    },
    [layoutRoot, patchDesign]
  );

  const setElementBox = useCallback(
    (s: CardSide, id: string, nextBox: ElementBox) => {
      const current = s === 'front' ? layoutRoot.front : layoutRoot.back;
      const next = {
        ...current,
        elements: {
          ...(current.elements ?? {}),
          [id]: nextBox,
        },
      };
      patchLayoutSide(s, next);
    },
    [layoutRoot, patchLayoutSide]
  );

  const setBackgroundImageBox = useCallback(
    (s: CardSide, nextBox: ElementBox | undefined) => {
      const current = s === 'front' ? layoutRoot.front : layoutRoot.back;
      const next = {
        ...current,
        backgroundImage: nextBox,
      };
      patchLayoutSide(s, next);
    },
    [layoutRoot, patchLayoutSide]
  );

  const resetLayoutSide = useCallback(
    (s: CardSide) => {
      patchLayoutSide(s, { elements: {} });
      setSelectedId(null);
      setEditingId(null);
      setRotationDraft({});
    },
    [patchLayoutSide]
  );

  const elementField = useCallback((id: string): keyof CardData | null => {
    if (id.startsWith('contact.')) {
      const k = id.slice('contact.'.length) as keyof CardData;
      return k;
    }
    switch (id) {
      case 'fullName':
      case 'jobTitle':
      case 'companyName':
      case 'tagline':
      case 'email':
      case 'phone':
      case 'mobile':
      case 'fax':
      case 'website':
      case 'address':
      case 'facebook':
      case 'twitter':
      case 'linkedin':
      case 'instagram':
      case 'youtube':
      case 'github':
        return id as keyof CardData;
      default:
        return null;
    }
  }, []);

  const computedText = useMemo(() => {
    // Determine text color based on background
    if (state.design.backgroundStyle === 'preset') {
      return getPresetTextColor(state.design.backgroundPreset) === 'light' ? '#ffffff' : readableTextColor('#ffffff');
    }
    if (state.design.backgroundStyle === 'noise' || template.category === 'Dark Mode') return '#ffffff';
    if (state.design.backgroundStyle === 'gradient') return '#ffffff';
    return readableTextColor('#ffffff');
  }, [state.design.backgroundStyle, state.design.backgroundPreset, template.category]);

  const defaultTextStyle = useCallback(
    (id: string): ElementTextStyle => {
      const base: ElementTextStyle = {
        fontSize: 12,
        color: withAlpha(computedText, 0.88),
        bold: false,
        italic: false,
        underline: false,
        align: 'left',
        letterSpacing: 0,
        lineHeight: 1.2,
      };

      if (id === 'fullName') return { ...base, fontSize: 24, bold: true, color: computedText, lineHeight: 1.1 };
      if (id === 'jobTitle') return { ...base, fontSize: 14, bold: true, color: state.design.primaryColor, lineHeight: 1.15 };
      if (id === 'companyName') return { ...base, fontSize: 12, bold: true, color: withAlpha(computedText, 0.78) };
      if (id === 'tagline') return { ...base, fontSize: 12, color: withAlpha(computedText, 0.62) };
      if (id.startsWith('contact.')) return { ...base, fontSize: 12, color: withAlpha(computedText, 0.88) };
      if (id === 'website') return { ...base, fontSize: 12, color: withAlpha(computedText, 0.72), align: 'center' };
      return base;
    },
    [computedText, state.design.primaryColor]
  );

  const backgroundLayers = useMemo(() => {
    const intensity = Math.min(1, Math.max(0, state.design.backgroundIntensity / 100));
    const v = state.design.backgroundVariant;

    const layers: React.ReactNode[] = [];

    if (state.design.backgroundStyle === 'geometric') {
      const size = v === 'v3' ? 16 : v === 'v2' ? 22 : 26;
      layers.push(
        <div
          key="geo"
          className="absolute inset-0"
          style={{
            opacity: 0.25 + intensity * 0.35,
            backgroundImage:
              v === 'v4'
                ? `radial-gradient(${withAlpha(state.design.primaryColor, 0.20)} 1px, transparent 1px)`
                : `linear-gradient(90deg, ${withAlpha(state.design.primaryColor, 0.18)} 1px, transparent 1px), linear-gradient(${withAlpha(
                    state.design.secondaryColor,
                    0.14,
                  )} 1px, transparent 1px)`,
            backgroundSize: `${size}px ${size}px`,
            maskImage:
              v === 'v5'
                ? 'radial-gradient(circle at 60% 30%, black, transparent 65%)'
                : 'radial-gradient(circle at 30% 20%, black, transparent 60%)',
          }}
        />,
      );
    }

    if (state.design.backgroundStyle === 'noise') {
      layers.push(
        <div
          key="noise"
          className="absolute inset-0"
          style={{
            opacity: 0.35 + intensity * 0.35,
            backgroundImage:
              v === 'v3'
                ? 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)'
                : 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)',
            backgroundSize: v === 'v3' ? '16px 16px' : '18px 18px, 28px 28px',
            backgroundPosition: v === 'v3' ? '0 0' : '0 0, 6px 10px',
          }}
        />,
      );
    }

    if (state.design.backgroundStyle === 'glass') {
      layers.push(
        <div
          key="glass"
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${state.design.glassBlur}px)`,
            background:
              v === 'v4'
                ? 'radial-gradient(520px circle at 20% 25%, rgba(255,255,255,0.18), transparent 60%), radial-gradient(520px circle at 90% 60%, rgba(255,255,255,0.12), transparent 60%)'
                : 'radial-gradient(500px circle at 10% 20%, rgba(255,255,255,0.20), transparent 55%), radial-gradient(420px circle at 90% 20%, rgba(255,255,255,0.14), transparent 55%)',
          }}
        />,
      );
    }

    if (state.design.backgroundStyle === 'solid') {
      if (v === 'v5') {
        layers.push(
          <div
            key="solid"
            className="absolute inset-0"
            style={{
              opacity: 0.22 + intensity * 0.24,
              backgroundImage: `radial-gradient(${withAlpha(state.design.primaryColor, 0.14)} 1px, transparent 1px)`,
              backgroundSize: '22px 22px',
              maskImage: 'radial-gradient(circle at 20% 20%, black, transparent 60%)',
            }}
          />,
        );
      }
    }

    // No additional layers for preset or image backgrounds
    if (state.design.backgroundStyle === 'preset' || state.design.backgroundStyle === 'image') {
      return layers;
    }

    // subtle edge sheen for most styles
    if (state.design.backgroundStyle !== 'noise') {
      layers.push(
        <div
          key="sheen"
          className="absolute inset-0"
          style={{
            opacity: 0.08 + intensity * 0.14,
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.75), rgba(255,255,255,0.0) 45%, rgba(255,255,255,0.0) 55%, rgba(255,255,255,0.35))',
            mixBlendMode: 'overlay',
          }}
        />,
      );
    }

    return layers;
  }, [state.design]);

  const handleExport = async (format: 'pdf' | 'png' | 'svg') => {
    const frontNode = frontExportRef.current;
    const backNode = backExportRef.current;
    if (!frontNode || !backNode) return;

    // Best-effort: wait for fonts/layout so exports are stable.
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (document as any).fonts?.ready;
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    } catch {
      // ignore
    }

    const downloadDataUrl = (dataUrl: string, filename: string) => {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      a.click();
    };

    const downloadSvgString = (svg: string, filename: string) => {
      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 0);
    };

    if (format === 'pdf') {
      const [frontCanvas, backCanvas] = await Promise.all([
        html2canvas(frontNode, {
          scale: 4,
          useCORS: true,
          backgroundColor: null,
        }),
        html2canvas(backNode, {
          scale: 4,
          useCORS: true,
          backgroundColor: null,
        }),
      ]);
      const frontImg = frontCanvas.toDataURL('image/png');
      const backImg = backCanvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [3.5, 2],
      });
      pdf.addImage(frontImg, 'PNG', 0, 0, 3.5, 2);
      pdf.addPage([3.5, 2], 'landscape');
      pdf.addImage(backImg, 'PNG', 0, 0, 3.5, 2);
      pdf.save('business-card.pdf');
      return;
    }

    if (format === 'png') {
      const [frontUrl, backUrl] = await Promise.all([
        toPng(frontNode, {
          pixelRatio: 3,
          cacheBust: true,
        }),
        toPng(backNode, {
          pixelRatio: 3,
          cacheBust: true,
        }),
      ]);

      downloadDataUrl(frontUrl, 'business-card-front.png');
      downloadDataUrl(backUrl, 'business-card-back.png');
      return;
    }

    const [frontSvg, backSvg] = await Promise.all([
      toSvg(frontNode, { cacheBust: true }),
      toSvg(backNode, { cacheBust: true }),
    ]);
    downloadSvgString(frontSvg, 'business-card-front.svg');
    downloadSvgString(backSvg, 'business-card-back.svg');
  };

  const cardAspect = 'aspect-[7/4]';
  const exportSize = useMemo(() => {
    const ratio = 3.5 / 2;
    const width = 980;
    const height = Math.round(width / ratio);
    return { width, height };
  }, []);

  const contactItems = [
    state.design.contactVisibility.email ? { k: 'email', v: state.data.email } : null,
    state.design.contactVisibility.phone ? { k: 'phone', v: state.data.phone } : null,
    state.design.contactVisibility.mobile ? { k: 'mobile', v: state.data.mobile } : null,
    state.design.contactVisibility.fax ? { k: 'fax', v: state.data.fax } : null,
    state.design.contactVisibility.website ? { k: 'website', v: state.data.website } : null,
    state.design.contactVisibility.address ? { k: 'address', v: state.data.address } : null,
    state.design.contactVisibility.facebook ? { k: 'facebook', v: state.data.facebook } : null,
    state.design.contactVisibility.twitter ? { k: 'twitter', v: state.data.twitter } : null,
    state.design.contactVisibility.linkedin ? { k: 'linkedin', v: state.data.linkedin } : null,
    state.design.contactVisibility.instagram ? { k: 'instagram', v: state.data.instagram } : null,
    state.design.contactVisibility.youtube ? { k: 'youtube', v: state.data.youtube } : null,
    state.design.contactVisibility.github ? { k: 'github', v: state.data.github } : null,
  ].filter(Boolean) as { k: string; v: string }[];

  const contactIcon = useMemo(() => {
    const strokeWidth = iconStroke(state.design.iconStyle);
    const iconColor =
      state.design.backgroundStyle === 'noise' || template.category === 'Dark Mode' || state.design.backgroundStyle === 'gradient'
        ? 'rgba(255,255,255,0.92)'
        : withAlpha(state.design.primaryColor, 0.95);

    const wrapperBase =
      state.design.iconStyle === 'solid'
        ? {
            background: withAlpha(state.design.primaryColor, 0.14),
            border: '1px solid var(--border)',
          }
        : undefined;

    const common = {
      strokeWidth,
      style: { color: iconColor } as React.CSSProperties,
      size: state.design.iconStyle === 'bold' ? 16 : 14,
    } as const;

    return {
      wrapperBase,
      get: (k: string) => {
        switch (k) {
          case 'email':
            return <Icon name="Mail" {...common} decorative />;
          case 'phone':
            return <Icon name="Phone" {...common} decorative />;
          case 'mobile':
            return <Icon name="Smartphone" {...common} decorative />;
          case 'fax':
            return <Icon name="Printer" {...common} decorative />;
          case 'website':
            return <Icon name="Globe" {...common} decorative />;
          case 'address':
            return <Icon name="MapPin" {...common} decorative />;
          case 'facebook':
            return <Icon name="Facebook" {...common} decorative />;
          case 'twitter':
            return <Icon name="Twitter" {...common} decorative />;
          case 'linkedin':
            return <Icon name="Linkedin" {...common} decorative />;
          case 'instagram':
            return <Icon name="Instagram" {...common} decorative />;
          case 'youtube':
            return <Icon name="Youtube" {...common} decorative />;
          case 'github':
            return <Icon name="Github" {...common} decorative />;
          default:
            return null;
        }
      },
    };
  }, [state.design.backgroundStyle, state.design.iconStyle, state.design.primaryColor, template.category]);

  const frontContent = (mode: 'screen' | 'export') => {
    const nameClass = mode === 'export' ? 'text-3xl' : 'text-xl sm:text-2xl';
    const titleClass = mode === 'export' ? 'text-base' : 'text-sm';
    const metaClass = mode === 'export' ? 'text-sm' : 'text-xs';
    const contactText = mode === 'export' ? 'text-[14px]' : 'text-[12px]';

    if (template.layout === 'center') {
      return (
        <div className="relative h-full flex flex-col items-center justify-between text-center">
          <div className="w-full">
            <div data-el="fullName" className={`${nameClass} font-semibold tracking-tight`}>{state.data.fullName || 'Your Name'}</div>
            <div data-el="jobTitle" className={`${titleClass} font-medium mt-2`} style={{ color: state.design.primaryColor }}>
              {state.data.jobTitle || 'Job Title'}
            </div>
            <div className={`${metaClass} mt-2`} style={{ color: withAlpha(computedText, 0.72) }}>
              <span data-el="companyName">{state.data.companyName || 'Company'}</span>
              {state.data.tagline ? <span data-el="tagline">{` · ${state.data.tagline}`}</span> : ''}
            </div>
          </div>

          <div className={`${contactText} w-full`} style={{ display: 'grid', gap: spacing }}>
            {contactItems.map((it) => (
              <div key={it.k} data-el={`contact.${it.k}`} className="flex items-start justify-center gap-2">
                {state.design.iconStyle === 'minimal' ? (
                  <span className="mt-1.5 inline-block h-2.5 w-2.5 rounded-full" style={{ background: withAlpha(state.design.primaryColor, 0.75) }} />
                ) : (
                  <span
                    className="mt-0.5 inline-flex items-center justify-center h-7 w-7 rounded-xl"
                    style={contactIcon.wrapperBase}
                  >
                    {contactIcon.get(it.k)}
                  </span>
                )}
                <div style={{ color: withAlpha(computedText, 0.88), lineHeight: 1.2 }}>{it.v}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (template.layout === 'editorial') {
      return (
        <div className="relative h-full grid" style={{ gridTemplateRows: 'auto 1fr auto', gap: spacing }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div data-el="fullName" className={`${nameClass} font-semibold tracking-tight`}>{state.data.fullName || 'Your Name'}</div>
              <div data-el="jobTitle" className={`${titleClass} font-medium mt-2`} style={{ color: state.design.primaryColor }}>
                {state.data.jobTitle || 'Job Title'}
              </div>
            </div>
            <div className="text-right">
              <div data-el="companyName" className={`${metaClass} font-semibold`} style={{ color: withAlpha(computedText, 0.78) }}>
                {state.data.companyName || 'Company'}
              </div>
              {state.data.tagline ? (
                <div data-el="tagline" className={`${metaClass} mt-1`} style={{ color: withAlpha(computedText, 0.62) }}>
                  {state.data.tagline}
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl" style={{ borderLeft: `3px solid ${withAlpha(state.design.accentColor, 0.65)}` }} />

          <div className={`${contactText}`} style={{ display: 'grid', gap: spacing }}>
            {contactItems.map((it) => (
              <div key={it.k} data-el={`contact.${it.k}`} className="flex items-start gap-2">
                {state.design.iconStyle === 'minimal' ? (
                  <span className="mt-1.5 inline-block h-2.5 w-2.5 rounded-full" style={{ background: withAlpha(state.design.primaryColor, 0.75) }} />
                ) : (
                  <span
                    className="mt-0.5 inline-flex items-center justify-center h-7 w-7 rounded-xl"
                    style={contactIcon.wrapperBase}
                  >
                    {contactIcon.get(it.k)}
                  </span>
                )}
                <div style={{ color: withAlpha(computedText, 0.88), lineHeight: 1.2 }}>{it.v}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (template.layout === 'bold') {
      return (
        <div className="relative h-full flex flex-col justify-between">
          <div>
            <div
              data-el="companyName"
              className="inline-flex rounded-2xl px-3 py-2 text-xs font-semibold"
              style={{ background: withAlpha(state.design.accentColor, 0.16), border: '1px solid var(--border)' }}
            >
              {state.data.companyName || 'Company'}
            </div>
            <div data-el="fullName" className={`${mode === 'export' ? 'text-4xl' : 'text-2xl sm:text-3xl'} font-semibold tracking-tight mt-3`}>
              {state.data.fullName || 'Your Name'}
            </div>
            <div data-el="jobTitle" className={`${titleClass} font-medium mt-2`} style={{ color: state.design.primaryColor }}>
              {state.data.jobTitle || 'Job Title'}
            </div>
          </div>

          <div className={`${contactText}`} style={{ display: 'grid', gap: spacing }}>
            {contactItems.slice(0, 3).map((it) => (
              <div key={it.k} data-el={`contact.${it.k}`} className="flex items-start gap-2">
                {state.design.iconStyle === 'minimal' ? (
                  <span className="mt-1.5 inline-block h-2.5 w-2.5 rounded-full" style={{ background: withAlpha(state.design.primaryColor, 0.75) }} />
                ) : (
                  <span
                    className="mt-0.5 inline-flex items-center justify-center h-7 w-7 rounded-xl"
                    style={contactIcon.wrapperBase}
                  >
                    {contactIcon.get(it.k)}
                  </span>
                )}
                <div style={{ color: withAlpha(computedText, 0.88), lineHeight: 1.2 }}>{it.v}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (template.layout === 'stack') {
      return (
        <div className="relative h-full flex flex-col justify-between">
          <div>
            <div data-el="fullName" className={`${nameClass} font-semibold tracking-tight`}>{state.data.fullName || 'Your Name'}</div>
            <div data-el="jobTitle" className={`${titleClass} font-medium mt-2`} style={{ color: state.design.primaryColor }}>
              {state.data.jobTitle || 'Job Title'}
            </div>
            <div className={`${metaClass} mt-2`} style={{ color: withAlpha(computedText, 0.72) }}>
              <span data-el="companyName">{state.data.companyName || 'Company'}</span>
              {state.data.tagline ? <span data-el="tagline">{` · ${state.data.tagline}`}</span> : ''}
            </div>
          </div>

          <div className="rounded-2xl" style={{ borderTop: `1px solid ${withAlpha(computedText, 0.14)}` }} />

          <div className={`${contactText}`} style={{ display: 'grid', gap: spacing }}>
            {contactItems.map((it) => (
              <div key={it.k} data-el={`contact.${it.k}`} className="flex items-start gap-2">
                {state.design.iconStyle === 'minimal' ? (
                  <span className="mt-1.5 inline-block h-2.5 w-2.5 rounded-full" style={{ background: withAlpha(state.design.primaryColor, 0.75) }} />
                ) : (
                  <span
                    className="mt-0.5 inline-flex items-center justify-center h-7 w-7 rounded-xl"
                    style={contactIcon.wrapperBase}
                  >
                    {contactIcon.get(it.k)}
                  </span>
                )}
                <div style={{ color: withAlpha(computedText, 0.88), lineHeight: 1.2 }}>{it.v}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // split / stack default
    return (
      <div className="relative h-full flex flex-col justify-between">
        <div>
          <div data-el="fullName" className={`${nameClass} font-semibold tracking-tight`}>{state.data.fullName || 'Your Name'}</div>
          <div data-el="jobTitle" className={`${titleClass} font-medium mt-1`} style={{ color: state.design.primaryColor }}>
            {state.data.jobTitle || 'Job Title'}
          </div>
          <div className={`${metaClass} mt-1`} style={{ color: withAlpha(computedText, 0.72) }}>
            <span data-el="companyName">{state.data.companyName || 'Company'}</span>
            {state.data.tagline ? <span data-el="tagline">{` · ${state.data.tagline}`}</span> : ''}
          </div>
        </div>

        <div className={`${contactText}`} style={{ display: 'grid', gap: spacing }}>
          {contactItems.map((it) => (
            <div key={it.k} data-el={`contact.${it.k}`} className="flex items-start gap-2">
              {state.design.iconStyle === 'minimal' ? (
                <span className="mt-1.5 inline-block h-2.5 w-2.5 rounded-full" style={{ background: withAlpha(state.design.primaryColor, 0.75) }} />
              ) : (
                <span
                  className="mt-0.5 inline-flex items-center justify-center h-7 w-7 rounded-xl"
                  style={contactIcon.wrapperBase}
                >
                  {contactIcon.get(it.k)}
                </span>
              )}
              <div style={{ color: withAlpha(computedText, 0.88), lineHeight: 1.2 }}>{it.v}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const logoPlacement = useMemo(() => {
    const p = state.design.logoPosition;
    const base = 'absolute z-20';
    switch (p) {
      case 'top-left':
        return `${base} top-4 left-4`;
      case 'top-right':
        return `${base} top-4 right-4`;
      case 'bottom-left':
        return `${base} bottom-4 left-4`;
      case 'bottom-right':
        return `${base} bottom-4 right-4`;
      case 'center':
      default:
        return `${base} inset-0 grid place-items-center`;
    }
  }, [state.design.logoPosition]);

  const captureSideLayout = useCallback(
    (s: CardSide) => {
      const ref = getInnerRef(s).current;
      if (!ref) return;

      const sl = s === 'front' ? layoutRoot.front : layoutRoot.back;
      const rect = ref.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) return;

      const found: Record<string, ElementBox> = {};
      const nodes = Array.from(ref.querySelectorAll<HTMLElement>('[data-el]'));
      nodes.forEach((node, index) => {
        const id = node.dataset.el;
        if (!id) return;
        const r = node.getBoundingClientRect();
        const existing = sl?.elements?.[id];
        found[id] = {
          x: r.left - rect.left,
          y: r.top - rect.top,
          w: Math.max(4, r.width),
          h: Math.max(4, r.height),
          rotate: existing?.rotate ?? 0,
          z: existing?.z ?? 20 + index,
        };
      });

      const nextElements = {
        ...(sl?.elements ?? {}),
        ...Object.fromEntries(
          Object.entries(found).map(([id, box]) => {
            // Only override missing boxes; keep user adjustments.
            const existing = sl?.elements?.[id];
            return [id, existing ?? box];
          })
        ),
      };

      const nextSide = {
        ...(sl ?? { elements: {} }),
        elements: nextElements,
        baseW: sl?.baseW ?? rect.width,
        baseH: sl?.baseH ?? rect.height,
        templateId: state.design.template,
        padding,
      };

      // Default editable background image box (fills inner area).
      const hasBgImage = s === 'front'
        ? state.design.backgroundStyle === 'image' && !!state.design.backgroundImage
        : state.design.backBackgroundStyle === 'image' && !!state.design.backBackgroundImage;
      if (hasBgImage && !nextSide.backgroundImage) {
        nextSide.backgroundImage = { x: 0, y: 0, w: rect.width, h: rect.height, rotate: 0, z: 0 };
      }

      patchLayoutSide(s, nextSide);
    },
    [getInnerRef, layoutRoot.back, layoutRoot.front, padding, patchLayoutSide, state.design.backgroundImage, state.design.backgroundStyle, state.design.backBackgroundImage, state.design.backBackgroundStyle, state.design.template]
  );

  useEffect(() => {
    if (!editMode) return;
    const sl = sideLayout;
    const needsCapture = !sl?.baseW || sl?.templateId !== state.design.template || sl?.padding !== padding;
    if (!needsCapture) return;
    const id = requestAnimationFrame(() => captureSideLayout(side));
    return () => cancelAnimationFrame(id);
  }, [captureSideLayout, editMode, padding, side, sideLayout, state.design.template]);

  const renderTextValue = useCallback(
    (id: string) => {
      if (id.startsWith('contact.')) {
        const k = id.slice('contact.'.length) as keyof CardData;
        return (state.data[k] as string) || '';
      }
      const field = elementField(id);
      if (!field) return '';
      return (state.data[field] as string) || '';
    },
    [elementField, state.data]
  );

  const renderManualLayer = (s: CardSide, mode: 'screen' | 'export', containerW?: number, containerH?: number) => {
      const sl = s === 'front' ? layoutRoot.front : layoutRoot.back;
      const { sx, sy } = getScaleForSide(s, containerW, containerH);
      const isInteractive = mode === 'screen' && editMode;

      const textStyleFor = (id: string): ElementTextStyle => {
        const stored = sl?.textStyles?.[id];
        return stored ?? defaultTextStyle(id);
      };

      const commonTextStyle = (id: string): React.CSSProperties => {
        const st = textStyleFor(id);
        return {
          fontSize: st.fontSize,
          color: st.color,
          fontWeight: st.bold ? 700 : 500,
          fontStyle: st.italic ? 'italic' : 'normal',
          textDecoration: st.underline ? 'underline' : 'none',
          letterSpacing: `${st.letterSpacing}px`,
          lineHeight: st.lineHeight,
          textAlign: st.align,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: st.align === 'center' ? 'center' : st.align === 'right' ? 'flex-end' : 'flex-start',
          overflow: 'hidden',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          userSelect: isInteractive ? 'none' : 'auto',
        };
      };

      const setBoxFromCurrent = (id: string, boxInCurrent: ElementBox) => {
        const base: ElementBox = {
          ...boxInCurrent,
          x: boxInCurrent.x / sx,
          y: boxInCurrent.y / sy,
          w: boxInCurrent.w / sx,
          h: boxInCurrent.h / sy,
        };
        setElementBox(s, id, {
          ...base,
          x: snapNumber(base.x),
          y: snapNumber(base.y),
          w: Math.max(gridStep, snapNumber(base.w)),
          h: Math.max(gridStep, snapNumber(base.h)),
        });
      };

      const setBgFromCurrent = (boxInCurrent: ElementBox) => {
        const base: ElementBox = {
          ...boxInCurrent,
          x: boxInCurrent.x / sx,
          y: boxInCurrent.y / sy,
          w: boxInCurrent.w / sx,
          h: boxInCurrent.h / sy,
        };
        setBackgroundImageBox(s, {
          ...base,
          x: snapNumber(base.x),
          y: snapNumber(base.y),
          w: Math.max(gridStep, snapNumber(base.w)),
          h: Math.max(gridStep, snapNumber(base.h)),
        });
      };

      const renderEditableText = (id: string, placeholder: string) => {
        const value = renderTextValue(id) || placeholder;
        if (isInteractive && editingId === id && patchData) {
          return (
            <input
              autoFocus
              className="ui-input h-full w-full"
              value={draftText}
              placeholder={placeholder}
              onChange={(e) => setDraftText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setEditingId(null);
                  return;
                }
                if (e.key === 'Enter') {
                  const field = elementField(id);
                  if (field) patchData({ [field]: draftText } as Partial<CardData>);
                  setEditingId(null);
                }
              }}
              onBlur={() => {
                const field = elementField(id);
                if (field) patchData({ [field]: draftText } as Partial<CardData>);
                setEditingId(null);
              }}
            />
          );
        }
        return (
          <div
            className="h-full w-full"
            style={commonTextStyle(id)}
            onDoubleClick={() => {
              if (!isInteractive) return;
              const field = elementField(id);
              if (!field || !patchData) return;
              setEditingId(id);
              setDraftText((state.data[field] as string) || '');
            }}
          >
            {value}
          </div>
        );
      };

      // Background image layer
      const bgSrc = s === 'front' ? state.design.backgroundImage : state.design.backBackgroundImage;
      const bgEnabled = s === 'front'
        ? state.design.backgroundStyle === 'image' && !!bgSrc
        : state.design.backBackgroundStyle === 'image' && !!bgSrc;

      const bgBox = sl?.backgroundImage;

      const items: Array<{ id: string; kind: 'text' | 'logo' | 'qr' | 'contact'; render: () => React.ReactNode }> = [];

      if (s === 'front') {
        items.push({ id: 'fullName', kind: 'text', render: () => renderEditableText('fullName', 'Your Name') });
        items.push({ id: 'jobTitle', kind: 'text', render: () => renderEditableText('jobTitle', 'Job Title') });
        items.push({ id: 'companyName', kind: 'text', render: () => renderEditableText('companyName', 'Company') });
        items.push({ id: 'tagline', kind: 'text', render: () => renderEditableText('tagline', '') });

        contactItems.forEach((it) => {
          items.push({
            id: `contact.${it.k}`,
            kind: 'contact',
            render: () => (
              <div className="h-full w-full flex items-start gap-2" style={{ color: withAlpha(computedText, 0.88), lineHeight: 1.2 }}>
                {state.design.iconStyle === 'minimal' ? (
                  <span className="mt-1.5 inline-block h-2.5 w-2.5 rounded-full" style={{ background: withAlpha(state.design.primaryColor, 0.75) }} />
                ) : (
                  <span
                    className="mt-0.5 inline-flex items-center justify-center h-7 w-7 rounded-xl"
                    style={contactIcon.wrapperBase}
                  >
                    {contactIcon.get(it.k)}
                  </span>
                )}
                <div className="flex-1">
                  {renderEditableText(`contact.${it.k}`, '')}
                </div>
              </div>
            ),
          });
        });

        if (state.data.logo) {
          items.push({
            id: 'logo',
            kind: 'logo',
            render: () => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={state.data.logo}
                alt="Logo"
                className="h-full w-full rounded-xl object-contain bg-white/70"
                style={{ border: '1px solid var(--border)' }}
              />
            ),
          });
        }
      } else {
        items.push({ id: 'companyName', kind: 'text', render: () => renderEditableText('companyName', 'Company') });

        if (state.data.logo) {
          items.push({
            id: 'logo',
            kind: 'logo',
            render: () => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={state.data.logo}
                alt="Logo"
                className="h-full w-full rounded-2xl object-contain bg-white/75"
                style={{ border: '1px solid var(--border)' }}
              />
            ),
          });
        }

        if (state.design.showQr && qrDataUrl) {
          items.push({
            id: 'qr',
            kind: 'qr',
            render: () => (
              <div className="h-full w-full grid place-items-center rounded-2xl bg-white" style={{ border: '1px solid var(--border)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl} alt="QR code" className="h-full w-full object-contain" />
              </div>
            ),
          });
        }

        items.push({ id: 'website', kind: 'text', render: () => renderEditableText('website', '') });
      }

      const sorted = items
        .map((it) => ({ it, box: sl?.elements?.[it.id] }))
        .filter((x) => !!x.box)
        .sort((a, b) => (a.box!.z ?? 0) - (b.box!.z ?? 0));

      const startRotate =
        (id: string, current: ElementBox, commit: (angle: number) => void) =>
        (e: React.PointerEvent) => {
        if (!isInteractive) return;
        e.preventDefault();
        e.stopPropagation();
        setSelectedId(id);

        const parentEl = getInnerRef(s).current;
        if (!parentEl) return;
        const parentRect = parentEl.getBoundingClientRect();

        const cx = (current.x * sx + (current.w * sx) / 2);
        const cy = (current.y * sy + (current.h * sy) / 2);

        const onMove = (ev: PointerEvent) => {
          const px = ev.clientX - parentRect.left;
          const py = ev.clientY - parentRect.top;
          const angle = (Math.atan2(py - cy, px - cx) * 180) / Math.PI;
          setRotationDraft((d) => ({ ...d, [id]: angle }));
        };
        const onUp = () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp);
          setRotationDraft((d) => {
            const next = { ...d };
            const angle = next[id];
            delete next[id];
            if (typeof angle === 'number') {
              commit(angle);
            }
            return next;
          });
        };

        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
      };

      return (
        <>
          {bgEnabled && bgSrc && bgBox ? (
            <Rnd
              bounds="parent"
              disableDragging={!isInteractive}
              enableResizing={isInteractive && selectedId === 'backgroundImage'}
              size={{ width: bgBox.w * sx, height: bgBox.h * sy }}
              position={{ x: bgBox.x * sx, y: bgBox.y * sy }}
              style={{ zIndex: bgBox.z ?? 0 }}
              onDragStart={() => setSelectedId('backgroundImage')}
              onDragStop={(_, d) => {
                setBgFromCurrent({ ...bgBox, x: d.x, y: d.y, w: bgBox.w * sx, h: bgBox.h * sy } as ElementBox);
              }}
              onResizeStop={(_, __, ref, ___, pos) => {
                const w = ref.offsetWidth;
                const h = ref.offsetHeight;
                setBgFromCurrent({ ...bgBox, x: pos.x, y: pos.y, w, h } as ElementBox);
              }}
            >
              <div
                className={`absolute inset-0 ${selectedId === 'backgroundImage' && isInteractive ? 'ring-2 ring-teal-500/60' : ''}`}
                onMouseDown={() => setSelectedId('backgroundImage')}
                style={{ overflow: 'hidden', borderRadius: 0 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bgSrc}
                  alt="Background"
                  className="h-full w-full"
                  style={{ objectFit: 'cover', transform: `rotate(${rotationDraft['backgroundImage'] ?? bgBox.rotate}deg)` }}
                />
                {isInteractive && selectedId === 'backgroundImage' ? (
                  <div
                    className="absolute -top-7 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full ui-surface grid place-items-center cursor-grab"
                    onPointerDown={startRotate('backgroundImage', bgBox, (angle) => setBackgroundImageBox(s, { ...bgBox, rotate: angle }))}
                    style={{ border: '1px solid var(--border)' }}
                    title="Rotate"
                  >
                    <Icon name="RotateCw" size="input" decorative />
                  </div>
                ) : null}
              </div>
            </Rnd>
          ) : null}

          {sorted.map(({ it, box }) => {
            const b = box!;
            const rotate = rotationDraft[it.id] ?? b.rotate;
            const isSelected = selectedId === it.id;

            return (
              <Rnd
                key={it.id}
                bounds="parent"
                disableDragging={!isInteractive}
                enableResizing={isInteractive && isSelected}
                size={{ width: b.w * sx, height: b.h * sy }}
                position={{ x: b.x * sx, y: b.y * sy }}
                style={{ zIndex: b.z ?? 20 }}
                onDragStart={() => {
                  setSelectedId(it.id);
                  setEditingId(null);
                }}
                onDragStop={(_, d) => {
                  setBoxFromCurrent(it.id, { ...b, x: d.x, y: d.y, w: b.w * sx, h: b.h * sy, rotate } as ElementBox);
                }}
                onResizeStart={() => {
                  setSelectedId(it.id);
                  setEditingId(null);
                }}
                onResizeStop={(_, __, ref, ___, pos) => {
                  const w = ref.offsetWidth;
                  const h = ref.offsetHeight;
                  setBoxFromCurrent(it.id, { ...b, x: pos.x, y: pos.y, w, h, rotate } as ElementBox);
                }}
              >
                <div
                  className={`relative h-full w-full ${isInteractive && isSelected ? 'ring-2 ring-teal-500/60' : ''}`}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setSelectedId(it.id);
                  }}
                >
                  <div className="absolute inset-0" style={{ transform: `rotate(${rotate}deg)`, transformOrigin: 'center center' }}>
                    {it.render()}
                  </div>

                  {isInteractive && isSelected && it.kind === 'logo' ? (
                    <div
                      className="absolute -top-7 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full ui-surface grid place-items-center cursor-grab"
                      onPointerDown={startRotate(it.id, b, (angle) => setElementBox(s, it.id, { ...b, rotate: angle }))}
                      style={{ border: '1px solid var(--border)' }}
                      title="Rotate"
                    >
                      <Icon name="RotateCw" size="input" decorative />
                    </div>
                  ) : null}
                </div>
              </Rnd>
            );
          })}
        </>
      );
    };

  return (
    <div className="w-full h-full flex flex-col bg-canvas">
      {/* Toolbar */}
      <div className="ui-glass-strong ui-shadow-lg px-4 py-3 animate-slide-down">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setSide((s) => (s === 'front' ? 'back' : 'front'))}
              className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 ui-surface hover:ui-shadow transition-all text-sm font-semibold hover-lift"
            >
              <Icon name="FlipHorizontal" size="button" decorative /> {side === 'front' ? 'Front' : 'Back'}
            </button>

            <div className="h-8 w-px bg-border hidden sm:block" />

            <div className="flex items-center gap-1 p-1 rounded-xl ui-surface-2">
              <button
                type="button"
                onClick={() => setZoomIndex((z) => Math.max(0, z - 1))}
                disabled={zoomIndex === 0}
                className="inline-flex items-center justify-center rounded-lg px-2.5 py-2 hover:bg-surface-3 transition-all disabled:opacity-40"
              >
                <Icon name="ZoomOut" size="input" decorative />
              </button>
              <div className="px-3 py-1.5 text-sm font-bold min-w-13 text-center">
                {Math.round(zoom * 100)}%
              </div>
              <button
                type="button"
                onClick={() => setZoomIndex((z) => Math.min(zoomStops.length - 1, z + 1))}
                disabled={zoomIndex === zoomStops.length - 1}
                className="inline-flex items-center justify-center rounded-lg px-2.5 py-2 hover:bg-surface-3 transition-all disabled:opacity-40"
              >
                <Icon name="ZoomIn" size="input" decorative />
              </button>
            </div>

            {undo && redo ? (
              <>
                <div className="h-8 w-px bg-border hidden lg:block" />
                <div className="flex items-center gap-1 p-1 rounded-xl ui-surface-2">
                  <button
                    type="button"
                    onClick={undo}
                    disabled={!canUndo}
                    className="inline-flex items-center justify-center rounded-lg px-2.5 py-2 hover:bg-surface-3 transition-all disabled:opacity-40"
                    title="Undo"
                  >
                    <Icon name="Undo2" size="input" decorative />
                  </button>
                  <button
                    type="button"
                    onClick={redo}
                    disabled={!canRedo}
                    className="inline-flex items-center justify-center rounded-lg px-2.5 py-2 hover:bg-surface-3 transition-all disabled:opacity-40"
                    title="Redo"
                  >
                    <Icon name="Redo2" size="input" decorative />
                  </button>
                </div>
              </>
            ) : null}

            <div className="flex items-center gap-1 p-1 rounded-xl ui-surface-2">
              <button
                type="button"
                onClick={() => patchDesign({ showSafeMargins: !state.design.showSafeMargins })}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition-all ${
                  state.design.showSafeMargins 
                    ? 'bg-teal-500/15 text-teal-600 dark:text-teal-300' 
                    : 'hover:bg-surface-3'
                }`}
              >
                <Icon name="Shield" size="input" decorative />
                <span className="hidden lg:inline">Safe</span>
              </button>
              <button
                type="button"
                onClick={() => patchDesign({ showBleed: !state.design.showBleed })}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition-all ${
                  state.design.showBleed 
                    ? 'bg-orange-500/15 text-orange-600 dark:text-orange-300' 
                    : 'hover:bg-surface-3'
                }`}
              >
                <Icon name="Sparkles" size="input" decorative />
                <span className="hidden lg:inline">Bleed</span>
              </button>
              <button
                type="button"
                onClick={() => patchDesign({ showGrid: !state.design.showGrid })}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition-all ${
                  state.design.showGrid 
                    ? 'bg-sky-500/15 text-sky-600 dark:text-sky-300' 
                    : 'hover:bg-surface-3'
                }`}
              >
                <Icon name="Grid3X3" size="input" decorative />
                <span className="hidden lg:inline">Grid</span>
              </button>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl ui-surface-2">
              <button
                type="button"
                onClick={() => setEditMode((m) => !m)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition-all ${
                  editMode ? 'bg-teal-500/15 text-teal-600 dark:text-teal-300' : 'hover:bg-surface-3'
                }`}
                title={editMode ? 'Exit edit mode' : 'Enter edit mode'}
              >
                <Icon name={editMode ? 'MousePointer2' : 'Move'} size="input" decorative />
                <span className="hidden lg:inline">Edit</span>
              </button>
              <button
                type="button"
                onClick={() => resetLayoutSide(side)}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold hover:bg-surface-3 transition-all"
                title="Reset manual layout"
              >
                <Icon name="RefreshCcw" size="input" decorative />
                <span className="hidden lg:inline">Reset</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setExportOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white bg-linear-to-r from-teal-500 via-sky-500 to-orange-500 hover:opacity-95 transition-all hover-lift animate-pulse-glow"
            style={{ boxShadow: '0 4px 16px rgba(14, 165, 233, 0.35)' }}
          >
              <Icon name="Download" size="button" decorative /> Export
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-hidden grid place-items-center p-6 lg:p-8">
        <div className="w-full max-w-130">
          <div
            className={`relative ${cardAspect} transition-all duration-500 ease-out`}
            style={{ transform: `scale(${zoom})` }}
          >
            {/* Card glow effect */}
            <div 
              className="absolute inset-0 rounded-3xl blur-2xl opacity-30 transition-opacity duration-500"
              style={{ 
                background: `linear-gradient(135deg, ${state.design.primaryColor}, ${state.design.accentColor})`,
                transform: 'scale(0.95) translateY(8px)',
              }}
            />
            
            <div className="absolute inset-0" style={{ perspective: '1200px' }}>
              <div
                className="absolute inset-0 transition-transform duration-700 ease-out"
                style={{ transformStyle: 'preserve-3d', transform: side === 'back' ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
              >
                {/* Front */}
                <div
                  key={`front-${state.design.template}`}
                  className="absolute inset-0 rounded-[20px] ui-shadow overflow-hidden transition-[transform,opacity,filter] duration-300"
                  style={{
                    borderRadius: `${state.design.borderRadius}px`,
                    background: baseBackground,
                    color: computedText,
                    backfaceVisibility: 'hidden',
                    fontFamily: fontFamily(state.design.font),
                    border: '1px solid var(--border)',
                  }}
                >
                  {/* Background layers */}
                  {backgroundLayers}

                  {/* Content */}
                  <div
                    ref={frontInnerRef}
                    className="relative w-full h-full"
                    style={{ padding }}
                    onMouseDown={() => {
                      if (!editMode) return;
                      setSelectedId(null);
                      setEditingId(null);
                    }}
                  >
                    {/* Base template content kept for capture; hidden when manual overlay active */}
                    <div style={manualFrontActive ? { opacity: 0, pointerEvents: 'none' } : undefined}>
                      {state.data.logo ? (
                        <div data-el="logo" className={logoPlacement}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={state.data.logo}
                            alt="Logo"
                            className="h-10 w-10 rounded-xl object-contain bg-white/70"
                            style={{ border: '1px solid var(--border)' }}
                          />
                        </div>
                      ) : null}

                      <div className="relative h-full flex flex-col justify-between">
                        {frontContent('screen')}
                      </div>
                    </div>

                    {/* Manual layer (draggable/resizable elements + editable background image) */}
                    {manualFrontActive ? (
                      <div className="absolute inset-0">
                        {renderManualLayer('front', 'screen', frontInnerSize.w, frontInnerSize.h)}
                      </div>
                    ) : null}

                    {/* Print overlays */}
                    {state.design.showSafeMargins ? (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          padding: Math.round(padding * 0.55),
                        }}
                      >
                        <div className="w-full h-full rounded-xl" style={{ border: '1px dashed rgba(99,102,241,0.55)' }} />
                      </div>
                    ) : null}
                    {state.design.showBleed ? (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-2 rounded-xl" style={{ border: '1px solid rgba(236,72,153,0.35)' }} />
                      </div>
                    ) : null}
                    {state.design.showGrid ? (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          backgroundImage:
                            'linear-gradient(90deg, rgba(148,163,184,0.18) 1px, transparent 1px), linear-gradient(rgba(148,163,184,0.14) 1px, transparent 1px)',
                          backgroundSize: '26px 26px',
                          opacity: 0.55,
                        }}
                      />
                    ) : null}
                  </div>
                </div>

                {/* Back */}
                <div
                  key={`back-${state.design.template}`}
                  className="absolute inset-0 ui-shadow overflow-hidden"
                  style={{
                    borderRadius: `${state.design.borderRadius}px`,
                    background: backBackground,
                    color: computedText,
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    fontFamily: fontFamily(state.design.font),
                    border: '1px solid var(--border)',
                  }}
                >
                  <div
                    ref={backInnerRef}
                    className="relative w-full h-full"
                    style={{ padding }}
                    onMouseDown={() => {
                      if (!editMode) return;
                      setSelectedId(null);
                      setEditingId(null);
                    }}
                  >
                    {state.design.backBackgroundStyle !== 'image' && state.design.backBackgroundStyle !== 'preset' && (
                      <div
                        className="absolute inset-0 opacity-70"
                        style={{
                          backgroundImage: `radial-gradient(${withAlpha(state.design.primaryColor, 0.25)} 1px, transparent 1px)`,
                          backgroundSize: '22px 22px',
                        }}
                      />
                    )}

                    <div style={manualBackActive ? { opacity: 0, pointerEvents: 'none' } : undefined}>
                      <div className="relative h-full grid place-items-center text-center">
                        <div>
                          <div data-el="companyName" className="text-sm font-semibold" style={{ color: withAlpha(computedText, 0.80) }}>
                            {state.data.companyName || 'Company'}
                          </div>

                          <div className="mt-2">
                            {state.data.logo ? (
                              <div data-el="logo">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={state.data.logo}
                                  alt="Logo"
                                  className="h-14 w-14 rounded-2xl object-contain bg-white/75 mx-auto"
                                  style={{ border: '1px solid var(--border)' }}
                                />
                              </div>
                            ) : (
                              <div
                                className="inline-flex items-center justify-center h-14 w-14 rounded-2xl"
                                style={{ background: withAlpha(state.design.accentColor, 0.18), border: '1px solid var(--border)' }}
                              >
                                <div className="text-xl font-semibold" style={{ color: state.design.primaryColor }}>
                                  {state.data.companyName?.slice(0, 1) || 'C'}
                                </div>
                              </div>
                            )}
                          </div>

                          {state.design.showQr && qrDataUrl ? (
                            <div data-el="qr" className="mt-3 inline-flex items-center justify-center rounded-2xl bg-white p-2" style={{ border: '1px solid var(--border)' }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={qrDataUrl} alt="QR code" className="h-20 w-20" />
                            </div>
                          ) : null}

                          <div data-el="website" className="mt-3 text-xs" style={{ color: withAlpha(computedText, 0.72) }}>
                            {state.data.website}
                          </div>
                        </div>
                      </div>
                    </div>

                    {manualBackActive ? (
                      <div className="absolute inset-0">
                        {renderManualLayer('back', 'screen', backInnerSize.w, backInnerSize.h)}
                      </div>
                    ) : null}

                    {state.design.showSafeMargins ? (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          padding: Math.round(padding * 0.55),
                        }}
                      >
                        <div className="w-full h-full rounded-xl" style={{ border: '1px dashed rgba(99,102,241,0.55)' }} />
                      </div>
                    ) : null}
                    {state.design.showBleed ? (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-2 rounded-xl" style={{ border: '1px solid rgba(236,72,153,0.35)' }} />
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Export capture target */}
                <div className="sr-only" />
              </div>
            </div>

          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg grid place-items-center" style={{ background: baseBackground, border: '1px solid var(--border)' }} />
              <div>
                <div className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>
                  {template.name}
                </div>
                <div className="text-[11px]" style={{ color: 'var(--muted-2)' }}>
                  {template.category} · {template.layout}
                </div>
              </div>
            </div>
            <div className="ui-surface rounded-xl px-3 py-2">
              <div className="text-xs font-bold" style={{ color: 'var(--muted)' }}>
                {'3.5" × 2"'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        onExport={async (format) => {
          await handleExport(format);
          setExportOpen(false);
        }}
      />

      {/* Off-screen export nodes (front + back) */}
      <div
        ref={frontExportRef}
        aria-hidden
        style={{
          position: 'fixed',
          left: -10000,
          top: 0,
          width: exportSize.width,
          height: exportSize.height,
        }}
      >
        <div
          className="w-full h-full overflow-hidden"
          style={{
            borderRadius: `${state.design.borderRadius}px`,
            background: baseBackground,
            color: computedText,
            fontFamily: fontFamily(state.design.font),
            border: '1px solid var(--border)',
          }}
        >
          <div className="relative w-full h-full" style={{ padding }}>
            {backgroundLayers}
            {manualFrontActive ? (
              <div className="absolute inset-0">
                {renderManualLayer('front', 'export', exportSize.width - padding * 2, exportSize.height - padding * 2)}
              </div>
            ) : (
              <>
                {state.data.logo ? (
                  <div className={logoPlacement}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={state.data.logo}
                      alt="Logo"
                      className="h-12 w-12 rounded-2xl object-contain bg-white/70"
                      style={{ border: '1px solid var(--border)' }}
                    />
                  </div>
                ) : null}

                {frontContent('export')}
              </>
            )}
          </div>
        </div>
      </div>

      <div
        ref={backExportRef}
        aria-hidden
        style={{
          position: 'fixed',
          left: -20000,
          top: 0,
          width: exportSize.width,
          height: exportSize.height,
        }}
      >
        <div
          className="w-full h-full overflow-hidden"
          style={{
            borderRadius: `${state.design.borderRadius}px`,
            background: backBackground,
            color: computedText,
            fontFamily: fontFamily(state.design.font),
            border: '1px solid var(--border)',
          }}
        >
          <div className="relative w-full h-full" style={{ padding }}>
            <div
              className="absolute inset-0 opacity-70"
              style={{
                backgroundImage: `radial-gradient(${withAlpha(state.design.primaryColor, 0.25)} 1px, transparent 1px)`,
                backgroundSize: '22px 22px',
              }}
            />
            {manualBackActive ? (
              <div className="absolute inset-0">
                {renderManualLayer('back', 'export', exportSize.width - padding * 2, exportSize.height - padding * 2)}
              </div>
            ) : (
              <div className="relative h-full grid place-items-center text-center">
                <div>
                  <div className="text-base font-semibold" style={{ color: withAlpha(computedText, 0.80) }}>
                    {state.data.companyName || 'Company'}
                  </div>
                  {state.design.showQr && qrDataUrl ? (
                    <div
                      className="mt-4 inline-flex items-center justify-center rounded-2xl bg-white p-3"
                      style={{ border: '1px solid var(--border)' }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={qrDataUrl} alt="QR code" className="h-40 w-40" />
                    </div>
                  ) : null}
                  <div className="mt-4 text-sm" style={{ color: withAlpha(computedText, 0.72) }}>
                    {state.data.website}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


