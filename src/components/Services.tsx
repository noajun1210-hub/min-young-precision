import { useEffect, useState } from 'react';
import {
  Car,
  Cpu,
  Database,
  Factory,
  Layers,
  PenTool,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import siteContent from '../data/siteContent.json';

const iconMap: Record<string, LucideIcon> = {
  car: Car,
  cpu: Cpu,
  settings: Settings,
  penTool: PenTool,
  layers: Layers,
  database: Database,
};

export default function Services() {
  const { services } = siteContent;
  const serviceImages = ((services as { images?: string[] }).images || []);
  const slideIntervalMs = ((services as { slideIntervalMs?: number }).slideIntervalMs || 4000);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (serviceImages.length <= 1) return;

    const timer = window.setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % serviceImages.length);
    }, slideIntervalMs);

    return () => window.clearInterval(timer);
  }, [serviceImages.length, slideIntervalMs]);

  useEffect(() => {
    if (currentImageIndex >= serviceImages.length) {
      setCurrentImageIndex(0);
    }
  }, [currentImageIndex, serviceImages.length]);

  return (
    <section id="services" className="bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center sm:mb-14">
          <span className="text-sm font-black uppercase tracking-wider text-brand-blue">
            {services.eyebrow}
          </span>

          <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl lg:text-5xl">
            {services.title}
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-10">
          <div className="relative lg:sticky lg:top-24">
            {serviceImages.length > 0 ? (
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-2xl">
                <div className="relative h-[320px] sm:h-[440px] lg:h-[520px]">
                  {serviceImages.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className={`absolute inset-0 transition-opacity duration-700 ${
                        index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <img
                        src={image}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl"
                      />

                      <div className="absolute inset-0 bg-slate-950/25"></div>

                      <img
                        src={image}
                        alt={`민영정밀 사업 분야 이미지 ${index + 1}`}
                        className="relative z-10 h-full w-full object-contain p-2 sm:p-4"
                      />
                    </div>
                  ))}

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 bg-gradient-to-t from-slate-950/55 to-transparent"></div>

                  {serviceImages.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 z-30 flex flex-wrap justify-center gap-2 px-4">
                      {serviceImages.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setCurrentImageIndex(index)}
                          aria-label={`사업 분야 이미지 ${index + 1} 보기`}
                          className={`h-2.5 rounded-full transition-all ${
                            index === currentImageIndex
                              ? 'w-8 bg-white shadow'
                              : 'w-2.5 bg-white/55 hover:bg-white/85'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {serviceImages.length > 1 && (
                    <div className="absolute right-3 top-3 z-30 rounded-full bg-slate-950/60 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                      {currentImageIndex + 1} / {serviceImages.length}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-3xl bg-slate-950 p-8 shadow-2xl sm:min-h-[440px] lg:min-h-[520px]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.35),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.22),transparent_35%)]"></div>

                <div className="relative z-10 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600/20 text-blue-400">
                    <Factory size={42} />
                  </div>

                  <p className="text-sm font-black uppercase tracking-[0.32em] text-blue-400">
                    Min Young Precision
                  </p>

                  <h3 className="mt-4 text-2xl font-black text-white sm:text-3xl">
                    정밀가공 전문 분야
                  </h3>

                  <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
                    관리자 페이지에서 사업 분야 이미지를 등록하면 이 영역에 최대 10장까지 자동 슬라이드로 표시됩니다.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            {services.items.map((item, index) => {
              const Icon = iconMap[item.icon] || Settings;

              return (
                <article
                  key={`${item.title}-${index}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-brand-blue transition group-hover:bg-brand-blue group-hover:text-white">
                    <Icon size={24} />
                  </div>

                  <h3 className="text-lg font-black text-slate-950 sm:text-xl">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
