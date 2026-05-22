import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import siteContent from '../data/siteContent.json';

export default function Header() {
  const { company, navigation } = siteContent;
  const [isOpen, setIsOpen] = useState(false);

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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#top"
          onClick={closeMenu}
          className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-950"
          aria-label={`${company.name} 홈으로 이동`}
        >
          <span>{company.name.replace('정밀', '')}</span>
          <span className="text-brand-blue">정밀</span>
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
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm md:hidden"
          aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-x-0 top-16 z-50 border-b border-slate-200 bg-white shadow-2xl md:hidden">
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
