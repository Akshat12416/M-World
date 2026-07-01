import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Standardized labels for the master timeline so components can sync their animations
// regardless of mount order. The numerical values represent relative duration blocks.
export const LABELS = {
  hero: "hero",               // 0 -> 7 (Massive pinned scroll section)
  reframe: "reframe",         // 7 -> 8
  problem: "problem",         // 8 -> 9
  solution: "solution",       // 9 -> 10
  howItWorks: "howItWorks",   // 10 -> 12
  vision: "vision",           // 12 -> 13.5
  cta: "cta",                 // 13.5 -> 14.5
};

let masterTimeline: gsap.core.Timeline | null = null;

export const getMasterTimeline = () => {
  if (typeof window === 'undefined') return null;
  
  if (!masterTimeline) {
    gsap.registerPlugin(ScrollTrigger);
    
    // Create the master scroll-driven timeline
    masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.page-wrapper',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      }
    });

    // Adjust timeline so the Reframe animation takes up a very small percentage of the total scroll
    // and happens almost immediately after scrolling begins.
    masterTimeline.addLabel(LABELS.hero, 0)
                  .addLabel(LABELS.reframe, 0.5) 
                  .addLabel(LABELS.problem, 2)
                  .addLabel(LABELS.solution, 6)
                  .addLabel(LABELS.howItWorks, 9)
                  .addLabel(LABELS.vision, 14)
                  .addLabel(LABELS.cta, 18);
  }
  
  return masterTimeline;
};

export const resetMasterTimeline = () => {
  if (masterTimeline) {
    masterTimeline.kill();
    masterTimeline = null;
  }
};
