'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { IconArrow, IconPause, IconPlay } from '@/components/Icons';

export function FestivalFrame() {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.festivalMotion = paused ? 'paused' : 'playing';
    window.dispatchEvent(new Event('mw-festival-motion'));
    return () => { delete document.documentElement.dataset.festivalMotion; };
  }, [paused]);
  return <>
    <div className="festival-rail festival-rail-left" aria-hidden="true"/>
    <div className="festival-rail festival-rail-right" aria-hidden="true"/>
    <div className="festival-crown" aria-hidden="true"/>
    <div className="festival-greeting"><span className="festival-diya" aria-hidden="true"><i/></span><p><span className="festival-eyebrow">DIWALI AT MOBILE WORLD</span>रोशनी, भरोसा और ख़ुशियाँ।</p><button type="button" className="festival-motion" aria-pressed={paused} aria-label={paused ? 'Festival animations चलाइए' : 'Festival animations रोकिए'} onClick={() => setPaused(v => !v)}>{paused ? <IconPlay/> : <IconPause/>}<span>{paused ? 'Animation चलाइए' : 'Animation रोकिए'}</span></button></div>
  </>;
}

export function FestivalFlightScene() {
  const section = useRef<HTMLElement>(null);
  const flight = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      frame = 0;
      if (document.documentElement.dataset.festivalMotion === 'paused' || reduced.matches || !section.current) return;
      const rect = section.current.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
      flight.current?.style.setProperty('--flight-x', `${(progress - .5) * 90}px`);
      flight.current?.style.setProperty('--flight-y', `${Math.sin(progress * Math.PI * 2) * 22}px`);
      flight.current?.style.setProperty('--flight-tilt', `${(progress - .5) * -6}deg`);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('mw-festival-motion', schedule);
    reduced.addEventListener('change', schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); window.removeEventListener('mw-festival-motion', schedule); reduced.removeEventListener('change', schedule); };
  }, []);
  return <section className="festival-flight-scene" ref={section} aria-labelledby="festival-flight-title">
    <Image className="festival-flight-landscape" src="/festival-v2/pilgrimage-panorama.webp" fill sizes="100vw" alt="साँझ के पहाड़ों में माँ वैष्णो देवी भवन से प्रेरित campaign artwork"/>
    <div className="festival-flight-copy"><p>DIWALI की ख़ुशियों के साथ</p><h2 id="festival-flight-title">आस्था का सफ़र।<br/><span>ख़ुशियों की उड़ान।</span></h2><a href="#festival-highlights">Yatra campaign देखिए <IconArrow/></a></div>
    <div className="festival-flight" ref={flight} aria-hidden="true"><div className="festival-flight-body"><Image src="/festival-v2/helicopter.webp" width={900} height={600} alt="" sizes="(max-width: 760px) 230px, 390px"/><span className="festival-beacon"/></div></div>
    <span className="festival-scene-note">MOBILE WORLD · DIWALI 2026</span>
  </section>;
}
