import { Image as ImageIcon } from 'lucide-react';
import siteContent from '../data/siteContent.json';

export default function Achievements() {
  const { achievements } = siteContent;

  const allImages = achievements.tabs.flatMap((tab) =>
    (tab.images || []).map((image, index) => ({
      image,
      category: tab.label,
      title: `${tab.label} 자료 ${index + 1}`,
    }))
  );

  return (
    <section id="achievements" className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-14">
          <span className="text-brand-blue font-bold uppercase tracking-[0.35em] text-xs md:text-sm">
            CERTIFICATES & AWARDS
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
            기술력과 신뢰를 증명하는 자료
          </h2>

          <p className="mt-5 max-w-3xl mx-auto text-slate-600 leading-relaxed">
            민영정밀의 특허, 기술등록, 인증, 상패 및 주요 성과 자료를 한눈에 확인하실 수 있습니다.
          </p>
        </div>

        {allImages.length > 0 ? (
          <div className="relative">
            <div
              className={`flex snap-x snap-mandatory gap-8 overflow-x-auto pb-8 ${
                allImages.length === 1 ? 'justify-center' : ''
              }`}
            >
              {allImages.map((item, index) => (
                <a
                  key={`${item.image}-${index}`}
                  href={item.image}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${item.category} 이미지 ${index + 1} 크게 보기`}
                  className="group block w-[86vw] max-w-[620px] shrink-0 snap-center sm:w-[520px] lg:w-[560px] xl:w-[600px]"
                >
                  <img
                    src={item.image}
                    alt={`${item.category} 이미지 ${index + 1}`}
                    className="block h-auto w-full rounded-2xl border border-slate-200 bg-white shadow-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl"
                  />
                </a>
              ))}
            </div>

            {allImages.length > 1 && (
              <p className="mt-1 text-center text-xs font-medium text-slate-400">
                좌우로 스크롤하면 모든 자료를 크게 확인할 수 있습니다.
              </p>
            )}
          </div>
        ) : (
          <div className="flex min-h-[360px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white text-center">
            <div className="px-6">
              <ImageIcon size={44} className="mx-auto text-slate-400" />

              <p className="mt-4 text-lg font-bold text-slate-800">
                아직 등록된 이미지가 없습니다.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                관리자 페이지에서 특허증, 등록증, 상패, 인증서 이미지를 추가하면 이곳에 표시됩니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
