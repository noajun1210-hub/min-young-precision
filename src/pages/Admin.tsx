import { type ReactNode, useMemo, useState } from 'react';
import {
  Save,
  Download,
  KeyRound,
  Building2,
  Mail,
  MapPin,
  ListChecks,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  LogOut,
  Github,
  ImagePlus,
  Trash2,
  UploadCloud,
  Award,
  FileCheck2,
  ShieldCheck,
  Image as ImageIcon,
} from 'lucide-react';
import {
  deleteUploadedImage,
  githubContentConfig,
  loadSiteContent,
  saveSiteContent,
  uploadAboutSlideImage,
  uploadAchievementImage,
  uploadHeroBackgroundImage,
  uploadServiceSlideImage,
} from '../lib/githubContent';

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
  backgroundImage: string;
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
  slideIntervalMs: number;
  images: string[];
};

type AchievementTab = {
  id: string;
  label: string;
  title: string;
  description: string;
  images: string[];
};

type AchievementsContent = {
  eyebrow: string;
  title: string;
  description: string;
  tabs: AchievementTab[];
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
  images?: string[];
  slideIntervalMs?: number;
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
  achievements: AchievementsContent;
  services: ServicesContent;
  expertise: ExpertiseContent;
  strengths: StrengthsContent;
  contact: ContactContent;
  footer: FooterContent;
};

type StatusType = 'idle' | 'loading' | 'success' | 'error';

const MAX_ABOUT_IMAGES = 10;
const MAX_SERVICE_IMAGES = 10;

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
  children: ReactNode;
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

function EmptyImageBox({ text, subText }: { text: string; subText: string }) {
  return (
    <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center">
      <div>
        <ImagePlus size={34} className="mx-auto text-slate-400" />
        <p className="mt-3 text-sm font-bold text-slate-700">{text}</p>
        <p className="mt-1 text-xs text-slate-500">{subText}</p>
      </div>
    </div>
  );
}

export default function Admin() {
  const [repositoryOwner, setRepositoryOwner] = useState('');
  const [repositoryName, setRepositoryName] = useState('');
  const [token, setToken] = useState(() => localStorage.getItem('minyoung_github_token') || '');
  const [rememberToken, setRememberToken] = useState(() => Boolean(localStorage.getItem('minyoung_github_token')));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [status, setStatus] = useState<StatusType>('idle');
  const [message, setMessage] = useState('');
  const [selectedHeroImage, setSelectedHeroImage] = useState<File | null>(null);
  const [selectedAboutImages, setSelectedAboutImages] = useState<File[]>([]);
  const [aboutImagePreviewUrls, setAboutImagePreviewUrls] = useState<Record<string, string>>({});
  const [selectedServiceImages, setSelectedServiceImages] = useState<File[]>([]);
  const [serviceImagePreviewUrls, setServiceImagePreviewUrls] = useState<Record<string, string>>({});
  const [selectedAchievementImages, setSelectedAchievementImages] = useState<File[]>([]);
  const [achievementImagePreviewUrls, setAchievementImagePreviewUrls] = useState<Record<string, string>>({});
  const [selectedAchievementTabId, setSelectedAchievementTabId] = useState('patents');

  const isBusy = status === 'loading';

  const repositoryLabel = useMemo(() => {
    return `${githubContentConfig.owner}/${githubContentConfig.repo}`;
  }, []);

  const aboutImages = content?.about.images || [];
  const serviceImages = content?.services.images || [];
  const achievementTabs = content?.achievements.tabs || [];
  const activeAchievementTab =
    achievementTabs.find((tab) => tab.id === selectedAchievementTabId) ||
    achievementTabs[0];

  const totalAchievementImages = achievementTabs.reduce((sum, tab) => sum + (tab.images?.length || 0), 0);

  function setStatusMessage(nextStatus: StatusType, nextMessage: string) {
    setStatus(nextStatus);
    setMessage(nextMessage);
  }

  function validateLoginInfo() {
    if (repositoryOwner.trim() !== githubContentConfig.owner) {
      throw new Error(`Repository Owner는 ${githubContentConfig.owner}로 입력해주세요.`);
    }

    if (repositoryName.trim() !== githubContentConfig.repo) {
      throw new Error(`Repository Name은 ${githubContentConfig.repo}로 입력해주세요.`);
    }

    if (!token.trim()) {
      throw new Error('GitHub Personal Access Token을 입력해주세요.');
    }
  }

  async function handleLogin() {
    try {
      validateLoginInfo();

      setStatusMessage('loading', 'GitHub 저장소에 접속하는 중입니다.');

      if (rememberToken) {
        localStorage.setItem('minyoung_github_token', token.trim());
      } else {
        localStorage.removeItem('minyoung_github_token');
      }

      const result = await loadSiteContent(token);
      const loadedContent = result.content as SiteContent;

      setContent(loadedContent);
      setSelectedAchievementTabId(loadedContent.achievements?.tabs?.[0]?.id || 'patents');
      setIsAuthenticated(true);
      setStatusMessage('success', '관리자 페이지 접속이 완료되었습니다.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : '접속하지 못했습니다.');
    }
  }

  async function handleLoad() {
    try {
      setStatusMessage('loading', 'GitHub에서 홈페이지 데이터를 다시 불러오는 중입니다.');

      const result = await loadSiteContent(token);
      const loadedContent = result.content as SiteContent;

      setContent(loadedContent);
      setSelectedAchievementTabId(loadedContent.achievements?.tabs?.[0]?.id || 'patents');
      setStatusMessage('success', '홈페이지 데이터를 다시 불러왔습니다.');
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

      await saveSiteContent(token, content);
      setStatusMessage('success', '저장 완료! Cloudflare Pages가 자동으로 다시 배포됩니다. 보통 1~2분 정도 걸립니다.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : '저장하지 못했습니다.');
    }
  }

  async function handleHeroImageUpload() {
    if (!content) {
      setStatusMessage('error', '먼저 데이터를 불러와주세요.');
      return;
    }

    if (!selectedHeroImage) {
      setStatusMessage('error', '업로드할 이미지를 선택해주세요.');
      return;
    }

    try {
      setStatusMessage('loading', '메인 배경 이미지를 GitHub에 업로드하는 중입니다.');

      const uploadedImage = await uploadHeroBackgroundImage(token, selectedHeroImage);

      const nextContent: SiteContent = {
        ...content,
        hero: {
          ...content.hero,
          backgroundImage: uploadedImage.publicPath,
        },
      };

      await saveSiteContent(token, nextContent);

      setContent(nextContent);
      setSelectedHeroImage(null);
      setStatusMessage('success', '메인 배경 이미지가 업로드되었습니다. Cloudflare Pages가 자동으로 다시 배포됩니다.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.');
    }
  }

  async function handleHeroImageDelete() {
    if (!content) {
      setStatusMessage('error', '먼저 데이터를 불러와주세요.');
      return;
    }

    if (!content.hero.backgroundImage) {
      setStatusMessage('error', '삭제할 메인 배경 이미지가 없습니다.');
      return;
    }

    try {
      setStatusMessage('loading', '메인 배경 이미지를 삭제하는 중입니다.');

      await deleteUploadedImage(token, content.hero.backgroundImage);

      const nextContent: SiteContent = {
        ...content,
        hero: {
          ...content.hero,
          backgroundImage: '',
        },
      };

      await saveSiteContent(token, nextContent);

      setContent(nextContent);
      setSelectedHeroImage(null);
      setStatusMessage('success', '메인 배경 이미지가 삭제되었습니다. 기본 배경으로 돌아갑니다.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : '이미지 삭제에 실패했습니다.');
    }
  }

  async function handleAboutImageUpload() {
    if (!content) {
      setStatusMessage('error', '먼저 데이터를 불러와주세요.');
      return;
    }

    if (selectedAboutImages.length === 0) {
      setStatusMessage('error', '업로드할 회사소개 이미지를 선택해주세요.');
      return;
    }

    const currentImages = content.about.images || [];

    if (currentImages.length + selectedAboutImages.length > MAX_ABOUT_IMAGES) {
      setStatusMessage(
        'error',
        `회사소개 이미지는 최대 ${MAX_ABOUT_IMAGES}장까지 등록할 수 있습니다. 현재 ${currentImages.length}장이 등록되어 있으므로 ${MAX_ABOUT_IMAGES - currentImages.length}장까지만 추가할 수 있습니다.`
      );
      return;
    }

    try {
      setStatusMessage('loading', '회사소개 이미지를 GitHub에 업로드하는 중입니다.');

      const uploadedImagePaths: string[] = [];
      const nextPreviewUrls: Record<string, string> = {};

      for (const file of selectedAboutImages) {
        const uploadedImage = await uploadAboutSlideImage(token, file);
        uploadedImagePaths.push(uploadedImage.publicPath);
        nextPreviewUrls[uploadedImage.publicPath] = URL.createObjectURL(file);
      }

      const nextContent: SiteContent = {
        ...content,
        about: {
          ...content.about,
          images: [...currentImages, ...uploadedImagePaths],
        },
      };

      await saveSiteContent(token, nextContent);

      setContent(nextContent);
      setSelectedAboutImages([]);
      setAboutImagePreviewUrls((prev) => ({
        ...prev,
        ...nextPreviewUrls,
      }));
      setStatusMessage('success', '회사소개 이미지가 추가되었습니다. Cloudflare Pages가 자동으로 다시 배포됩니다.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : '회사소개 이미지 업로드에 실패했습니다.');
    }
  }

  async function handleAboutImageDelete(imagePath: string) {
    if (!content) {
      setStatusMessage('error', '먼저 데이터를 불러와주세요.');
      return;
    }

    try {
      setStatusMessage('loading', '회사소개 이미지를 삭제하는 중입니다.');

      await deleteUploadedImage(token, imagePath);

      const nextContent: SiteContent = {
        ...content,
        about: {
          ...content.about,
          images: (content.about.images || []).filter((image) => image !== imagePath),
        },
      };

      await saveSiteContent(token, nextContent);

      setContent(nextContent);
      setAboutImagePreviewUrls((prev) => {
        const nextPreviewUrls = { ...prev };
        delete nextPreviewUrls[imagePath];
        return nextPreviewUrls;
      });
      setStatusMessage('success', '회사소개 이미지가 삭제되었습니다. Cloudflare Pages가 자동으로 다시 배포됩니다.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : '회사소개 이미지 삭제에 실패했습니다.');
    }
  }

  async function handleServiceImageUpload() {
    if (!content) {
      setStatusMessage('error', '먼저 데이터를 불러와주세요.');
      return;
    }

    if (selectedServiceImages.length === 0) {
      setStatusMessage('error', '업로드할 사업 분야 이미지를 선택해주세요.');
      return;
    }

    const currentImages = content.services.images || [];

    if (currentImages.length + selectedServiceImages.length > MAX_SERVICE_IMAGES) {
      setStatusMessage(
        'error',
        `사업 분야 이미지는 최대 ${MAX_SERVICE_IMAGES}장까지 등록할 수 있습니다. 현재 ${currentImages.length}장이 등록되어 있으므로 ${MAX_SERVICE_IMAGES - currentImages.length}장까지만 추가할 수 있습니다.`
      );
      return;
    }

    try {
      setStatusMessage('loading', '사업 분야 이미지를 GitHub에 업로드하는 중입니다.');

      const uploadedImagePaths: string[] = [];
      const nextPreviewUrls: Record<string, string> = {};

      for (const file of selectedServiceImages) {
        const uploadedImage = await uploadServiceSlideImage(token, file);
        uploadedImagePaths.push(uploadedImage.publicPath);
        nextPreviewUrls[uploadedImage.publicPath] = URL.createObjectURL(file);
      }

      const nextContent: SiteContent = {
        ...content,
        services: {
          ...content.services,
          images: [...currentImages, ...uploadedImagePaths],
          slideIntervalMs: content.services.slideIntervalMs || 4000,
        },
      };

      await saveSiteContent(token, nextContent);

      setContent(nextContent);
      setSelectedServiceImages([]);
      setServiceImagePreviewUrls((prev) => ({
        ...prev,
        ...nextPreviewUrls,
      }));
      setStatusMessage('success', '사업 분야 이미지가 추가되었습니다. Cloudflare Pages가 자동으로 다시 배포됩니다.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : '사업 분야 이미지 업로드에 실패했습니다.');
    }
  }

  async function handleServiceImageDelete(imagePath: string) {
    if (!content) {
      setStatusMessage('error', '먼저 데이터를 불러와주세요.');
      return;
    }

    try {
      setStatusMessage('loading', '사업 분야 이미지를 삭제하는 중입니다.');

      await deleteUploadedImage(token, imagePath);

      const nextContent: SiteContent = {
        ...content,
        services: {
          ...content.services,
          images: (content.services.images || []).filter((image) => image !== imagePath),
        },
      };

      await saveSiteContent(token, nextContent);

      setContent(nextContent);
      setServiceImagePreviewUrls((prev) => {
        const nextPreviewUrls = { ...prev };
        delete nextPreviewUrls[imagePath];
        return nextPreviewUrls;
      });
      setStatusMessage('success', '사업 분야 이미지가 삭제되었습니다. Cloudflare Pages가 자동으로 다시 배포됩니다.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : '사업 분야 이미지 삭제에 실패했습니다.');
    }
  }

  async function handleAchievementImageUpload() {
    if (!content) {
      setStatusMessage('error', '먼저 데이터를 불러와주세요.');
      return;
    }

    if (!activeAchievementTab) {
      setStatusMessage('error', '이미지를 등록할 분류를 찾을 수 없습니다.');
      return;
    }

    if (selectedAchievementImages.length === 0) {
      setStatusMessage('error', '업로드할 인증 자료 이미지를 선택해주세요.');
      return;
    }

    try {
      setStatusMessage('loading', `${activeAchievementTab.label} 이미지를 GitHub에 업로드하는 중입니다.`);

      const uploadedImagePaths: string[] = [];
      const nextPreviewUrls: Record<string, string> = {};

      for (const file of selectedAchievementImages) {
        const uploadedImage = await uploadAchievementImage(
          token,
          file,
          activeAchievementTab.id
        );

        uploadedImagePaths.push(uploadedImage.publicPath);
        nextPreviewUrls[uploadedImage.publicPath] = URL.createObjectURL(file);
      }

      const nextContent: SiteContent = {
        ...content,
        achievements: {
          ...content.achievements,
          tabs: content.achievements.tabs.map((tab) =>
            tab.id === activeAchievementTab.id
              ? {
                  ...tab,
                  images: [...(tab.images || []), ...uploadedImagePaths],
                }
              : tab
          ),
        },
      };

      await saveSiteContent(token, nextContent);

      setContent(nextContent);
      setSelectedAchievementImages([]);
      setAchievementImagePreviewUrls((prev) => ({
        ...prev,
        ...nextPreviewUrls,
      }));
      setStatusMessage('success', `${activeAchievementTab.label} 이미지가 추가되었습니다. Cloudflare Pages가 자동으로 다시 배포됩니다.`);
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : '인증 자료 이미지 업로드에 실패했습니다.');
    }
  }

  async function handleAchievementImageDelete(tabId: string, imagePath: string) {
    if (!content) {
      setStatusMessage('error', '먼저 데이터를 불러와주세요.');
      return;
    }

    try {
      setStatusMessage('loading', '인증 자료 이미지를 삭제하는 중입니다.');

      await deleteUploadedImage(token, imagePath);

      const nextContent: SiteContent = {
        ...content,
        achievements: {
          ...content.achievements,
          tabs: content.achievements.tabs.map((tab) =>
            tab.id === tabId
              ? {
                  ...tab,
                  images: (tab.images || []).filter((image) => image !== imagePath),
                }
              : tab
          ),
        },
      };

      await saveSiteContent(token, nextContent);

      setContent(nextContent);
      setAchievementImagePreviewUrls((prev) => {
        const nextPreviewUrls = { ...prev };
        delete nextPreviewUrls[imagePath];
        return nextPreviewUrls;
      });
      setStatusMessage('success', '인증 자료 이미지가 삭제되었습니다. Cloudflare Pages가 자동으로 다시 배포됩니다.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : '인증 자료 이미지 삭제에 실패했습니다.');
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setContent(null);
    setStatus('idle');
    setMessage('');
    setSelectedHeroImage(null);
    setSelectedAboutImages([]);
    setAboutImagePreviewUrls({});
    setSelectedServiceImages([]);
    setServiceImagePreviewUrls({});
    setSelectedAchievementImages([]);
    setAchievementImagePreviewUrls({});

    if (!rememberToken) {
      setToken('');
      localStorage.removeItem('minyoung_github_token');
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

  function updateAchievementTab(tabId: string, key: keyof Pick<AchievementTab, 'label' | 'title' | 'description'>, value: string) {
    setContent((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        achievements: {
          ...prev.achievements,
          tabs: prev.achievements.tabs.map((tab) =>
            tab.id === tabId
              ? {
                  ...tab,
                  [key]: value,
                }
              : tab
          ),
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-[2rem] bg-zinc-950 px-8 py-10 text-white shadow-2xl sm:px-12">
          <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-blue-500">
            <KeyRound size={28} />
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tight">Admin CMS 접속</h1>
            <p className="mt-3 text-sm text-slate-300">
              GitHub Personal Access Token이 필요합니다.
            </p>
          </div>

          <div className="mt-10 space-y-6">
            <label className="block">
              <span className="block text-xs font-black uppercase tracking-wider text-white">
                Repository Owner
              </span>
              <input
                type="text"
                value={repositoryOwner}
                onChange={(event) => setRepositoryOwner(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/15 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
              />
            </label>

            <label className="block">
              <span className="block text-xs font-black uppercase tracking-wider text-white">
                Repository Name
              </span>
              <input
                type="text"
                value={repositoryName}
                onChange={(event) => setRepositoryName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/15 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
              />
            </label>

            <label className="block">
              <span className="block text-xs font-black uppercase tracking-wider text-white">
                Personal Access Token (Fine-grained)
              </span>
              <input
                type="password"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/15 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
              />
            </label>

            <label className="inline-flex items-center gap-2 text-xs text-slate-400">
              <input
                type="checkbox"
                checked={rememberToken}
                onChange={(event) => setRememberToken(event.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-zinc-900"
              />
              이 기기에 토큰 임시 저장
            </label>

            {message && (
              <div
                className={`rounded-2xl px-4 py-3 text-sm ${
                  status === 'error'
                    ? 'bg-red-500/10 text-red-200'
                    : status === 'success'
                      ? 'bg-emerald-500/10 text-emerald-200'
                      : 'bg-blue-500/10 text-blue-200'
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="button"
              onClick={handleLogin}
              disabled={isBusy}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isBusy ? <Loader2 size={18} className="animate-spin" /> : <Github size={18} />}
              인증 및 접속
            </button>

            <a
              href="/"
              className="block text-center text-xs font-bold text-slate-300 transition hover:text-white"
            >
              홈으로 돌아가기
            </a>
          </div>
        </div>
      </div>
    );
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

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                홈페이지로 돌아가기
              </a>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
              >
                <LogOut size={16} />
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900">연결된 저장소</p>
              <p className="mt-1 text-sm text-slate-500">
                {repositoryLabel} / {githubContentConfig.path}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleLoad}
                disabled={isBusy}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isBusy ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                데이터 새로고침
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
            <h2 className="mt-4 text-xl font-bold text-slate-900">데이터를 불러오는 중입니다.</h2>
          </div>
        ) : (
          <div className="space-y-6">
            <AdminSection
              title="메인 배경 이미지"
              description="홈페이지 첫 화면의 배경 이미지를 업로드하거나 삭제할 수 있습니다. 권장 크기는 1920×1080 이상, 용량은 5MB 이하입니다."
            >
              <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
                <div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center gap-3 text-slate-900">
                      <ImagePlus size={22} className="text-blue-600" />
                      <div>
                        <h3 className="font-bold">배경 이미지 업로드</h3>
                        <p className="mt-1 text-sm text-slate-500">
                          JPG, PNG, WEBP, GIF 파일을 사용할 수 있습니다.
                        </p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => setSelectedHeroImage(event.target.files?.[0] || null)}
                        className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-slate-800"
                      />

                      {selectedHeroImage && (
                        <p className="mt-3 text-sm text-slate-600">
                          선택된 파일: <strong>{selectedHeroImage.name}</strong>
                        </p>
                      )}
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={handleHeroImageUpload}
                        disabled={isBusy || !selectedHeroImage}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isBusy ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                        이미지 업로드 및 적용
                      </button>

                      <button
                        type="button"
                        onClick={handleHeroImageDelete}
                        disabled={isBusy || !content.hero.backgroundImage}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isBusy ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                        현재 이미지 삭제
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-bold text-slate-700">현재 배경 이미지</p>

                  {content.hero.backgroundImage ? (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                      <img
                        src={content.hero.backgroundImage}
                        alt="현재 메인 배경 이미지"
                        className="h-56 w-full object-cover"
                      />
                      <div className="border-t border-slate-200 bg-white p-4">
                        <p className="break-all text-xs text-slate-500">{content.hero.backgroundImage}</p>
                      </div>
                    </div>
                  ) : (
                    <EmptyImageBox
                      text="현재 설정된 이미지가 없습니다."
                      subText="기본 다크 그라데이션 배경이 표시됩니다."
                    />
                  )}
                </div>
              </div>
            </AdminSection>

            <AdminSection
              title="회사소개 슬라이드 이미지"
              description={`회사소개 오른쪽 영역에 표시될 이미지를 관리합니다. 최대 ${MAX_ABOUT_IMAGES}장까지 등록할 수 있으며, 여러 장이면 자동으로 전환됩니다.`}
            >
              <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-3 text-slate-900">
                    <ImagePlus size={22} className="text-blue-600" />
                    <div>
                      <h3 className="font-bold">회사소개 이미지 추가</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        JPG, PNG, WEBP, GIF 파일을 사용할 수 있습니다. 현재 {aboutImages.length}/{MAX_ABOUT_IMAGES}장 등록되어 있습니다.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) => setSelectedAboutImages(Array.from(event.target.files || []))}
                      className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-slate-800"
                    />

                    {selectedAboutImages.length > 0 && (
                      <div className="mt-3 rounded-xl bg-white p-3 text-sm text-slate-600">
                        <p className="font-bold text-slate-800">
                          선택된 파일 {selectedAboutImages.length}개
                        </p>

                        <ul className="mt-2 space-y-1">
                          {selectedAboutImages.map((file, index) => (
                            <li key={`${file.name}-${index}`} className="break-all text-xs text-slate-500">
                              {index + 1}. {file.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={handleAboutImageUpload}
                      disabled={isBusy || selectedAboutImages.length === 0 || aboutImages.length >= MAX_ABOUT_IMAGES}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isBusy ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                      회사소개 이미지 추가
                    </button>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-bold text-slate-700">등록된 회사소개 이미지</p>

                  {aboutImages.length > 0 ? (
                    <div className="space-y-4">
                      {aboutImages.map((image, index) => (
                        <div key={`${image}-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                          <img
                            src={aboutImagePreviewUrls[image] || image}
                            alt={`회사소개 이미지 ${index + 1}`}
                            className="h-40 w-full object-cover"
                            onError={(event) => {
                              event.currentTarget.style.display = 'none';
                            }}
                          />

                          <div className="space-y-3 border-t border-slate-200 p-4">
                            <p className="break-all text-xs text-slate-500">{image}</p>

                            <button
                              type="button"
                              onClick={() => handleAboutImageDelete(image)}
                              disabled={isBusy}
                              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isBusy ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                              이 이미지 삭제
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyImageBox
                      text="등록된 회사소개 이미지가 없습니다."
                      subText="이미지가 없으면 기존 MIN YOUNG 카드가 표시됩니다."
                    />
                  )}
                </div>
              </div>
            </AdminSection>

            <AdminSection
              title="사업 분야 슬라이드 이미지"
              description={`주요 사업 분야 섹션의 좌측에 표시될 이미지를 관리합니다. 최대 ${MAX_SERVICE_IMAGES}장까지 등록할 수 있으며, 여러 장이면 자동으로 전환됩니다.`}
            >
              <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-3 text-slate-900">
                    <ImagePlus size={22} className="text-blue-600" />
                    <div>
                      <h3 className="font-bold">사업 분야 이미지 추가</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        JPG, PNG, WEBP, GIF 파일을 사용할 수 있습니다. 현재 {serviceImages.length}/{MAX_SERVICE_IMAGES}장 등록되어 있습니다.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) => setSelectedServiceImages(Array.from(event.target.files || []))}
                      className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-slate-800"
                    />

                    {selectedServiceImages.length > 0 && (
                      <div className="mt-3 rounded-xl bg-white p-3 text-sm text-slate-600">
                        <p className="font-bold text-slate-800">
                          선택된 파일 {selectedServiceImages.length}개
                        </p>

                        <ul className="mt-2 max-h-36 space-y-1 overflow-auto pr-1">
                          {selectedServiceImages.map((file, index) => (
                            <li key={`${file.name}-${index}`} className="break-all text-xs text-slate-500">
                              {index + 1}. {file.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={handleServiceImageUpload}
                      disabled={isBusy || selectedServiceImages.length === 0 || serviceImages.length >= MAX_SERVICE_IMAGES}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isBusy ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                      사업 분야 이미지 추가
                    </button>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-bold text-slate-700">등록된 사업 분야 이미지</p>

                  {serviceImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {serviceImages.map((image, index) => (
                        <div key={`${image}-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                          <div className="aspect-[4/3] bg-slate-50 p-2">
                            <img
                              src={serviceImagePreviewUrls[image] || image}
                              alt={`사업 분야 이미지 ${index + 1}`}
                              className="h-full w-full object-contain"
                              onError={(event) => {
                                event.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>

                          <div className="space-y-2 border-t border-slate-200 p-3">
                            <p className="truncate text-xs font-bold text-slate-600">
                              사업 분야 {index + 1}
                            </p>

                            <button
                              type="button"
                              onClick={() => handleServiceImageDelete(image)}
                              disabled={isBusy}
                              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isBusy ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                              삭제
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyImageBox
                      text="등록된 사업 분야 이미지가 없습니다."
                      subText="이미지가 없으면 기본 다크 안내 박스가 표시됩니다."
                    />
                  )}
                </div>
              </div>
            </AdminSection>

            <AdminSection
              title="인증서 · 상패 · 특허 자료 관리"
              description="홈페이지에는 탭 없이 모든 이미지가 한눈에 보이는 갤러리로 표시됩니다. 여기서는 분류별로 업로드하고 삭제만 쉽게 관리합니다."
            >
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white">
                      <ImageIcon size={22} />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900">자료 업로드</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        분류를 고르고 여러 이미지를 한 번에 추가할 수 있습니다.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="mb-2 text-sm font-bold text-slate-700">업로드할 분류</p>
                    <div className="grid gap-2">
                      {achievementTabs.map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setSelectedAchievementTabId(tab.id)}
                          className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                            selectedAchievementTabId === tab.id
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <span className="flex items-center gap-2 text-sm font-bold">
                            {tab.id === 'patents' && <FileCheck2 size={17} />}
                            {tab.id === 'awards' && <Award size={17} />}
                            {tab.id === 'records' && <ShieldCheck size={17} />}
                            {tab.label}
                          </span>

                          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-500">
                            {tab.images?.length || 0}장
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) => setSelectedAchievementImages(Array.from(event.target.files || []))}
                      className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-slate-800"
                    />

                    {selectedAchievementImages.length > 0 && (
                      <div className="mt-3 rounded-xl bg-white p-3 text-sm text-slate-600">
                        <p className="font-bold text-slate-800">
                          선택된 파일 {selectedAchievementImages.length}개
                        </p>

                        <ul className="mt-2 max-h-36 space-y-1 overflow-auto pr-1">
                          {selectedAchievementImages.map((file, index) => (
                            <li key={`${file.name}-${index}`} className="break-all text-xs text-slate-500">
                              {index + 1}. {file.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleAchievementImageUpload}
                    disabled={isBusy || selectedAchievementImages.length === 0}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isBusy ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                    선택한 분류에 이미지 추가
                  </button>

                  <div className="mt-5 rounded-2xl bg-white p-4 text-sm text-slate-600">
                    <p className="font-bold text-slate-900">현재 전체 등록 수: {totalAchievementImages}장</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      홈페이지에서는 분류와 상관없이 모든 이미지가 한 줄 갤러리 형태로 정리되어 표시됩니다.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {achievementTabs.map((tab) => (
                    <div key={tab.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="flex items-center gap-2 text-lg font-black text-slate-900">
                            {tab.id === 'patents' && <FileCheck2 size={19} className="text-blue-600" />}
                            {tab.id === 'awards' && <Award size={19} className="text-blue-600" />}
                            {tab.id === 'records' && <ShieldCheck size={19} className="text-blue-600" />}
                            {tab.label}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            등록된 이미지 {tab.images?.length || 0}장
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedAchievementTabId(tab.id)}
                          className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
                        >
                          이 분류에 추가
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                        {tab.images && tab.images.length > 0 ? (
                          tab.images.map((image, index) => (
                            <div key={`${image}-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                              <div className="aspect-[3/4] bg-white p-2">
                                <img
                                  src={achievementImagePreviewUrls[image] || image}
                                  alt={`${tab.label} 이미지 ${index + 1}`}
                                  className="h-full w-full object-contain"
                                  onError={(event) => {
                                    event.currentTarget.style.display = 'none';
                                  }}
                                />
                              </div>

                              <div className="space-y-2 border-t border-slate-200 p-3">
                                <p className="truncate text-xs font-bold text-slate-600">
                                  {tab.label} {index + 1}
                                </p>

                                <button
                                  type="button"
                                  onClick={() => handleAchievementImageDelete(tab.id, image)}
                                  disabled={isBusy}
                                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {isBusy ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                  삭제
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 md:col-span-3">
                            아직 등록된 이미지가 없습니다.
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AdminSection>

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
                <TextInput
                  label="슬라이드 전환 시간(ms)"
                  value={String(content.about.slideIntervalMs || 4000)}
                  onChange={(value) => updateAbout('slideIntervalMs', Number(value) || 4000)}
                />
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
        <div className="flex flex-wrap items-center justify-center gap-2">
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
