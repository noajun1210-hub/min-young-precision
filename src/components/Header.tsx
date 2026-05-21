import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import siteContent from '../data/siteContent.json';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const companyName = siteContent.company.name;
  const highlightedText = companyName.endsWith('정밀') ? '정밀' : companyName;
  const baseText = companyName.endsWith('정밀')
    ? companyName.replace(/정밀$/, '')
    : '';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <a href="#" className="flex items-center" aria-label="홈으로 이동">
            <span
              className={`text-2xl font-bold tracking-tight ${
                scrolled ? 'text-brand-dark' : 'text-white'
              }`}
            >
              {baseText}
              <span className="text-brand-blue">{highlightedText}</span>
            </span>
          </a>

          <nav className="hidden md:flex space-x-8">
            {siteContent.navigation.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-brand-blue ${
                  scrolled ? 'text-slate-700' : 'text-white/90'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={scrolled ? 'text-brand-dark' : 'text-white'}
              aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {siteContent.navigation.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-blue"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
