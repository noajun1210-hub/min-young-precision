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
  uploadHeroSlideImage,
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
  backgroundImages?: string[];
  slideIntervalMs?: number;
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

const MAX_HERO_IMAGES = 10;
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

function ImageErrorFallback() {
  return (
    <div className="flex h-40 items-center justify-center bg-slate-100 px-4 text-center text-xs font-bold text-slate-400">
      ë°°í¬ ìë£ í ì´ë¯¸ì§ê° íìë©ëë¤.
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

  const [selectedHeroImages, setSelectedHeroImages] = useState<File[]>([]);
  const [heroImagePreviewUrls, setHeroImagePreviewUrls] = useState<Record<string, string>>({});

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

  const heroImages = content
    ? ((content.hero.backgroundImages && content.hero.backgroundImages.length > 0)
        ? content.hero.backgroundImages
        : content.hero.backgroundImage
          ? [content.hero.backgroundImage]
          : [])
    : [];

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
      throw new Error(`Repository Ownerë ${githubContentConfig.owner}ë¡ ìë ¥í´ì£¼ì¸ì.`);
    }

    if (repositoryName.trim() !== githubContentConfig.repo) {
      throw new Error(`Repository Nameì ${githubContentConfig.repo}ë¡ ìë ¥í´ì£¼ì¸ì.`);
    }

    if (!token.trim()) {
      throw new Error('GitHub Personal Access Tokenì ìë ¥í´ì£¼ì¸ì.');
    }
  }

  async function handleLogin() {
    try {
      validateLoginInfo();

      setStatusMessage('loading', 'GitHub ì ì¥ìì ì ìíë ì¤ìëë¤.');

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
      setStatusMessage('success', 'ê´ë¦¬ì íì´ì§ ì ìì´ ìë£ëììµëë¤.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : 'ì ìíì§ ëª»íìµëë¤.');
    }
  }

  async function handleLoad() {
    try {
      setStatusMessage('loading', 'GitHubìì ííì´ì§ ë°ì´í°ë¥¼ ë¤ì ë¶ë¬ì¤ë ì¤ìëë¤.');

      const result = await loadSiteContent(token);
      const loadedContent = result.content as SiteContent;

      setContent(loadedContent);
      setSelectedAchievementTabId(loadedContent.achievements?.tabs?.[0]?.id || 'patents');
      setStatusMessage('success', 'ííì´ì§ ë°ì´í°ë¥¼ ë¤ì ë¶ë¬ììµëë¤.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : 'ë°ì´í°ë¥¼ ë¶ë¬ì¤ì§ ëª»íìµëë¤.');
    }
  }

  async function handleSave() {
    if (!content) {
      setStatusMessage('error', 'ë¨¼ì  ë°ì´í°ë¥¼ ë¶ë¬ìì£¼ì¸ì.');
      return;
    }

    try {
      setStatusMessage('loading', 'ìì  ë´ì©ì GitHubì ì ì¥íë ì¤ìëë¤.');

      await saveSiteContent(token, content);
      setStatusMessage('success', 'ì ì¥ ìë£! Cloudflare Pagesê° ìëì¼ë¡ ë¤ì ë°°í¬ë©ëë¤. ë³´íµ 1~2ë¶ ì ë ê±¸ë¦½ëë¤.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : 'ì ì¥íì§ ëª»íìµëë¤.');
    }
  }

  async function handleHeroImageUpload() {
    if (!content) {
      setStatusMessage('error', 'ë¨¼ì  ë°ì´í°ë¥¼ ë¶ë¬ìì£¼ì¸ì.');
      return;
    }

    if (selectedHeroImages.length === 0) {
      setStatusMessage('error', 'ìë¡ëí  ë©ì¸ ëí ì´ë¯¸ì§ë¥¼ ì íí´ì£¼ì¸ì.');
      return;
    }

    if (heroImages.length + selectedHeroImages.length > MAX_HERO_IMAGES) {
      setStatusMessage(
        'error',
        `ë©ì¸ ëí ì´ë¯¸ì§ë ìµë ${MAX_HERO_IMAGES}ì¥ê¹ì§ ë±ë¡í  ì ììµëë¤. íì¬ ${heroImages.length}ì¥ì´ ë±ë¡ëì´ ìì¼ë¯ë¡ ${MAX_HERO_IMAGES - heroImages.length}ì¥ê¹ì§ë§ ì¶ê°í  ì ììµëë¤.`
      );
      return;
    }

    try {
      setStatusMessage('loading', 'ë©ì¸ ëí ì´ë¯¸ì§ë¥¼ GitHubì ìë¡ëíë ì¤ìëë¤.');

      const uploadedImagePaths: string[] = [];
      const nextPreviewUrls: Record<string, string> = {};

      for (const file of selectedHeroImages) {
        const uploadedImage = await uploadHeroSlideImage(token, file);
        uploadedImagePaths.push(uploadedImage.publicPath);
        nextPreviewUrls[uploadedImage.publicPath] = URL.createObjectURL(file);
      }

      const nextHeroImages = [...heroImages, ...uploadedImagePaths];

      const nextContent: SiteContent = {
        ...content,
        hero: {
          ...content.hero,
          backgroundImage: nextHeroImages[0] || '',
          backgroundImages: nextHeroImages,
          slideIntervalMs: content.hero.slideIntervalMs || 4500,
        },
      };

      await saveSiteContent(token, nextContent);

      setContent(nextContent);
      setSelectedHeroImages([]);
      setHeroImagePreviewUrls((prev) => ({
        ...prev,
        ...nextPreviewUrls,
      }));
      setStatusMessage('success', 'ë©ì¸ ëí ì´ë¯¸ì§ê° ì¶ê°ëììµëë¤. Cloudflare Pagesê° ìëì¼ë¡ ë¤ì ë°°í¬ë©ëë¤.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : 'ë©ì¸ ëí ì´ë¯¸ì§ ìë¡ëì ì¤í¨íìµëë¤.');
    }
  }

  async function handleHeroImageDelete(imagePath: string) {
    if (!content) {
      setStatusMessage('error', 'ë¨¼ì  ë°ì´í°ë¥¼ ë¶ë¬ìì£¼ì¸ì.');
      return;
    }

    try {
      setStatusMessage('loading', 'ë©ì¸ ëí ì´ë¯¸ì§ë¥¼ ì­ì íë ì¤ìëë¤.');

      await deleteUploadedImage(token, imagePath);

      const nextHeroImages = heroImages.filter((image) => image !== imagePath);

      const nextContent: SiteContent = {
        ...content,
        hero: {
          ...content.hero,
          backgroundImage: nextHeroImages[0] || '',
          backgroundImages: nextHeroImages,
          slideIntervalMs: content.hero.slideIntervalMs || 4500,
        },
      };

      await saveSiteContent(token, nextContent);

      setContent(nextContent);
      setHeroImagePreviewUrls((prev) => {
        const nextPreviewUrls = { ...prev };
        delete nextPreviewUrls[imagePath];
        return nextPreviewUrls;
      });
      setStatusMessage('success', 'ë©ì¸ ëí ì´ë¯¸ì§ê° ì­ì ëììµëë¤. Cloudflare Pagesê° ìëì¼ë¡ ë¤ì ë°°í¬ë©ëë¤.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : 'ë©ì¸ ëí ì´ë¯¸ì§ ì­ì ì ì¤í¨íìµëë¤.');
    }
  }

  async function handleAboutImageUpload() {
    if (!content) {
      setStatusMessage('error', 'ë¨¼ì  ë°ì´í°ë¥¼ ë¶ë¬ìì£¼ì¸ì.');
      return;
    }

    if (selectedAboutImages.length === 0) {
      setStatusMessage('error', 'ìë¡ëí  íì¬ìê° ì´ë¯¸ì§ë¥¼ ì íí´ì£¼ì¸ì.');
      return;
    }

    const currentImages = content.about.images || [];

    if (currentImages.length + selectedAboutImages.length > MAX_ABOUT_IMAGES) {
      setStatusMessage(
        'error',
        `íì¬ìê° ì´ë¯¸ì§ë ìµë ${MAX_ABOUT_IMAGES}ì¥ê¹ì§ ë±ë¡í  ì ììµëë¤. íì¬ ${currentImages.length}ì¥ì´ ë±ë¡ëì´ ìì¼ë¯ë¡ ${MAX_ABOUT_IMAGES - currentImages.length}ì¥ê¹ì§ë§ ì¶ê°í  ì ììµëë¤.`
      );
      return;
    }

    try {
      setStatusMessage('loading', 'íì¬ìê° ì´ë¯¸ì§ë¥¼ GitHubì ìë¡ëíë ì¤ìëë¤.');

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
      setStatusMessage('success', 'íì¬ìê° ì´ë¯¸ì§ê° ì¶ê°ëììµëë¤. Cloudflare Pagesê° ìëì¼ë¡ ë¤ì ë°°í¬ë©ëë¤.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : 'íì¬ìê° ì´ë¯¸ì§ ìë¡ëì ì¤í¨íìµëë¤.');
    }
  }

  async function handleAboutImageDelete(imagePath: string) {
    if (!content) {
      setStatusMessage('error', 'ë¨¼ì  ë°ì´í°ë¥¼ ë¶ë¬ìì£¼ì¸ì.');
      return;
    }

    try {
      setStatusMessage('loading', 'íì¬ìê° ì´ë¯¸ì§ë¥¼ ì­ì íë ì¤ìëë¤.');

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
      setStatusMessage('success', 'íì¬ìê° ì´ë¯¸ì§ê° ì­ì ëììµëë¤. Cloudflare Pagesê° ìëì¼ë¡ ë¤ì ë°°í¬ë©ëë¤.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : 'íì¬ìê° ì´ë¯¸ì§ ì­ì ì ì¤í¨íìµëë¤.');
    }
  }

  async function handleServiceImageUpload() {
    if (!content) {
      setStatusMessage('error', 'ë¨¼ì  ë°ì´í°ë¥¼ ë¶ë¬ìì£¼ì¸ì.');
      return;
    }

    if (selectedServiceImages.length === 0) {
      setStatusMessage('error', 'ìë¡ëí  ì¬ì ë¶ì¼ ì´ë¯¸ì§ë¥¼ ì íí´ì£¼ì¸ì.');
      return;
    }

    const currentImages = content.services.images || [];

    if (currentImages.length + selectedServiceImages.length > MAX_SERVICE_IMAGES) {
      setStatusMessage(
        'error',
        `ì¬ì ë¶ì¼ ì´ë¯¸ì§ë ìµë ${MAX_SERVICE_IMAGES}ì¥ê¹ì§ ë±ë¡í  ì ììµëë¤. íì¬ ${currentImages.length}ì¥ì´ ë±ë¡ëì´ ìì¼ë¯ë¡ ${MAX_SERVICE_IMAGES - currentImages.length}ì¥ê¹ì§ë§ ì¶ê°í  ì ììµëë¤.`
      );
      return;
    }

    try {
      setStatusMessage('loading', 'ì¬ì ë¶ì¼ ì´ë¯¸ì§ë¥¼ GitHubì ìë¡ëíë ì¤ìëë¤.');

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
      setStatusMessage('success', 'ì¬ì ë¶ì¼ ì´ë¯¸ì§ê° ì¶ê°ëììµëë¤. Cloudflare Pagesê° ìëì¼ë¡ ë¤ì ë°°í¬ë©ëë¤.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : 'ì¬ì ë¶ì¼ ì´ë¯¸ì§ ìë¡ëì ì¤í¨íìµëë¤.');
    }
  }

  async function handleServiceImageDelete(imagePath: string) {
    if (!content) {
      setStatusMessage('error', 'ë¨¼ì  ë°ì´í°ë¥¼ ë¶ë¬ìì£¼ì¸ì.');
      return;
    }

    try {
      setStatusMessage('loading', 'ì¬ì ë¶ì¼ ì´ë¯¸ì§ë¥¼ ì­ì íë ì¤ìëë¤.');

      await deleteUploadedImage(token, imagePath);

      const nextContent: SiteContent = {
        ...content,
        services: {
          ...content.services,
          images: (content.services.images || []).filter((image) => image !== imagePath),
          slideIntervalMs: content.services.slideIntervalMs || 4000,
        },
      };

      await saveSiteContent(token, nextContent);

      setContent(nextContent);
      setServiceImagePreviewUrls((prev) => {
        const nextPreviewUrls = { ...prev };
        delete nextPreviewUrls[imagePath];
        return nextPreviewUrls;
      });
      setStatusMessage('success', 'ì¬ì ë¶ì¼ ì´ë¯¸ì§ê° ì­ì ëììµëë¤. Cloudflare Pagesê° ìëì¼ë¡ ë¤ì ë°°í¬ë©ëë¤.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : 'ì¬ì ë¶ì¼ ì´ë¯¸ì§ ì­ì ì ì¤í¨íìµëë¤.');
    }
  }

  async function handleAchievementImageUpload() {
    if (!content) {
      setStatusMessage('error', 'ë¨¼ì  ë°ì´í°ë¥¼ ë¶ë¬ìì£¼ì¸ì.');
      return;
    }

    if (!activeAchievementTab) {
      setStatusMessage('error', 'ì´ë¯¸ì§ë¥¼ ë±ë¡í  ë¶ë¥ë¥¼ ì°¾ì ì ììµëë¤.');
      return;
    }

    if (selectedAchievementImages.length === 0) {
      setStatusMessage('error', 'ìë¡ëí  ì¸ì¦ ìë£ ì´ë¯¸ì§ë¥¼ ì íí´ì£¼ì¸ì.');
      return;
    }

    try {
      setStatusMessage('loading', `${activeAchievementTab.label} ì´ë¯¸ì§ë¥¼ GitHubì ìë¡ëíë ì¤ìëë¤.`);

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
      setStatusMessage('success', `${activeAchievementTab.label} ì´ë¯¸ì§ê° ì¶ê°ëììµëë¤. Cloudflare Pagesê° ìëì¼ë¡ ë¤ì ë°°í¬ë©ëë¤.`);
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : 'ì¸ì¦ ìë£ ì´ë¯¸ì§ ìë¡ëì ì¤í¨íìµëë¤.');
    }
  }

  async function handleAchievementImageDelete(tabId: string, imagePath: string) {
    if (!content) {
      setStatusMessage('error', 'ë¨¼ì  ë°ì´í°ë¥¼ ë¶ë¬ìì£¼ì¸ì.');
      return;
    }

    try {
      setStatusMessage('loading', 'ì¸ì¦ ìë£ ì´ë¯¸ì§ë¥¼ ì­ì íë ì¤ìëë¤.');

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
      setStatusMessage('success', 'ì¸ì¦ ìë£ ì´ë¯¸ì§ê° ì­ì ëììµëë¤. Cloudflare Pagesê° ìëì¼ë¡ ë¤ì ë°°í¬ë©ëë¤.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : 'ì¸ì¦ ìë£ ì´ë¯¸ì§ ì­ì ì ì¤í¨íìµëë¤.');
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setContent(null);
    setStatus('idle');
    setMessage('');
    setSelectedHeroImages([]);
    setHeroImagePreviewUrls({});
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

  function updateServices<Key extends keyof ServicesContent>(key: Key, value: ServicesContent[Key]) {
    setContent((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        services: {
          ...prev.services,
          [key]: value,
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
            <h1 className="text-2xl font-black tracking-tight">Admin CMS ì ì</h1>
            <p className="mt-3 text-sm text-slate-300">
              GitHub Personal Access Tokenì´ íìí©ëë¤.
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
              ì´ ê¸°ê¸°ì í í° ìì ì ì¥
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
              ì¸ì¦ ë° ì ì
            </button>

            <a
              href="/"
              className="block text-center text-xs font-bold text-slate-300 transition hover:text-white"
            >
              íì¼ë¡ ëìê°ê¸°
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
              <h1 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">ë¯¼ìì ë° ê´ë¦¬ì íì´ì§</h1>
              <p className="mt-4 max-w-2xl text-slate-300">
                ííì´ì§ ë¬¸êµ¬ì íì¬ ì ë³´ë¥¼ ìì í ë¤ GitHubì ì ì¥í©ëë¤. ì ì¥ í Cloudflare Pagesê° ìëì¼ë¡ ì¬ë°°í¬í©ëë¤.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                ííì´ì§ë¡ ëìê°ê¸°
              </a>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
              >
                <LogOut size={16} />
                ë¡ê·¸ìì
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900">ì°ê²°ë ì ì¥ì</p>
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
                ë°ì´í° ìë¡ê³ ì¹¨
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isBusy || !content}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isBusy ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                ì ì¥íê¸°
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
            <h2 className="mt-4 text-xl font-bold text-slate-900">ë°ì´í°ë¥¼ ë¶ë¬ì¤ë ì¤ìëë¤.</h2>
          </div>
        ) : (
          <div className="space-y-6">
            <AdminSection
              title="ë©ì¸ ëí ì´ë¯¸ì§ ì¬ë¼ì´ë"
              description={`ííì´ì§ ì²« íë©´ì ëí ì´ë¯¸ì§ë¥¼ ê´ë¦¬í©ëë¤. ìµë ${MAX_HERO_IMAGES}ì¥ê¹ì§ ë±ë¡í  ì ìì¼ë©°, ì¬ë¬ ì¥ì´ë©´ ìëì¼ë¡ ì íë©ëë¤.`}
            >
              <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-3 text-slate-900">
                    <ImagePlus size={22} className="text-blue-600" />
                    <div>
                      <h3 className="font-bold">ë©ì¸ ëí ì´ë¯¸ì§ ì¶ê°</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        JPG, PNG, WEBP, GIF íì¼ì ì¬ì©í  ì ììµëë¤. íì¬ {heroImages.length}/{MAX_HERO_IMAGES}ì¥ ë±ë¡ëì´ ììµëë¤.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) => setSelectedHeroImages(Array.from(event.target.files || []))}
                      className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-slate-800"
                    />

                    {selectedHeroImages.length > 0 && (
                      <div className="mt-3 rounded-xl bg-white p-3 text-sm text-slate-600">
                        <p className="font-bold text-slate-800">
                          ì íë íì¼ {selectedHeroImages.length}ê°
                        </p>

                        <ul className="mt-2 max-h-36 space-y-1 overflow-auto pr-1">
                          {selectedHeroImages.map((file, index) => (
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
                    onClick={handleHeroImageUpload}
                    disabled={isBusy || selectedHeroImages.length === 0 || heroImages.length >= MAX_HERO_IMAGES}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isBusy ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                    ë©ì¸ ëí ì´ë¯¸ì§ ì¶ê°
                  </button>

                  <div className="mt-5">
                    <TextInput
                      label="ë©ì¸ ì´ë¯¸ì§ ì í ìê°(ms)"
                      value={String(content.hero.slideIntervalMs || 4500)}
                      onChange={(value) => updateHero('slideIntervalMs', Number(value) || 4500)}
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-bold text-slate-700">ë±ë¡ë ë©ì¸ ëí ì´ë¯¸ì§</p>

                  {heroImages.length > 0 ? (
                    <div className="space-y-4">
                      {heroImages.map((image, index) => (
                        <div key={`${image}-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                          <img
                            src={heroImagePreviewUrls[image] || image}
                            alt={`ë©ì¸ ëí ì´ë¯¸ì§ ${index + 1}`}
                            className="h-40 w-full object-cover"
                            onError={(event) => {
                              event.currentTarget.style.display = 'none';
                            }}
                          />

                          <div className="space-y-3 border-t border-slate-200 p-4">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-xs font-bold text-slate-700">
                                {index === 0 ? 'ëí 1ë² ì´ë¯¸ì§' : `ì¬ë¼ì´ë ì´ë¯¸ì§ ${index + 1}`}
                              </p>
                              {index === 0 && (
                                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                                  ê¸°ë³¸ ëí
                                </span>
                              )}
                            </div>

                            <p className="break-all text-xs text-slate-500">{image}</p>

                            <button
                              type="button"
                              onClick={() => handleHeroImageDelete(image)}
                              disabled={isBusy}
                              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isBusy ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                              ì´ ì´ë¯¸ì§ ì­ì 
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyImageBox
                      text="ë±ë¡ë ë©ì¸ ëí ì´ë¯¸ì§ê° ììµëë¤."
                      subText="ì´ë¯¸ì§ê° ìì¼ë©´ ê¸°ë³¸ ë¤í¬ ë°°ê²½ì´ íìë©ëë¤."
                    />
                  )}
                </div>
              </div>
            </AdminSection>

            <AdminSection
              title="íì¬ìê° ì¬ë¼ì´ë ì´ë¯¸ì§"
              description={`íì¬ìê° ì¤ë¥¸ìª½ ìì­ì íìë  ì´ë¯¸ì§ë¥¼ ê´ë¦¬í©ëë¤. ìµë ${MAX_ABOUT_IMAGES}ì¥ê¹ì§ ë±ë¡í  ì ìì¼ë©°, ì¬ë¬ ì¥ì´ë©´ ìëì¼ë¡ ì íë©ëë¤.`}
            >
              <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-3 text-slate-900">
                    <ImagePlus size={22} className="text-blue-600" />
                    <div>
                      <h3 className="font-bold">íì¬ìê° ì´ë¯¸ì§ ì¶ê°</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        JPG, PNG, WEBP, GIF íì¼ì ì¬ì©í  ì ììµëë¤. íì¬ {aboutImages.length}/{MAX_ABOUT_IMAGES}ì¥ ë±ë¡ëì´ ììµëë¤.
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
                          ì íë íì¼ {selectedAboutImages.length}ê°
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
                      íì¬ìê° ì´ë¯¸ì§ ì¶ê°
                    </button>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-bold text-slate-700">ë±ë¡ë íì¬ìê° ì´ë¯¸ì§</p>

                  {aboutImages.length > 0 ? (
                    <div className="space-y-4">
                      {aboutImages.map((image, index) => (
                        <div key={`${image}-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                          <img
                            src={aboutImagePreviewUrls[image] || image}
                            alt={`íì¬ìê° ì´ë¯¸ì§ ${index + 1}`}
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
                              ì´ ì´ë¯¸ì§ ì­ì 
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyImageBox
                      text="ë±ë¡ë íì¬ìê° ì´ë¯¸ì§ê° ììµëë¤."
                      subText="ì´ë¯¸ì§ê° ìì¼ë©´ ê¸°ì¡´ MIN YOUNG ì¹´ëê° íìë©ëë¤."
                    />
                  )}
                </div>
              </div>
            </AdminSection>

            <AdminSection
              title="ì¬ì ë¶ì¼ ì¬ë¼ì´ë ì´ë¯¸ì§"
              description={`ì£¼ì ì¬ì ë¶ì¼ ì¹ì ì¼ìª½ì íìë  ì´ë¯¸ì§ë¥¼ ê´ë¦¬í©ëë¤. ìµë ${MAX_SERVICE_IMAGES}ì¥ê¹ì§ ë±ë¡í  ì ììµëë¤.`}
            >
              <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-3 text-slate-900">
                    <ImagePlus size={22} className="text-blue-600" />
                    <div>
                      <h3 className="font-bold">ì¬ì ë¶ì¼ ì´ë¯¸ì§ ì¶ê°</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        JPG, PNG, WEBP, GIF íì¼ì ì¬ì©í  ì ììµëë¤. íì¬ {serviceImages.length}/{MAX_SERVICE_IMAGES}ì¥ ë±ë¡ëì´ ììµëë¤.
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
                          ì íë íì¼ {selectedServiceImages.length}ê°
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

                  <button
                    type="button"
                    onClick={handleServiceImageUpload}
                    disabled={isBusy || selectedServiceImages.length === 0 || serviceImages.length >= MAX_SERVICE_IMAGES}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isBusy ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                    ì¬ì ë¶ì¼ ì´ë¯¸ì§ ì¶ê°
                  </button>

                  <div className="mt-5">
                    <TextInput
                      label="ì¬ì ë¶ì¼ ì´ë¯¸ì§ ì í ìê°(ms)"
                      value={String(content.services.slideIntervalMs || 4000)}
                      onChange={(value) => updateServices('slideIntervalMs', Number(value) || 4000)}
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-bold text-slate-700">ë±ë¡ë ì¬ì ë¶ì¼ ì´ë¯¸ì§</p>

                  {serviceImages.length > 0 ? (
                    <div className="space-y-4">
                      {serviceImages.map((image, index) => (
                        <div key={`${image}-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                          <img
                            src={serviceImagePreviewUrls[image] || image}
                            alt={`ì¬ì ë¶ì¼ ì´ë¯¸ì§ ${index + 1}`}
                            className="h-40 w-full object-cover"
                            onError={(event) => {
                              event.currentTarget.style.display = 'none';
                            }}
                          />

                          <div className="space-y-3 border-t border-slate-200 p-4">
                            <p className="break-all text-xs text-slate-500">{image}</p>

                            <button
                              type="button"
                              onClick={() => handleServiceImageDelete(image)}
                              disabled={isBusy}
                              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isBusy ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                              ì´ ì´ë¯¸ì§ ì­ì 
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyImageBox
                      text="ë±ë¡ë ì¬ì ë¶ì¼ ì´ë¯¸ì§ê° ììµëë¤."
                      subText="ì´ë¯¸ì§ê° ìì¼ë©´ ê¸°ë³¸ ìë´ ë°ì¤ê° íìë©ëë¤."
                    />
                  )}
                </div>
              </div>
            </AdminSection>

            <AdminSection
              title="ì¸ì¦ì Â· ìí¨ Â· í¹í ìë£ ê´ë¦¬"
              description="ííì´ì§ìë í­ ìì´ ëª¨ë  ì´ë¯¸ì§ê° íëì ë³´ì´ë ê°¤ë¬ë¦¬ë¡ íìë©ëë¤. ì¬ê¸°ìë ë¶ë¥ë³ë¡ ìë¡ëíê³  ì­ì ë§ ì½ê² ê´ë¦¬í©ëë¤."
            >
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white">
                      <ImageIcon size={22} />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900">ìë£ ìë¡ë</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        ë¶ë¥ë¥¼ ê³ ë¥´ê³  ì¬ë¬ ì´ë¯¸ì§ë¥¼ í ë²ì ì¶ê°í  ì ììµëë¤.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="mb-2 text-sm font-bold text-slate-700">ìë¡ëí  ë¶ë¥</p>
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
                            {tab.images?.length || 0}ì¥
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
                          ì íë íì¼ {selectedAchievementImages.length}ê°
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
                    ì íí ë¶ë¥ì ì´ë¯¸ì§ ì¶ê°
                  </button>

                  <div className="mt-5 rounded-2xl bg-white p-4 text-sm text-slate-600">
                    <p className="font-bold text-slate-900">íì¬ ì ì²´ ë±ë¡ ì: {totalAchievementImages}ì¥</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      ííì´ì§ììë ë¶ë¥ì ìê´ìì´ ëª¨ë  ì´ë¯¸ì§ê° í ì¤ ê°¤ë¬ë¦¬ ííë¡ ì ë¦¬ëì´ íìë©ëë¤.
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
                            ë±ë¡ë ì´ë¯¸ì§ {tab.images?.length || 0}ì¥
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedAchievementTabId(tab.id)}
                          className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
                        >
                          ì´ ë¶ë¥ì ì¶ê°
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                        {tab.images && tab.images.length > 0 ? (
                          tab.images.map((image, index) => (
                            <div key={`${image}-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                              <div className="aspect-[3/4] bg-white p-2">
                                <img
                                  src={achievementImagePreviewUrls[image] || image}
                                  alt={`${tab.label} ì´ë¯¸ì§ ${index + 1}`}
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
                                  ì­ì 
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 md:col-span-3">
                            ìì§ ë±ë¡ë ì´ë¯¸ì§ê° ììµëë¤.
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AdminSection>

            <AdminSection title="íì¬ ê¸°ë³¸ ì ë³´" description="íì¬ëª, ëíì, ì°ë½ì², ì£¼ì ë± ííì´ì§ ì ë°ì ì¬ì©ëë ì ë³´ìëë¤.">
              <div className="grid gap-5 md:grid-cols-2">
                <TextInput label="íì¬ëª" value={content.company.name} onChange={(value) => updateCompany('name', value)} />
                <TextInput label="ìë¬¸ íì¬ëª" value={content.company.englishName} onChange={(value) => updateCompany('englishName', value)} />
                <TextInput label="ëíì" value={content.company.representative} onChange={(value) => updateCompany('representative', value)} />
                <TextInput label="ì´ë©ì¼" type="email" value={content.company.email} onChange={(value) => updateCompany('email', value)} />
                <TextInput label="ì íë²í¸" value={content.company.phone} onChange={(value) => updateCompany('phone', value)} />
                <TextInput label="í©ì¤ë²í¸" value={content.company.fax} onChange={(value) => updateCompany('fax', value)} />
                <TextInput label="ì£¼ì" value={content.company.address} onChange={(value) => updateCompany('address', value)} />
                <TextInput label="ì¬ììë±ë¡ë²í¸" value={content.company.businessNumber} onChange={(value) => updateCompany('businessNumber', value)} />
                <div className="md:col-span-2">
                  <TextInput label="í¸í° ìë¬¸ ë¬¸êµ¬" value={content.company.tagline} onChange={(value) => updateCompany('tagline', value)} />
                </div>
              </div>
            </AdminSection>

            <AdminSection title="ë©ì¸ íë©´" description="ííì´ì§ ì²« íë©´ì ë³´ì´ë í° ë¬¸êµ¬ì ë²í¼ìëë¤.">
              <div className="grid gap-5 md:grid-cols-2">
                <TextInput label="ìë¨ ìë¬¸ ë¬¸êµ¬" value={content.hero.eyebrow} onChange={(value) => updateHero('eyebrow', value)} />
                <TextInput label="ê°ì¡°í  ë¨ì´" value={content.hero.highlight} onChange={(value) => updateHero('highlight', value)} />
                <div className="md:col-span-2">
                  <TextInput label="í° ì ëª©" value={content.hero.title} onChange={(value) => updateHero('title', value)} />
                </div>
                <div className="md:col-span-2">
                  <TextArea label="ì¤ëª ë¬¸êµ¬" rows={4} value={content.hero.description} onChange={(value) => updateHero('description', value)} />
                </div>
                <TextInput label="ì²« ë²ì§¸ ë²í¼ ë¬¸êµ¬" value={content.hero.primaryButton.label} onChange={(value) => updateHero('primaryButton', { ...content.hero.primaryButton, label: value })} />
                <TextInput label="ì²« ë²ì§¸ ë²í¼ ë§í¬" value={content.hero.primaryButton.href} onChange={(value) => updateHero('primaryButton', { ...content.hero.primaryButton, href: value })} />
                <TextInput label="ë ë²ì§¸ ë²í¼ ë¬¸êµ¬" value={content.hero.secondaryButton.label} onChange={(value) => updateHero('secondaryButton', { ...content.hero.secondaryButton, label: value })} />
                <TextInput label="ë ë²ì§¸ ë²í¼ ë§í¬" value={content.hero.secondaryButton.href} onChange={(value) => updateHero('secondaryButton', { ...content.hero.secondaryButton, href: value })} />
              </div>
            </AdminSection>

            <AdminSection title="íì¬ ìê°" description="íì¬ ìê° ì¹ìì ì ëª©ê³¼ ë³¸ë¬¸ìëë¤.">
              <div className="grid gap-5 md:grid-cols-2">
                <TextInput label="ìì ëª©" value={content.about.eyebrow} onChange={(value) => updateAbout('eyebrow', value)} />
                <TextInput label="ì¤ë¥¸ìª½ ë°ì¤ ì ëª©" value={content.about.visualTitle} onChange={(value) => updateAbout('visualTitle', value)} />
                <div className="md:col-span-2">
                  <TextArea label="ìê° ì ëª©" rows={3} value={content.about.title} onChange={(value) => updateAbout('title', value)} />
                </div>
                <TextInput label="ì¤ë¥¸ìª½ ë°ì¤ ë³´ì¡° ë¬¸êµ¬" value={content.about.visualSubtitle} onChange={(value) => updateAbout('visualSubtitle', value)} />
                <TextInput
                  label="íì¬ìê° ì¬ë¼ì´ë ì í ìê°(ms)"
                  value={String(content.about.slideIntervalMs || 4000)}
                  onChange={(value) => updateAbout('slideIntervalMs', Number(value) || 4000)}
                />
              </div>

              <div className="mt-6 space-y-4">
                {content.about.paragraphs.map((paragraph, index) => (
                  <TextArea
                    key={index}
                    label={`ìê° ë³¸ë¬¸ ${index + 1}`}
                    value={paragraph}
                    onChange={(value) => updateAboutParagraph(index, value)}
                  />
                ))}
              </div>
            </AdminSection>

            <AdminSection title="ì£¼ì ì¬ì ë¶ì¼" description="ì¬ì ë¶ì¼ ì¹´ëì ì ëª©, ì¤ëª, ìì´ì½ ì´ë¦ì ìì í©ëë¤.">
              <div className="grid gap-5 md:grid-cols-2">
                <TextInput
                  label="ìì ëª©"
                  value={content.services.eyebrow}
                  onChange={(value) => updateServices('eyebrow', value)}
                />
                <TextInput
                  label="ì ëª©"
                  value={content.services.title}
                  onChange={(value) => updateServices('title', value)}
                />
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {content.services.items.map((item, index) => (
                  <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="mb-4 font-bold text-slate-900">ì¬ì ë¶ì¼ {index + 1}</h3>
                    <div className="space-y-4">
                      <TextInput label="ì ëª©" value={item.title} onChange={(value) => updateService(index, 'title', value)} />
                      <TextArea label="ì¤ëª" value={item.description} onChange={(value) => updateService(index, 'description', value)} />
                      <TextInput label="ìì´ì½ ì´ë¦" value={item.icon} onChange={(value) => updateService(index, 'icon', value)} />
                    </div>
                  </div>
                ))}
              </div>
            </AdminSection>

            <AdminSection title="ì ë¬¸ ê¸°ì " description="ì½ë ì², MCT, CNC ë± ì ë¬¸ ê¸°ì  ê´ë ¨ ë¬¸êµ¬ìëë¤.">
              <div className="grid gap-5 md:grid-cols-2">
                <TextInput label="ìì ëª©" value={content.expertise.eyebrow} onChange={(value) => updateExpertise('eyebrow', value)} />
                <TextInput label="ì ëª©" value={content.expertise.title} onChange={(value) => updateExpertise('title', value)} />
                <div className="md:col-span-2">
                  <TextInput label="ë©ì¸ ì ëª©" value={content.expertise.mainTitle} onChange={(value) => updateExpertise('mainTitle', value)} />
                </div>
                <div className="md:col-span-2">
                  <TextArea label="ë©ì¸ ì¤ëª" value={content.expertise.mainDescription} onChange={(value) => updateExpertise('mainDescription', value)} />
                </div>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {content.expertise.points.map((point, index) => (
                  <TextInput
                    key={index}
                    label={`ê¸°ì  í¬ì¸í¸ ${index + 1}`}
                    value={point}
                    onChange={(value) => updateExpertisePoint(index, value)}
                  />
                ))}
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {content.expertise.cards.map((card, index) => (
                  <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="mb-4 font-bold text-slate-900">ê¸°ì  ì¹´ë {index + 1}</h3>
                    <div className="space-y-4">
                      <TextInput label="ì ëª©" value={card.title} onChange={(value) => updateExpertiseCard(index, 'title', value)} />
                      <TextArea label="ì¤ëª" value={card.description} onChange={(value) => updateExpertiseCard(index, 'description', value)} />
                    </div>
                  </div>
                ))}
              </div>
            </AdminSection>

            <AdminSection title="ê²½ìë ¥" description="ë¯¼ìì ë°ì ê°ì  ì¹´ëìëë¤.">
              <div className="grid gap-5 md:grid-cols-2">
                <TextInput
                  label="ìì ëª©"
                  value={content.strengths.eyebrow}
                  onChange={(value) =>
                    setContent((prev) =>
                      prev ? { ...prev, strengths: { ...prev.strengths, eyebrow: value } } : prev
                    )
                  }
                />
                <TextInput
                  label="ì ëª©"
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
                    <h3 className="mb-4 font-bold text-slate-900">ê²½ìë ¥ {index + 1}</h3>
                    <div className="space-y-4">
                      <TextInput label="ì ëª©" value={item.title} onChange={(value) => updateStrength(index, 'title', value)} />
                      <TextArea label="ì¤ëª" value={item.description} onChange={(value) => updateStrength(index, 'description', value)} />
                      <TextInput label="ìì´ì½ ì´ë¦" value={item.icon} onChange={(value) => updateStrength(index, 'icon', value)} />
                    </div>
                  </div>
                ))}
              </div>
            </AdminSection>

            <AdminSection title="ë¬¸ì ìì­" description="ë¬¸ìíê¸° ì¹ìê³¼ ì´ë©ì¼ ë²í¼ ë¬¸êµ¬ìëë¤.">
              <div className="grid gap-5 md:grid-cols-2">
                <TextInput label="ë¬¸ì ì ëª©" value={content.contact.title} onChange={(value) => updateContact('title', value)} />
                <TextInput label="ë²í¼ ì ëª©" value={content.contact.emailButtonTitle} onChange={(value) => updateContact('emailButtonTitle', value)} />
                <div className="md:col-span-2">
                  <TextArea label="ë¬¸ì ì¤ëª" value={content.contact.description} onChange={(value) => updateContact('description', value)} />
                </div>
                <TextInput label="ë²í¼ ì¤ëª" value={content.contact.emailButtonDescription} onChange={(value) => updateContact('emailButtonDescription', value)} />
                <TextInput label="ë²í¼ ìì ë¬¸êµ¬" value={content.contact.emailButtonSmallText} onChange={(value) => updateContact('emailButtonSmallText', value)} />
              </div>
            </AdminSection>

            <AdminSection title="í¸í°" description="íë¨ ì ìê¶ ë¬¸êµ¬ìëë¤.">
              <TextInput label="ì ìê¶ ë¬¸êµ¬" value={content.footer.copyrightText} onChange={(value) => updateFooter('copyrightText', value)} />
            </AdminSection>

            <div className="sticky bottom-4 z-20 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-600">
                  ìì  í ë°ëì <strong className="text-slate-900">ì ì¥íê¸°</strong>ë¥¼ ëë¬ì¼ ííì´ì§ì ë°ìë©ëë¤.
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isBusy || !content}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isBusy ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  ì ì¥íê¸°
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
          <span>Â·</span>
          <Mail size={14} />
          <span>GitHub Contents API</span>
          <span>Â·</span>
          <MapPin size={14} />
          <span>Cloudflare Pages</span>
        </div>
      </footer>
    </div>
  );
}
