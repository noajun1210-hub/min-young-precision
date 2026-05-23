import { ExternalLink, MapPin } from 'lucide-react';
import siteContent from '../data/siteContent.json';

export default function NaverLocation() {
  const { company } = siteContent;

  const addressKeyword = `${company.name} ${company.address}`;

  const naverMapUrl = `https://map.naver.com/p/search/${encodeURIComponent(
    addressKeyword
  )}`;

  const googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    addressKeyword
  )}`;

  return (
    <section id="location" className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-600">
              Location
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              오시는 길
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              민영정밀은 충청남도 아산시에 위치한 정밀가공 전문 기업입니다.
              방문 전 연락 주시면 더욱 정확하게 안내해 드리겠습니다.
            </p>

            <div className="mt-7 rounded-3xl bg-slate-50 p-5">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white">
                  <MapPin size={24} />
                </div>

                <div>
                  <p className="text-sm font-black text-slate-500">주소</p>
                  <p className="mt-1 text-lg font-black leading-relaxed text-slate-950">
                    {company.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                href={naverMapUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-6 py-4 text-base font-black text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700"
              >
                네이버지도에서 보기
                <ExternalLink size={18} />
              </a>

              <a
                href={googleMapUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-base font-black text-slate-800 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                구글맵에서 보기
                <ExternalLink size={18} />
              </a>
            </div>
          </div>

          <a
            href={naverMapUrl}
            target="_blank"
            rel="noreferrer"
            className="group relative min-h-[340px] overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-2xl"
            aria-label="네이버지도에서 민영정밀 위치 보기"
          >
            <div className="absolute inset-0 bg-slate-100">
              <div className="absolute inset-0 opacity-70">
                <div className="h-full w-full bg-[linear-gradient(to_right,rgba(148,163,184,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.25)_1px,transparent_1px)] bg-[size:42px_42px]" />
              </div>

              <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/10" />
              <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/15" />
              <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/20" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-600 text-white shadow-2xl shadow-green-600/30 transition group-hover:scale-110">
                  <MapPin size={38} />
                </div>

                <div className="mt-6 rounded-3xl bg-white/95 px-6 py-5 shadow-xl backdrop-blur">
                  <p className="text-2xl font-black text-slate-950">
                    {company.name}
                  </p>

                  <p className="mt-2 max-w-md text-sm font-bold leading-relaxed text-slate-600">
                    {company.address}
                  </p>

                  <p className="mt-4 text-sm font-black text-green-600">
                    클릭하면 네이버지도로 이동합니다
                  </p>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
