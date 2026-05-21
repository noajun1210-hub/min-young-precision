import { ChevronRight } from 'lucide-react';
import siteContent from '../data/siteContent.json';

export default function Hero() {
  const { hero } = siteContent;
  const titleParts = hero.title.split(hero.highlight);

  return (
    <section className="relative h-screen flex items-center justify-center bg-metal-gradient overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      ></div>

      <div className="relative z-10 text-center px-4 animate-fade-in">
        <h2 className="text-brand-blue font-bold tracking-widest mb-4 text-lg md:text-xl uppercase">
          {hero.eyebrow}
        </h2>

        <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          {titleParts[0]}
          <span className="text-brand-accent">{hero.highlight}</span>
          {titleParts[1]}
        </h1>

        <p className="text-lg md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto font-light leading-relaxed whitespace-pre-line">
          {hero.description}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href={hero.primaryButton.href}
            className="bg-brand-blue hover:bg-blue-700 text-white px-8 py-4 rounded-md font-bold transition-all transform hover:-translate-y-1 shadow-lg"
          >
            {hero.primaryButton.label}
          </a>

          <a
            href={hero.secondaryButton.href}
            className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm px-8 py-4 rounded-md font-bold border border-white/30 transition-all flex items-center justify-center"
          >
            {hero.secondaryButton.label}
            <ChevronRight size={20} className="ml-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
