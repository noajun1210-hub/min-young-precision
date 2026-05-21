import { Cpu, Settings, Car, PenTool, Database, Layers } from 'lucide-react';

const services = [
  {
    title: '자동차 부품 가공',
    desc: '고정밀 엔진 및 변속기 관련 부품 및 전장 부품 가공',
    icon: <Car />,
  },
  {
    title: '반도체 부품 가공',
    desc: '고순도 가공이 요구되는 반도체 장비 핵심 파츠 제작',
    icon: <Cpu />,
  },
  {
    title: '정밀기계 부품 가공',
    desc: '산업용 로봇 및 자동화 설비 정밀 부품 제작',
    icon: <Settings />,
  },
  {
    title: '설계 및 치공구 제작',
    desc: '생산 효율 극대화를 위한 맞춤형 치공구 설계/제작',
    icon: <PenTool />,
  },
  {
    title: '기구 제작',
    desc: '산업용 기구 및 프로토타입 정밀 제작',
    icon: <Layers />,
  },
  {
    title: 'MCT / CNC 가공',
    desc: '최신 설비를 통한 복합 정밀 가공 및 대량 대응',
    icon: <Database />,
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-subtle-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-brand-blue font-bold uppercase tracking-wider text-sm">
          Business Fields
        </span>

        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-16">
          주요 사업 분야
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 bg-slate-50 text-brand-blue rounded-lg flex items-center justify-center mb-6 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                {service.icon}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {service.title}
              </h3>

              <p className="text-slate-600 leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
