import { ShieldCheck, Zap, Cog, Microscope } from 'lucide-react';

const strengths = [
  {
    title: '정밀한 가공 품질',
    desc: '마이크로 단위의 정밀도를 추구하여 완벽한 제품을 납품합니다.',
    icon: <Microscope />,
  },
  {
    title: '현장 경험 기반 제작',
    desc: '수십 년간 쌓아온 노하우로 최적의 솔루션을 제안합니다.',
    icon: <Cog />,
  },
  {
    title: '설계부터 제작까지',
    desc: '설계와 치공구 제작까지 원스톱 대응 시스템을 갖추고 있습니다.',
    icon: <Zap />,
  },
  {
    title: '산업별 최적화',
    desc: '자동차, 반도체 분야별 특성에 맞는 소재와 공법을 적용합니다.',
    icon: <ShieldCheck />,
  },
];

export default function Strengths() {
  return (
    <section id="strengths" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-brand-blue font-bold uppercase tracking-wider text-sm">
          Our Strengths
        </span>

        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-16">
          민영정밀의 경쟁력
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {strengths.map((strength, index) => (
            <div key={index} className="group">
              <div className="w-16 h-16 mx-auto bg-slate-100 text-brand-dark rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {strength.icon}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {strength.title}
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed">
                {strength.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
