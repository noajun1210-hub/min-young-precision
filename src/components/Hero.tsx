import { useEffect, useState } from 'react';
import siteContent from '../data/siteContent.json';

export default function Hero() {
  const { hero } = siteContent;

  const backgroundImagesFromData =
    ((hero as { backgroundImages?: string[] }).backgroundImages || []).filter(Boolean);

  const backgroundImages =
    backgroundImagesFromData.length > 0
      ? backgroundImagesFromData
      : hero.backgroundImage
        ? [hero.backgroundImage]
        : [];

  const slideIntervalMs =
    (hero as { slideIntervalMs?: number }).slideIntervalMs || 4500;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (backgroundImages.length <= 1) return;

    const timer = window.setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, slideIntervalMs);

    return () => window.clearInterval(timer);
  }, [backgroundImages.length, slideIntervalMs]);

  useEffect(() => {
    if (currentImageIndex >= backgroundImages.length) {
      setCurrentImageIndex(0);
    }
  }, [currentImageIndex, backgroundImages.length]);

  const titleParts = hero.highlight
    ? hero.title.split(hero.highlight)
    : [hero.title];

  return (
    <section
      id="top"
      className="relative min-h-[calc(100svh-4rem)] overflow-hidden bg-brand-dark text-white"
    >
      {backgroundImages.length > 0 && (
        <div className="absolute inset-0">
          {backgroundImages.map((image, index) => (
            <img
              key={`${image}-${index}`}
              src={image}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-75' : 'opacity-0'
              }`}
            />
          ))}
        </div>
      )}

      <div className="absolute inset-0 bg-slate-950/45"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_36%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {backgroundImages.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2 px-4">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentImageIndex(index)}
              aria-label={`메인 이미지 ${index + 1} 보기`}
              className={`h-2.5 rounded-full transition-all ${
                index === currentImageIndex
                  ? 'w-8 bg-white shadow'
                  : 'w-2.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}

      {backgroundImages.length > 1 && (
        <div className="absolute right-4 top-20 z-20 rounded-full bg-slate-950/50 px-3 py-1 text-xs font-bold text-white backdrop-blur sm:right-6">
          {currentImageIndex + 1} / {backgroundImages.length}
        </div>
      )}

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="w-full">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-brand-blue sm:text-sm md:text-lg">
            {hero.eyebrow}
          </p>

          <h1 className="mx-auto mt-5 max-w-6xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl md:text-7xl lg:text-8xl">
            {hero.highlight ? (
              <>
                {titleParts[0]}
                <span className="block text-brand-blue sm:inline">
                  {hero.highlight}
                </span>
                {titleParts.slice(1).join(hero.highlight)}
              </>
            ) : (
              hero.title
            )}
          </h1>

          <p className="mx-auto mt-6 max-w-3xl whitespace-pre-line text-base leading-relaxed text-slate-100 sm:text-xl md:text-2xl">
            {hero.description}
          </p>

          <div className="mx-auto mt-10 grid max-w-sm gap-3 sm:flex sm:max-w-none sm:justify-center">
            <a
              href={hero.primaryButton.href}
              className="inline-flex min-h-14 items-center justify-center rounded-xl bg-brand-blue px-8 py-4 text-base font-black text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
            >
              {hero.primaryButton.label}
            </a>

            <a
              href={hero.secondaryButton.href}
              className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/35 bg-white/10 px-8 py-4 text-base font-black text-white backdrop-blur transition hover:bg-white/15"
            >
              {hero.secondaryButton.label}
              <span className="ml-2">›</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
