import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { APPLY_ENDPOINT, CONTACT_EMAIL, allFields, validate, type Field, type FormDef } from './applications';

type Values = Record<string, string | boolean | string[]>;
type State = { kind: 'idle' } | { kind: 'sending' } | { kind: 'done'; id: string } | { kind: 'error'; message: string };

const ERRORS: Record<string, string> = {
  invalid: 'Some required details are missing. Please check the form and try again.',
  'rate-limited': 'Too many applications have been sent from this email recently. Please try again in an hour.',
  rejected: 'We could not accept this submission. Please wait a few seconds and try again.',
};

const inputCls =
  'w-full rounded-xl border-2 border-slate-900 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-teal-300/60 aria-[invalid=true]:border-rose-600';

function FieldInput({ f, value, onChange, error }: { f: Field; value: Values[string] | undefined; onChange: (v: Values[string]) => void; error?: string }) {
  const id = `f-${f.name}`;
  const describedBy = [f.help ? `${id}-help` : '', error ? `${id}-err` : ''].filter(Boolean).join(' ') || undefined;
  const common = { id, name: f.name, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy } as const;

  if (f.type === 'checkbox') {
    return (
      <div className="sm:col-span-2">
        <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-slate-700">
          <input {...common} type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-teal-600" />
          <span>
            {f.label}
            {f.required && <span className="text-rose-600"> *</span>}
          </span>
        </label>
        {error && <p id={`${id}-err`} className="mt-1 pl-8 text-sm text-rose-700">{error}</p>}
      </div>
    );
  }

  const label = (
    <span className="mb-2 block font-semibold text-slate-900">
      {f.label}
      {f.required ? <span className="text-rose-600"> *</span> : <span className="font-normal text-slate-500"> (optional)</span>}
    </span>
  );

  let control;
  if (f.type === 'textarea') {
    control = <textarea {...common} rows={4} maxLength={f.max} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} className={inputCls} placeholder={f.placeholder} />;
  } else if (f.type === 'select') {
    control = (
      <select {...common} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} className={inputCls}>
        <option value="">Choose…</option>
        {f.options!.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    );
  } else if (f.type === 'multi') {
    const arr = Array.isArray(value) ? value : [];
    return (
      <fieldset className="sm:col-span-2" aria-describedby={describedBy}>
        <legend className="mb-2 block font-semibold text-slate-900">
          {f.label}
          {f.required && <span className="text-rose-600"> *</span>}
        </legend>
        <div className="flex flex-wrap gap-2">
          {f.options!.map((o) => {
            const on = arr.includes(o);
            return (
              <label key={o} className={`cursor-pointer rounded-full border-2 px-4 py-2 text-sm transition-colors ${on ? 'border-slate-900 bg-teal-300 text-slate-950' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-900'}`}>
                <input type="checkbox" className="sr-only" checked={on} onChange={() => onChange(on ? arr.filter((x) => x !== o) : [...arr, o])} />
                {o}
              </label>
            );
          })}
        </div>
        {f.help && <p id={`${id}-help`} className="mt-2 text-sm text-slate-500">{f.help}</p>}
        {error && <p id={`${id}-err`} className="mt-1 text-sm text-rose-700">{error}</p>}
      </fieldset>
    );
  } else {
    control = (
      <input
        {...common}
        type={f.type === 'email' ? 'email' : f.type === 'url' ? 'url' : 'text'}
        inputMode={f.type === 'url' ? 'url' : undefined}
        autoComplete={f.name === 'fullName' ? 'name' : f.name === 'email' ? 'email' : f.name === 'country' ? 'country-name' : f.name === 'city' ? 'address-level2' : undefined}
        maxLength={f.max}
        value={(value as string) ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
        placeholder={f.placeholder}
      />
    );
  }

  return (
    <div className={f.half ? '' : 'sm:col-span-2'}>
      <label htmlFor={id}>{label}</label>
      {control}
      {f.help && <p id={`${id}-help`} className="mt-2 text-sm text-slate-500">{f.help}</p>}
      {error && <p id={`${id}-err`} className="mt-1 text-sm text-rose-700">{error}</p>}
    </div>
  );
}

export default function ApplicationForm({ def }: { def: FormDef }) {
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<State>({ kind: 'idle' });
  const startedAt = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (state.kind === 'done') doneRef.current?.focus();
  }, [state]);

  const set = (name: string) => (v: Values[string]) => {
    setValues((s) => ({ ...s, [name]: v }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
  };

  const fields = allFields(def);
  const consentStart = fields.findIndex((f) => f.name === 'adult');

  async function submit(e: FormEvent) {
    e.preventDefault();
    const errs = Object.fromEntries(Object.entries(validate(def, values)).filter(([, v]) => v));
    setErrors(errs);
    if (Object.keys(errs).length) {
      setState({ kind: 'idle' });
      requestAnimationFrame(() => {
        summaryRef.current?.focus();
        document.getElementById(`f-${Object.keys(errs)[0]}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      return;
    }
    if (!APPLY_ENDPOINT) {
      setState({ kind: 'error', message: `Online applications aren’t switched on yet. Please email ${CONTACT_EMAIL} and we’ll get back to you.` });
      return;
    }
    setState({ kind: 'sending' });
    try {
      // text/plain keeps this a "simple" request, which Google Apps Script web apps accept cross-origin.
      const res = await fetch(APPLY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ kind: def.kind, values, startedAt: startedAt.current, website: honeypot.current?.value ?? '' }),
      });
      const json = (await res.json()) as { ok?: boolean; id?: string; code?: string };
      if (json.ok && json.id) {
        setState({ kind: 'done', id: json.id });
        return;
      }
      setState({ kind: 'error', message: ERRORS[json.code ?? ''] ?? `Something went wrong on our side, so your application was not saved. Please try again later or email ${CONTACT_EMAIL}.` });
    } catch {
      setState({ kind: 'error', message: `We couldn’t confirm that your application was received. Please wait a few minutes before trying again, or email ${CONTACT_EMAIL}.` });
    }
  }

  if (state.kind === 'done') {
    return (
      <div ref={doneRef} tabIndex={-1} role="status" className="rounded-3xl border-2 border-slate-900 bg-white p-8 sm:p-10 shadow-[8px_8px_0_#14b8a6] focus:outline-none">
        <CheckCircle2 className="text-teal-600" size={40} />
        <h3 className="mt-4 font-display text-3xl font-black uppercase tracking-tight text-slate-900">Application received</h3>
        <p className="mt-3 text-lg text-slate-700">
          Thank you. Your reference is <span className="font-mono font-bold text-slate-900">{state.id}</span>. We review every application personally and will reply by email within about a week.
        </p>
        <Link to="/hackathon" className="mt-6 inline-flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-wider text-teal-700 hover:text-teal-900">
          Back to Beyond the Prompt <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <form noValidate onSubmit={submit} className="relative rounded-3xl border-2 border-slate-900 bg-white p-6 sm:p-10 shadow-[8px_8px_0_#020617]">
      <div ref={summaryRef} tabIndex={-1} className="focus:outline-none">
        {errorCount > 0 && (
          <p role="alert" className="mb-6 rounded-xl border-2 border-rose-600 bg-rose-50 px-4 py-3 text-rose-800">
            Please check {errorCount === 1 ? 'the highlighted field' : `the ${errorCount} highlighted fields`}.
          </p>
        )}
      </div>

      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {fields.slice(0, consentStart).map((f) => (
          <FieldInput key={f.name} f={f} value={values[f.name]} onChange={set(f.name)} error={errors[f.name]} />
        ))}
      </div>

      <div className="mt-10 grid gap-4 border-t-2 border-dashed border-slate-200 pt-8">
        {fields.slice(consentStart).map((f) => (
          <FieldInput key={f.name} f={f} value={values[f.name]} onChange={set(f.name)} error={errors[f.name]} />
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-slate-50 p-5 text-sm leading-relaxed text-slate-600">
        <p className="font-semibold text-slate-800">Collection notice</p>
        <p className="mt-1">
          Fundex Global Pty Ltd (Fund&rsquo;ex) collects these details to assess your application and to contact you about Beyond the Prompt 2027. They are stored in Fund&rsquo;ex&rsquo;s Google Workspace, which may hold data outside Australia. We never share applicant details with sponsors, and we only publish your name, photo or logo with your permission. You can ask to see, correct or delete your details at any time by emailing{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-teal-800 underline">{CONTACT_EMAIL}</a>. More in our{' '}
          <Link to="/privacy" className="font-semibold text-teal-800 underline">Privacy Policy</Link>.
        </p>
      </div>

      {state.kind === 'error' && (
        <p role="alert" className="mt-6 rounded-xl border-2 border-rose-600 bg-rose-50 px-4 py-3 text-rose-800">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={state.kind === 'sending'}
        className="group mt-8 inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-950 bg-teal-400 px-7 py-4 font-mono text-sm sm:text-base font-bold uppercase tracking-wider text-slate-950 shadow-[6px_6px_0_#020617] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_#020617] disabled:opacity-60"
      >
        {state.kind === 'sending' ? (
          <>
            <Loader2 className="animate-spin" size={18} /> Sending…
          </>
        ) : (
          <>
            Submit application <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} />
          </>
        )}
      </button>
    </form>
  );
}
