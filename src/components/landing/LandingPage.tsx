"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Icon, type IconName } from '@/components/ui/Icon';

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-linear-to-br from-teal-500/20 via-sky-500/15 to-transparent blur-3xl animate-pulse"
        style={{ animationDuration: '8s' }}
      />
      <div
        className="absolute -bottom-[30%] -right-[20%] w-[60%] h-[60%] rounded-full bg-linear-to-tl from-sky-500/15 via-teal-500/10 to-transparent blur-3xl animate-pulse"
        style={{ animationDuration: '10s', animationDelay: '2s' }}
      />
      <div
        className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-linear-to-bl from-sky-500/10 via-orange-500/8 to-transparent blur-3xl animate-pulse"
        style={{ animationDuration: '12s', animationDelay: '4s' }}
      />
    </div>
  );
}

function FloatingCard({ delay = 0, className = '' }: { delay?: number; className?: string }) {
  return (
    <div
      className={`absolute ui-surface ui-shadow-lg rounded-2xl ${className}`}
      style={{
        animation: `float 6s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <div className="p-4">
        <div className="w-full h-2 bg-linear-to-r from-teal-500 to-sky-500 rounded-full mb-3" />
        <div className="space-y-2">
          <div className="h-2 bg-border-strong rounded w-3/4" />
          <div className="h-2 bg-border rounded w-1/2" />
        </div>
        <div className="mt-4 flex gap-2">
          <div className="w-6 h-6 rounded-full bg-linear-to-br from-teal-500 to-sky-500" />
          <div className="flex-1 space-y-1.5">
            <div className="h-1.5 bg-border-strong rounded w-full" />
            <div className="h-1.5 bg-border rounded w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  iconName,
  title,
  description,
}: {
  iconName: IconName;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative p-6 rounded-2xl ui-surface ui-shadow hover:ui-shadow-lg transition-all duration-500 hover:-translate-y-1">
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-teal-500/5 via-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-teal-500 to-sky-600 text-white shadow-lg shadow-teal-500/25 mb-4 group-hover:scale-110 transition-transform duration-300">
          <Icon name={iconName} size="action" decorative />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
  iconName,
}: {
  number: number;
  title: string;
  description: string;
  iconName: IconName;
}) {
  return (
    <div className="relative flex flex-col items-center text-center group">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-teal-500 to-sky-600 flex items-center justify-center text-white shadow-xl shadow-teal-500/25 group-hover:scale-110 transition-transform duration-300">
          <Icon name={iconName} size="action" decorative />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-surface-2 border-2 border-teal-500 flex items-center justify-center text-teal-600 dark:text-teal-300 font-bold text-sm ui-shadow">
          {number}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted max-w-xs">{description}</p>
    </div>
  );
}

function AudienceCard({
  iconName,
  title,
  description,
}: {
  iconName: IconName;
  title: string;
  description: string;
}) {
  return (
    <div className="group p-6 rounded-2xl ui-surface ui-shadow hover:ui-shadow-lg transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-teal-500/15 to-sky-500/15 flex items-center justify-center text-teal-600 dark:text-teal-300 transition-all duration-300" style={{ border: '1px solid var(--border)' }}>
          <Icon name={iconName} size="action" decorative />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-muted text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  value,
  label,
  detail,
  iconName,
}: {
  value: string;
  label: string;
  detail: string;
  iconName: IconName;
}) {
  return (
    <div className="ui-surface ui-shadow rounded-2xl p-5 flex items-center gap-4">
      <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-teal-500/15 to-sky-500/15 flex items-center justify-center text-teal-600 dark:text-teal-300" style={{ border: '1px solid var(--border)' }}>
        <Icon name={iconName} size="action" decorative />
      </div>
      <div>
        <div className="text-2xl font-semibold text-foreground">{value}</div>
        <div className="text-sm font-semibold text-foreground">{label}</div>
        <div className="text-xs text-muted">{detail}</div>
      </div>
    </div>
  );
}

function TemplateCard({
  title,
  description,
  tags,
  gradient,
}: {
  title: string;
  description: string;
  tags: string[];
  gradient: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl ui-surface ui-shadow hover:ui-shadow-lg transition-all duration-300">
      <div className="absolute inset-0 opacity-90" style={{ background: gradient }} />
      <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="relative p-6 min-h-56 flex flex-col justify-between text-white">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-white/70">Template</div>
          <h3 className="mt-3 text-2xl font-display">{title}</h3>
          <p className="mt-2 text-sm text-white/80 max-w-xs">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/15 text-white/90">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({
  quote,
  name,
  role,
}: {
  quote: string;
  name: string;
  role: string;
}) {
  return (
    <div className="ui-surface ui-shadow rounded-2xl p-6 flex flex-col gap-4">
      <Icon name="BadgeCheck" size="action" className="text-teal-500" decorative />
      <p className="text-sm leading-relaxed text-foreground/80">&quot;{quote}&quot;</p>
      <div>
        <div className="text-sm font-semibold text-foreground">{name}</div>
        <div className="text-xs text-muted">{role}</div>
      </div>
    </div>
  );
}

function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'ui-glass ui-shadow backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center shadow-lg shadow-teal-500/25 overflow-hidden">
              <img src="/GrayVally.png" alt="GrayVally logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold ui-gradient-text">GrayVally Business Card Maker</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#templates" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
              Templates
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#audience" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
              Who It&apos;s For
            </a>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle className="hidden sm:inline-flex" />
            <Link
              href="/editor"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              <Icon name="Play" size="input" decorative />
              Try Demo
            </Link>
            <Link
              href="/editor"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-teal-500 to-sky-600 rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Start Designing
              <Icon name="ArrowRight" size="input" className="group-hover:translate-x-0.5" decorative />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(2deg);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>

      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <AnimatedBackground />

        {/* Floating cards decoration */}
        <FloatingCard delay={0} className="hidden lg:block w-48 h-28 top-32 left-[8%] rotate-[-8deg]" />
        <FloatingCard delay={2} className="hidden lg:block w-40 h-24 top-48 right-[12%] rotate-6" />
        <FloatingCard delay={4} className="hidden xl:block w-36 h-20 bottom-32 left-[15%] rotate-[4deg]" />

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-teal-50 to-sky-50 border border-teal-100 mb-8 animate-fade-in-up opacity-0 ui-shadow">
              <Icon name="Sparkles" size="input" className="text-teal-500" decorative />
              <span className="text-sm font-medium text-teal-700">Professional Business Card Studio</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-up opacity-0 animation-delay-200">
              <span className="bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                Design Professional
              </span>
              <br />
              <span className="bg-linear-to-r from-teal-600 via-sky-600 to-teal-600 bg-clip-text text-transparent">
                Business Cards
              </span>
              <br />
              <span className="bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                in Minutes
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up opacity-0 animation-delay-400">
              Create print-ready cards with live preview, autosave, smart alignment, and premium templates. Design the
              front and back with confidence, then export exactly what you see.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up opacity-0 animation-delay-600">
              <Link
                href="/editor"
                className="group inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-linear-to-r from-teal-500 via-sky-500 to-teal-600 rounded-2xl shadow-xl shadow-teal-500/25 hover:shadow-2xl hover:shadow-teal-500/30 hover:-translate-y-1 transition-all duration-300"
              >
                Start Designing
                <Icon name="ArrowRight" size="toolbar" className="group-hover:translate-x-1" decorative />
              </Link>
              <Link
                href="#templates"
                className="group inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-slate-700 bg-white border-2 border-slate-200 rounded-2xl hover:border-teal-200 hover:bg-teal-50 transition-all duration-300"
              >
                <Icon name="Layers" size="toolbar" decorative />
                View Templates
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Icon name="Save" size="button" className="text-teal-500" decorative />
                <span>Autosave drafts + versions</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="ArrowLeftRight" size="button" className="text-teal-500" decorative />
                <span>Front + back editing</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="QrCode" size="button" className="text-teal-500" decorative />
                <span>QR codes built-in</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Printer" size="button" className="text-teal-500" decorative />
                <span>Print-ready export</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard value="120+" label="Templates" detail="Curated styles" iconName="LayoutGrid" />
            <StatCard value="250+" label="Backgrounds" detail="Gradients + patterns" iconName="Palette" />
            <StatCard value="3" label="Export formats" detail="PDF, PNG, SVG" iconName="Download" />
            <StatCard value="2-sided" label="Layouts" detail="Front and back" iconName="ArrowLeftRight" />
          </div>
        </div>
      </section>

      {/* Product Preview Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-teal-50/50 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Powerful Yet Simple</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A professional-grade editor that feels intuitive from the first click
            </p>
          </div>

          {/* Editor Mockup */}
          <div className="relative max-w-6xl mx-auto">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-linear-to-r from-teal-500/20 via-sky-500/20 to-orange-500/20 rounded-3xl blur-3xl transform scale-95" />

            {/* Main mockup container */}
            <div className="relative bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200/60 overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 border-b border-slate-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1.5 bg-white rounded-lg text-xs text-slate-500 border border-slate-200">
                    grayvally.tech/editor
                  </div>
                </div>
              </div>

              {/* Editor UI Mockup */}
              <div className="flex" style={{ height: '500px' }}>
                {/* Left Panel */}
                <div className="w-80 bg-slate-50 border-r border-slate-200 p-4 space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-linear-to-br from-teal-500 to-sky-500" />
                      <div className="flex-1">
                        <div className="h-2 bg-slate-200 rounded w-20 mb-1" />
                        <div className="h-1.5 bg-slate-100 rounded w-14" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-8 bg-slate-100 rounded-lg" />
                      <div className="h-8 bg-slate-100 rounded-lg" />
                      <div className="h-8 bg-slate-100 rounded-lg" />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                    <div className="h-2 bg-slate-200 rounded w-24 mb-3" />
                    <div className="grid grid-cols-4 gap-2">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="aspect-square rounded-lg bg-linear-to-br from-teal-100 to-sky-100" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Preview Area */}
                <div className="flex-1 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
                  <div className="relative">
                    {/* Card preview */}
                    <div className="w-87.5 h-50 rounded-2xl bg-linear-to-br from-teal-500 via-sky-500 to-orange-500 shadow-2xl shadow-sky-500/30 p-6 flex flex-col justify-between text-white">
                      <div>
                        <div className="text-xl font-bold">Alex Johnson</div>
                        <div className="text-sm opacity-80">Creative Director</div>
                        <div className="text-xs opacity-60 mt-1">TechVentures Inc.</div>
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="space-y-1 text-xs opacity-80">
                          <div>alex@techventures.com</div>
                          <div>+1 (555) 123-4567</div>
                          <div>www.techventures.com</div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur" />
                      </div>
                    </div>

                    {/* Live indicator */}
                    <div className="absolute -top-3 -right-3 px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      Live Preview
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Caption */}
            <div className="text-center mt-8">
              <p className="inline-flex items-center gap-2 text-slate-600 font-medium">
                <Icon name="Eye" size="button" className="text-teal-500" decorative />
                What you design is exactly what you export
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 mb-6">
              <Icon name="Zap" size="input" className="text-teal-500" decorative />
              <span className="text-sm font-medium text-teal-700">Powerful Features</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Create
              <br />
              <span className="bg-linear-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent">
                Stunning Business Cards
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Professional tools made simple. From design to print-ready export in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              iconName="Eye"
              title="Live Preview Editor"
              description="See your changes instantly with our real-time preview. What you see is exactly what you'll get when you export."
            />
            <FeatureCard
              iconName="Grid3X3"
              title="Smart Grid & Auto Alignment"
              description="Perfect alignment every time with intelligent snap-to-grid and automatic spacing tools."
            />
            <FeatureCard
              iconName="Save"
              title="Autosave + Version History"
              description="Every change is captured automatically. Save milestones and roll back anytime."
            />
            <FeatureCard
              iconName="Palette"
              title="250+ Backgrounds & Patterns"
              description="Choose from gradients, meshes, patterns, and textures. Upload your own or pick a solid color."
            />
            <FeatureCard
              iconName="ArrowLeftRight"
              title="Front + Back Design"
              description="Craft both sides of your card and add QR codes, logos, and brand accents."
            />
            <FeatureCard
              iconName="Download"
              title="Print-Ready Export"
              description="Export crisp PDF, PNG, or SVG with bleed-safe layouts ready for printing."
            />
          </div>
        </div>
      </section>

      {/* Template Gallery Section */}
      <section id="templates" className="py-24 bg-linear-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 border border-sky-100 mb-4">
                <Icon name="LayoutGrid" size="input" className="text-sky-500" decorative />
                <span className="text-sm font-medium text-sky-700">Template Gallery</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
                Styles That Match Your Brand
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl">
                Start from a beautiful foundation, then personalize every detail with your colors, fonts, and layout.
              </p>
            </div>
            <Link
              href="/editor"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-teal-700 bg-teal-50 border border-teal-100 hover:bg-teal-100 transition-all"
            >
              Browse all templates
              <Icon name="ArrowRight" size="input" decorative />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TemplateCard
              title="Modern Minimal"
              description="Crisp typography, subtle accents, and perfect spacing for modern teams."
              tags={["Minimal", "Tech", "Consulting"]}
              gradient="linear-gradient(135deg, #0f766e, #0ea5e9)"
            />
            <TemplateCard
              title="Studio Bold"
              description="High-contrast layouts that highlight your logo, title, and contact stack."
              tags={["Creative", "Portfolio", "Agency"]}
              gradient="linear-gradient(135deg, #0f172a, #0ea5e9, #f97316)"
            />
            <TemplateCard
              title="Warm Executive"
              description="A refined look with a confident palette for leadership and enterprise teams."
              tags={["Executive", "Corporate", "Sales"]}
              gradient="linear-gradient(135deg, #f97316, #f59e0b)"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-linear-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 border border-sky-100 mb-6">
              <Icon name="MousePointer2" size="input" className="text-sky-500" decorative />
              <span className="text-sm font-medium text-sky-700">Simple Process</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Create Your Card in
              <br />
              <span className="bg-linear-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent">
                Three Easy Steps
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              No design experience needed. Our intuitive editor guides you through the process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto relative">
            {/* Connector lines */}
            <div
              className="hidden md:block absolute left-1/3 right-1/3 top-1/2 h-0.5 bg-linear-to-r from-teal-200 via-sky-200 to-teal-200"
              style={{ transform: 'translateY(-40px)' }}
            />

            <StepCard
              number={1}
              iconName="Pen"
              title="Enter Your Details"
              description="Add your name, title, company, and contact information. Our smart form makes it easy."
            />
            <StepCard
              number={2}
              iconName="Palette"
              title="Customize Design"
              description="Choose a template or start from scratch. Adjust colors, fonts, layouts, and backgrounds."
            />
            <StepCard
              number={3}
              iconName="Download"
              title="Export & Print"
              description="Download your print-ready file and send it to your favorite print shop."
            />
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section id="audience" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
              <Icon name="Users" size="input" className="text-emerald-500" decorative />
              <span className="text-sm font-medium text-emerald-700">Built For Everyone</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Perfect For
              <br />
              <span className="bg-linear-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent">
                Every Professional
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Whether you&apos;re starting out or running a team, GrayVally Business Card Maker adapts to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <AudienceCard
              iconName="Zap"
              title="Entrepreneurs"
              description="Make a memorable first impression with cards that reflect your brand's ambition and professionalism."
            />
            <AudienceCard
              iconName="Pen"
              title="Designers"
              description="Fine-tune every detail with precision tools. Export production-ready files with proper specifications."
            />
            <AudienceCard
              iconName="Briefcase"
              title="Freelancers"
              description="Stand out from the crowd with unique, personalized cards that showcase your creative identity."
            />
            <AudienceCard
              iconName="Building2"
              title="Corporate Teams"
              description="Maintain brand consistency across your organization with customizable templates and color schemes."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-linear-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 mb-4">
              <Icon name="BadgeCheck" size="input" className="text-teal-500" decorative />
              <span className="text-sm font-medium text-teal-700">Trusted by creators</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              Loved by Designers and Teams
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From solo founders to enterprise teams, GrayVally Business Card Maker keeps every brand consistent and print-ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="The editor feels like a pro tool but stays simple. We produced a full team set in one afternoon."
              name="Maya Rodriguez"
              role="Creative Lead, Northline"
            />
            <TestimonialCard
              quote="Autosave and version history are game changers. We can iterate without fear."
              name="Chris Patel"
              role="Founder, Studio Eight"
            />
            <TestimonialCard
              quote="Exported files are ready for print every time. Our vendor had zero adjustments."
              name="Avery Chen"
              role="Ops Manager, Landmark Co."
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-teal-600 via-sky-600 to-teal-700" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.5\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6">
            Make Your First Impression
            <br />
            <span className="text-teal-200">Count.</span>
          </h2>
          <p className="text-xl text-teal-100 mb-10 max-w-2xl mx-auto">
            Join thousands of professionals who trust GrayVally Business Card Maker to create business cards that leave a lasting
            impact.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/editor"
              className="group inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-teal-600 bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              Create Your Card Now
              <Icon name="ArrowRight" size="toolbar" className="group-hover:translate-x-1" decorative />
            </Link>
            <Link
              href="/editor"
              className="group inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-2xl hover:bg-white/10 transition-all duration-300"
            >
              <Icon name="Play" size="toolbar" decorative />
              Try a Demo
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-teal-200">
            <span className="flex items-center gap-2">
              <Icon name="CheckCircle2" size="input" decorative />
              Free to use
            </span>
            <span className="flex items-center gap-2">
              <Icon name="CheckCircle2" size="input" decorative />
              No signup required
            </span>
            <span className="flex items-center gap-2">
              <Icon name="CheckCircle2" size="input" decorative />
              Instant download
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
                  <img src="/GrayVally.png" alt="GrayVally logo" className="w-full h-full object-cover" />
                </div>
                <span className="text-xl font-bold text-white">GrayVally Business Card Maker</span>
              </div>
              <p className="text-sm">Professional Business Card Designer</p>
            </div>

            <div className="flex items-center gap-8 text-sm">
              <a href="#features" className="hover:text-white transition-colors">
                Features
              </a>
              <a href="#templates" className="hover:text-white transition-colors">
                Templates
              </a>
              <a href="#how-it-works" className="hover:text-white transition-colors">
                How It Works
              </a>
              <Link href="/editor" className="hover:text-white transition-colors">
                Card Maker
              </Link>
            </div>

            <div className="text-center md:text-right">
              <p className="text-sm mb-2">Built by</p>
              <a
                href="https://grayvally.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white font-semibold hover:text-teal-400 transition-colors"
              >
                GrayVally
                <Icon name="ExternalLink" size="input" decorative />
              </a>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm">
            <p>(c) {new Date().getFullYear()} GrayVally Business Card Maker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}





