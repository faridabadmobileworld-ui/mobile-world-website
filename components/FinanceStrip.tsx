import Image from "next/image";
import { financePartners, LOGO_W, LOGO_H } from "@/data/finance";

export function FinanceStrip() {
  return <ul className="mw-finance-partners" aria-label="EMI की सुविधा देने वाली companies">{financePartners.map((f) => <li key={f.name}>{f.logo ? <Image src={f.logo} alt={f.name} width={LOGO_W} height={LOGO_H} sizes="140px" /> : <span>{f.name}</span>}</li>)}</ul>;
}
