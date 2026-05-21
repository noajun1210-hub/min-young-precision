import { Award, CheckCircle2 } from 'lucide-react';
import siteContent from '../data/siteContent.json';

export default function Expertise() {
  const { expertise } = siteContent;

  return (
    <section
      id="expertise"
      className="py-24 bg-brand-dark text-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-brand-accent font-bold uppercase tracking-wider text-sm">
            {expertise.eyebrow}
          </span>

          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            {expertise.title}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Award size={80} />
            </div>

            <h3 className="text-2xl font-bold text-brand-accent mb-4">
              {expertise.mainTitle}
            </h3>

            <p className="text-slate-300 text-lg leading-relaxed mb-6">
              {expertise.mainDescription}
            </p>

            <ul className="space-y-3">
              {expertise.points.map((point, index) => (
                <li key={index} className="flex items-center text-slate-400">
                  <CheckCircle2 size={18} className="mr-2 text-brand-accent" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {expertise.cards.map((card, index) => (
              <div
                key={index}
                className="bg-white/5 p-6 rounded-xl border border-white/10"
              >
                <h4 className="font-bold text-xl mb-2">{card.title}</h4>

                <p className="text-slate-400 text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
