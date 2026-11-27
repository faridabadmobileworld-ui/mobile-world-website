import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ComparePicker } from '@/components/commerce/ComparePicker';
import { ShareChoice } from '@/components/commerce/ShareChoice';
import { MotionHeading } from '@/components/MotionHeading';
import { publicPhoneGuides } from '@/lib/catalog/guides';
import { publicProducts } from '@/lib/catalog/sanity';
import { sectionNames } from '@/lib/catalog/preferences';
import { visibleSections, specificationSections, extraSpecificationFields } from '@/lib/catalog/core';
import { shoppingCatalogue } from '@/lib/commerce/catalogue';
import { comparisonChoices, comparisonHref } from '@/lib/commerce/comparison';
import { choiceText, exactPrice, lineKey, rupees } from '@/lib/commerce/core';
import { choicePicture, modelHref } from '@/lib/commerce/discovery';
import './compare.css';

export const metadata:Metadata = {title:'Phones की specifications साथ में compare करें',alternates:{canonical:'/compare'},robots:{index:false,follow:true}};

export default async function Compare({searchParams}:{searchParams:Promise<Record<string,string | string[] | undefined>>}) {
  const [params, catalogue, merchant] = await Promise.all([searchParams,shoppingCatalogue(),publicProducts()]);
  const items = catalogue.filter(i => i.kind === 'model').sort((a,b) => a.name.localeCompare(b.name,'en-IN'));
  const products = new Map([...publicPhoneGuides(),...merchant].map(p => [p.id,p]));
  const {choices,invalid} = comparisonChoices(params,items);
  const different = params.different === '1';
  const columns = choices.map(choice => {
    const item = items.find(i => i.id === choice.productId)!;
    const p = products.get(item.id)!;
    const sections = visibleSections(p,p.variants.find(v => v._key === choice.variant));
    const fields = new Map(sections.flatMap(s => s.fields).map(f => [f.key,f]));
    return {item,choice,fields,price:exactPrice(item,choice),picture:choicePicture(item,choice)};
  });
  const groups = specificationSections.map(s => {
    const keys = s.fields.flatMap(f => [f.key, ...extraSpecificationFields.filter(extra => extra.after === f.key && extra.sectionId === s.id).map(e => e.key)]);
    const rows = keys.flatMap(key => {
      const fields = columns.map(c => c.fields.get(key));
      const field = fields.find(f => f !== undefined);
      if (!field) return [];
      const values = fields.map(f => f?.value ?? '');
      if (different && new Set(values.map(v => v.trim().toLowerCase())).size < 2) return [];
      return [{key,label:field.label,values}];
    });
    return {id:s.id,name:sectionNames[s.id] ?? s.title,rows};
  }).filter(s => s.rows.length);
  const url = comparisonHref(choices,different);
  return <div className="wrap ec-page cm-page">
    <nav className="ec-crumb" aria-label="Breadcrumb"><Link href="/">Home</Link> / <Link href="/products">Products</Link> / Compare</nav>
    <MotionHeading as="h1">Phones की तुलना</MotionHeading>
    <p>दो या तीन models चुनिए। एक ही phone के अलग memory options भी साथ देख सकते हैं।</p>
    {invalid && <p className="ec-error" role="status">पुराने link का एक विकल्प बदल गया है। नीचे मौजूदा options चुनिए।</p>}
    <ComparePicker key={url} items={items} initial={choices} different={different}/>
    {columns.length >= 2 && <section aria-labelledby="compare-specs"><header className="cm-tools"><h2 id="compare-specs">Specifications साथ में</h2>
      <Link href={comparisonHref(choices,!different)} scroll={false} className="ec-button ec-secondary">{different ? 'सभी ख़ूबियाँ देखिए' : 'सिर्फ़ अंतर देखिए'}</Link>
      <ShareChoice href={url} name="Mobile World · Phone comparison"/></header>
      <p className="mw-small">खाली जानकारी के लिए “—” दिया है। छोटे screen पर table को दाएँ-बाएँ खिसकाएँ।</p>
      <div className="cm-scroll" tabIndex={0} role="region" aria-label="चुने हुए phones की specification table"><table>
        <caption className="sr">चुने हुए models, variants और उनकी verified specifications</caption>
        <thead><tr><th scope="col">ख़ूबी</th>{columns.map(({item,choice,picture,price}) => <th scope="col" key={lineKey(choice)}>
          <a href={modelHref(item,choice)}><Image src={picture.src} alt={picture.alt} width={160} height={135}/><strong>{item.name}</strong></a>
          <small>{choiceText(item,choice)}</small>
          {price && <small>Official India reference · {rupees(price.amount)} · {price.checkedAt}</small>}
        </th>)}</tr></thead>
        {groups.map(s => <tbody key={s.id}><tr className="cm-group"><th scope="rowgroup" colSpan={columns.length+1}>{s.name}</th></tr>
          {s.rows.map(row => <tr key={row.key}><th scope="row">{row.label}</th>{row.values.map((value,i) => <td key={i}>{value || '—'}</td>)}</tr>)}
        </tbody>)}
      </table></div>
      {!groups.length && <p role="status">इन variants की दर्ज specifications एक जैसी हैं। चुनी हुई पसंद ऊपर दिख रही है।</p>}
    </section>}
  </div>;
}
