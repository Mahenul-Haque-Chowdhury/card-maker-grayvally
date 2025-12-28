import type { BackgroundStyle, BackgroundVariant, BackgroundPreset, DesignSettings } from '@/types';
import { withAlpha } from '@/lib/color';

export const BACKGROUND_VARIANTS: BackgroundVariant[] = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6'];

// 250 Unique Background Presets (50 curated + 200 generated)
export interface PresetDefinition {
  id: BackgroundPreset;
  name: string;
  category: 'gradient' | 'mesh' | 'pattern' | 'artistic';
  background: string;
  textColor: 'light' | 'dark';
}

const BASE_BACKGROUND_PRESETS: PresetDefinition[] = [
  // === Gradients (20) ===
  { id: 'sunset-vibes', name: 'Sunset Vibes', category: 'gradient', textColor: 'light',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' },
  { id: 'ocean-breeze', name: 'Ocean Breeze', category: 'gradient', textColor: 'light',
    background: 'linear-gradient(135deg, #0077b6 0%, #00b4d8 50%, #90e0ef 100%)' },
  { id: 'northern-lights', name: 'Northern Lights', category: 'gradient', textColor: 'light',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #e94560 100%)' },
  { id: 'cotton-candy', name: 'Cotton Candy', category: 'gradient', textColor: 'dark',
    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 30%, #ff9a9e 60%, #fecfef 100%)' },
  { id: 'midnight-city', name: 'Midnight City', category: 'gradient', textColor: 'light',
    background: 'linear-gradient(135deg, #232526 0%, #414345 50%, #232526 100%)' },
  { id: 'golden-hour', name: 'Golden Hour', category: 'gradient', textColor: 'dark',
    background: 'linear-gradient(135deg, #f6d365 0%, #fda085 50%, #f6d365 100%)' },
  { id: 'lavender-dream', name: 'Lavender Dream', category: 'gradient', textColor: 'dark',
    background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 50%, #e0c3fc 100%)' },
  { id: 'tropical-punch', name: 'Tropical Punch', category: 'gradient', textColor: 'light',
    background: 'linear-gradient(135deg, #f83600 0%, #f9d423 50%, #ff6b35 100%)' },
  { id: 'arctic-frost', name: 'Arctic Frost', category: 'gradient', textColor: 'dark',
    background: 'linear-gradient(135deg, #e6e9f0 0%, #eef1f5 50%, #cfd9df 100%)' },
  { id: 'desert-dusk', name: 'Desert Dusk', category: 'gradient', textColor: 'light',
    background: 'linear-gradient(135deg, #c94b4b 0%, #4b134f 100%)' },
  { id: 'neon-nights', name: 'Neon Nights', category: 'gradient', textColor: 'light',
    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' },
  { id: 'spring-meadow', name: 'Spring Meadow', category: 'gradient', textColor: 'dark',
    background: 'linear-gradient(135deg, #a8e063 0%, #56ab2f 50%, #86e3ce 100%)' },
  { id: 'cosmic-dust', name: 'Cosmic Dust', category: 'gradient', textColor: 'light',
    background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 30%, #4a1942 60%, #0c0c0c 100%)' },
  { id: 'coral-reef', name: 'Coral Reef', category: 'gradient', textColor: 'dark',
    background: 'linear-gradient(135deg, #ff9966 0%, #ff5e62 50%, #ff9966 100%)' },
  { id: 'emerald-forest', name: 'Emerald Forest', category: 'gradient', textColor: 'light',
    background: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)' },
  { id: 'rose-gold', name: 'Rose Gold', category: 'gradient', textColor: 'dark',
    background: 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 50%, #d4a574 100%)' },
  { id: 'electric-blue', name: 'Electric Blue', category: 'gradient', textColor: 'light',
    background: 'linear-gradient(135deg, #0052d4 0%, #4364f7 50%, #6fb1fc 100%)' },
  { id: 'warm-sunset', name: 'Warm Sunset', category: 'gradient', textColor: 'dark',
    background: 'linear-gradient(135deg, #ffe259 0%, #ffa751 50%, #ff6e7f 100%)' },
  { id: 'cool-mint', name: 'Cool Mint', category: 'gradient', textColor: 'dark',
    background: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 50%, #11998e 100%)' },
  { id: 'peachy-keen', name: 'Peachy Keen', category: 'gradient', textColor: 'dark',
    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
  
  // === Mesh Gradients (10) ===
  { id: 'mesh-aurora', name: 'Aurora Mesh', category: 'mesh', textColor: 'light',
    background: `radial-gradient(at 40% 20%, #4ade80 0px, transparent 50%),
radial-gradient(at 80% 0%, #22d3ee 0px, transparent 50%),
radial-gradient(at 0% 50%, #8b5cf6 0px, transparent 50%),
radial-gradient(at 80% 50%, #0ea5e9 0px, transparent 50%),
radial-gradient(at 0% 100%, #6366f1 0px, transparent 50%),
radial-gradient(at 80% 100%, #14b8a6 0px, transparent 50%),
radial-gradient(at 0% 0%, #a78bfa 0px, transparent 50%),
#0f172a` },
  { id: 'mesh-nebula', name: 'Nebula Mesh', category: 'mesh', textColor: 'light',
    background: `radial-gradient(at 0% 0%, #7c3aed 0px, transparent 50%),
radial-gradient(at 90% 10%, #f472b6 0px, transparent 50%),
radial-gradient(at 50% 50%, #8b5cf6 0px, transparent 50%),
radial-gradient(at 100% 100%, #ec4899 0px, transparent 50%),
radial-gradient(at 20% 80%, #a855f7 0px, transparent 50%),
#1e1b4b` },
  { id: 'mesh-sunset', name: 'Sunset Mesh', category: 'mesh', textColor: 'light',
    background: `radial-gradient(at 0% 0%, #fbbf24 0px, transparent 50%),
radial-gradient(at 50% 0%, #f97316 0px, transparent 50%),
radial-gradient(at 100% 0%, #ef4444 0px, transparent 50%),
radial-gradient(at 50% 100%, #dc2626 0px, transparent 50%),
radial-gradient(at 0% 100%, #f59e0b 0px, transparent 50%),
#7c2d12` },
  { id: 'mesh-ocean', name: 'Ocean Mesh', category: 'mesh', textColor: 'light',
    background: `radial-gradient(at 0% 0%, #06b6d4 0px, transparent 50%),
radial-gradient(at 90% 20%, #0ea5e9 0px, transparent 50%),
radial-gradient(at 50% 50%, #3b82f6 0px, transparent 50%),
radial-gradient(at 100% 100%, #0891b2 0px, transparent 50%),
radial-gradient(at 10% 90%, #2563eb 0px, transparent 50%),
#0c4a6e` },
  { id: 'mesh-forest', name: 'Forest Mesh', category: 'mesh', textColor: 'light',
    background: `radial-gradient(at 10% 10%, #22c55e 0px, transparent 50%),
radial-gradient(at 90% 30%, #16a34a 0px, transparent 50%),
radial-gradient(at 50% 60%, #15803d 0px, transparent 50%),
radial-gradient(at 80% 90%, #14532d 0px, transparent 50%),
radial-gradient(at 20% 80%, #166534 0px, transparent 50%),
#052e16` },
  { id: 'mesh-candy', name: 'Candy Mesh', category: 'mesh', textColor: 'dark',
    background: `radial-gradient(at 0% 0%, #f9a8d4 0px, transparent 50%),
radial-gradient(at 100% 0%, #c084fc 0px, transparent 50%),
radial-gradient(at 50% 50%, #fda4af 0px, transparent 50%),
radial-gradient(at 100% 100%, #f0abfc 0px, transparent 50%),
radial-gradient(at 0% 100%, #fbcfe8 0px, transparent 50%),
#fdf2f8` },
  { id: 'mesh-royal', name: 'Royal Mesh', category: 'mesh', textColor: 'light',
    background: `radial-gradient(at 20% 20%, #6366f1 0px, transparent 50%),
radial-gradient(at 80% 30%, #7c3aed 0px, transparent 50%),
radial-gradient(at 50% 70%, #4f46e5 0px, transparent 50%),
radial-gradient(at 90% 90%, #5b21b6 0px, transparent 50%),
radial-gradient(at 10% 80%, #4c1d95 0px, transparent 50%),
#1e1b4b` },
  { id: 'mesh-ember', name: 'Ember Mesh', category: 'mesh', textColor: 'light',
    background: `radial-gradient(at 10% 10%, #f97316 0px, transparent 50%),
radial-gradient(at 80% 20%, #dc2626 0px, transparent 50%),
radial-gradient(at 40% 60%, #ea580c 0px, transparent 50%),
radial-gradient(at 90% 80%, #b91c1c 0px, transparent 50%),
radial-gradient(at 20% 90%, #c2410c 0px, transparent 50%),
#450a0a` },
  { id: 'mesh-mint', name: 'Mint Mesh', category: 'mesh', textColor: 'dark',
    background: `radial-gradient(at 0% 20%, #a7f3d0 0px, transparent 50%),
radial-gradient(at 80% 10%, #6ee7b7 0px, transparent 50%),
radial-gradient(at 40% 60%, #34d399 0px, transparent 50%),
radial-gradient(at 90% 80%, #a7f3d0 0px, transparent 50%),
radial-gradient(at 20% 90%, #d1fae5 0px, transparent 50%),
#ecfdf5` },
  { id: 'mesh-twilight', name: 'Twilight Mesh', category: 'mesh', textColor: 'light',
    background: `radial-gradient(at 0% 0%, #1e3a5f 0px, transparent 50%),
radial-gradient(at 90% 10%, #4a1942 0px, transparent 50%),
radial-gradient(at 50% 50%, #2d1b4e 0px, transparent 50%),
radial-gradient(at 100% 100%, #1a1a2e 0px, transparent 50%),
radial-gradient(at 20% 80%, #16213e 0px, transparent 50%),
#0f0f1a` },
  
  // === Patterns (10) ===
  { id: 'dots-minimal', name: 'Minimal Dots', category: 'pattern', textColor: 'dark',
    background: `radial-gradient(circle, #d1d5db 1px, transparent 1px),
linear-gradient(#ffffff, #ffffff)` },
  { id: 'lines-diagonal', name: 'Diagonal Lines', category: 'pattern', textColor: 'dark',
    background: `repeating-linear-gradient(45deg, transparent, transparent 10px, #f1f5f9 10px, #f1f5f9 11px),
linear-gradient(#ffffff, #ffffff)` },
  { id: 'grid-subtle', name: 'Subtle Grid', category: 'pattern', textColor: 'dark',
    background: `linear-gradient(#e5e7eb 1px, transparent 1px),
linear-gradient(90deg, #e5e7eb 1px, transparent 1px),
linear-gradient(#f9fafb, #f9fafb)` },
  { id: 'waves-soft', name: 'Soft Waves', category: 'pattern', textColor: 'dark',
    background: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='%23e5e7eb' fill-opacity='0.5' fill-rule='evenodd'/%3E%3C/svg%3E"),
linear-gradient(#ffffff, #ffffff)` },
  { id: 'circles-overlap', name: 'Overlapping Circles', category: 'pattern', textColor: 'dark',
    background: `radial-gradient(circle at 100% 50%, transparent 20%, rgba(99, 102, 241, 0.08) 21%, rgba(99, 102, 241, 0.08) 34%, transparent 35%),
radial-gradient(circle at 0% 50%, transparent 20%, rgba(139, 92, 246, 0.08) 21%, rgba(139, 92, 246, 0.08) 34%, transparent 35%),
linear-gradient(#ffffff, #ffffff)` },
  { id: 'triangles-geo', name: 'Geometric Triangles', category: 'pattern', textColor: 'dark',
    background: `linear-gradient(135deg, #f8fafc 25%, transparent 25%),
linear-gradient(225deg, #f8fafc 25%, transparent 25%),
linear-gradient(45deg, #f8fafc 25%, transparent 25%),
linear-gradient(315deg, #f8fafc 25%, #f1f5f9 25%)` },
  { id: 'hexagon-tech', name: 'Tech Hexagon', category: 'pattern', textColor: 'dark',
    background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.6'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"),
linear-gradient(#ffffff, #ffffff)` },
  { id: 'diamond-luxury', name: 'Luxury Diamond', category: 'pattern', textColor: 'dark',
    background: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 8 L8 0 L16 8 L8 16 Z' fill='none' stroke='%23d4af37' stroke-opacity='0.15' stroke-width='0.5'/%3E%3C/svg%3E"),
linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)` },
  { id: 'stripes-bold', name: 'Bold Stripes', category: 'pattern', textColor: 'dark',
    background: `repeating-linear-gradient(90deg, #f8fafc, #f8fafc 20px, #f1f5f9 20px, #f1f5f9 40px)` },
  { id: 'confetti-fun', name: 'Fun Confetti', category: 'pattern', textColor: 'dark',
    background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='2' fill='%2322c55e' fill-opacity='0.4'/%3E%3Ccircle cx='40' cy='15' r='2' fill='%23f59e0b' fill-opacity='0.4'/%3E%3Ccircle cx='25' cy='40' r='2' fill='%23ec4899' fill-opacity='0.4'/%3E%3Ccircle cx='50' cy='45' r='2' fill='%236366f1' fill-opacity='0.4'/%3E%3Crect x='5' y='35' width='4' height='4' transform='rotate(45 7 37)' fill='%23f97316' fill-opacity='0.3'/%3E%3Crect x='45' y='5' width='4' height='4' transform='rotate(30 47 7)' fill='%238b5cf6' fill-opacity='0.3'/%3E%3C/svg%3E"),
linear-gradient(#ffffff, #ffffff)` },
  
  // === Artistic (10) ===
  { id: 'watercolor-wash', name: 'Watercolor Wash', category: 'artistic', textColor: 'dark',
    background: `radial-gradient(ellipse at 20% 30%, rgba(99, 102, 241, 0.12) 0%, transparent 50%),
radial-gradient(ellipse at 80% 20%, rgba(236, 72, 153, 0.10) 0%, transparent 45%),
radial-gradient(ellipse at 60% 70%, rgba(14, 165, 233, 0.08) 0%, transparent 50%),
linear-gradient(#ffffff, #fefefe)` },
  { id: 'marble-classic', name: 'Classic Marble', category: 'artistic', textColor: 'dark',
    background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.07'/%3E%3C/svg%3E"),
linear-gradient(135deg, #f8f8f8, #e8e8e8)` },
  { id: 'paper-texture', name: 'Paper Texture', category: 'artistic', textColor: 'dark',
    background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='6'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)' opacity='0.05'/%3E%3C/svg%3E"),
linear-gradient(#fffef9, #faf8f0)` },
  { id: 'linen-fabric', name: 'Linen Fabric', category: 'artistic', textColor: 'dark',
    background: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 3h1v1H1V3zm2-2h1v1H3V1z' fill='%23000000' fill-opacity='0.03'/%3E%3C/svg%3E"),
linear-gradient(#faf5ef, #f5ebe0)` },
  { id: 'brushstroke-art', name: 'Brushstroke', category: 'artistic', textColor: 'dark',
    background: `radial-gradient(ellipse at 10% 90%, rgba(99, 102, 241, 0.15) 0%, transparent 40%),
radial-gradient(ellipse at 90% 10%, rgba(236, 72, 153, 0.12) 0%, transparent 35%),
linear-gradient(#fefefe, #fefefe)` },
  { id: 'ink-splash', name: 'Ink Splash', category: 'artistic', textColor: 'dark',
    background: `radial-gradient(circle at 85% 15%, rgba(15, 23, 42, 0.08) 0%, transparent 30%),
radial-gradient(circle at 15% 85%, rgba(15, 23, 42, 0.06) 0%, transparent 25%),
radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.02) 0%, transparent 50%),
linear-gradient(#ffffff, #f8fafc)` },
  { id: 'terrazzo-modern', name: 'Modern Terrazzo', category: 'artistic', textColor: 'dark',
    background: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cellipse cx='20' cy='25' rx='6' ry='4' fill='%23fda4af' fill-opacity='0.4' transform='rotate(30 20 25)'/%3E%3Cellipse cx='60' cy='15' rx='5' ry='3' fill='%2393c5fd' fill-opacity='0.4' transform='rotate(-20 60 15)'/%3E%3Cellipse cx='45' cy='55' rx='7' ry='4' fill='%23fcd34d' fill-opacity='0.4' transform='rotate(10 45 55)'/%3E%3Cellipse cx='15' cy='65' rx='4' ry='3' fill='%23a5b4fc' fill-opacity='0.4' transform='rotate(-15 15 65)'/%3E%3Cellipse cx='70' cy='50' rx='5' ry='3' fill='%2386efac' fill-opacity='0.4' transform='rotate(25 70 50)'/%3E%3C/svg%3E"),
linear-gradient(#faf5f5, #f5f0f0)` },
  { id: 'grain-film', name: 'Film Grain', category: 'artistic', textColor: 'dark',
    background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise2)' opacity='0.06'/%3E%3C/svg%3E"),
linear-gradient(#f5f5f4, #e7e5e4)` },
  { id: 'canvas-rough', name: 'Rough Canvas', category: 'artistic', textColor: 'dark',
    background: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' fill='%23000' fill-opacity='0.02'/%3E%3Crect x='3' y='3' width='1' height='1' fill='%23000' fill-opacity='0.02'/%3E%3C/svg%3E"),
linear-gradient(#fdfaf6, #f5f0e8)` },
  { id: 'silk-smooth', name: 'Smooth Silk', category: 'artistic', textColor: 'dark',
    background: `linear-gradient(135deg, rgba(255,255,255,0.95), rgba(250,250,250,0.90)),
radial-gradient(ellipse at 30% 20%, rgba(248, 113, 113, 0.05) 0%, transparent 50%),
radial-gradient(ellipse at 70% 80%, rgba(129, 140, 248, 0.05) 0%, transparent 50%),
linear-gradient(#fefefe, #fbfbfb)` },
];

function svgDataUri(svg: string): string {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function makeMeshBackground(
  colors: string[],
  layout: Array<{ x: number; y: number; r: number }>,
  base: string,
): string {
  const stops = layout
    .map((p, idx) => {
      const c = colors[idx % colors.length];
      return `radial-gradient(at ${p.x}% ${p.y}%, ${c} 0px, transparent ${p.r}%)`;
    })
    .join(',\n');
  return `${stops},\n${base}`;
}

const EXTRA_BACKGROUND_PRESETS: PresetDefinition[] = (() => {
  const out: PresetDefinition[] = [];

  // 80 gradients (20 palettes × 4 angles)
  const gradientPalettes: Array<{ key: string; name: string; colors: [string, string, string]; text: 'light' | 'dark' }> = [
    { key: 'berry', name: 'Berry Bloom', colors: ['#4f46e5', '#a855f7', '#ec4899'], text: 'light' },
    { key: 'aqua', name: 'Aqua Mist', colors: ['#06b6d4', '#0ea5e9', '#3b82f6'], text: 'light' },
    { key: 'citrus', name: 'Citrus Pop', colors: ['#f59e0b', '#f97316', '#ef4444'], text: 'dark' },
    { key: 'mint', name: 'Mint Cream', colors: ['#bbf7d0', '#6ee7b7', '#22c55e'], text: 'dark' },
    { key: 'violet', name: 'Violet Haze', colors: ['#312e81', '#7c3aed', '#c026d3'], text: 'light' },
    { key: 'rose', name: 'Rose Quartz', colors: ['#fff1f2', '#fda4af', '#fb7185'], text: 'dark' },
    { key: 'slate', name: 'Slate Steel', colors: ['#0f172a', '#334155', '#0b1220'], text: 'light' },
    { key: 'sand', name: 'Warm Sand', colors: ['#fff7ed', '#fed7aa', '#fb923c'], text: 'dark' },
    { key: 'aurora', name: 'Aurora Drift', colors: ['#22c55e', '#22d3ee', '#8b5cf6'], text: 'light' },
    { key: 'sunrise', name: 'Soft Sunrise', colors: ['#ffe4e6', '#fecdd3', '#fdba74'], text: 'dark' },
    { key: 'ocean', name: 'Deep Ocean', colors: ['#0b1020', '#0ea5e9', '#22d3ee'], text: 'light' },
    { key: 'ember', name: 'Ember Glow', colors: ['#450a0a', '#ea580c', '#f59e0b'], text: 'light' },
    { key: 'forest', name: 'Forest Shade', colors: ['#052e16', '#16a34a', '#86efac'], text: 'light' },
    { key: 'lilac', name: 'Lilac Sky', colors: ['#f5f3ff', '#c4b5fd', '#60a5fa'], text: 'dark' },
    { key: 'pearl', name: 'Pearl Glow', colors: ['#ffffff', '#f1f5f9', '#e2e8f0'], text: 'dark' },
    { key: 'night', name: 'Night Pulse', colors: ['#020617', '#1e1b4b', '#7c3aed'], text: 'light' },
    { key: 'coral', name: 'Coral Mist', colors: ['#fff7ed', '#fb7185', '#f97316'], text: 'dark' },
    { key: 'glacier', name: 'Glacier Air', colors: ['#e0f2fe', '#93c5fd', '#38bdf8'], text: 'dark' },
    { key: 'plum', name: 'Plum Velvet', colors: ['#2e1065', '#a855f7', '#fb7185'], text: 'light' },
    { key: 'lime', name: 'Lime Splash', colors: ['#ecfccb', '#a3e635', '#22c55e'], text: 'dark' },
  ];
  const angles = [135, 45, 315, 225] as const;
  for (const pal of gradientPalettes) {
    angles.forEach((angle, idx) => {
      out.push({
        id: `gen-grad-${pal.key}-${idx + 1}`,
        name: `${pal.name} ${idx + 1}`,
        category: 'gradient',
        textColor: pal.text,
        background: `linear-gradient(${angle}deg, ${pal.colors[0]} 0%, ${pal.colors[1]} 55%, ${pal.colors[2]} 100%)`,
      });
    });
  }

  // 50 mesh (10 palettes × 5 layouts)
  const meshLayouts: Array<Array<{ x: number; y: number; r: number }>> = [
    [
      { x: 15, y: 20, r: 55 },
      { x: 85, y: 15, r: 55 },
      { x: 55, y: 80, r: 60 },
      { x: 15, y: 90, r: 55 },
      { x: 90, y: 85, r: 55 },
    ],
    [
      { x: 10, y: 10, r: 50 },
      { x: 92, y: 25, r: 55 },
      { x: 55, y: 55, r: 65 },
      { x: 20, y: 85, r: 55 },
      { x: 85, y: 92, r: 50 },
    ],
    [
      { x: 20, y: 30, r: 60 },
      { x: 80, y: 20, r: 55 },
      { x: 50, y: 60, r: 65 },
      { x: 10, y: 70, r: 55 },
      { x: 90, y: 75, r: 55 },
    ],
    [
      { x: 30, y: 10, r: 55 },
      { x: 70, y: 15, r: 55 },
      { x: 90, y: 55, r: 60 },
      { x: 15, y: 65, r: 60 },
      { x: 40, y: 95, r: 55 },
    ],
    [
      { x: 5, y: 45, r: 58 },
      { x: 95, y: 40, r: 58 },
      { x: 50, y: 5, r: 55 },
      { x: 55, y: 95, r: 60 },
      { x: 30, y: 65, r: 65 },
    ],
  ];

  const meshPalettes: Array<{ key: string; name: string; colors: string[]; base: string; text: 'light' | 'dark' }> = [
    { key: 'nebula', name: 'Nebula', colors: ['#7c3aed', '#ec4899', '#8b5cf6', '#f472b6'], base: '#1e1b4b', text: 'light' },
    { key: 'aurora', name: 'Aurora', colors: ['#22c55e', '#22d3ee', '#8b5cf6', '#0ea5e9'], base: '#0b1020', text: 'light' },
    { key: 'tropic', name: 'Tropic', colors: ['#06b6d4', '#22c55e', '#f59e0b', '#fb7185'], base: '#06283d', text: 'light' },
    { key: 'royal', name: 'Royal', colors: ['#6366f1', '#7c3aed', '#4f46e5', '#a855f7'], base: '#1e1b4b', text: 'light' },
    { key: 'ember', name: 'Ember', colors: ['#f97316', '#ef4444', '#f59e0b', '#dc2626'], base: '#450a0a', text: 'light' },
    { key: 'ocean', name: 'Ocean', colors: ['#06b6d4', '#0ea5e9', '#3b82f6', '#38bdf8'], base: '#0c4a6e', text: 'light' },
    { key: 'forest', name: 'Forest', colors: ['#16a34a', '#22c55e', '#86efac', '#14532d'], base: '#052e16', text: 'light' },
    { key: 'blush', name: 'Blush', colors: ['#fbcfe8', '#fda4af', '#c4b5fd', '#93c5fd'], base: '#fff7ed', text: 'dark' },
    { key: 'stone', name: 'Stone', colors: ['#e2e8f0', '#cbd5e1', '#94a3b8', '#f1f5f9'], base: '#ffffff', text: 'dark' },
    { key: 'midnight', name: 'Midnight', colors: ['#0ea5e9', '#7c3aed', '#111827', '#1f2937'], base: '#020617', text: 'light' },
  ];

  meshPalettes.forEach((pal) => {
    meshLayouts.forEach((layout, idx) => {
      out.push({
        id: `gen-mesh-${pal.key}-${idx + 1}`,
        name: `${pal.name} Mesh ${idx + 1}`,
        category: 'mesh',
        textColor: pal.text,
        background: makeMeshBackground(pal.colors, layout, pal.base),
      });
    });
  });

  // 40 patterns (10 templates × 4 colorways)
  const patternColorways: Array<{ key: string; ink: string; paper: string; text: 'light' | 'dark' }> = [
    { key: 'slate', ink: '#0f172a', paper: '#ffffff', text: 'dark' },
    { key: 'indigo', ink: '#4f46e5', paper: '#ffffff', text: 'dark' },
    { key: 'emerald', ink: '#059669', paper: '#ffffff', text: 'dark' },
    { key: 'rose', ink: '#e11d48', paper: '#ffffff', text: 'dark' },
  ];

  const patternTemplates: Array<{ key: string; name: string; build: (ink: string, paper: string) => string }> = [
    {
      key: 'micro-dots',
      name: 'Micro Dots',
      build: (ink, paper) =>
        `${svgDataUri(`<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'><circle cx='4' cy='4' r='1' fill='${ink}' fill-opacity='0.08'/><circle cx='16' cy='10' r='1' fill='${ink}' fill-opacity='0.07'/><circle cx='10' cy='18' r='1' fill='${ink}' fill-opacity='0.06'/></svg>`)}, linear-gradient(${paper}, ${paper})`,
    },
    {
      key: 'fine-grid',
      name: 'Fine Grid',
      build: (ink, paper) =>
        `linear-gradient(${ink} 1px, transparent 1px), linear-gradient(90deg, ${ink} 1px, transparent 1px), linear-gradient(${paper}, ${paper})`,
    },
    {
      key: 'diagonal-hatch',
      name: 'Diagonal Hatch',
      build: (ink, paper) =>
        `repeating-linear-gradient(45deg, transparent 0 10px, ${ink} 10px 11px), linear-gradient(${paper}, ${paper})`,
    },
    {
      key: 'checker-soft',
      name: 'Soft Checker',
      build: (ink, paper) =>
        `linear-gradient(45deg, ${ink} 25%, transparent 25%), linear-gradient(225deg, ${ink} 25%, transparent 25%), linear-gradient(135deg, ${ink} 25%, transparent 25%), linear-gradient(315deg, ${ink} 25%, ${paper} 25%)`,
    },
    {
      key: 'rings',
      name: 'Concentric Rings',
      build: (ink, paper) =>
        `${svgDataUri(`<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><circle cx='40' cy='40' r='10' fill='none' stroke='${ink}' stroke-opacity='0.10'/><circle cx='40' cy='40' r='22' fill='none' stroke='${ink}' stroke-opacity='0.08'/><circle cx='40' cy='40' r='34' fill='none' stroke='${ink}' stroke-opacity='0.06'/></svg>`)}, linear-gradient(${paper}, ${paper})`,
    },
    {
      key: 'tiny-triangles',
      name: 'Tiny Triangles',
      build: (ink, paper) =>
        `${svgDataUri(`<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'><path d='M12 6l8 14H4L12 6z' fill='${ink}' fill-opacity='0.06'/><path d='M36 28l8 14H28l8-14z' fill='${ink}' fill-opacity='0.05'/><path d='M22 30l6 10H16l6-10z' fill='${ink}' fill-opacity='0.04'/></svg>`)}, linear-gradient(${paper}, ${paper})`,
    },
    {
      key: 'soft-waves',
      name: 'Soft Waves',
      build: (ink, paper) =>
        `${svgDataUri(`<svg xmlns='http://www.w3.org/2000/svg' width='120' height='30' viewBox='0 0 120 30'><path d='M0 16c10 0 10-8 20-8s10 8 20 8 10-8 20-8 10 8 20 8 10-8 20-8 10 8 20 8' fill='none' stroke='${ink}' stroke-opacity='0.10' stroke-width='2'/></svg>`)}, linear-gradient(${paper}, ${paper})`,
    },
    {
      key: 'pixel-noise',
      name: 'Pixel Noise',
      build: (ink, paper) =>
        `${svgDataUri(`<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'>${Array.from({ length: 18 })
          .map((_, i) => `<rect x='${(i * 7) % 40}' y='${(i * 11) % 40}' width='2' height='2' fill='${ink}' fill-opacity='0.06'/>`)
          .join('')}</svg>`)}, linear-gradient(${paper}, ${paper})`,
    },
    {
      key: 'hex-outline',
      name: 'Hex Outline',
      build: (ink, paper) =>
        `${svgDataUri(`<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'><path d='M28 2l20 12v28L28 54 8 42V14L28 2z' fill='none' stroke='${ink}' stroke-opacity='0.08'/><path d='M28 14l10 6v12l-10 6-10-6V20l10-6z' fill='none' stroke='${ink}' stroke-opacity='0.06'/></svg>`)}, linear-gradient(${paper}, ${paper})`,
    },
    {
      key: 'dot-grid',
      name: 'Dot Grid',
      build: (ink, paper) =>
        `radial-gradient(${ink} 1px, transparent 1px), linear-gradient(${paper}, ${paper})`,
    },
  ];

  for (const tpl of patternTemplates) {
    for (const cw of patternColorways) {
      out.push({
        id: `gen-pat-${tpl.key}-${cw.key}`,
        name: `${tpl.name} • ${cw.key}`,
        category: 'pattern',
        textColor: cw.text,
        background: tpl.build(cw.ink, cw.paper),
      });
    }
  }

  // 30 artistic (10 templates × 3 colorways)
  const artColorways: Array<{ key: string; a: string; b: string; c: string; base: string; text: 'light' | 'dark' }> = [
    { key: 'soft', a: 'rgba(99,102,241,0.12)', b: 'rgba(236,72,153,0.10)', c: 'rgba(14,165,233,0.08)', base: '#ffffff', text: 'dark' },
    { key: 'moody', a: 'rgba(56,189,248,0.16)', b: 'rgba(168,85,247,0.14)', c: 'rgba(2,6,23,0.18)', base: '#0b1020', text: 'light' },
    { key: 'earth', a: 'rgba(234,88,12,0.12)', b: 'rgba(245,158,11,0.10)', c: 'rgba(34,197,94,0.10)', base: '#fff7ed', text: 'dark' },
  ];

  const artTemplates: Array<{ key: string; name: string; build: (cw: (typeof artColorways)[number]) => string }> = [
    {
      key: 'wash',
      name: 'Water Wash',
      build: (cw) =>
        `radial-gradient(ellipse at 20% 30%, ${cw.a} 0%, transparent 55%), radial-gradient(ellipse at 80% 15%, ${cw.b} 0%, transparent 50%), radial-gradient(ellipse at 55% 80%, ${cw.c} 0%, transparent 55%), linear-gradient(${cw.base}, ${cw.base})`,
    },
    {
      key: 'paper',
      name: 'Paper Grain',
      build: (cw) =>
        `${svgDataUri(`<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='4'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/></svg>`)}, linear-gradient(${cw.base}, ${cw.base})`,
    },
    {
      key: 'ink',
      name: 'Ink Bloom',
      build: (cw) =>
        `radial-gradient(circle at 85% 18%, ${cw.c} 0%, transparent 35%), radial-gradient(circle at 18% 85%, ${cw.b} 0%, transparent 30%), radial-gradient(circle at 50% 50%, ${cw.a} 0%, transparent 60%), linear-gradient(${cw.base}, ${cw.base})`,
    },
    {
      key: 'linen',
      name: 'Linen',
      build: (cw) =>
        `${svgDataUri(`<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><path d='M0 2h10M0 6h10' stroke='rgba(15,23,42,0.05)'/><path d='M2 0v10M6 0v10' stroke='rgba(15,23,42,0.04)'/></svg>`)}, linear-gradient(${cw.base}, ${cw.base})`,
    },
    {
      key: 'terrazzo',
      name: 'Terrazzo',
      build: (cw) =>
        `${svgDataUri(`<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'>
<ellipse cx='20' cy='25' rx='7' ry='4' fill='rgba(99,102,241,0.22)'/>
<ellipse cx='60' cy='15' rx='6' ry='3' fill='rgba(236,72,153,0.18)'/>
<ellipse cx='45' cy='70' rx='8' ry='4' fill='rgba(14,165,233,0.18)'/>
<ellipse cx='18' cy='88' rx='5' ry='3' fill='rgba(245,158,11,0.16)'/>
<ellipse cx='90' cy='55' rx='6' ry='3' fill='rgba(34,197,94,0.16)'/>
</svg>`)}, linear-gradient(${cw.base}, ${cw.base})`,
    },
    {
      key: 'film',
      name: 'Film Grain',
      build: (cw) =>
        `${svgDataUri(`<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='g'><feTurbulence baseFrequency='0.6' numOctaves='3'/></filter><rect width='100%25' height='100%25' filter='url(%23g)' opacity='0.06'/></svg>`)}, radial-gradient(circle at 30% 20%, ${cw.a}, transparent 55%), linear-gradient(${cw.base}, ${cw.base})`,
    },
    {
      key: 'canvas',
      name: 'Canvas',
      build: (cw) =>
        `${svgDataUri(`<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'><path d='M0 0h16v16H0z' fill='rgba(0,0,0,0.0)'/><path d='M0 4h16M0 8h16M0 12h16' stroke='rgba(15,23,42,0.03)'/><path d='M4 0v16M8 0v16M12 0v16' stroke='rgba(15,23,42,0.02)'/></svg>`)}, linear-gradient(${cw.base}, ${cw.base})`,
    },
    {
      key: 'silk',
      name: 'Silk Glow',
      build: (cw) =>
        `linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,255,255,0.86)), radial-gradient(ellipse at 30% 25%, ${cw.b} 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, ${cw.a} 0%, transparent 55%), linear-gradient(${cw.base}, ${cw.base})`,
    },
    {
      key: 'marble',
      name: 'Marble',
      build: (cw) =>
        `${svgDataUri(`<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='m'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/><feDisplacementMap in='SourceGraphic' scale='20'/></filter><rect width='100%25' height='100%25' filter='url(%23m)' opacity='0.05'/></svg>`)}, linear-gradient(${cw.base}, ${cw.base})`,
    },
    {
      key: 'brush',
      name: 'Brush Stroke',
      build: (cw) =>
        `radial-gradient(ellipse at 10% 90%, ${cw.a} 0%, transparent 45%), radial-gradient(ellipse at 90% 10%, ${cw.b} 0%, transparent 40%), radial-gradient(ellipse at 50% 40%, ${cw.c} 0%, transparent 55%), linear-gradient(${cw.base}, ${cw.base})`,
    },
  ];

  for (const tpl of artTemplates) {
    for (const cw of artColorways) {
      out.push({
        id: `gen-art-${tpl.key}-${cw.key}`,
        name: `${tpl.name} • ${cw.key}`,
        category: 'artistic',
        textColor: cw.text,
        background: tpl.build(cw),
      });
    }
  }

  // Ensure we add exactly 200 extras.
  return out.slice(0, 200);
})();

export const BACKGROUND_PRESETS: PresetDefinition[] = [...BASE_BACKGROUND_PRESETS, ...EXTRA_BACKGROUND_PRESETS];

export function computeBaseBackground(
  design: Pick<
    DesignSettings,
    | 'primaryColor'
    | 'secondaryColor'
    | 'accentColor'
    | 'backgroundStyle'
    | 'backgroundIntensity'
    | 'backgroundVariant'
  >,
  templateId?: string,
): string {
  const intensity = Math.min(1, Math.max(0, design.backgroundIntensity / 100));
  const a = 0.08 + intensity * 0.28;
  const b = 0.06 + intensity * 0.22;
  const c = 0.04 + intensity * 0.18;

  const v = design.backgroundVariant;

  switch (design.backgroundStyle) {
    case 'gradient': {
      if (v === 'v2') {
        return `linear-gradient(45deg, ${withAlpha(design.primaryColor, 0.92)}, ${withAlpha(design.secondaryColor, 0.88)})`;
      }
      if (v === 'v3') {
        return `conic-gradient(from 215deg at 50% 50%, ${withAlpha(design.primaryColor, 0.92)}, ${withAlpha(
          design.accentColor,
          0.88,
        )}, ${withAlpha(design.secondaryColor, 0.90)}, ${withAlpha(design.primaryColor, 0.92)})`;
      }
      if (v === 'v4') {
        return `radial-gradient(700px circle at 20% 20%, ${withAlpha(design.primaryColor, 0.92)}, transparent 60%),
radial-gradient(600px circle at 80% 30%, ${withAlpha(design.accentColor, 0.86)}, transparent 58%),
radial-gradient(700px circle at 60% 120%, ${withAlpha(design.secondaryColor, 0.88)}, transparent 62%),
linear-gradient(135deg, rgba(255,255,255,1), rgba(255,255,255,1))`;
      }
      return `linear-gradient(135deg, ${withAlpha(design.primaryColor, 0.90)}, ${withAlpha(
        design.secondaryColor,
        0.85,
      )} 55%, ${withAlpha(design.accentColor, 0.85)})`;
    }

    case 'abstract': {
      if (v === 'v2') {
        return `radial-gradient(700px circle at 18% 30%, ${withAlpha(design.primaryColor, a)}, transparent 55%),
radial-gradient(520px circle at 90% 16%, ${withAlpha(design.accentColor, b)}, transparent 52%),
linear-gradient(135deg, rgba(255,255,255,1), rgba(255,255,255,1))`;
      }
      if (v === 'v3') {
        return `radial-gradient(680px circle at 85% 35%, ${withAlpha(design.secondaryColor, a)}, transparent 60%),
radial-gradient(420px circle at 15% 80%, ${withAlpha(design.accentColor, b)}, transparent 55%),
linear-gradient(135deg, rgba(255,255,255,1), rgba(255,255,255,1))`;
      }
      if (v === 'v4') {
        return `radial-gradient(520px circle at 15% 18%, ${withAlpha(design.accentColor, a)}, transparent 55%),
radial-gradient(460px circle at 50% 50%, ${withAlpha(design.primaryColor, b)}, transparent 58%),
radial-gradient(520px circle at 90% 95%, ${withAlpha(design.secondaryColor, c)}, transparent 60%),
linear-gradient(135deg, rgba(255,255,255,1), rgba(255,255,255,1))`;
      }
      if (v === 'v5') {
        return `linear-gradient(135deg, rgba(255,255,255,1), rgba(255,255,255,1)),
radial-gradient(560px circle at 30% 110%, ${withAlpha(design.primaryColor, a)}, transparent 60%),
radial-gradient(520px circle at 100% 40%, ${withAlpha(design.accentColor, b)}, transparent 58%)`;
      }
      return `radial-gradient(520px circle at 20% 20%, ${withAlpha(design.accentColor, a)}, transparent 52%),
radial-gradient(480px circle at 90% 30%, ${withAlpha(design.primaryColor, b)}, transparent 55%),
radial-gradient(520px circle at 60% 110%, ${withAlpha(design.secondaryColor, c)}, transparent 58%),
linear-gradient(135deg, rgba(255,255,255,1), rgba(255,255,255,1))`;
    }

    case 'geometric': {
      if (v === 'v2') {
        return `linear-gradient(135deg, rgba(255,255,255,1), rgba(255,255,255,1)),
linear-gradient(90deg, ${withAlpha(design.primaryColor, 0.08)} 1px, transparent 1px),
linear-gradient(${withAlpha(design.secondaryColor, 0.06)} 1px, transparent 1px)`;
      }
      if (v === 'v3') {
        return `linear-gradient(135deg, rgba(255,255,255,1), rgba(255,255,255,1)),
repeating-linear-gradient(135deg, ${withAlpha(design.accentColor, 0.08)} 0 10px, transparent 10px 20px)`;
      }
      if (v === 'v4') {
        return `linear-gradient(135deg, rgba(255,255,255,1), rgba(255,255,255,1)),
radial-gradient(${withAlpha(design.primaryColor, 0.10)} 1px, transparent 1px),
radial-gradient(${withAlpha(design.secondaryColor, 0.08)} 1px, transparent 1px)`;
      }
      if (v === 'v5') {
        return `linear-gradient(135deg, rgba(255,255,255,1), rgba(255,255,255,1)),
linear-gradient(45deg, ${withAlpha(design.primaryColor, 0.10)}, transparent 60%),
linear-gradient(225deg, ${withAlpha(design.accentColor, 0.10)}, transparent 60%)`;
      }
      return `linear-gradient(135deg, rgba(255,255,255,1), rgba(255,255,255,1))`;
    }

    case 'noise': {
      if (v === 'v2') {
        return `linear-gradient(135deg, rgba(2,6,23,0.98), rgba(30,41,59,0.92))`;
      }
      if (v === 'v3') {
        return `linear-gradient(135deg, rgba(9,9,11,0.98), rgba(30,41,59,0.90))`;
      }
      if (v === 'v4') {
        return `linear-gradient(135deg, rgba(2,6,23,0.96), rgba(15,23,42,0.92), rgba(2,6,23,0.96))`;
      }
      return `linear-gradient(135deg, rgba(2,6,23,0.95), rgba(15,23,42,0.92))`;
    }

    case 'glass': {
      if (v === 'v2') {
        return `linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.05))`;
      }
      if (v === 'v3') {
        return `linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04)),
radial-gradient(520px circle at 20% 30%, rgba(255,255,255,0.10), transparent 60%)`;
      }
      if (v === 'v4') {
        return `linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06)),
radial-gradient(540px circle at 85% 25%, rgba(255,255,255,0.12), transparent 60%)`;
      }
      return `linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))`;
    }

    case 'solid':
    default: {
      if (templateId === 'dark') return 'linear-gradient(135deg, rgba(2,6,23,0.98), rgba(15,23,42,0.95))';
      if (v === 'v2') {
        return `linear-gradient(135deg, rgba(255,255,255,1), rgba(255,255,255,1)),
radial-gradient(520px circle at 10% 20%, ${withAlpha(design.primaryColor, 0.10)}, transparent 60%)`;
      }
      if (v === 'v3') {
        return `linear-gradient(135deg, rgba(255,255,255,1), rgba(255,255,255,1)),
radial-gradient(560px circle at 90% 10%, ${withAlpha(design.accentColor, 0.08)}, transparent 60%)`;
      }
      if (v === 'v4') {
        return `linear-gradient(135deg, rgba(255,255,255,1), rgba(255,255,255,1)),
linear-gradient(90deg, ${withAlpha(design.secondaryColor, 0.05)} 1px, transparent 1px),
linear-gradient(${withAlpha(design.primaryColor, 0.04)} 1px, transparent 1px)`;
      }
      if (v === 'v5') {
        return `linear-gradient(135deg, rgba(255,255,255,1), rgba(255,255,255,1)),
repeating-linear-gradient(135deg, ${withAlpha(design.accentColor, 0.04)} 0 8px, transparent 8px 16px)`;
      }
      return '#ffffff';
    }
  }
}

export function variantLabel(style: BackgroundStyle, variant: BackgroundVariant): string {
  const idx = BACKGROUND_VARIANTS.indexOf(variant);
  const n = idx >= 0 ? idx + 1 : 1;
  switch (style) {
    case 'gradient':
      return ['Blend', 'Duo', 'Conic', 'Mesh', 'Blend', 'Blend'][idx] ?? `V${n}`;
    case 'abstract':
      return ['Orbit', 'Bloom', 'Corner', 'Trio', 'Wave', 'Orbit'][idx] ?? `V${n}`;
    case 'geometric':
      return ['Grid', 'Graph', 'Stripe', 'Dots', 'Corners', 'Grid'][idx] ?? `V${n}`;
    case 'noise':
      return ['Carbon', 'Slate', 'Noir', 'Fade', 'Carbon', 'Carbon'][idx] ?? `V${n}`;
    case 'glass':
      return ['Frost', 'Clear', 'Halo', 'Prism', 'Frost', 'Frost'][idx] ?? `V${n}`;
    case 'preset':
      return 'Preset';
    case 'image':
      return 'Custom';
    case 'solid':
    default:
      return ['Pure', 'Glow', 'Highlight', 'Lines', 'Stripe', 'Pure'][idx] ?? `V${n}`;
  }
}

// Get preset background by ID
export function getPresetBackground(presetId: BackgroundPreset): string {
  const preset = BACKGROUND_PRESETS.find(p => p.id === presetId);
  return preset?.background ?? '#ffffff';
}

// Check if preset has light or dark text
export function getPresetTextColor(presetId: BackgroundPreset): 'light' | 'dark' {
  const preset = BACKGROUND_PRESETS.find(p => p.id === presetId);
  return preset?.textColor ?? 'dark';
}