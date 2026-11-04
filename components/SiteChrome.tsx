'use client';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import type { SearchEntry } from '@/data/search';
import { SiteHeader } from './SiteHeader';
import { SiteFooter, MobileBar } from './SiteFooter';
import { FestivalFrame } from '@/app/FestivalFrame';
import { WebsiteAnalytics } from './WebsiteAnalytics';

export function SiteChrome({ children, searchIndex }: { children: ReactNode; searchIndex: SearchEntry[] }) {
  const pathname = usePathname();
  if (pathname === '/shop' || pathname.startsWith('/shop/')) return <main id="main" className="ec-root">{children}</main>;
  return <><FestivalFrame /><SiteHeader searchIndex={searchIndex} /><main id="main">{children}</main><SiteFooter /><MobileBar /><WebsiteAnalytics /></>;
}
