import React, { useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { computeFlashlightCoordinates, FlashlightPosition } from '../utils/portfolioLogic';

interface HeroFlashlightSectionProps {
  onExploreProjects: () => void;
}

const FIXED_SPOTLIGHT_RADIUS = 500;

export const HeroFlashlightSection: React.FC<HeroFlashlightSectionProps> = ({
  onExploreProjects,
}) => {
  const heroRef = useRef<HTMLElement | null>(null);

  const [cursorPos, setCursorPos] = useState<FlashlightPosition>({
    xPx: 740,
    yPx: 390,
    xPercent: 52,
    yPercent: 45,
    latFormatted: "22°53.60'S",
    lonFormatted: "043°10.24'W",
  });

  const [imgLoadError, setImgLoadError] = useState<boolean>(false);

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const computed = computeFlashlightCoordinates(clientX, clientY, rect);
    setCursorPos(computed);
    heroRef.current.style.setProperty('--mouse-x', `${computed.xPx}px`);
    heroRef.current.style.setProperty('--mouse-y', `${computed.yPx}px`);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    handlePointerMove(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    if (e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  return (
    <section
      id="home"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      style={
        {
          '--mouse-x': `${cursorPos.xPx}px`,
          '--mouse-y': `${cursorPos.yPx}px`,
          '--spotlight-radius': `${FIXED_SPOTLIGHT_RADIUS}px`,
        } as React.CSSProperties
      }
      className="relative min-h-[92vh] flex flex-col justify-between pt-24 pb-10 overflow-hidden bg-[#070C18] border-b border-slate-800/80 select-none"
    >
      {/* 1. Ambient Base Dark Grid (visible even outside the flashlight beam) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(6, 182, 212, 0.09) 1px, transparent 1px), linear-gradient(to bottom, rgba(6, 182, 212, 0.09) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* 2. Revealed Pure Photo Background Layer (500px fixed flashlight aperture) */}
      <div
        data-testid="hero-flashlight-layer"
        className="pointer-events-none absolute inset-0 hero-flashlight-reveal opacity-100 transition-opacity duration-200"
      >
        {!imgLoadError && (
          <img
            id="hero-background-img"
            src="/assets/aistudio/Hero_Section_Background_09180758.jpg"
            alt="Cenário Marítimo Bototech"
            referrerPolicy="no-referrer"
            onError={() => setImgLoadError(true)}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-95 brightness-110"
          />
        )}

        {/* Measured Left-Side Contrast Scrim for WCAG AAA text legibility */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#070C18]/85 via-[#0F172A]/35 to-transparent"
        />
      </div>

      {/* 3. Subtle Neon Ring Following the 500px Flashlight Beam */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hero-flashlight-ring"
      />

      {/* 4. Main Foreground Hero Content */}
      <div className="relative z-10 max-w-[1200px] w-full mx-auto px-6 my-auto py-12">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-3 text-xs font-medium tracking-wider text-[#06B6D4]">
            <span>ENGENHARIA DE SOFTWARE INDEPENDENTE</span>
          </div>

          <h1
            className="font-display font-bold text-white tracking-tight leading-[1.08]"
            style={{
              fontSize: 'clamp(2.35rem, 4.5vw, 3.85rem)',
              textWrap: 'balance',
            }}
          >
            Desenvolvimento Full-Stack, Simulações 3D e Apps.
          </h1>

          <p className="text-lg sm:text-xl text-slate-200 max-w-2xl leading-relaxed font-normal">
            Soluções independentes e de alta performance. Arquiteturas enxutas em{' '}
            <span className="text-white font-semibold">HTML/JS Vanilla</span>,{' '}
            <span className="text-[#06B6D4] font-semibold">Three.js</span>,{' '}
            <span className="text-[#FF4D6D] font-semibold">Flutter/SQLite</span> e automações em{' '}
            <span className="text-white font-semibold">VPS próprio</span>.
          </p>

          {/* Primary CTA */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onExploreProjects}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-semibold text-white bg-[#FF4D6D] hover:bg-[#FF3358] rounded-xl shadow-lg shadow-[#FF4D6D]/30 hover:shadow-[#FF4D6D]/50 transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#06B6D4]"
            >
              <span>Explorar Projetos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
