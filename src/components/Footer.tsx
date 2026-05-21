import siteContent from '../data/siteContent.json';

export default function Footer() {
  const { company, footer } = siteContent;
  const currentYear = new Date().getFullYear();

  const companyName = company.name;
  const highlightedText = companyName.endsWith('정밀') ? '정밀' : companyName;
  const baseText = companyName.endsWith('정밀')
    ? companyName.replace(/정밀$/, '')
    : '';

  return (
    <footer className="bg-white py-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-4 md:space-y-0">
        <div>
          <div className="text-xl font-bold text-brand-dark mb-1">
            {baseText}
            <span className="text-brand-blue">{highlightedText}</span>
          </div>

          <p className="text-slate-500 text-xs uppercase tracking-tighter font-medium italic">
            {company.tagline}
          </p>
        </div>

        <div className="text-slate-500 text-sm">
          <p className="mb-1">
            대표 : {company.representative} | 이메일 : {company.email}
          </p>

          <p>
            © {currentYear} {company.englishName}. {footer.copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}
