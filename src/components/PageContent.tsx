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
import Problem from '@/components/dom/Problem';
import Solution from '@/components/dom/Solution';
import HowItWorks from '@/components/dom/HowItWorks';
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
      gsap.set('.problem-text, .problem-diagram, .step, .cta-button', { opacity: 0, y: 30 });
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
        tl.to('.hero-content-wrapper', { opacity: 0, y: -40, duration: 0.5, ease: 'power2.inOut' }, 0);

        // At LABELS.reframe, instantly show Reframe text (corresponds to Screenshot 1)
        tl.to('.reframe-content', { opacity: 1, y: 0, duration: 0.01 }, LABELS.reframe);
        
        // At LABELS.problem, instantly hide Reframe text (corresponds to Screenshot 2)
        tl.to('.reframe-content', { opacity: 0, duration: 0.01 }, LABELS.problem);
        tl.to('#reframe .container', { opacity: 0, duration: 0.01 }, LABELS.problem);

        // The camera sweep takes 1s. Then the pillar scales for 1s. Total = 2s.
        // Wait until BOTH are completely finished before fading in the Problem text.
        tl.fromTo('.problem-content', { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power2.out' }, `${LABELS.problem}+=2`);
      }

      // We remove the old Problem scroll trigger since it's now on masterTimeline
      // gsapt.to('.problem-text, .problem-diagram' ...);

      const solutionRows = gsap.utils.toArray('.solution-row');
      solutionRows.forEach((row: any) => {
        const h3 = row.querySelector('h3');
        gsap.to(row, {
          scrollTrigger: {
            trigger: row, start: 'top center', end: 'bottom center',
            onEnter: () => {
              gsap.to(row, { opacity: 1, duration: 0.3 });
              if (h3) gsap.to(h3, { color: 'var(--accent)', duration: 0.3 });
            },
            onLeave: () => {
              gsap.to(row, { opacity: 0.3, duration: 0.3 });
              if (h3) gsap.to(h3, { color: 'var(--ink-dark)', duration: 0.3 });
            },
            onEnterBack: () => {
              gsap.to(row, { opacity: 1, duration: 0.3 });
              if (h3) gsap.to(h3, { color: 'var(--accent)', duration: 0.3 });
            },
            onLeaveBack: () => {
              gsap.to(row, { opacity: 0.3, duration: 0.3 });
              if (h3) gsap.to(h3, { color: 'var(--ink-dark)', duration: 0.3 });
            },
          }
        });
      });

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
        <Solution />
        <HowItWorks />
        <Vision />
        <CTA />
      </div>
    </div>
  );
}
