/** छोटे line icons। सब एक ही जगह ताकि दोहराव न हो। */

const S = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const IconMenu = () => (
  <svg {...S} aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
);

export const IconSearch = () => (
  <svg {...S} aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
);

export const IconPhone = () => (
  <svg {...S} aria-hidden="true">
    <path d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4 5.2 2 2 0 0 1 6 3z" />
  </svg>
);

export const IconWhatsApp = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.3A10 10 0 1 0 12 2zm0 2a8 8 0 1 1-4.1 14.9l-.4-.2-2.6.7.7-2.5-.3-.4A8 8 0 0 1 12 4z" />
  </svg>
);

export const IconPin = () => (
  <svg {...S} aria-hidden="true">
    <path d="M12 21.5s-7-5.6-7-11.2a7 7 0 1 1 14 0c0 5.6-7 11.2-7 11.2z" /><circle cx="12" cy="10" r="2.5" />
  </svg>
);

export const IconGrid = () => (
  <svg {...S} aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

export const IconPost = () => (
  <svg {...S} aria-hidden="true">
    <path d="M4 5h11a2 2 0 0 1 2 2v12H6a2 2 0 0 1-2-2z" />
    <path d="M17 9h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" /><path d="M7 9h6M7 12h6M7 15h4" />
  </svg>
);

export const IconTool = () => (
  <svg {...S} width={16} height={16} aria-hidden="true">
    <path d="M14.5 6.5a4 4 0 0 1 5.2 5.2L9.4 22a2.3 2.3 0 0 1-3.3-3.3z" /><path d="M4 4l3.5 3.5M2.5 8.5L6 5" />
  </svg>
);

export const IconHome = () => (
  <svg {...S} aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V21H3z" /><path d="M9 21v-6h6v6" /></svg>
);

export const IconArrow = ({ size = 14 }: { size?: number }) => (
  <svg {...S} width={size} height={size} aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

export const IconChevL = () => (
  <svg {...S} width={16} height={16} aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
);

export const IconChevR = () => (
  <svg {...S} width={16} height={16} aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
);

export const IconPause = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
);

export const IconPlay = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5l11 7-11 7z" /></svg>
);

export const IconYouTube = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23 12s0-3.6-.5-5.3a2.8 2.8 0 0 0-2-2C18.8 4 12 4 12 4s-6.8 0-8.5.7a2.8 2.8 0 0 0-2 2C1 8.4 1 12 1 12s0 3.6.5 5.3a2.8 2.8 0 0 0 2 2C5.2 20 12 20 12 20s6.8 0 8.5-.7a2.8 2.8 0 0 0 2-2C23 15.6 23 12 23 12zM9.8 15.4V8.6l5.9 3.4z" />
  </svg>
);

export const IconInstagram = () => (
  <svg {...S} aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

export const IconFacebook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.5V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" />
  </svg>
);
