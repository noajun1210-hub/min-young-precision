import { useEffect, useState } from 'react';
import siteContent from '../data/siteContent.json';

export default function About() {
  const { about } = siteContent;
  const images = about.images || [];
  const slideIntervalMs = about.slideIntervalMs || 4000;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = window.setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, slideIntervalMs);

    return () => window.clearInterval(timer);
  }, [images.length, slideIntervalMs]);

  useEffect(() => {
    if (currentImageIndex >= images.length) {
      setCurrentImageIndex(0);
    }
  }, [currentImageIndex, images.length]);

  const currentImage = images[currentImageIndex];

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
            <div className="absolute -inset-4 bg-slate-100 rounded-3xl transform rotate-2 group-hover:rotate-1 transition-transform"></div>

            {images.length > 0 ? (
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-2xl">
                <div className="relative h-[420px] md:h-[520px]">
                  {images.map((image, index) => (
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

                      <div className="absolute inset-0 bg-white/35"></div>

                      <img
                        src={image}
                        alt={`민영정밀 회사소개 이미지 ${index + 1}`}
                        className="relative z-10 h-full w-full object-contain p-3 md:p-4"
                      />
                    </div>
                  ))}

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-slate-950/45 to-transparent"></div>

                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-2 px-4">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setCurrentImageIndex(index)}
                          aria-label={`이미지 ${index + 1} 보기`}
                          className={`h-2.5 rounded-full transition-all ${
                            index === currentImageIndex
                              ? 'w-8 bg-white shadow'
                              : 'w-2.5 bg-white/55 hover:bg-white/85'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {images.length > 1 && (
                    <div className="absolute right-4 top-4 z-30 rounded-full bg-slate-950/60 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  )}
                </div>

                {currentImage && (
                  <div className="border-t border-slate-200 bg-white px-5 py-4">
                    <p className="text-sm font-bold text-slate-900">
                      민영정밀 현장 및 주요 자료
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      이미지 전체가 보이도록 표시하고, 남는 공간은 같은 이미지를 흐림 배경으로 채워 자연스럽게 보이도록 처리했습니다.
                    </p>
                  </div>
                )}
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
