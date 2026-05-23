import siteContent from '../data/siteContent.json';

const seoLinks = [
  {
    label: '민영정밀 아산',
    href: '/company',
  },
  {
    label: '아산 정밀가공',
    href: '/precision-machining',
  },
  {
    label: 'MCT · CNC 가공',
    href: '/mct-cnc',
  },
  {
    label: '콜렛척 가공',
    href: '/collet-chuck',
  },
  {
    label: '자동차 · 반도체 부품',
    href: '/automotive-semiconductor',
  },
  {
    label: '오시는 길',
    href: '#location',
  },
  {
    label: '문의하기',
    href: '#contact',
  },
];

export default function Footer() {
  const { company, footer } = siteContent;
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';

  const addressKeyword = `${company.name} ${company.address}`;

  const naverMapUrl = `https://map.naver.com/p/search/${encodeURIComponent(
    addressKeyword
  )}`;

  const googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    addressKeyword
  )}`;

  function getSectionHref(href: string) {
    if (!href.startsWith('#')) {
      return href;
    }

    if (currentPath === '/') {
      return href;
    }

    return `/${href}`;
  }

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div className="text-center lg:text-left">
            <a
              href="/"
              className="inline-flex items-center text-2xl font-black tracking-tight text-slate-950"
            >
              <span>{company.name.replace('정밀', '')}</span>
              <span className="text-brand-blue">정밀</span>
            </a>

            <p className="mt-2 text-xs font-medium uppercase italic tracking-tight text-slate-500 sm:text-sm">
              {company.tagline}
            </p>

            <div className="mt-5 text-sm leading-relaxed text-slate-500">
              <p>대표 : {company.representative}</p>

              {company.phone && <p className="mt-1">전화 : {company.phone}</p>}

              {company.email && (
                <p className="mt-1 break-all">이메일 : {company.email}</p>
              )}

              {company.address && (
                <p className="mt-1 font-bold text-slate-600">
                  주소 : {company.address}
                </p>
              )}
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:max-w-md">
              <a
                href={naverMapUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-green-600 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-green-700"
              >
                네이버지도
              </a>

              <a
                href={googleMapUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                구글맵
              </a>
            </div>
          </div>

          <div className="text-center lg:text-right">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-slate-400">
              Quick Links
            </p>

            <nav className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-end">
              {seoLinks.map((link) => (
                <a
                  key={`${link.label}-${link.href}`}
                  href={getSectionHref(link.href)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <p className="mt-6 text-sm leading-relaxed text-slate-500">
              © 2026 {company.englishName}. {footer.copyrightText}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
