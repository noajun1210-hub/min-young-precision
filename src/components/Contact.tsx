import { Mail, MapPin, User, ArrowUpRight, Phone, Building2 } from 'lucide-react';
import siteContent from '../data/siteContent.json';

export default function Contact() {
  const { company, contact } = siteContent;

  return (
    <section id="contact" className="py-24 bg-subtle-gray border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-dark rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          <div className="p-12 lg:w-1/2 text-white flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {contact.title}
            </h2>

            <p className="text-slate-400 mb-10 text-lg whitespace-pre-line">
              {contact.description}
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-brand-blue/20 rounded-full flex items-center justify-center text-brand-blue">
                  <User size={20} />
                </div>

                <div>
                  <p className="text-slate-400 text-xs">대표자</p>
                  <p className="text-lg font-medium">{company.representative}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-brand-blue/20 rounded-full flex items-center justify-center text-brand-blue">
                  <Mail size={20} />
                </div>

                <div>
                  <p className="text-slate-400 text-xs">이메일</p>
                  <p className="text-lg font-medium text-brand-accent">
                    {company.email}
                  </p>
                </div>
              </div>

              {company.phone && (
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-brand-blue/20 rounded-full flex items-center justify-center text-brand-blue">
                    <Phone size={20} />
                  </div>

                  <div>
                    <p className="text-slate-400 text-xs">전화번호</p>
                    <p className="text-lg font-medium">{company.phone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-brand-blue/20 rounded-full flex items-center justify-center text-brand-blue">
                  <MapPin size={20} />
                </div>

                <div>
                  <p className="text-slate-400 text-xs">사업장 주소</p>
                  <p className="text-lg font-medium">{company.address}</p>
                </div>
              </div>

              {company.businessNumber && (
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-brand-blue/20 rounded-full flex items-center justify-center text-brand-blue">
                    <Building2 size={20} />
                  </div>

                  <div>
                    <p className="text-slate-400 text-xs">사업자등록번호</p>
                    <p className="text-lg font-medium">{company.businessNumber}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-12 lg:w-1/2 flex items-center justify-center">
            <a
              href={`mailto:${company.email}`}
              className="w-full group bg-brand-blue hover:bg-blue-700 text-white p-10 rounded-2xl flex flex-col items-center justify-center text-center transition-all shadow-xl"
            >
              <Mail size={48} className="mb-4 group-hover:scale-110 transition-transform" />

              <span className="text-2xl font-bold mb-2">
                {contact.emailButtonTitle}
              </span>

              <p className="text-blue-100 mb-4 font-light">
                {contact.emailButtonDescription}
              </p>

              <div className="bg-white/20 px-6 py-2 rounded-full flex items-center text-sm font-bold backdrop-blur-md">
                {contact.emailButtonSmallText}
                <ArrowUpRight size={16} className="ml-1" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
