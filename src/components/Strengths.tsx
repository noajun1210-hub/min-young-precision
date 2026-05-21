import { ShieldCheck, Zap, Cog, Microscope } from 'lucide-react';
import siteContent from '../data/siteContent.json';

const iconMap = {
  microscope: <Microscope />,
  cog: <Cog />,
  zap: <Zap />,
  shieldCheck: <ShieldCheck />,
};

export default function Strengths() {
  const { strengths } = siteContent;

  return (
    <section id="strengths" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-brand-blue font-bold uppercase tracking-wider text-sm">
          {strengths.eyebrow}
        </span>

        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-16">
          {strengths.title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {strengths.items.map((strength, index) => (
            <div key={index} className="group">
              <div className="w-16 h-16 mx-auto bg-slate-100 text-brand-dark rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {iconMap[strength.icon as keyof typeof iconMap] ?? <ShieldCheck />}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {strength.title}
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed">
                {strength.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
