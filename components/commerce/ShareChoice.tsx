'use client';

import { useState } from 'react';
import { shop } from '@/data/shop';

export function ShareChoice({ href, name }: { href: string; name: string }) {
  const [status,setStatus] = useState('');
  const [showLink,setShowLink] = useState(false);
  const url = shop.siteUrl + href;
  async function share() {
    try {
      if (navigator.share) await navigator.share({title:name,url});
      else { await navigator.clipboard.writeText(url); setStatus('इस पसंद का link copy हो गया।'); }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      setShowLink(true);
    }
  }
  return <div className="ec-share-choice"><button className="ec-text" type="button" onClick={share}>इस पसंद का link share करें</button>
    {showLink && <input aria-label="इस पसंद का public link" value={url} readOnly onFocus={e => e.currentTarget.select()}/>}
    <span role="status">{status}</span></div>;
}
