import Image from "next/image";
import type { Photo } from "@/data/photos";

/**
 * एक तस्वीर, चमकती किनार और गोल कोनों के साथ।
 *
 * next/image इस्तेमाल किया है — यह अपने आप हर फ़ोन के लिए सही size की
 * तस्वीर भेजता है, इसलिए 4G पर भी जल्दी खुलती है (CLAUDE.md §6)।
 */
export default function PhotoFrame({
  photo,
  className = "",
  sizes = "(min-width: 640px) 50vw, 100vw",
  priority = false,
}: {
  photo: Photo;
  className?: string;
  /** browser को बताता है कि तस्वीर screen पर कितनी चौड़ी दिखेगी */
  sizes?: string;
  /** सबसे ऊपर दिखने वाली तस्वीर के लिए true — वो सबसे पहले load होगी */
  priority?: boolean;
}) {
  return (
    <div
      className={`glow-ring group relative overflow-hidden rounded-2xl bg-surface ${className}`}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes={sizes}
        priority={priority}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* नीचे हल्का अँधेरा, ताकि तस्वीरें page के dark look में घुल जाएँ */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent"
      />
    </div>
  );
}
