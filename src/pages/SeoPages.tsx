import { useEffect } from 'react';
import siteContent from '../data/siteContent.json';

type SeoPageData = {
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  intro: string;
  sections: {
    title: string;
    body: string;
  }[];
  keywords: string[];
};

const BASE_URL = 'https://minyoung9515.pages.dev';

function setMetaDescription(description: string) {
  let meta = document.querySelector('meta[name="description"]');

  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'description');
    document.head.appendChild(meta);
  }

  meta.setAttribute('content', description);
}

function setCanonical(path: string) {
  let canonical = document.querySelector('link[rel="canonical"]');

  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }

  canonical.setAttribute('href', `${BASE_URL}${path}`);
}

function SeoPage({ data, path }: { data: SeoPageData; path: string }) {
  const { company } = siteContent;

  useEffect(() => {
    document.title = data.title;
    setMetaDescription(data.description);
    setCanonical(path);
  }, [data.title, data.description, path]);

  return (
    <main className="bg-white text-slate-950">
      <section className="relative overflow-hidden bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.3),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.18),transparent_34%)]"></div>
        <div className="relative mx-auto max-w-6xl">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-400">
            {data.eyebrow}
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {data.heading}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300 sm:text-xl">
            {data.intro}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            {data.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-[2rem] border border-slate-200 bg-slate-50 p-7 lg:sticky lg:top-32 lg:h-fit">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-blue-600">
              Company
            </p>

            <h2 className="mt-4 text-3xl font-black text-slate-950">
              {company.name}
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-700">
              <div>
                <p className="font-black text-slate-950">주소</p>
                <p className="mt-1">{company.address}</p>
              </div>

              <div>
                <p className="font-black text-slate-950">전화번호</p>
                <p className="mt-1">{company.phone}</p>
              </div>

              <div>
                <p className="font-black text-slate-950">이메일</p>
                <p className="mt-1 break-all">{company.email}</p>
              </div>
            </div>

            <a
              href="/#contact"
              className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-5 py-4 text-base font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              문의하기
            </a>
          </aside>

          <div className="space-y-6">
            {data.sections.map((section) => (
              <article
                key={section.title}
                className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm"
              >
                <h2 className="text-2xl font-black text-slate-950">
                  {section.title}
                </h2>
                <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-700">
                  {section.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

const companyPage: SeoPageData = {
  title: '민영정밀 회사소개 | 아산 정밀가공 전문 기업',
  description:
    '민영정밀은 충청남도 아산시에 위치한 정밀가공 전문 기업입니다. 자동차, 반도체, 정밀기계 부품 가공과 설계, 치공구 제작, MCT 가공, CNC 선반 가공을 수행합니다.',
  eyebrow: 'Company Profile',
  heading: '충남 아산 정밀가공 전문 기업, 민영정밀',
  intro:
    '민영정밀은 아산시 음봉면을 기반으로 자동차, 반도체, 정밀기계 분야의 부품 가공과 치공구 제작을 수행하는 정밀가공 전문 기업입니다.',
  keywords: ['민영정밀', '아산 정밀가공', 'MCT 가공', 'CNC 선반', '치공구 제작'],
  sections: [
    {
      title: '민영정밀 소개',
      body:
        '민영정밀은 충청남도 아산시에 위치한 정밀가공 전문 기업입니다. 자동차 부품, 반도체 장비 부품, 정밀기계 부품 등 다양한 산업 분야의 가공품을 제작하며, 고객의 도면과 요구사항에 맞춘 맞춤형 가공 서비스를 제공합니다.',
    },
    {
      title: '정밀가공 중심의 생산 대응',
      body:
        'MCT 가공과 CNC 선반 가공을 기반으로 복잡한 형상의 부품과 높은 정밀도가 요구되는 제품을 안정적으로 제작합니다. 단순 가공을 넘어 설계 의도와 사용 목적을 고려한 가공 품질을 중요하게 생각합니다.',
    },
    {
      title: '아산·천안 지역 제조업 파트너',
      body:
        '민영정밀은 아산과 천안을 중심으로 충청남도 지역 제조업체와 협력하며, 자동차, 반도체, 기계 분야의 현장 요구에 맞는 부품 가공과 치공구 제작을 수행합니다.',
    },
  ],
};

const precisionPage: SeoPageData = {
  title: '아산 정밀가공 전문 | 민영정밀',
  description:
    '민영정밀은 충남 아산 기반 정밀가공 전문 업체입니다. 자동차, 반도체, 정밀기계 부품의 MCT 가공, CNC 선반 가공, 치공구 제작을 제공합니다.',
  eyebrow: 'Precision Machining',
  heading: '아산 정밀가공 전문, 민영정밀',
  intro:
    '정밀한 부품 품질과 안정적인 납기를 중요하게 생각하는 제조 현장을 위해 민영정밀은 정밀가공 서비스를 제공합니다.',
  keywords: ['아산 정밀가공', '충남 정밀가공', '정밀 부품 가공', '기계 가공'],
  sections: [
    {
      title: '정밀 부품 가공',
      body:
        '민영정밀은 자동차, 반도체, 정밀기계 분야에서 요구되는 다양한 부품 가공을 수행합니다. 제품의 형상, 소재, 용도, 공차 조건을 고려하여 안정적인 가공 품질을 목표로 합니다.',
    },
    {
      title: '도면 기반 맞춤 제작',
      body:
        '고객이 제공하는 도면과 사양을 바탕으로 필요한 가공 공정을 검토하고, 현장 경험을 바탕으로 제작 방향을 제안합니다. 소량 다품종 부품부터 반복 생산이 필요한 부품까지 유연하게 대응합니다.',
    },
    {
      title: '품질과 신뢰 중심의 가공',
      body:
        '정밀가공은 단순히 형상을 만드는 작업이 아니라, 제품이 실제 현장에서 안정적으로 기능하도록 만드는 과정입니다. 민영정밀은 정밀도와 품질을 우선으로 생각합니다.',
    },
  ],
};

const mctCncPage: SeoPageData = {
  title: 'MCT 가공 · CNC 선반 가공 | 민영정밀',
  description:
    '민영정밀은 MCT 가공과 CNC 선반 가공을 전문으로 하며 자동차, 반도체, 정밀기계 부품의 맞춤형 정밀가공을 제공합니다.',
  eyebrow: 'MCT & CNC Machining',
  heading: 'MCT 가공 · CNC 선반 가공 전문',
  intro:
    'MCT 가공과 CNC 선반 가공은 민영정밀의 핵심 생산 역량입니다. 정밀 부품 제작과 복합 가공에 대응합니다.',
  keywords: ['MCT 가공', 'CNC 선반', 'CNC 가공', '복합 가공', '부품 가공'],
  sections: [
    {
      title: 'MCT 가공',
      body:
        'MCT 가공은 복잡한 형상의 부품 제작과 정밀한 면 가공, 홀 가공, 포켓 가공 등에 적합합니다. 민영정밀은 산업용 부품과 정밀기계 부품 제작에 필요한 MCT 가공을 수행합니다.',
    },
    {
      title: 'CNC 선반 가공',
      body:
        'CNC 선반 가공은 원형 부품, 축류 부품, 회전체 부품 제작에 중요한 공정입니다. 민영정밀은 제품의 사용 목적과 요구 공차를 고려하여 안정적인 선반 가공 품질을 제공합니다.',
    },
    {
      title: '정밀가공 공정 검토',
      body:
        '가공 전 도면을 검토하고, 소재와 형상에 적합한 공정을 고려합니다. 이를 통해 불필요한 시행착오를 줄이고 고객이 원하는 결과물에 가까운 제작을 목표로 합니다.',
    },
  ],
};

const colletChuckPage: SeoPageData = {
  title: '콜렛척 전문 가공 | 민영정밀',
  description:
    '민영정밀은 콜렛척 관련 특허 출원 및 등록 기술을 바탕으로 콜렛척 전문 가공과 정밀 부품 제작 서비스를 제공합니다.',
  eyebrow: 'Collet Chuck',
  heading: '콜렛척 전문 가공 기술',
  intro:
    '민영정밀은 콜렛척 관련 가공 경험과 기술력을 바탕으로 정밀하고 안정적인 제품 제작을 추구합니다.',
  keywords: ['콜렛척', 'Collet Chuck', '콜렛척 가공', '특허 기술', '정밀 척'],
  sections: [
    {
      title: '콜렛척 가공 전문성',
      body:
        '콜렛척은 공작물의 고정 안정성과 회전 정밀도에 중요한 역할을 하는 부품입니다. 민영정밀은 콜렛척 관련 가공 경험을 바탕으로 제품의 정밀도와 내구성을 중요하게 생각합니다.',
    },
    {
      title: '특허 출원 및 등록 기술',
      body:
        '민영정밀은 콜렛척 전문 가공 분야에서 특허 출원 및 등록 이력을 보유하고 있으며, 이를 바탕으로 차별화된 기술력과 품질 경쟁력을 강화하고 있습니다.',
    },
    {
      title: '맞춤형 사양 대응',
      body:
        '고객의 설비와 사용 환경에 따라 필요한 사양이 달라질 수 있습니다. 민영정밀은 도면과 요구 조건을 기반으로 맞춤형 콜렛척 가공을 검토하고 제작합니다.',
    },
  ],
};

const automotiveSemiconductorPage: SeoPageData = {
  title: '자동차 · 반도체 부품 가공 | 민영정밀',
  description:
    '민영정밀은 자동차 부품, 반도체 장비 부품, 정밀기계 부품 가공을 수행하는 충남 아산 정밀가공 전문 기업입니다.',
  eyebrow: 'Automotive & Semiconductor',
  heading: '자동차 · 반도체 · 정밀기계 부품 가공',
  intro:
    '산업별 요구 조건에 맞춰 자동차 부품, 반도체 장비 부품, 정밀기계 부품의 가공 서비스를 제공합니다.',
  keywords: ['자동차 부품 가공', '반도체 부품 가공', '정밀기계 부품', '장비 부품'],
  sections: [
    {
      title: '자동차 부품 가공',
      body:
        '자동차 부품은 반복 생산성과 안정적인 품질이 중요합니다. 민영정밀은 자동차 관련 부품 가공 경험을 바탕으로 요구 사양에 맞는 정밀가공을 수행합니다.',
    },
    {
      title: '반도체 장비 부품 가공',
      body:
        '반도체 장비 부품은 정밀도와 표면 품질, 안정적인 제작 공정이 중요합니다. 민영정밀은 반도체 분야의 부품 제작 요구에 맞춰 정밀가공 서비스를 제공합니다.',
    },
    {
      title: '정밀기계 부품 가공',
      body:
        '산업용 설비, 자동화 장비, 정밀기계에 사용되는 다양한 부품을 도면 기반으로 제작합니다. 부품의 기능과 사용 환경을 고려한 가공 품질을 목표로 합니다.',
    },
  ],
};

export function CompanyPage() {
  return <SeoPage data={companyPage} path="/company" />;
}

export function PrecisionMachiningPage() {
  return <SeoPage data={precisionPage} path="/precision-machining" />;
}

export function MctCncPage() {
  return <SeoPage data={mctCncPage} path="/mct-cnc" />;
}

export function ColletChuckPage() {
  return <SeoPage data={colletChuckPage} path="/collet-chuck" />;
}

export function AutomotiveSemiconductorPage() {
  return (
    <SeoPage
      data={automotiveSemiconductorPage}
      path="/automotive-semiconductor"
    />
  );
}
