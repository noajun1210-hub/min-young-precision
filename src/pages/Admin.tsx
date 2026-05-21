import { useMemo, useState } from 'react';
import {
  Save,
  Download,
  KeyRound,
  Building2,
  Mail,
  MapPin,
  Phone,
  ListChecks,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { githubContentConfig, loadSiteContent, saveSiteContent } from '../lib/githubContent';

type CompanyInfo = {
  name: string;
  englishName: string;
  representative: string;
  email: string;
  phone: string;
  fax: string;
  address: string;
  businessNumber: string;
  tagline: string;
};

type NavigationItem = {
  label: string;
  href: string;
};

type HeroContent = {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  primaryButton: {
    label: string;
    href: string;
  };
  secondaryButton: {
    label: string;
    href: string;
  };
};

type AboutContent = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  visualTitle: string;
  visualSubtitle: string;
};

type ServiceItem = {
  title: string;
  description: string;
  icon: string;
};

type ServicesContent = {
  eyebrow: string;
  title: string;
  items: ServiceItem[];
};

type ExpertiseCard = {
  title: string;
  description: string;
};

type ExpertiseContent = {
  eyebrow: string;
  title: string;
  mainTitle: string;
  mainDescription: string;
  points: string[];
  cards: ExpertiseCard[];
};

type StrengthItem = {
  title: string;
  description: string;
  icon: string;
};

type StrengthsContent = {
  eyebrow: string;
  title: string;
  items: StrengthItem[];
};

type ContactContent = {
  title: string;
  description: string;
  emailButtonTitle: string;
  emailButtonDescription: string;
  emailButtonSmallText: string;
};

type FooterContent = {
  copyrightText: string;
};

type SiteContent = {
  company: CompanyInfo;
  navigation: NavigationItem[];
  hero: HeroContent;
  about: AboutContent;
  services: ServicesContent;
  expertise: ExpertiseContent;
  strengths: StrengthsContent;
  contact: ContactContent;
  footer: FooterContent;
};

type StatusType = 'idle' | 'loading' | 'success' | 'error';

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-slate-700 mb-2">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-slate-700 mb-2">{label}</span>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      />
    </label>
  );
}

function AdminSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        {description && <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem('minyoung_github_token') || '');
  const [rememberToken, setRememberToken] = useState(() => Boolean(localStorage.getItem('minyoung_github_token')));
  const [content, setContent] = useState<SiteContent | null>(null);
  const [status, setStatus] = useState<StatusType>('idle');
  const [message, setMessage] = useState('');

  const isBusy = status === 'loading';

  const repositoryLabel = useMemo(() => {
    return `${githubContentConfig.owner}/${githubContentConfig.repo}`;
  }, []);

  function setStatusMessage(nextStatus: StatusType, nextMessage: string) {
    setStatus(nextStatus);
    setMessage(nextMessage);
  }

  async function handleLoad() {
    try {
      setStatusMessage('loading', 'GitHub에서 홈페이지 데이터를 불러오는 중입니다.');

      if (rememberToken) {
        localStorage.setItem('minyoung_github_token', token.trim());
      } else {
        localStorage.removeItem('minyoung_github_token');
      }

      const result = await loadSiteContent(token);
      setContent(result.content as SiteContent);
      setStatusMessage('success', '홈페이지 데이터를 불러왔습니다.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : '데이터를 불러오지 못했습니다.');
    }
  }

  async function handleSave() {
    if (!content) {
      setStatusMessage('error', '먼저 데이터를 불러와주세요.');
      return;
    }

    try {
      setStatusMessage('loading', '수정 내용을 GitHub에 저장하는 중입니다.');

      if (rememberToken) {
        localStorage.setItem('minyoung_github_token', token.trim());
      } else {
        localStorage.removeItem('minyoung_github_token');
      }

      await saveSiteContent(token, content);
      setStatusMessage('success', '저장 완료! Cloudflare Pages가 자동으로 다시 배포됩니다. 보통 1~2분 정도 걸립니다.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : '저장하지 못했습니다.');
    }
  }

  function updateCompany<Key extends keyof CompanyInfo>(key: Key, value: CompanyInfo[Key]) {
    setContent((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        company: {
          ...prev.company,
          [key]: value,
        },
      };
    });
  }

  function updateHero<Key extends keyof HeroContent>(key: Key, value: HeroContent[Key]) {
    setContent((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        hero: {
          ...prev.hero,
          [key]: value,
        },
      };
    });
  }

  function updateAbout<Key extends keyof AboutContent>(key: Key, value: AboutContent[Key]) {
    setContent((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        about: {
          ...prev.about,
          [key]: value,
        },
      };
    });
  }

  function updateAboutParagraph(index: number, value: string) {
    setContent((prev) => {
      if (!prev) return prev;
      const paragraphs = [...prev.about.paragraphs];
      paragraphs[index] = value;

      return {
        ...prev,
        about: {
          ...prev.about,
          paragraphs,
        },
      };
    });
  }

  function updateService(index: number, key: keyof ServiceItem, value: string) {
    setContent((prev) => {
      if (!prev) return prev;
      const items = [...prev.services.items];
      items[index] = {
        ...items[index],
        [key]: value,
      };

      return {
        ...prev,
        services: {
          ...prev.services,
          items,
        },
      };
    });
  }

  function updateExpertise<Key extends keyof ExpertiseContent>(key: Key, value: ExpertiseContent[Key]) {
    setContent((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        expertise: {
          ...prev.expertise,
          [key]: value,
        },
      };
    });
  }

  function updateExpertisePoint(index: number, value: string) {
    setContent((prev) => {
      if (!prev) return prev;
      const points = [...prev.expertise.points];
      points[index] = value;

      return {
        ...prev,
        expertise: {
          ...prev.expertise,
          points,
        },
      };
    });
  }

  function updateExpertiseCard(index: number, key: keyof ExpertiseCard, value: string) {
    setContent((prev) => {
      if (!prev) return prev;
      const cards = [...prev.expertise.cards];
      cards[index] = {
        ...cards[index],
        [key]: value,
      };

      return {
        ...prev,
        expertise: {
          ...prev.expertise,
          cards,
        },
      };
    });
  }

  function updateStrength(index: number, key: keyof StrengthItem, value: string) {
    setContent((prev) => {
      if (!prev) return prev;
      const items = [...prev.strengths.items];
      items[index] = {
        ...items[index],
        [key]: value,
      };

      return {
        ...prev,
        strengths: {
          ...prev.strengths,
          items,
        },
      };
    });
  }

  function updateContact<Key extends keyof ContactContent>(key: Key, value: ContactContent[Key]) {
    setContent((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        contact: {
          ...prev.contact,
          [key]: value,
        },
      };
    });
  }

  function updateFooter<Key extends keyof FooterContent>(key: Key, value: FooterContent[Key]) {
    setContent((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        footer: {
          ...prev.footer,
          [key]: value,
        },
      };
    });
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-400">Admin Page</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">민영정밀 관리자 페이지</h1>
              <p className="mt-4 max-w-2xl text-slate-300">
                홈페이지 문구와 회사 정보를 수정한 뒤 GitHub에 저장합니다. 저장 후 Cloudflare Pages가 자동으로 재배포합니다.
              </p>
            </div>

            <a
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              홈페이지로 돌아가기
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
                <KeyRound size={18} />
                GitHub 토큰
              </div>

              <input
                type="password"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                placeholder="GitHub Fine-grained token을 입력하세요"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />

              <div className="mt-3 flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberToken}
                    onChange={(event) => setRememberToken(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  이 기기에 토큰 임시 저장
                </label>

                <span>
                  대상 파일: {repositoryLabel} / {githubContentConfig.path}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <button
                type="button"
                onClick={handleLoad}
                disabled={isBusy}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isBusy ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                데이터 불러오기
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isBusy || !content}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isBusy ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                저장하기
              </button>
            </div>
          </div>

          {message && (
            <div
              className={`mt-5 flex items-start gap-3 rounded-2xl px-4 py-3 text-sm ${
                status === 'success'
                  ? 'bg-emerald-50 text-emerald-800'
                  : status === 'error'
                    ? 'bg-red-50 text-red-800'
                    : 'bg-blue-50 text-blue-800'
              }`}
            >
              {status === 'success' ? (
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              ) : status === 'error' ? (
                <AlertTriangle size={18} className="mt-0.5 shrink-0" />
              ) : (
                <Loader2 size={18} className="mt-0.5 shrink-0 animate-spin" />
              )}

              <p>{message}</p>
            </div>
          )}
        </div>

        {!content ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <ListChecks size={42} className="mx-auto text-slate-400" />
            <h2 className="mt-4 text-xl font-bold text-slate-900">먼저 데이터를 불러와주세요.</h2>
            <p className="mt-2 text-sm text-slate-500">
              GitHub 토큰을 입력하고 “데이터 불러오기”를 누르면 수정 화면이 나타납니다.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <AdminSection title="회사 기본 정보" description="회사명, 대표자, 연락처, 주소 등 홈페이지 전반에 사용되는 정보입니다.">
              <div className="grid gap-5 md:grid-cols-2">
                <TextInput label="회사명" value={content.company.name} onChange={(value) => updateCompany('name', value)} />
                <TextInput label="영문 회사명" value={content.company.englishName} onChange={(value) => updateCompany('englishName', value)} />
                <TextInput label="대표자" value={content.company.representative} onChange={(value) => updateCompany('representative', value)} />
                <TextInput label="이메일" type="email" value={content.company.email} onChange={(value) => updateCompany('email', value)} />
                <TextInput label="전화번호" value={content.company.phone} onChange={(value) => updateCompany('phone', value)} />
                <TextInput label="팩스번호" value={content.company.fax} onChange={(value) => updateCompany('fax', value)} />
                <TextInput label="주소" value={content.company.address} onChange={(value) => updateCompany('address', value)} />
                <TextInput label="사업자등록번호" value={content.company.businessNumber} onChange={(value) => updateCompany('businessNumber', value)} />
                <div className="md:col-span-2">
                  <TextInput label="푸터 영문 문구" value={content.company.tagline} onChange={(value) => updateCompany('tagline', value)} />
                </div>
              </div>
            </AdminSection>

            <AdminSection title="메인 화면" description="홈페이지 첫 화면에 보이는 큰 문구와 버튼입니다.">
              <div className="grid gap-5 md:grid-cols-2">
                <TextInput label="상단 영문 문구" value={content.hero.eyebrow} onChange={(value) => updateHero('eyebrow', value)} />
                <TextInput label="강조할 단어" value={content.hero.highlight} onChange={(value) => updateHero('highlight', value)} />
                <div className="md:col-span-2">
                  <TextInput label="큰 제목" value={content.hero.title} onChange={(value) => updateHero('title', value)} />
                </div>
                <div className="md:col-span-2">
                  <TextArea label="설명 문구" rows={4} value={content.hero.description} onChange={(value) => updateHero('description', value)} />
                </div>
                <TextInput label="첫 번째 버튼 문구" value={content.hero.primaryButton.label} onChange={(value) => updateHero('primaryButton', { ...content.hero.primaryButton, label: value })} />
                <TextInput label="첫 번째 버튼 링크" value={content.hero.primaryButton.href} onChange={(value) => updateHero('primaryButton', { ...content.hero.primaryButton, href: value })} />
                <TextInput label="두 번째 버튼 문구" value={content.hero.secondaryButton.label} onChange={(value) => updateHero('secondaryButton', { ...content.hero.secondaryButton, label: value })} />
                <TextInput label="두 번째 버튼 링크" value={content.hero.secondaryButton.href} onChange={(value) => updateHero('secondaryButton', { ...content.hero.secondaryButton, href: value })} />
              </div>
            </AdminSection>

            <AdminSection title="회사 소개" description="회사 소개 섹션의 제목과 본문입니다.">
              <div className="grid gap-5 md:grid-cols-2">
                <TextInput label="소제목" value={content.about.eyebrow} onChange={(value) => updateAbout('eyebrow', value)} />
                <TextInput label="오른쪽 박스 제목" value={content.about.visualTitle} onChange={(value) => updateAbout('visualTitle', value)} />
                <div className="md:col-span-2">
                  <TextArea label="소개 제목" rows={3} value={content.about.title} onChange={(value) => updateAbout('title', value)} />
                </div>
                <TextInput label="오른쪽 박스 보조 문구" value={content.about.visualSubtitle} onChange={(value) => updateAbout('visualSubtitle', value)} />
              </div>

              <div className="mt-6 space-y-4">
                {content.about.paragraphs.map((paragraph, index) => (
                  <TextArea
                    key={index}
                    label={`소개 본문 ${index + 1}`}
                    value={paragraph}
                    onChange={(value) => updateAboutParagraph(index, value)}
                  />
                ))}
              </div>
            </AdminSection>

            <AdminSection title="주요 사업 분야" description="사업 분야 카드의 제목, 설명, 아이콘 이름을 수정합니다.">
              <div className="grid gap-5 md:grid-cols-2">
                <TextInput
                  label="소제목"
                  value={content.services.eyebrow}
                  onChange={(value) =>
                    setContent((prev) =>
                      prev ? { ...prev, services: { ...prev.services, eyebrow: value } } : prev
                    )
                  }
                />
                <TextInput
                  label="제목"
                  value={content.services.title}
                  onChange={(value) =>
                    setContent((prev) =>
                      prev ? { ...prev, services: { ...prev.services, title: value } } : prev
                    )
                  }
                />
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {content.services.items.map((item, index) => (
                  <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="mb-4 font-bold text-slate-900">사업 분야 {index + 1}</h3>
                    <div className="space-y-4">
                      <TextInput label="제목" value={item.title} onChange={(value) => updateService(index, 'title', value)} />
                      <TextArea label="설명" value={item.description} onChange={(value) => updateService(index, 'description', value)} />
                      <TextInput label="아이콘 이름" value={item.icon} onChange={(value) => updateService(index, 'icon', value)} />
                    </div>
                  </div>
                ))}
              </div>
            </AdminSection>

            <AdminSection title="전문 기술" description="콜렛척, MCT, CNC 등 전문 기술 관련 문구입니다.">
              <div className="grid gap-5 md:grid-cols-2">
                <TextInput label="소제목" value={content.expertise.eyebrow} onChange={(value) => updateExpertise('eyebrow', value)} />
                <TextInput label="제목" value={content.expertise.title} onChange={(value) => updateExpertise('title', value)} />
                <div className="md:col-span-2">
                  <TextInput label="메인 제목" value={content.expertise.mainTitle} onChange={(value) => updateExpertise('mainTitle', value)} />
                </div>
                <div className="md:col-span-2">
                  <TextArea label="메인 설명" value={content.expertise.mainDescription} onChange={(value) => updateExpertise('mainDescription', value)} />
                </div>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {content.expertise.points.map((point, index) => (
                  <TextInput
                    key={index}
                    label={`기술 포인트 ${index + 1}`}
                    value={point}
                    onChange={(value) => updateExpertisePoint(index, value)}
                  />
                ))}
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {content.expertise.cards.map((card, index) => (
                  <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="mb-4 font-bold text-slate-900">기술 카드 {index + 1}</h3>
                    <div className="space-y-4">
                      <TextInput label="제목" value={card.title} onChange={(value) => updateExpertiseCard(index, 'title', value)} />
                      <TextArea label="설명" value={card.description} onChange={(value) => updateExpertiseCard(index, 'description', value)} />
                    </div>
                  </div>
                ))}
              </div>
            </AdminSection>

            <AdminSection title="경쟁력" description="민영정밀의 강점 카드입니다.">
              <div className="grid gap-5 md:grid-cols-2">
                <TextInput
                  label="소제목"
                  value={content.strengths.eyebrow}
                  onChange={(value) =>
                    setContent((prev) =>
                      prev ? { ...prev, strengths: { ...prev.strengths, eyebrow: value } } : prev
                    )
                  }
                />
                <TextInput
                  label="제목"
                  value={content.strengths.title}
                  onChange={(value) =>
                    setContent((prev) =>
                      prev ? { ...prev, strengths: { ...prev.strengths, title: value } } : prev
                    )
                  }
                />
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {content.strengths.items.map((item, index) => (
                  <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="mb-4 font-bold text-slate-900">경쟁력 {index + 1}</h3>
                    <div className="space-y-4">
                      <TextInput label="제목" value={item.title} onChange={(value) => updateStrength(index, 'title', value)} />
                      <TextArea label="설명" value={item.description} onChange={(value) => updateStrength(index, 'description', value)} />
                      <TextInput label="아이콘 이름" value={item.icon} onChange={(value) => updateStrength(index, 'icon', value)} />
                    </div>
                  </div>
                ))}
              </div>
            </AdminSection>

            <AdminSection title="문의 영역" description="문의하기 섹션과 이메일 버튼 문구입니다.">
              <div className="grid gap-5 md:grid-cols-2">
                <TextInput label="문의 제목" value={content.contact.title} onChange={(value) => updateContact('title', value)} />
                <TextInput label="버튼 제목" value={content.contact.emailButtonTitle} onChange={(value) => updateContact('emailButtonTitle', value)} />
                <div className="md:col-span-2">
                  <TextArea label="문의 설명" value={content.contact.description} onChange={(value) => updateContact('description', value)} />
                </div>
                <TextInput label="버튼 설명" value={content.contact.emailButtonDescription} onChange={(value) => updateContact('emailButtonDescription', value)} />
                <TextInput label="버튼 작은 문구" value={content.contact.emailButtonSmallText} onChange={(value) => updateContact('emailButtonSmallText', value)} />
              </div>
            </AdminSection>

            <AdminSection title="푸터" description="하단 저작권 문구입니다.">
              <TextInput label="저작권 문구" value={content.footer.copyrightText} onChange={(value) => updateFooter('copyrightText', value)} />
            </AdminSection>

            <div className="sticky bottom-4 z-20 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-600">
                  수정 후 반드시 <strong className="text-slate-900">저장하기</strong>를 눌러야 홈페이지에 반영됩니다.
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isBusy || !content}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isBusy ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  저장하기
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="flex items-center justify-center gap-2">
          <Building2 size={14} />
          <span>Min Young Precision Admin</span>
          <span>·</span>
          <Mail size={14} />
          <span>GitHub Contents API</span>
          <span>·</span>
          <MapPin size={14} />
          <span>Cloudflare Pages</span>
        </div>
      </footer>
    </div>
  );
}
