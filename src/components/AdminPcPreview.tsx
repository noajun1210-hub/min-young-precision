import { useEffect, useState } from 'react';
import { Monitor, RotateCcw } from 'lucide-react';

const DESKTOP_WIDTH = 1440;
const DESKTOP_HEIGHT = 3600;

export default function AdminPcPreview() {
  const [scale, setScale] = useState(0.3);
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    function updateScale() {
      const availableWidth = window.innerWidth - 48;
      const nextScale = Math.min(availableWidth / DESKTOP_WIDTH, 1);
      setScale(nextScale);
    }

    updateScale();
    window.addEventListener('resize', updateScale);

    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Monitor size={22} className="text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">
              PC 버전 미리보기
            </h2>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            관리자 페이지 안에서만 보이는 PC 화면 확인용 미리보기입니다.
            실제 방문자에게 별도 주소로 노출되지 않습니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setPreviewKey((prev) => prev + 1)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          <RotateCcw size={17} />
          미리보기 새로고침
        </button>
      </div>

      <div className="rounded-2xl bg-slate-950 p-3">
        <div className="mb-3 flex items-center gap-2 px-2">
          <span className="h-3 w-3 rounded-full bg-red-400"></span>
          <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
          <span className="h-3 w-3 rounded-full bg-green-400"></span>
          <span className="ml-2 text-xs font-bold text-slate-400">
            1440px Desktop Preview
          </span>
        </div>

        <div className="overflow-auto rounded-xl bg-white">
          <div
            style={{
              width: `${DESKTOP_WIDTH * scale}px`,
              height: `${DESKTOP_HEIGHT * scale}px`,
            }}
          >
            <iframe
              key={previewKey}
              src="/?admin-pc-preview=1"
              title="민영정밀 PC 버전 미리보기"
              style={{
                width: `${DESKTOP_WIDTH}px`,
                height: `${DESKTOP_HEIGHT}px`,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                border: '0',
              }}
            />
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs leading-relaxed text-slate-400">
        모바일 화면 안에서 PC 가로폭 1440px 기준 화면을 축소해서 보여줍니다.
        실제 PC에서는 더 선명하게 표시됩니다.
      </p>
    </section>
  );
}
