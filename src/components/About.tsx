import siteContent from '../data/siteContent.json';

export default function About() {
  const { about } = siteContent;

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-brand-blue font-bold uppercase tracking-wider text-sm">
              {about.eyebrow}
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-6 whitespace-pre-line leading-tight">
              {about.title}
            </h2>

            <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
              {about.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-slate-100 rounded-xl transform rotate-2 group-hover:rotate-1 transition-transform"></div>

            <div className="relative bg-brand-dark aspect-video rounded-xl shadow-2xl flex items-center justify-center p-8 overflow-hidden">
              <div className="text-center z-10">
                <div className="text-brand-blue font-mono text-5xl mb-4 italic font-black uppercase tracking-tighter">
                  {about.visualTitle}
                </div>

                <div className="text-white/30 tracking-[1em] uppercase text-xs">
                  {about.visualSubtitle}
                </div>
              </div>

              <div className="absolute top-1/2 left-1/2 w-64 h-64 border-2 border-white/5 rounded-full border-dashed animate-spin-slow"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
