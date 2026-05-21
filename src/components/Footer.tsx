export default function Footer() {
  return (
    <footer className="bg-white py-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-4 md:space-y-0">
        <div>
          <div className="text-xl font-bold text-brand-dark mb-1">
            민영<span className="text-brand-blue">정밀</span>
          </div>

          <p className="text-slate-500 text-xs uppercase tracking-tighter font-medium italic">
            Automotive · Semiconductor · Precision Machinery
          </p>
        </div>

        <div className="text-slate-500 text-sm">
          <p className="mb-1">
            대표 : 조지훈 | 이메일 : jjh110374@daum.net
          </p>

          <p>
            © {new Date().getFullYear()} Min Young Precision. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
