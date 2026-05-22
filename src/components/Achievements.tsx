import { useState } from 'react';
import { Award, FileCheck2, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import siteContent from '../data/siteContent.json';

export default function Achievements() {
  const { achievements } = siteContent;
  const [activeTabId, setActiveTabId] = useState(
    achievements.tabs[0]?.id || 'patents'
  );

  const activeTab =
    achievements.tabs.find((tab) => tab.id === activeTabId) ||
    achievements.tabs[0];

  const tabIconMap = {
    patents: <FileCheck2 size={18} />,
    awards: <Award size={18} />,
    records: <ShieldCheck size={18} />,
  };

  if (!activeTab) {
    return null;
  }

  return (
    <section id="achievements" className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-brand-blue font-bold uppercase tracking-wider text-sm">
            {achievements.eyebrow}
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            {achievements.title}
          </h2>

          <p className="mt-5 max-w-3xl mx-auto text-slate-600 leading-relaxed">
            {achievements.description}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {achievements.tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTabId(tab.id)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-all ${
                activeTabId === tab.id
                  ? 'bg-brand-blue text-white shadow-lg shadow-blue-600/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tabIconMap[tab.id as keyof typeof tabIconMap] || <ImageIcon size={18} />}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="rounded-3xl bg-slate-50 border border-slate-100 p-6 md:p-10">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
            <div>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue mb-6">
                {tabIconMap[activeTab.id as keyof typeof tabIconMap] || <ImageIcon size={24} />}
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                {activeTab.title}
              </h3>

              <p className="text-slate-600 leading-relaxed">
                {activeTab.description}
              </p>

              <div className="mt-8 text-sm text-slate-500">
                등록 이미지 수:{' '}
                <span className="font-bold text-slate-900">
                  {activeTab.images?.length || 0}
                </span>
              </div>
            </div>

            {activeTab.images && activeTab.images.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {activeTab.images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm text-left"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                      <img
                        src={image}
                        alt={`${activeTab.label} 이미지 ${index + 1}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-4">
                      <p className="text-sm font-bold text-slate-900">
                        {activeTab.label} 자료 {index + 1}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        등록된 이미지 자료입니다.
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-center">
                <div className="px-6">
                  <ImageIcon size={42} className="mx-auto text-slate-400" />
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
        </div>
      </div>
    </section>
  );
}
