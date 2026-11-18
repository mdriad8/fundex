import { Navigate, useParams } from 'react-router-dom';
import ApplicationForm from './hackathon/ApplicationForm';
import { EventBar, Meta, PageHero, Tag } from './hackathon/Layout';
import { forms, type FormKind } from './hackathon/applications';

const kinds: FormKind[] = ['club', 'community', 'university', 'speaker'];

export default function HackathonApply() {
  const { kind } = useParams();
  if (kind === 'ambassador') return <Navigate to="/hackathon/ambassadors#apply" replace />;
  if (!kinds.includes(kind as FormKind)) return <Navigate to="/hackathon/contribute" replace />;
  const def = forms[kind as FormKind];

  return (
    <div className="pt-16 sm:pt-20">
      <Meta title={`Apply: ${def.title} | Beyond the Prompt 2027`} description={`${def.short} Apply to take part in Beyond the Prompt 2027, a free AI & automation conference and 48-hour hackathon.`} path={`/hackathon/apply/${def.kind}`} />
      <EventBar />
      <PageHero crumb={def.title} eyebrow={`Get involved · ${def.title}`} title={def.title} intro={<p>{def.short}</p>} />
      <section className="hk-paper px-5 py-16 sm:px-8 sm:py-24" aria-labelledby="form-title">
        <div className="mx-auto max-w-4xl">
          <Tag>Apply</Tag>
          <h2 id="form-title" className="font-display text-3xl font-black uppercase tracking-tight text-slate-900 sm:text-5xl">Tell us about you</h2>
          <p className="mt-4 mb-10 text-lg text-slate-600">{def.intro} Fields marked * are required.</p>
          <ApplicationForm key={def.kind} def={def} />
        </div>
      </section>
    </div>
  );
}
