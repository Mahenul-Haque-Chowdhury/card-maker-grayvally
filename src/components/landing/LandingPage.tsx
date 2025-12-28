"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Icon, type IconName } from '@/components/ui/Icon';

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-linear-to-br from-indigo-500/20 via-purple-500/15 to-transparent blur-3xl animate-pulse"
        style={{ animationDuration: '8s' }}
      />
      <div
        className="absolute -bottom-[30%] -right-[20%] w-[60%] h-[60%] rounded-full bg-linear-to-tl from-blue-500/15 via-cyan-500/10 to-transparent blur-3xl animate-pulse"
        style={{ animationDuration: '10s', animationDelay: '2s' }}
      />
      <div
        className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-linear-to-bl from-violet-500/10 via-fuchsia-500/8 to-transparent blur-3xl animate-pulse"
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
        <div className="w-full h-2 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full mb-3" />
        <div className="space-y-2">
          <div className="h-2 bg-border-strong rounded w-3/4" />
          <div className="h-2 bg-border rounded w-1/2" />
        </div>
        <div className="mt-4 flex gap-2">
          <div className="w-6 h-6 rounded-full bg-linear-to-br from-indigo-500 to-purple-500" />
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
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-indigo-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 mb-4 group-hover:scale-110 transition-transform duration-300">
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
        <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/25 group-hover:scale-110 transition-transform duration-300">
          <Icon name={iconName} size="action" decorative />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-surface-2 border-2 border-indigo-500 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-sm ui-shadow">
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
        <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500/15 to-purple-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-300 transition-all duration-300" style={{ border: '1px solid var(--border)' }}>
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
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Icon name="CreditCard" size="toolbar" className="text-white" decorative />
            </div>
            <span className="text-xl font-bold ui-gradient-text">CardCraft Pro</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
              Features
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
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300"
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-indigo-50 to-purple-50 border border-indigo-100 mb-8 animate-fade-in-up opacity-0">
              <Icon name="Sparkles" size="input" className="text-indigo-500" decorative />
              <span className="text-sm font-medium text-indigo-700">Professional Business Card Designer</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-up opacity-0 animation-delay-200">
              <span className="bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                Design Professional
              </span>
              <br />
              <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Business Cards
              </span>
              <br />
              <span className="bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                in Minutes
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up opacity-0 animation-delay-400">
              Create stunning, print-ready business cards with precision tools, smart layouts, and 250+ premium
              backgrounds. What you design is exactly what you export.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up opacity-0 animation-delay-600">
              <Link
                href="/editor"
                className="group inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-linear-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-300"
              >
                Start Designing
                <Icon name="ArrowRight" size="toolbar" className="group-hover:translate-x-1" decorative />
              </Link>
              <Link
                href="/editor"
                className="group inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-slate-700 bg-white border-2 border-slate-200 rounded-2xl hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-300"
              >
                <Icon name="Layers" size="toolbar" decorative />
                View Templates
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Icon name="CheckCircle2" size="button" className="text-green-500" decorative />
                <span>100+ Premium Templates</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="CheckCircle2" size="button" className="text-green-500" decorative />
                <span>250+ Backgrounds</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="CheckCircle2" size="button" className="text-green-500" decorative />
                <span>Print-Ready Export</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="CheckCircle2" size="button" className="text-green-500" decorative />
                <span>No Account Required</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Preview Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-indigo-50/50 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Powerful Yet Simple</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A professional-grade editor that feels intuitive from the first click
            </p>
          </div>

          {/* Editor Mockup */}
          <div className="relative max-w-6xl mx-auto">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-linear-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-3xl transform scale-95" />

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
                    cardcraft.pro/editor
                  </div>
                </div>
              </div>

              {/* Editor UI Mockup */}
              <div className="flex" style={{ height: '500px' }}>
                {/* Left Panel */}
                <div className="w-80 bg-slate-50 border-r border-slate-200 p-4 space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-500" />
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
                        <div key={i} className="aspect-square rounded-lg bg-linear-to-br from-indigo-100 to-purple-100" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Preview Area */}
                <div className="flex-1 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
                  <div className="relative">
                    {/* Card preview */}
                    <div className="w-87.5 h-50 rounded-2xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-purple-500/30 p-6 flex flex-col justify-between text-white">
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
                <Icon name="Eye" size="button" className="text-indigo-500" decorative />
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-6">
              <Icon name="Zap" size="input" className="text-indigo-500" decorative />
              <span className="text-sm font-medium text-indigo-700">Powerful Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Create
              <br />
              <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
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
              iconName="Wand2"
              title="100+ Premium Templates"
              description="Start with professionally designed templates across categories like Corporate, Creative, Tech, and more."
            />
            <FeatureCard
              iconName="Palette"
              title="250+ Backgrounds & Patterns"
              description="Choose from gradients, meshes, patterns, and artistic textures. Upload your own or pick a solid color."
            />
            <FeatureCard
              iconName="Download"
              title="Print-Ready Export"
              description="Export as high-resolution PDF or PNG with proper bleed margins. Ready for professional printing."
            />
            <FeatureCard
              iconName="CreditCard"
              title="Standard Card Sizes"
              description="Design for standard 3.5&quot; × 2&quot; business cards."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-linear-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 mb-6">
              <Icon name="MousePointer2" size="input" className="text-purple-500" decorative />
              <span className="text-sm font-medium text-purple-700">Simple Process</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Create Your Card in
              <br />
              <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
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
              className="hidden md:block absolute left-1/3 right-1/3 top-1/2 h-0.5 bg-linear-to-r from-indigo-200 via-purple-200 to-indigo-200"
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
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Perfect For
              <br />
              <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Every Professional
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Whether you&apos;re starting out or running a team, CardCraft Pro adapts to your needs.
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

      {/* Final CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-600 via-purple-600 to-indigo-700" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.5\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Make Your First Impression
            <br />
            <span className="text-indigo-200">Count.</span>
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Join thousands of professionals who trust CardCraft Pro to create business cards that leave a lasting
            impact.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/editor"
              className="group inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-indigo-600 bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
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

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-indigo-200">
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
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Icon name="CreditCard" size="toolbar" className="text-white" decorative />
                </div>
                <span className="text-xl font-bold text-white">CardCraft Pro</span>
              </div>
              <p className="text-sm">Professional Business Card Designer</p>
            </div>

            <div className="flex items-center gap-8 text-sm">
              <a href="#features" className="hover:text-white transition-colors">
                Features
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
                className="inline-flex items-center gap-2 text-white font-semibold hover:text-indigo-400 transition-colors"
              >
                GrayVally
                <Icon name="ExternalLink" size="input" decorative />
              </a>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm">
            <p>© {new Date().getFullYear()} CardCraft Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
