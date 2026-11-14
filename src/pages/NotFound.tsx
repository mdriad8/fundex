import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="pt-20">
      <Helmet>
        <title>Page Not Found | Fundex Global</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <section className="relative min-h-[60vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950">
        <div className="text-center">
          <p className="text-teal-300 tracking-widest text-sm mb-4">404</p>
          <h1 className="text-4xl sm:text-5xl font-light text-white mb-6">We couldn't find that page</h1>
          <Link
            to="/"
            className="inline-flex items-center px-7 py-4 bg-teal-700 hover:bg-teal-600 text-white rounded-xl transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}

export default NotFound;
