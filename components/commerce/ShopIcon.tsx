export type IconName = 'search' | 'heart' | 'bag' | 'user' | 'arrow' | 'chevron' | 'box' | 'pin' | 'truck' | 'check' | 'close' | 'plus' | 'minus' | 'trash' | 'grid' | 'phone' | 'shield' | 'logout' | 'help' | 'tune' | 'clock' | 'print' | 'store';
const paths: Record<IconName, string> = {
  search: 'M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
  bag: 'M5 7h14l1 14H4L5 7Z M8 8V6a4 4 0 0 1 8 0v2', user: 'M20 21v-2a7 7 0 0 0-14 0v2 M17 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  arrow: 'M4 12h16 M14 6l6 6-6 6', chevron: 'm9 5 7 7-7 7', box: 'm3 6 9-4 9 4v12l-9 4-9-4V6Z m0 0 9 4 9-4 M12 10v12 M7 4l9 4',
  pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  truck: 'M1 4h13v13H1V4Z M14 9h5l3 4v4h-8 M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0 M21 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  check: 'm5 12 4 4L20 5', close: 'm6 6 12 12 M6 18 18 6', plus: 'M12 5v14 M5 12h14', minus: 'M5 12h14',
  trash: 'M3 6h18 M9 6V3h6v3 M5 6l1 15h12l1-15 M10 10v7 M14 10v7', grid: 'M3 3h7v7H3V3Z M14 3h7v7h-7V3Z M3 14h7v7H3v-7Z M14 14h7v7h-7v-7Z',
  phone: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z M10 18h4',
  shield: 'm12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Z m-4 10 3 3 5-6', logout: 'M9 3H3v18h6 M9 12h13 m-5-5 5 5-5 5',
  help: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M9 8a3 3 0 1 1 4 3v3 M12 18h.01', tune: 'M4 7h16 M4 17h16 M8 4v6 M16 14v6',
  clock: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M12 6v6l4 3', print: 'M6 9V2h12v7 M6 18H3V9h18v9h-3 M6 14h12v8H6v-8Z',
  store: 'M3 10h18l-2-7H5l-2 7Z M4 10v11h16V10 M9 21v-7h6v7',
};
export function ShopIcon({ name, className = '' }: { name: IconName; className?: string }) { return <svg className={`ec-icon ${className}`} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>; }
