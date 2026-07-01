"use client";

import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import Lenis from 'lenis';
import { useStore } from '@/lib/store';
import Scene from '@/components/canvas/Scene';
import Hero from '@/components/dom/Hero';
import Reframe from '@/components/dom/Reframe';
import Problem from './dom/Problem';
import HowItWorks from './dom/HowItWorks';
import Vision from '@/components/dom/Vision';
import CTA from '@/components/dom/CTA';
import NodeFallback from '@/components/dom/NodeFallback';
import Header from '@/components/dom/Header';
import { getMasterTimeline, LABELS } from '@/lib/animations';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export default function PageContent() {
  const setIsMobile = useStore(state => state.setIsMobile);
  const setPrefersReducedMotion = useStore(state => state.setPrefersReducedMotion);
  const isMobile = useStore(state => state.isMobile);
  const prefersReducedMotion = useStore(state => state.prefersReducedMotion);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', checkMobile);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, [setIsMobile, setPrefersReducedMotion]);

  // Lenis Smooth Scrolling
  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.08, // Adjust for smoothness
      wheelMultiplier: 1,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(update);
    };
  }, [prefersReducedMotion]);

  // DOM GSAP Animations
  useEffect(() => {
    if (!mounted) return;
    if (prefersReducedMotion) {
      gsap.set('.hero-title, .hero-subtitle, .scroll-cue, .problem-text, .problem-diagram, .step, .cta-button, .vision-text', {
        opacity: 1, y: 0, scale: 1
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set('.hero-title, .hero-subtitle, .scroll-cue, .hero-cta', { opacity: 0, y: 20 });
      gsap.set('.step, .cta-button', { opacity: 0, y: 30 });
      gsap.set('.problem-content, .problem-row', { autoAlpha: 0, y: 20 });
      gsap.set('.reframe-content', { autoAlpha: 0 });
      gsap.set('.vision-text', { opacity: 0, scale: 0.95 });

      gsap.to('.hero-title, .hero-subtitle, .scroll-cue, .hero-cta', {
        opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: 'power3.out', delay: 0.3
      });

      const tl = getMasterTimeline();
      // Master timeline handles the 3D canvas and bg-sweep independently.

      // 1. We will fade out the Hero content on the master timeline instead of a separate scroll trigger
      // to ensure it perfectly syncs with the background sweep.

      // 2. Turn Header text black on very first scroll
      gsap.fromTo('.header-text',
        { color: '#F0EDE8' },
        {
          color: '#111113',
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: '.page-wrapper',
            start: 'top top',
            end: '+=200',
            scrub: true
          }
        }
      );

      if (tl) {
        // Fade out hero text smoothly between 0 and LABELS.reframe (0.5) so it's gone before the sweep finishes
        tl.to('.hero-content-wrapper', { autoAlpha: 0, y: -40, duration: 0.5, ease: 'power2.inOut' }, 0);

        // At LABELS.reframe, instantly show Reframe text (corresponds to Screenshot 1)
        tl.to('.reframe-content', { autoAlpha: 1, y: 0, duration: 0.01 }, LABELS.reframe);
        
        // At LABELS.problem, instantly hide Reframe text (corresponds to Screenshot 2)
        tl.to('.reframe-content', { autoAlpha: 0, duration: 0.01 }, LABELS.problem);
        tl.to('#reframe .container', { autoAlpha: 0, duration: 0.01 }, LABELS.problem);
        
        // Turn Header text white when the orange background comes up
        tl.to('.header-text', { color: '#F0EDE8', duration: 1 }, LABELS.problem);

        // We handle problem text on a separate local timeline to avoid React Strict Mode race conditions
        // with the global 3D master timeline being reset by the Canvas unmounting.
      }

      // Local timeline perfectly mirrored to the master timeline's scroll position
      // LABELS.problem is time 2, background scales at time 3 to 4. We fade in at time 3.
      // LABELS.solution is time 6. We fade out at time 7.
      const domTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.page-wrapper',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        }
      });

      // Total master timeline duration is 18. This maps perfectly to the same absolute scroll positions.
      domTl.to('.problem-content', { autoAlpha: 1, y: 0, duration: 1, ease: 'power2.out' }, 3);
      domTl.to('.problem-row', { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power2.out' }, 3);

      // Simulate scrolling: push the wrapper up further to account for 6 rows
      domTl.to('.problem-scroll-wrapper', { y: '-130vh', duration: 3, ease: 'none' }, 4);

      // --- Crossfade Magic to put Sphere in front of Table ---
      // At time 4, the 3D orange pillar covers the screen. We crossfade to a DOM orange background.
      domTl.to('.problem-bg-override', { opacity: 1, duration: 0.2, ease: 'none' }, 4);
      // Once the 3D mesh is transparent (time 4.2), we pop the Canvas to z-index 2!
      // This brings the Canvas (and the Sphere) IN FRONT of the table!
      domTl.set('.canvas-wrapper', { zIndex: 2 }, 4.21);

      // Highlight each row as the sphere passes over it
      // With 6 rows and a -130vh scroll, the first row hits the center around time 4.4
      const highlightStart = 4.4;
      const highlightEnd = 6.6;
      const highlightDuration = (highlightEnd - highlightStart) / 6;

      for (let i = 0; i < 6; i++) {
        const startTime = highlightStart + (i * highlightDuration);
        
        // Highlight ON (Solid Yellow background, black text)
        // Since the sphere is now physically IN FRONT of the row, we don't need transparency!
        domTl.to(`.problem-row-${i}`, { backgroundColor: '#F7D046', color: '#111113', duration: 0.15 }, startTime);
        domTl.to(`.problem-row-${i} .problem-btn`, { borderColor: '#111113', duration: 0.15 }, startTime);
        
        // Highlight OFF (Back to transparent, white text)
        domTl.to(`.problem-row-${i}`, { backgroundColor: 'transparent', color: 'var(--ink-primary)', duration: 0.15 }, startTime + highlightDuration);
        domTl.to(`.problem-row-${i} .problem-btn`, { borderColor: 'rgba(255,255,255,0.4)', duration: 0.15 }, startTime + highlightDuration);
      }

      // Fade everything out before HowItWorks starts
      domTl.to('.problem-scroll-wrapper', { autoAlpha: 0, y: '-140vh', duration: 0.5, ease: 'power2.in' }, 7.5);
      
      // Revert the Crossfade Magic before the next section
      domTl.set('.canvas-wrapper', { zIndex: 0 }, 7.49);
      domTl.to('.problem-bg-override', { opacity: 0, duration: 0.2, ease: 'none' }, 7.5);
      
      // CRITICAL: We must pad the end of this local timeline so its total duration is exactly 18,
      // identical to the masterTimeline. Otherwise GSAP stretches the 7.5s timeline across the whole page!
      domTl.set({}, {}, 18);

      // We remove the old Problem/Solution scroll triggers since it's all on masterTimeline now

      gsap.to('.step', {
        scrollTrigger: { trigger: '#how-it-works', start: 'top 40%' },
        opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out'
      });

      gsap.to('.vision-text', {
        scrollTrigger: { trigger: '#vision', start: 'top 60%' },
        opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out'
      });

      gsap.to('.cta-button', {
        scrollTrigger: { trigger: '#cta', start: 'top 70%' },
        opacity: 1, y: 0, duration: 1, ease: 'power3.out'
      });
    });

    return () => {
      ctx.revert();
    };
  }, [mounted, prefersReducedMotion]);

  return (
    <div className="page-wrapper" style={{ position: 'relative', width: '100%', overflowX: 'hidden' }}>
      {/* NOISE OVERLAY DISABLED FOR DIAGNOSTIC */}
      <div className="noise-overlay" />

      <Header />

      {/* Background Sweep for Transition */}
      <div className="bg-sweep" style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', height: '0vh', backgroundColor: 'var(--bg-paper)', zIndex: -1 }} />

      {/* DOM Orange Background for Problem section (allows canvas z-index to pop to front) */}
      <div className="problem-bg-override" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', backgroundColor: '#E45B2E', zIndex: 0, opacity: 0, pointerEvents: 'none' }} />

      {/* 3D Canvas wrapper */}
      <div
        className="canvas-wrapper"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {mounted && !isMobile && !prefersReducedMotion && <Scene />}
        {mounted && (isMobile || prefersReducedMotion) && <NodeFallback />}
      </div>

      {/* DOM Sections */}
      <div className="dom-sections" style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <Reframe />
        <Problem />
        <HowItWorks />
        <Vision />
        <CTA />
      </div>
    </div>
  );
}
