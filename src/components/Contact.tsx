import { Mail, MapPin, User, ArrowUpRight } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-subtle-gray border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-dark rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          <div className="p-12 lg:w-1/2 text-white flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              프로젝트 문의하기
            </h2>

            <p className="text-slate-400 mb-10 text-lg">
              도면 검토 및 견적 문의는 아래 연락처로 주시면
              <br />
              친절하고 정확하게 상담해 드리겠습니다.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-brand-blue/20 rounded-full flex items-center justify-center text-brand-blue">
                  <User size={20} />
                </div>

                <div>
                  <p className="text-slate-400 text-xs">대표자</p>
                  <p className="text-lg font-medium">조지훈</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-brand-blue/20 rounded-full flex items-center justify-center text-brand-blue">
                  <Mail size={20} />
                </div>

                <div>
                  <p className="text-slate-400 text-xs">이메일</p>
                  <p className="text-lg font-medium text-brand-accent">
                    jjh110374@daum.net
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-brand-blue/20 rounded-full flex items-center justify-center text-brand-blue">
                  <MapPin size={20} />
                </div>

                <div>
                  <p className="text-slate-400 text-xs">사업장 주소</p>
                  <p className="text-lg font-medium">충청남도 천안시</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-12 lg:w-1/2 flex items-center justify-center">
            <a
              href="mailto:jjh110374@daum.net"
              className="w-full group bg-brand-blue hover:bg-blue-700 text-white p-10 rounded-2xl flex flex-col items-center justify-center text-center transition-all shadow-xl"
            >
              <Mail size={48} className="mb-4 group-hover:scale-110 transition-transform" />

              <span className="text-2xl font-bold mb-2">이메일 보내기</span>

              <p className="text-blue-100 mb-4 font-light">
                간편하게 견적 및 가공 의뢰를 남겨주세요
              </p>

              <div className="bg-white/20 px-6 py-2 rounded-full flex items-center text-sm font-bold backdrop-blur-md">
                Click to Send <ArrowUpRight size={16} className="ml-1" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
