import { MotionHeading } from "@/components/MotionHeading";
import Image from "next/image";
import Link from "next/link";
import { IconArrow } from "@/components/Icons";
import { modelDisplayName, phoneModels } from "@/data/catalog";
import { phoneGuideLinks } from "@/lib/catalog/guides";
import { campaignIsLive, defaultCampaigns, featuredModelIds, type CampaignSettings } from "@/lib/campaigns/core";
import "./current-offers.css";

export function CurrentOffers({ settings = defaultCampaigns() }: { settings?: CampaignSettings }) {
  const specificationLinks = phoneGuideLinks();
  const models = featuredModelIds.flatMap(id => {
    const model = phoneModels.find(phone => phone.id === id);
    return model && campaignIsLive(settings.items[id]) ? [model] : [];
  });
  if (!models.length) return null;

  return (
    <section id="current-offers" className="current-offers" aria-labelledby="current-offers-title">
      <MotionHeading as="h2" id="current-offers-title">चुनिंदा phones की specifications</MotionHeading>
      <div className="current-offers-grid">
        {models.map(model => {
          const name = modelDisplayName(model);
          return (
            <Link
              key={model.id}
              className={`offer-card offer-${model.brandSlug}`}
              href={specificationLinks[model.id] ?? `/products?model=${model.id}`}
              prefetch={false}
              aria-label={`${name} की specifications देखिए`}
            >
              <div className="offer-image">
                <Image
                  src={model.image}
                  alt={model.imageAlt}
                  fill
                  sizes="(max-width: 700px) 90vw, (max-width: 1200px) 32vw, 380px"
                />
              </div>
              <div className="offer-card-content">
                <h3>{name}</h3>
                <span className="offer-cta">Specifications देखिए <IconArrow /></span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
