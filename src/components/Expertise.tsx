import { Award, CheckCircle2 } from 'lucide-react';

export default function Expertise() {
  return (
    <section id="expertise" className="py-24 bg-brand-dark text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-brand-accent font-bold uppercase tracking-wider text-sm">
            Our Expertise
          </span>

          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            차별화된 전문 기술력
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Award size={80} />
            </div>

            <h3 className="text-2xl font-bold text-brand-accent mb-4">
              특허 보유: Collet Chuck 전문 가공
            </h3>

            <p className="text-slate-300 text-lg leading-relaxed mb-6">
              콜렛척 전문 제작 업체로서 독자적인 기술력을 보유하고 있으며,
              특허 출원 및 등록을 통해 고성능 제품을 공급합니다.
            </p>

            <ul className="space-y-3">
              {[
                '고정밀도 공차 유지',
                '내구성 극대화 가공',
                '맞춤형 특수 사양 제작',
                '안정적인 고속 회전 밸런스',
              ].map((item, index) => (
                <li key={index} className="flex items-center text-slate-400">
                  <CheckCircle2 size={18} className="mr-2 text-brand-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              'MCT 가공',
              'CNC 선반 가공',
              '소량 다품종 대응',
              '설계 기반 맞춤 제작',
            ].map((title, index) => (
              <div
                key={index}
                className="bg-white/5 p-6 rounded-xl border border-white/10"
              >
                <h4 className="font-bold text-xl mb-2">{title}</h4>

                <p className="text-slate-400 text-sm leading-relaxed">
                  최적의 가공 공법을 적용하여 고객이 원하는 고품질 결과물을
                  도출합니다.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
