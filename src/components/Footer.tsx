import siteContent from '../data/siteContent.json';

export default function Footer() {
  const { company, footer } = siteContent;

  return (
    <footer className="border-t border-slate-200 bg-white py-10">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 text-center sm:px-6 lg:grid-cols-2 lg:px-8 lg:text-left">
        <div>
          <a href="#top" className="inline-flex items-center text-2xl font-black tracking-tight text-slate-950">
            <span>{company.name.replace('정밀', '')}</span>
            <span className="text-brand-blue">정밀</span>
          </a>

          <p className="mt-2 text-xs font-medium uppercase italic tracking-tight text-slate-500 sm:text-sm">
            {company.tagline}
          </p>
        </div>

        <div className="text-sm leading-relaxed text-slate-500 lg:text-right">
          <p>
            대표 : {company.representative}
            {company.email && <> <span className="mx-2 hidden sm:inline">|</span><br className="sm:hidden" /> 이메일 : {company.email}</>}
          </p>

          {company.address && <p className="mt-1">{company.address}</p>}

          <p className="mt-2">
            © 2026 {company.englishName}. {footer.copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}
