import { Cpu, Settings, Car, PenTool, Database, Layers } from 'lucide-react';
import siteContent from '../data/siteContent.json';

const iconMap = {
  car: <Car />,
  cpu: <Cpu />,
  settings: <Settings />,
  penTool: <PenTool />,
  database: <Database />,
  layers: <Layers />,
};

export default function Services() {
  const { services } = siteContent;

  return (
    <section id="services" className="py-24 bg-subtle-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-brand-blue font-bold uppercase tracking-wider text-sm">
          {services.eyebrow}
        </span>

        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-16">
          {services.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {services.items.map((service, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 bg-slate-50 text-brand-blue rounded-lg flex items-center justify-center mb-6 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                {iconMap[service.icon as keyof typeof iconMap] ?? <Settings />}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {service.title}
              </h3>

              <p className="text-slate-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
