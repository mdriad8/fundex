import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

function Privacy() {
  return (
    <div className="pt-20">
      <Helmet>
        <title>Privacy Policy | Fundex Global</title>
        <meta
          name="description"
          content="How Fundex Global Pty Ltd collects, uses and protects personal information submitted through this website."
        />
        <link rel="canonical" href="https://www.fundexglobal.vc/privacy" />
      </Helmet>

      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-light text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-300">Last updated 14 November 2026</p>
        </div>
      </section>

      <section className="py-14 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto space-y-6 text-gray-700 leading-relaxed">
          <p>
            This policy explains how Fundex Global Pty Ltd (ABN 49 694 783 205) ("Fund'ex", "we") handles personal
            information collected through this website. We aim to handle personal information in line with the
            Australian Privacy Principles.
          </p>

          <h2 className="text-2xl font-light text-slate-900 pt-4">What we collect and why</h2>
          <p>
            When you use our contact form we collect your name, email address, company (if provided), the type of
            enquiry and your message. We use this only to read and reply to your enquiry and to keep a record of our
            correspondence. We do not sell personal information or use it for unrelated marketing.
          </p>

          <h2 className="text-2xl font-light text-slate-900 pt-4">Who else sees it</h2>
          <p>
            Service providers that help us run this website and deliver email, including our website host (Vercel)
            and our email delivery provider. These providers may store data outside Australia, including in the
            United States.
          </p>

          <h2 className="text-2xl font-light text-slate-900 pt-4">Website data</h2>
          <p>
            This website does not use advertising or analytics cookies. Our host keeps standard server logs (such as
            IP address and pages requested) to keep the site secure. To prevent spam, the contact form temporarily
            uses a one-way hash of your IP address and email address to limit repeated submissions.
          </p>

          <h2 className="text-2xl font-light text-slate-900 pt-4">Access, correction and complaints</h2>
          <p>
            To access or correct your personal information, or to make a complaint, email{' '}
            <a href="mailto:info@fundexglobal.vc" className="text-teal-700 underline">
              info@fundexglobal.vc
            </a>
            . If you are not satisfied with our response, you can contact the Office of the Australian Information
            Commissioner at{' '}
            <a href="https://www.oaic.gov.au" className="text-teal-700 underline" rel="noopener noreferrer" target="_blank">
              oaic.gov.au
            </a>
            .
          </p>

          <p className="pt-6">
            <Link to="/contact" className="text-teal-700 underline">
              Back to the contact page
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Privacy;
