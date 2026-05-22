import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import siteContent from '../data/siteContent.json';

export default function Header() {
  const { company, navigation } = siteContent;
  const [isOpen, setIsOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const logoImage = '/minyoung-logo.PNG';

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-28 lg:px-8">
        <a
          href="#top"
          onClick={closeMenu}
          className="flex min-w-0 items-center"
          aria-label={`${company.name} 홈으로 이동`}
        >
          {!logoError ? (
            <img
              src={logoImage}
              alt={`${company.name} 로고`}
              className="h-20 w-auto max-w-[190px] object-contain sm:h-24 sm:max-w-[230px] lg:h-28 lg:max-w-[270px]"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="flex items-center text-2xl font-black tracking-tight text-slate-950">
              <span>{company.name.replace('정밀', '')}</span>
              <span className="text-brand-blue">정밀</span>
            </span>
          )}
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-bold text-slate-700 transition hover:text-brand-blue"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm md:hidden"
          aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-x-0 top-24 z-50 border-b border-slate-200 bg-white shadow-2xl md:hidden lg:top-28">
          <nav className="mx-auto max-w-7xl px-4 py-4">
            <div className="grid gap-2">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="rounded-2xl bg-slate-50 px-4 py-4 text-base font-black text-slate-900 transition active:scale-[0.99]"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <a
              href="#contact"
              onClick={closeMenu}
              className="mt-4 flex items-center justify-center rounded-2xl bg-brand-blue px-5 py-4 text-base font-black text-white shadow-lg shadow-blue-600/20"
            >
              문의하기
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
