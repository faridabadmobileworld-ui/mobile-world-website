export type ColourPhoto = { colour: string; src: string; alt: string };

// These three photos are published in our REDMI Note 17 Pro Max India guide.
const redmiColours = [
  ['Stealth Black', 'black'],
  ['Matcha Green', 'green'],
  ['Secret Sunrise', 'white'],
].map(([colour, file]) => ({
  colour,
  src: '/images/redmi-note-17-pro-max-' + file + '-official.webp',
  alt: 'REDMI Note 17 Pro Max 5G · ' + colour,
}));

export function colourPhotos(id: string): ColourPhoto[] {
  return id === 'xiaomi-redmi-note-17-pro-max' ? redmiColours : [];
}
