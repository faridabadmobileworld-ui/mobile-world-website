import { services } from "@/data/shop";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";

/**
 * Repair, EMI और Exchange — तीन सुविधाएँ।
 *
 * Customer ये तीनों सबसे ज़्यादा पूछता है, इसलिए Home और Products दोनों
 * pages पर दिखती हैं। शर्तें और दरें जान-बूझकर नहीं लिखीं — वो अभी पता
 * नहीं, और गलत लिखने से बेहतर है पूछने को कहना (CLAUDE.md §8)।
 */

const icons: Record<string, React.ReactNode> = {
  // पेचकस — repair के लिए
  repair: (
    <path d="M14.7 6.3a4 4 0 0 1 5 5l-1.6-1.6-2.1.5-.5 2.1 1.6 1.6a4 4 0 0 1-5-5l1.5 1.5 2.1-.5.5-2.1-1.5-1.5ZM11 12.5 4.6 18.9a1.5 1.5 0 0 0 2.1 2.1l6.4-6.4" />
  ),
  // नोट — EMI के लिए
  emi: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 12h.01M18 12h.01" />
    </>
  ),
  // अदला-बदली के तीर — exchange के लिए
  exchange: <path d="M4 8h13l-3-3m6 11H7l3 3" />,
};

export default function ServicesSection({
  heading = "सुविधाएँ",
  accent,
}: {
  heading?: string;
  accent?: string;
}) {
  return (
    <>
      <Reveal>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {heading}
          {accent && (
            <>
              {" "}
              <span className="bg-gradient-to-r from-brand to-electric bg-clip-text text-transparent">
                {accent}
              </span>
            </>
          )}
        </h2>
        <p className="mt-3 text-muted">
          सामान बेचने के अलावा ये तीन सुविधाएँ भी दुकान पर मिलती हैं
        </p>
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {services.map((service, i) => (
          <Reveal key={service.slug} delay={i * 100}>
            <TiltCard>
              <div className="glow-ring flex h-full flex-col rounded-2xl bg-gradient-to-br from-surface to-ink-2 p-6 transition-shadow duration-300 hover:shadow-[0_0_40px_-10px] hover:shadow-electric/40">
                <span className="float-slow mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand/25 to-electric/10 text-electric">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="h-5 w-5"
                  >
                    {icons[service.slug]}
                  </svg>
                </span>
                <h3 className="text-lg font-bold text-cream">{service.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {service.description}
                </p>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </>
  );
}
