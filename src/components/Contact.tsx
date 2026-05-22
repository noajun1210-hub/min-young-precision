import { Mail, MapPin, Phone, UserRound } from 'lucide-react';
import siteContent from '../data/siteContent.json';

export default function Contact() {
  const { company, contact } = siteContent;
  const mailTo = `mailto:${company.email}`;

  return (
    <section id="contact" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-slate-950 shadow-2xl lg:rounded-[2.5rem]">
          <div className="grid lg:grid-cols-2">
            <div className="p-7 text-white sm:p-10 lg:p-14">
              <h2 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                {contact.title}
              </h2>

              <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-slate-300 sm:text-lg">
                {contact.description}
              </p>

              <div className="mt-10 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400">
                    <UserRound size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-400">대표자</p>
                    <p className="mt-1 text-lg font-black">{company.representative}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400">
                    <Mail size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-400">이메일</p>
                    <a
                      href={mailTo}
                      className="mt-1 block break-all text-lg font-black text-blue-300 transition hover:text-blue-200"
                    >
                      {company.email}
                    </a>
                  </div>
                </div>

                {company.phone && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400">
                      <Phone size={20} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-400">전화번호</p>
                      <a
                        href={`tel:${company.phone.replace(/-/g, '')}`}
                        className="mt-1 block text-lg font-black text-blue-300 transition hover:text-blue-200"
                      >
                        {company.phone}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-400">주소</p>
                    <p className="mt-1 text-base font-bold leading-relaxed text-slate-100">
                      {company.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 p-7 text-white sm:p-10 lg:p-14">
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-[2rem] bg-white/10 p-8 text-center backdrop-blur">
                <div className="mb-7 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15">
                  <Mail size={42} />
                </div>

                <h3 className="text-3xl font-black">
                  {contact.emailButtonTitle}
                </h3>

                <p className="mt-4 text-base leading-relaxed text-blue-50 sm:text-lg">
                  {contact.emailButtonDescription}
                </p>

                <a
                  href={mailTo}
                  className="mt-8 inline-flex min-h-14 w-full max-w-xs items-center justify-center rounded-2xl bg-white px-6 py-4 text-base font-black text-blue-700 shadow-lg transition hover:bg-blue-50"
                >
                  {contact.emailButtonSmallText}
                  <span className="ml-2">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
