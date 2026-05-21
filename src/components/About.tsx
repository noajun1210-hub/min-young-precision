export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-brand-blue font-bold uppercase tracking-wider text-sm">
              About Us
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-6">
              숙련된 기술과 신뢰를 바탕으로
              <br />
              미래를 가공합니다.
            </h2>

            <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
              <p>
                충남 천안에 위치한 <strong>민영정밀</strong>은 자동차,
                반도체, 정밀기계 분야의 핵심 부품 가공과 치공구 및 기구
                제작을 수행하는 정밀가공 전문 기업입니다.
              </p>

              <p>
                단순한 가공을 넘어 설계 의도를 정확히 파악하고, MCT 및 CNC
                선반 가공의 풍부한 경험을 바탕으로 최적의 솔루션을
                제공합니다.
              </p>

              <p>
                특히 <strong>콜렛척(Collet Chuck) 전문 가공</strong>에 있어
                특허 출원 및 등록을 통해 기술 전문성을 대외적으로 인정받고
                있습니다.
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-slate-100 rounded-xl transform rotate-2 group-hover:rotate-1 transition-transform"></div>

            <div className="relative bg-brand-dark aspect-video rounded-xl shadow-2xl flex items-center justify-center p-8 overflow-hidden">
              <div className="text-center z-10">
                <div className="text-brand-blue font-mono text-5xl mb-4 italic font-black uppercase tracking-tighter">
                  Min Young
                </div>
                <div className="text-white/30 tracking-[1em] uppercase text-xs">
                  Precision
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
