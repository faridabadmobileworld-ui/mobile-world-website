import type { Photo } from "@/data/photos";
import PhotoFrame from "@/components/PhotoFrame";
import Reveal from "@/components/Reveal";

/**
 * दुकान की झलक — तस्वीरों की gallery।
 *
 * तस्वीरें अलग-अलग ऊँचाई की हैं (कुछ खड़ी, कुछ चौड़ी), इसलिए masonry जैसा
 * column layout इस्तेमाल किया है — इससे बीच में खाली जगह नहीं बचती।
 */
export default function PhotoGallery({ photos }: { photos: Photo[] }) {
  return (
    <div className="columns-2 gap-4 sm:columns-3">
      {photos.map((photo, i) => (
        // break-inside-avoid ज़रूरी है, वरना तस्वीर दो columns में बँट जाती है
        <div key={photo.src} className="mb-4 break-inside-avoid">
          <Reveal delay={(i % 3) * 90}>
            <PhotoFrame
              photo={photo}
              sizes="(min-width: 640px) 33vw, 50vw"
              className="tilt-card"
            />
          </Reveal>
        </div>
      ))}
    </div>
  );
}
