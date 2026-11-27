import { MotionHeading } from "@/components/MotionHeading";
import Image from "next/image";
import { IconArrow } from "@/components/Icons";
import { catalogueGuidePath, modelDisplayName, phoneModels } from "@/data/catalog";
import priceReferences from '@/data/phone-reference-prices.json';
import { rupees } from '@/lib/commerce/core';
import { publicPhoneGuides } from "@/lib/catalog/guides";
import { campaignIsLive, defaultCampaigns, featuredModelIds, type CampaignSettings } from "@/lib/campaigns/core";
import "./current-offers.css";

export function CurrentOffers({ settings = defaultCampaigns() }: { settings?: CampaignSettings }) {
  const guides = new Map(publicPhoneGuides().map(p => [p.id,p]));
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
          const guide = guides.get(model.id);
          const references = guide ? priceReferences[guide.slug as keyof typeof priceReferences] : undefined;
          const reference = references?.[0];
          const name = modelDisplayName(model);
          return (
            <a
              key={model.id}
              className={`offer-card offer-${model.brandSlug}`}
              href={guide ? '/phones/' + guide.slug : catalogueGuidePath(model.id)}
              aria-label={`${name} की specifications देखिए`}
            >
              <div className="offer-image">
                <Image
                  src={guide?.image ?? model.image}
                  alt={guide?.imageAlt ?? model.imageAlt}
                  fill
                  sizes="(max-width: 700px) 90vw, (max-width: 1200px) 32vw, 380px"
                />
              </div>
              <div className="offer-card-content">
                <h3>{name}</h3>
                {reference && <div className="offer-reference"><strong>{rupees(reference.amount)}</strong><span>Official India reference · {reference.checkedAt}</span>
                  <small>{[reference.ram && reference.ram + ' RAM',reference.storage,reference.colour].filter(Boolean).join(' · ')}</small></div>}
                <span className="offer-cta">Specifications देखिए <IconArrow /></span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
