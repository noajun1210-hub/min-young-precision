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

  return (
    <section id="about" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <span className="text-sm font-black uppercase tracking-wider text-brand-blue">
              {about.eyebrow}
            </span>

            <h2 className="mt-3 whitespace-pre-line text-3xl font-black leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
              {about.title}
            </h2>

            <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              {about.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-3xl bg-slate-100 sm:-inset-4"></div>

            {images.length > 0 ? (
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-2xl">
                <div className="relative h-[340px] sm:h-[440px] lg:h-[520px]">
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
                        className="relative z-10 h-full w-full object-contain p-2 sm:p-4"
                      />
                    </div>
                  ))}

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 bg-gradient-to-t from-slate-950/45 to-transparent"></div>

                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 z-30 flex flex-wrap justify-center gap-2 px-4">
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
                    <div className="absolute right-3 top-3 z-30 rounded-full bg-slate-950/60 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl bg-brand-dark p-8 shadow-2xl">
                <div className="relative z-10 text-center">
                  <div className="mb-4 font-mono text-4xl font-black uppercase italic tracking-tighter text-brand-blue sm:text-5xl">
                    {about.visualTitle}
                  </div>

                  <div className="text-xs uppercase tracking-[0.8em] text-white/30">
                    {about.visualSubtitle}
                  </div>
                </div>

                <div className="absolute left-1/2 top-1/2 h-64 w-64 rounded-full border-2 border-dashed border-white/5"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
