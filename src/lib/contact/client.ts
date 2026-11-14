/**
 * Progressive enhancement for the contact form. Without JavaScript the form posts normally and
 * the server redirects to /contact/thank-you (success) or returns an error page.
 * With JavaScript it submits via fetch and shows the server's real result inline.
 * A success message is shown ONLY when the server confirms delivery (HTTP 200, ok: true).
 */

type ApiResponse = { ok: boolean; code: string; message: string; errors?: Record<string, string> };

const FIELDS = ['name', 'email', 'organisation', 'enquiryType', 'message', 'consent'] as const;

const LABELS: Record<(typeof FIELDS)[number], string> = {
  name: 'Your name',
  email: 'Email address',
  organisation: 'Organisation',
  enquiryType: 'Enquiry type',
  message: 'Your message',
  consent: 'Privacy notice',
};

function clientErrors(form: HTMLFormElement): Record<string, string> {
  const errors: Record<string, string> = {};
  const get = (n: string) => form.elements.namedItem(n) as HTMLInputElement | null;
  const name = get('name')?.value.trim() ?? '';
  const email = get('email')?.value.trim() ?? '';
  const message = get('message')?.value.trim() ?? '';
  if (name.length < 2) errors.name = 'Please enter your name.';
  if (!email) errors.email = 'Please enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'Please enter a valid email address, like name@example.com.';
  if (!(get('enquiryType')?.value)) errors.enquiryType = 'Please choose what your enquiry is about.';
  if (message.length < 20) errors.message = 'Please tell us a little more (at least 20 characters).';
  if (!get('consent')?.checked) errors.consent = 'Please confirm you have read the privacy collection notice.';
  return errors;
}

export function enhanceContactForm(form: HTMLFormElement) {
  const status = document.querySelector<HTMLElement>('[data-status]');
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]');
  const label = form.querySelector<HTMLElement>('[data-submit-label]');
  const startedAt = form.querySelector<HTMLInputElement>('[data-started-at]');
  if (startedAt) startedAt.value = String(Date.now());

  const showFieldErrors = (errors: Record<string, string>) => {
    for (const f of FIELDS) {
      const input = form.elements.namedItem(f) as HTMLInputElement | null;
      const slot = form.querySelector<HTMLElement>(`[data-error-for="${f}"]`);
      const msg = errors[f];
      if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (slot) {
        slot.textContent = msg ?? '';
        slot.hidden = !msg;
      }
    }
  };

  const showStatus = (tone: 'error' | 'success', text: string, errors?: Record<string, string>) => {
    if (!status) return;
    status.dataset.tone = tone;
    status.setAttribute('role', tone === 'error' ? 'alert' : 'status');
    status.replaceChildren(document.createTextNode(text));
    if (errors && Object.keys(errors).length) {
      const ul = document.createElement('ul');
      for (const [field, msg] of Object.entries(errors)) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${field}`;
        a.textContent = `${LABELS[field as keyof typeof LABELS] ?? field}: ${msg}`;
        a.addEventListener('click', (e) => {
          e.preventDefault();
          (form.elements.namedItem(field) as HTMLElement | null)?.focus();
        });
        li.append(a);
        ul.append(li);
      }
      status.append(ul);
    }
    status.hidden = false;
    status.focus();
  };

  const setBusy = (busy: boolean) => {
    if (!submit || !label) return;
    submit.disabled = busy;
    submit.setAttribute('aria-disabled', String(busy));
    label.textContent = busy ? 'Sending…' : 'Send message';
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const errors = clientErrors(form);
    showFieldErrors(errors);
    if (Object.keys(errors).length) {
      showStatus('error', 'Please check the highlighted fields and try again.', errors);
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new URLSearchParams(new FormData(form) as unknown as Record<string, string>),
      });
      let data: ApiResponse | null = null;
      try {
        data = (await res.json()) as ApiResponse;
      } catch {
        data = null;
      }
      if (res.ok && data?.ok === true) {
        form.reset();
        showFieldErrors({});
        form.hidden = true;
        showStatus('success', data.message);
        return;
      }
      if (data?.errors) showFieldErrors(data.errors);
      showStatus(
        'error',
        data?.message ?? 'Your message could not be sent. Please try again later.',
        data?.errors,
      );
    } catch {
      showStatus('error', 'We could not reach the server, so your message was not sent. Please check your connection and try again.');
    } finally {
      setBusy(false);
    }
  });
}
