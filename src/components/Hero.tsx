import { ChevronRight } from 'lucide-react';

export default function Hero() {
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
          Precision Machining Standard
        </h2>

        <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          정밀가공의 기준, <span className="text-brand-accent">민영정밀</span>
        </h1>

        <p className="text-lg md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
          자동차 · 반도체 · 정밀기계 부품 가공 전문
          <br className="hidden md:block" />
          최고의 기술력으로 완벽한 품질을 약속합니다.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="#contact"
            className="bg-brand-blue hover:bg-blue-700 text-white px-8 py-4 rounded-md font-bold transition-all transform hover:-translate-y-1 shadow-lg"
          >
            문의하기
          </a>

          <a
            href="#services"
            className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm px-8 py-4 rounded-md font-bold border border-white/30 transition-all flex items-center justify-center"
          >
            사업 분야 보기 <ChevronRight size={20} className="ml-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
