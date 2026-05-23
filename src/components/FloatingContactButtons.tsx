import { Instagram, Mail } from 'lucide-react';
import siteContent from '../data/siteContent.json';

const INSTAGRAM_URL =
  'https://www.instagram.com/minyoung_tech?igsh=MWYzenF0dTk4Y243cg==';

export default function FloatingContactButtons() {
  const { company } = siteContent;

  const emailSubject = encodeURIComponent('민영정밀 가공 문의');
  const emailBody = encodeURIComponent(
    `안녕하세요. 민영정밀 홈페이지를 보고 문의드립니다.\n\n문의 내용:\n\n성함:\n연락처:\n`
  );

  const emailHref = `mailto:${company.email}?subject=${emailSubject}&body=${emailBody}`;

  return (
    <>
      <div className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex">
        <a
          href={emailHref}
          className="group flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-900 shadow-xl shadow-slate-900/10 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-600 hover:text-white hover:shadow-blue-600/25"
          aria-label="이메일 문의하기"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition group-hover:bg-white/15 group-hover:text-white">
            <Mail size={20} />
          </span>
          <span className="whitespace-nowrap">이메일 문의</span>
        </a>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-900 shadow-xl shadow-slate-900/10 transition hover:-translate-y-0.5 hover:border-pink-200 hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-400 hover:text-white hover:shadow-pink-500/25"
          aria-label="인스타그램 문의하기"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 text-pink-600 transition group-hover:bg-white/15 group-hover:text-white">
            <Instagram size={20} />
          </span>
          <span className="whitespace-nowrap">인스타 문의</span>
        </a>

        <div className="mx-auto mt-1 h-12 w-px bg-slate-200"></div>

        <div className="rounded-full bg-slate-950/90 px-3 py-2 text-center text-[11px] font-bold leading-relaxed text-white shadow-lg">
          QUICK
          <br />
          CONTACT
        </div>
      </div>

      <div className="fixed bottom-4 left-4 right-4 z-40 grid grid-cols-2 gap-3 md:hidden">
        <a
          href={emailHref}
          className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-4 text-sm font-black text-white shadow-xl shadow-blue-600/25"
          aria-label="이메일 문의하기"
        >
          <Mail size={19} />
          이메일 문의
        </a>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-400 px-4 py-4 text-sm font-black text-white shadow-xl shadow-pink-500/25"
          aria-label="인스타그램 문의하기"
        >
          <Instagram size={19} />
          인스타 문의
        </a>
      </div>
    </>
  );
}
