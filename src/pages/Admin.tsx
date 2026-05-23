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
      &#xBC30;&#xD3EC; &#xC644;&#xB8CC; &#xD6C4; &#xC774;&#xBBF8;&#xC9C0;&#xAC00; &#xD45C;&#xC2DC;&#xB429;&#xB2C8;&#xB2E4;.
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
      throw new Error(`Repository Owner\uB294 ${githubContentConfig.owner}\uB85C \uC785\uB825\uD574\uC8FC\uC138\uC694.`);
    }

    if (repositoryName.trim() !== githubContentConfig.repo) {
      throw new Error(`Repository Name\uC740 ${githubContentConfig.repo}\uB85C \uC785\uB825\uD574\uC8FC\uC138\uC694.`);
    }

    if (!token.trim()) {
      throw new Error('GitHub Personal Access Token\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.');
    }
  }

  async function handleLogin() {
    try {
      validateLoginInfo();

      setStatusMessage('loading', 'GitHub \uC800\uC7A5\uC18C\uC5D0 \uC811\uC18D\uD558\uB294 \uC911\uC785\uB2C8\uB2E4.');

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
      setStatusMessage('success', '\uAD00\uB9AC\uC790 \uD398\uC774\uC9C0 \uC811\uC18D\uC774 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : '\uC811\uC18D\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.');
    }
  }

  async function handleLoad() {
    try {
      setStatusMessage('loading', 'GitHub\uC5D0\uC11C \uD648\uD398\uC774\uC9C0 \uB370\uC774\uD130\uB97C \uB2E4\uC2DC \uBD88\uB7EC\uC624\uB294 \uC911\uC785\uB2C8\uB2E4.');

      const result = await loadSiteContent(token);
      const loadedContent = result.content as SiteContent;

      setContent(loadedContent);
      setSelectedAchievementTabId(loadedContent.achievements?.tabs?.[0]?.id || 'patents');
      setStatusMessage('success', '\uD648\uD398\uC774\uC9C0 \uB370\uC774\uD130\uB97C \uB2E4\uC2DC \uBD88\uB7EC\uC654\uC2B5\uB2C8\uB2E4.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : '\uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.');
    }
  }

  async function handleSave() {
    if (!content) {
      setStatusMessage('error', '\uBA3C\uC800 \uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC640\uC8FC\uC138\uC694.');
      return;
    }

    try {
      setStatusMessage('loading', '\uC218\uC815 \uB0B4\uC6A9\uC744 GitHub\uC5D0 \uC800\uC7A5\uD558\uB294 \uC911\uC785\uB2C8\uB2E4.');

      await saveSiteContent(token, content);
      setStatusMessage('success', '\uC800\uC7A5 \uC644\uB8CC! Cloudflare Pages\uAC00 \uC790\uB3D9\uC73C\uB85C \uB2E4\uC2DC \uBC30\uD3EC\uB429\uB2C8\uB2E4. \uBCF4\uD1B5 1~2\uBD84 \uC815\uB3C4 \uAC78\uB9BD\uB2C8\uB2E4.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : '\uC800\uC7A5\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.');
    }
  }

  async function handleHeroImageUpload() {
    if (!content) {
      setStatusMessage('error', '\uBA3C\uC800 \uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC640\uC8FC\uC138\uC694.');
      return;
    }

    if (selectedHeroImages.length === 0) {
      setStatusMessage('error', '\uC5C5\uB85C\uB4DC\uD560 \uBA54\uC778 \uB300\uD45C \uC774\uBBF8\uC9C0\uB97C \uC120\uD0DD\uD574\uC8FC\uC138\uC694.');
      return;
    }

    if (heroImages.length + selectedHeroImages.length > MAX_HERO_IMAGES) {
      setStatusMessage(
        'error',
        `\uBA54\uC778 \uB300\uD45C \uC774\uBBF8\uC9C0\uB294 \uCD5C\uB300 ${MAX_HERO_IMAGES}\uC7A5\uAE4C\uC9C0 \uB4F1\uB85D\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uD604\uC7AC ${heroImages.length}\uC7A5\uC774 \uB4F1\uB85D\uB418\uC5B4 \uC788\uC73C\uBBC0\uB85C ${MAX_HERO_IMAGES - heroImages.length}\uC7A5\uAE4C\uC9C0\uB9CC \uCD94\uAC00\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.`
      );
      return;
    }

    try {
      setStatusMessage('loading', '\uBA54\uC778 \uB300\uD45C \uC774\uBBF8\uC9C0\uB97C GitHub\uC5D0 \uC5C5\uB85C\uB4DC\uD558\uB294 \uC911\uC785\uB2C8\uB2E4.');

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
      setStatusMessage('success', '\uBA54\uC778 \uB300\uD45C \uC774\uBBF8\uC9C0\uAC00 \uCD94\uAC00\uB418\uC5C8\uC2B5\uB2C8\uB2E4. Cloudflare Pages\uAC00 \uC790\uB3D9\uC73C\uB85C \uB2E4\uC2DC \uBC30\uD3EC\uB429\uB2C8\uB2E4.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : '\uBA54\uC778 \uB300\uD45C \uC774\uBBF8\uC9C0 \uC5C5\uB85C\uB4DC\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.');
    }
  }

  async function handleHeroImageDelete(imagePath: string) {
    if (!content) {
      setStatusMessage('error', '\uBA3C\uC800 \uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC640\uC8FC\uC138\uC694.');
      return;
    }

    try {
      setStatusMessage('loading', '\uBA54\uC778 \uB300\uD45C \uC774\uBBF8\uC9C0\uB97C \uC0AD\uC81C\uD558\uB294 \uC911\uC785\uB2C8\uB2E4.');

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
      setStatusMessage('success', '\uBA54\uC778 \uB300\uD45C \uC774\uBBF8\uC9C0\uAC00 \uC0AD\uC81C\uB418\uC5C8\uC2B5\uB2C8\uB2E4. Cloudflare Pages\uAC00 \uC790\uB3D9\uC73C\uB85C \uB2E4\uC2DC \uBC30\uD3EC\uB429\uB2C8\uB2E4.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : '\uBA54\uC778 \uB300\uD45C \uC774\uBBF8\uC9C0 \uC0AD\uC81C\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.');
    }
  }

  async function handleAboutImageUpload() {
    if (!content) {
      setStatusMessage('error', '\uBA3C\uC800 \uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC640\uC8FC\uC138\uC694.');
      return;
    }

    if (selectedAboutImages.length === 0) {
      setStatusMessage('error', '\uC5C5\uB85C\uB4DC\uD560 \uD68C\uC0AC\uC18C\uAC1C \uC774\uBBF8\uC9C0\uB97C \uC120\uD0DD\uD574\uC8FC\uC138\uC694.');
      return;
    }

    const currentImages = content.about.images || [];

    if (currentImages.length + selectedAboutImages.length > MAX_ABOUT_IMAGES) {
      setStatusMessage(
        'error',
        `\uD68C\uC0AC\uC18C\uAC1C \uC774\uBBF8\uC9C0\uB294 \uCD5C\uB300 ${MAX_ABOUT_IMAGES}\uC7A5\uAE4C\uC9C0 \uB4F1\uB85D\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uD604\uC7AC ${currentImages.length}\uC7A5\uC774 \uB4F1\uB85D\uB418\uC5B4 \uC788\uC73C\uBBC0\uB85C ${MAX_ABOUT_IMAGES - currentImages.length}\uC7A5\uAE4C\uC9C0\uB9CC \uCD94\uAC00\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.`
      );
      return;
    }

    try {
      setStatusMessage('loading', '\uD68C\uC0AC\uC18C\uAC1C \uC774\uBBF8\uC9C0\uB97C GitHub\uC5D0 \uC5C5\uB85C\uB4DC\uD558\uB294 \uC911\uC785\uB2C8\uB2E4.');

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
      setStatusMessage('success', '\uD68C\uC0AC\uC18C\uAC1C \uC774\uBBF8\uC9C0\uAC00 \uCD94\uAC00\uB418\uC5C8\uC2B5\uB2C8\uB2E4. Cloudflare Pages\uAC00 \uC790\uB3D9\uC73C\uB85C \uB2E4\uC2DC \uBC30\uD3EC\uB429\uB2C8\uB2E4.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : '\uD68C\uC0AC\uC18C\uAC1C \uC774\uBBF8\uC9C0 \uC5C5\uB85C\uB4DC\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.');
    }
  }

  async function handleAboutImageDelete(imagePath: string) {
    if (!content) {
      setStatusMessage('error', '\uBA3C\uC800 \uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC640\uC8FC\uC138\uC694.');
      return;
    }

    try {
      setStatusMessage('loading', '\uD68C\uC0AC\uC18C\uAC1C \uC774\uBBF8\uC9C0\uB97C \uC0AD\uC81C\uD558\uB294 \uC911\uC785\uB2C8\uB2E4.');

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
      setStatusMessage('success', '\uD68C\uC0AC\uC18C\uAC1C \uC774\uBBF8\uC9C0\uAC00 \uC0AD\uC81C\uB418\uC5C8\uC2B5\uB2C8\uB2E4. Cloudflare Pages\uAC00 \uC790\uB3D9\uC73C\uB85C \uB2E4\uC2DC \uBC30\uD3EC\uB429\uB2C8\uB2E4.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : '\uD68C\uC0AC\uC18C\uAC1C \uC774\uBBF8\uC9C0 \uC0AD\uC81C\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.');
    }
  }

  async function handleServiceImageUpload() {
    if (!content) {
      setStatusMessage('error', '\uBA3C\uC800 \uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC640\uC8FC\uC138\uC694.');
      return;
    }

    if (selectedServiceImages.length === 0) {
      setStatusMessage('error', '\uC5C5\uB85C\uB4DC\uD560 \uC0AC\uC5C5 \uBD84\uC57C \uC774\uBBF8\uC9C0\uB97C \uC120\uD0DD\uD574\uC8FC\uC138\uC694.');
      return;
    }

    const currentImages = content.services.images || [];

    if (currentImages.length + selectedServiceImages.length > MAX_SERVICE_IMAGES) {
      setStatusMessage(
        'error',
        `\uC0AC\uC5C5 \uBD84\uC57C \uC774\uBBF8\uC9C0\uB294 \uCD5C\uB300 ${MAX_SERVICE_IMAGES}\uC7A5\uAE4C\uC9C0 \uB4F1\uB85D\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uD604\uC7AC ${currentImages.length}\uC7A5\uC774 \uB4F1\uB85D\uB418\uC5B4 \uC788\uC73C\uBBC0\uB85C ${MAX_SERVICE_IMAGES - currentImages.length}\uC7A5\uAE4C\uC9C0\uB9CC \uCD94\uAC00\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.`
      );
      return;
    }

    try {
      setStatusMessage('loading', '\uC0AC\uC5C5 \uBD84\uC57C \uC774\uBBF8\uC9C0\uB97C GitHub\uC5D0 \uC5C5\uB85C\uB4DC\uD558\uB294 \uC911\uC785\uB2C8\uB2E4.');

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
      setStatusMessage('success', '\uC0AC\uC5C5 \uBD84\uC57C \uC774\uBBF8\uC9C0\uAC00 \uCD94\uAC00\uB418\uC5C8\uC2B5\uB2C8\uB2E4. Cloudflare Pages\uAC00 \uC790\uB3D9\uC73C\uB85C \uB2E4\uC2DC \uBC30\uD3EC\uB429\uB2C8\uB2E4.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : '\uC0AC\uC5C5 \uBD84\uC57C \uC774\uBBF8\uC9C0 \uC5C5\uB85C\uB4DC\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.');
    }
  }

  async function handleServiceImageDelete(imagePath: string) {
    if (!content) {
      setStatusMessage('error', '\uBA3C\uC800 \uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC640\uC8FC\uC138\uC694.');
      return;
    }

    try {
      setStatusMessage('loading', '\uC0AC\uC5C5 \uBD84\uC57C \uC774\uBBF8\uC9C0\uB97C \uC0AD\uC81C\uD558\uB294 \uC911\uC785\uB2C8\uB2E4.');

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
      setStatusMessage('success', '\uC0AC\uC5C5 \uBD84\uC57C \uC774\uBBF8\uC9C0\uAC00 \uC0AD\uC81C\uB418\uC5C8\uC2B5\uB2C8\uB2E4. Cloudflare Pages\uAC00 \uC790\uB3D9\uC73C\uB85C \uB2E4\uC2DC \uBC30\uD3EC\uB429\uB2C8\uB2E4.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : '\uC0AC\uC5C5 \uBD84\uC57C \uC774\uBBF8\uC9C0 \uC0AD\uC81C\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.');
    }
  }

  async function handleAchievementImageUpload() {
    if (!content) {
      setStatusMessage('error', '\uBA3C\uC800 \uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC640\uC8FC\uC138\uC694.');
      return;
    }

    if (!activeAchievementTab) {
      setStatusMessage('error', '\uC774\uBBF8\uC9C0\uB97C \uB4F1\uB85D\uD560 \uBD84\uB958\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.');
      return;
    }

    if (selectedAchievementImages.length === 0) {
      setStatusMessage('error', '\uC5C5\uB85C\uB4DC\uD560 \uC778\uC99D \uC790\uB8CC \uC774\uBBF8\uC9C0\uB97C \uC120\uD0DD\uD574\uC8FC\uC138\uC694.');
      return;
    }

    try {
      setStatusMessage('loading', `${activeAchievementTab.label} \uC774\uBBF8\uC9C0\uB97C GitHub\uC5D0 \uC5C5\uB85C\uB4DC\uD558\uB294 \uC911\uC785\uB2C8\uB2E4.`);

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
      setStatusMessage('success', `${activeAchievementTab.label} \uC774\uBBF8\uC9C0\uAC00 \uCD94\uAC00\uB418\uC5C8\uC2B5\uB2C8\uB2E4. Cloudflare Pages\uAC00 \uC790\uB3D9\uC73C\uB85C \uB2E4\uC2DC \uBC30\uD3EC\uB429\uB2C8\uB2E4.`);
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : '\uC778\uC99D \uC790\uB8CC \uC774\uBBF8\uC9C0 \uC5C5\uB85C\uB4DC\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.');
    }
  }

  async function handleAchievementImageDelete(tabId: string, imagePath: string) {
    if (!content) {
      setStatusMessage('error', '\uBA3C\uC800 \uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC640\uC8FC\uC138\uC694.');
      return;
    }

    try {
      setStatusMessage('loading', '\uC778\uC99D \uC790\uB8CC \uC774\uBBF8\uC9C0\uB97C \uC0AD\uC81C\uD558\uB294 \uC911\uC785\uB2C8\uB2E4.');

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
      setStatusMessage('success', '\uC778\uC99D \uC790\uB8CC \uC774\uBBF8\uC9C0\uAC00 \uC0AD\uC81C\uB418\uC5C8\uC2B5\uB2C8\uB2E4. Cloudflare Pages\uAC00 \uC790\uB3D9\uC73C\uB85C \uB2E4\uC2DC \uBC30\uD3EC\uB429\uB2C8\uB2E4.');
    } catch (error) {
      setStatusMessage('error', error instanceof Error ? error.message : '\uC778\uC99D \uC790\uB8CC \uC774\uBBF8\uC9C0 \uC0AD\uC81C\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.');
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
            <h1 className="text-2xl font-black tracking-tight">Admin CMS &#xC811;&#xC18D;</h1>
            <p className="mt-3 text-sm text-slate-300">
              GitHub Personal Access Token&#xC774; &#xD544;&#xC694;&#xD569;&#xB2C8;&#xB2E4;.
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
              &#xC774; &#xAE30;&#xAE30;&#xC5D0; &#xD1A0;&#xD070; &#xC784;&#xC2DC; &#xC800;&#xC7A5;
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
              &#xC778;&#xC99D; &#xBC0F; &#xC811;&#xC18D;
            </button>

            <a
              href="/"
              className="block text-center text-xs font-bold text-slate-300 transition hover:text-white"
            >
              &#xD648;&#xC73C;&#xB85C; &#xB3CC;&#xC544;&#xAC00;&#xAE30;
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
              <h1 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">&#xBBFC;&#xC601;&#xC815;&#xBC00; &#xAD00;&#xB9AC;&#xC790; &#xD398;&#xC774;&#xC9C0;</h1>
              <p className="mt-4 max-w-2xl text-slate-300">
                &#xD648;&#xD398;&#xC774;&#xC9C0; &#xBB38;&#xAD6C;&#xC640; &#xD68C;&#xC0AC; &#xC815;&#xBCF4;&#xB97C; &#xC218;&#xC815;&#xD55C; &#xB4A4; GitHub&#xC5D0; &#xC800;&#xC7A5;&#xD569;&#xB2C8;&#xB2E4;. &#xC800;&#xC7A5; &#xD6C4; Cloudflare Pages&#xAC00; &#xC790;&#xB3D9;&#xC73C;&#xB85C; &#xC7AC;&#xBC30;&#xD3EC;&#xD569;&#xB2C8;&#xB2E4;.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                &#xD648;&#xD398;&#xC774;&#xC9C0;&#xB85C; &#xB3CC;&#xC544;&#xAC00;&#xAE30;
              </a>

              <a
                href="/admin/pc-preview"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                PC íë©´ ë¯¸ë¦¬ë³´ê¸°
              </a>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
              >
                <LogOut size={16} />
                &#xB85C;&#xADF8;&#xC544;&#xC6C3;
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900">&#xC5F0;&#xACB0;&#xB41C; &#xC800;&#xC7A5;&#xC18C;</p>
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
                &#xB370;&#xC774;&#xD130; &#xC0C8;&#xB85C;&#xACE0;&#xCE68;
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isBusy || !content}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isBusy ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                &#xC800;&#xC7A5;&#xD558;&#xAE30;
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
            <h2 className="mt-4 text-xl font-bold text-slate-900">&#xB370;&#xC774;&#xD130;&#xB97C; &#xBD88;&#xB7EC;&#xC624;&#xB294; &#xC911;&#xC785;&#xB2C8;&#xB2E4;.</h2>
          </div>
        ) : (
          <div className="space-y-6">
            <AdminSection
              title="\uBA54\uC778 \uB300\uD45C \uC774\uBBF8\uC9C0 \uC2AC\uB77C\uC774\uB4DC"
              description={`\uD648\uD398\uC774\uC9C0 \uCCAB \uD654\uBA74\uC758 \uB300\uD45C \uC774\uBBF8\uC9C0\uB97C \uAD00\uB9AC\uD569\uB2C8\uB2E4. \uCD5C\uB300 ${MAX_HERO_IMAGES}\uC7A5\uAE4C\uC9C0 \uB4F1\uB85D\uD560 \uC218 \uC788\uC73C\uBA70, \uC5EC\uB7EC \uC7A5\uC774\uBA74 \uC790\uB3D9\uC73C\uB85C \uC804\uD658\uB429\uB2C8\uB2E4.`}
            >
              <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-3 text-slate-900">
                    <ImagePlus size={22} className="text-blue-600" />
                    <div>
                      <h3 className="font-bold">&#xBA54;&#xC778; &#xB300;&#xD45C; &#xC774;&#xBBF8;&#xC9C0; &#xCD94;&#xAC00;</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        JPG, PNG, WEBP, GIF &#xD30C;&#xC77C;&#xC744; &#xC0AC;&#xC6A9;&#xD560; &#xC218; &#xC788;&#xC2B5;&#xB2C8;&#xB2E4;. &#xD604;&#xC7AC; {heroImages.length}/{MAX_HERO_IMAGES}&#xC7A5; &#xB4F1;&#xB85D;&#xB418;&#xC5B4; &#xC788;&#xC2B5;&#xB2C8;&#xB2E4;.
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
                          &#xC120;&#xD0DD;&#xB41C; &#xD30C;&#xC77C; {selectedHeroImages.length}&#xAC1C;
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
                    &#xBA54;&#xC778; &#xB300;&#xD45C; &#xC774;&#xBBF8;&#xC9C0; &#xCD94;&#xAC00;
                  </button>

                  <div className="mt-5">
                    <TextInput
                      label="\uBA54\uC778 \uC774\uBBF8\uC9C0 \uC804\uD658 \uC2DC\uAC04(ms)"
                      value={String(content.hero.slideIntervalMs || 4500)}
                      onChange={(value) => updateHero('slideIntervalMs', Number(value) || 4500)}
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-bold text-slate-700">&#xB4F1;&#xB85D;&#xB41C; &#xBA54;&#xC778; &#xB300;&#xD45C; &#xC774;&#xBBF8;&#xC9C0;</p>

                  {heroImages.length > 0 ? (
                    <div className="space-y-4">
                      {heroImages.map((image, index) => (
                        <div key={`${image}-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                          <img
                            src={heroImagePreviewUrls[image] || image}
                            alt={`\uBA54\uC778 \uB300\uD45C \uC774\uBBF8\uC9C0 ${index + 1}`}
                            className="h-40 w-full object-cover"
                            onError={(event) => {
                              event.currentTarget.style.display = 'none';
                            }}
                          />

                          <div className="space-y-3 border-t border-slate-200 p-4">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-xs font-bold text-slate-700">
                                {index === 0 ? '\uB300\uD45C 1\uBC88 \uC774\uBBF8\uC9C0' : `\uC2AC\uB77C\uC774\uB4DC \uC774\uBBF8\uC9C0 ${index + 1}`}
                              </p>
                              {index === 0 && (
                                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                                  &#xAE30;&#xBCF8; &#xB300;&#xD45C;
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
                              &#xC774; &#xC774;&#xBBF8;&#xC9C0; &#xC0AD;&#xC81C;
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyImageBox
                      text="\uB4F1\uB85D\uB41C \uBA54\uC778 \uB300\uD45C \uC774\uBBF8\uC9C0\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4."
                      subText="\uC774\uBBF8\uC9C0\uAC00 \uC5C6\uC73C\uBA74 \uAE30\uBCF8 \uB2E4\uD06C \uBC30\uACBD\uC774 \uD45C\uC2DC\uB429\uB2C8\uB2E4."
                    />
                  )}
                </div>
              </div>
            </AdminSection>

            <AdminSection
              title="\uD68C\uC0AC\uC18C\uAC1C \uC2AC\uB77C\uC774\uB4DC \uC774\uBBF8\uC9C0"
              description={`\uD68C\uC0AC\uC18C\uAC1C \uC624\uB978\uCABD \uC601\uC5ED\uC5D0 \uD45C\uC2DC\uB420 \uC774\uBBF8\uC9C0\uB97C \uAD00\uB9AC\uD569\uB2C8\uB2E4. \uCD5C\uB300 ${MAX_ABOUT_IMAGES}\uC7A5\uAE4C\uC9C0 \uB4F1\uB85D\uD560 \uC218 \uC788\uC73C\uBA70, \uC5EC\uB7EC \uC7A5\uC774\uBA74 \uC790\uB3D9\uC73C\uB85C \uC804\uD658\uB429\uB2C8\uB2E4.`}
            >
              <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-3 text-slate-900">
                    <ImagePlus size={22} className="text-blue-600" />
                    <div>
                      <h3 className="font-bold">&#xD68C;&#xC0AC;&#xC18C;&#xAC1C; &#xC774;&#xBBF8;&#xC9C0; &#xCD94;&#xAC00;</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        JPG, PNG, WEBP, GIF &#xD30C;&#xC77C;&#xC744; &#xC0AC;&#xC6A9;&#xD560; &#xC218; &#xC788;&#xC2B5;&#xB2C8;&#xB2E4;. &#xD604;&#xC7AC; {aboutImages.length}/{MAX_ABOUT_IMAGES}&#xC7A5; &#xB4F1;&#xB85D;&#xB418;&#xC5B4; &#xC788;&#xC2B5;&#xB2C8;&#xB2E4;.
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
                          &#xC120;&#xD0DD;&#xB41C; &#xD30C;&#xC77C; {selectedAboutImages.length}&#xAC1C;
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
                      &#xD68C;&#xC0AC;&#xC18C;&#xAC1C; &#xC774;&#xBBF8;&#xC9C0; &#xCD94;&#xAC00;
                    </button>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-bold text-slate-700">&#xB4F1;&#xB85D;&#xB41C; &#xD68C;&#xC0AC;&#xC18C;&#xAC1C; &#xC774;&#xBBF8;&#xC9C0;</p>

                  {aboutImages.length > 0 ? (
                    <div className="space-y-4">
                      {aboutImages.map((image, index) => (
                        <div key={`${image}-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                          <img
                            src={aboutImagePreviewUrls[image] || image}
                            alt={`\uD68C\uC0AC\uC18C\uAC1C \uC774\uBBF8\uC9C0 ${index + 1}`}
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
                              &#xC774; &#xC774;&#xBBF8;&#xC9C0; &#xC0AD;&#xC81C;
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyImageBox
                      text="\uB4F1\uB85D\uB41C \uD68C\uC0AC\uC18C\uAC1C \uC774\uBBF8\uC9C0\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4."
                      subText="\uC774\uBBF8\uC9C0\uAC00 \uC5C6\uC73C\uBA74 \uAE30\uC874 MIN YOUNG \uCE74\uB4DC\uAC00 \uD45C\uC2DC\uB429\uB2C8\uB2E4."
                    />
                  )}
                </div>
              </div>
            </AdminSection>

            <AdminSection
              title="\uC0AC\uC5C5 \uBD84\uC57C \uC2AC\uB77C\uC774\uB4DC \uC774\uBBF8\uC9C0"
              description={`\uC8FC\uC694 \uC0AC\uC5C5 \uBD84\uC57C \uC139\uC158 \uC67C\uCABD\uC5D0 \uD45C\uC2DC\uB420 \uC774\uBBF8\uC9C0\uB97C \uAD00\uB9AC\uD569\uB2C8\uB2E4. \uCD5C\uB300 ${MAX_SERVICE_IMAGES}\uC7A5\uAE4C\uC9C0 \uB4F1\uB85D\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.`}
            >
              <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-3 text-slate-900">
                    <ImagePlus size={22} className="text-blue-600" />
                    <div>
                      <h3 className="font-bold">&#xC0AC;&#xC5C5; &#xBD84;&#xC57C; &#xC774;&#xBBF8;&#xC9C0; &#xCD94;&#xAC00;</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        JPG, PNG, WEBP, GIF &#xD30C;&#xC77C;&#xC744; &#xC0AC;&#xC6A9;&#xD560; &#xC218; &#xC788;&#xC2B5;&#xB2C8;&#xB2E4;. &#xD604;&#xC7AC; {serviceImages.length}/{MAX_SERVICE_IMAGES}&#xC7A5; &#xB4F1;&#xB85D;&#xB418;&#xC5B4; &#xC788;&#xC2B5;&#xB2C8;&#xB2E4;.
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
                          &#xC120;&#xD0DD;&#xB41C; &#xD30C;&#xC77C; {selectedServiceImages.length}&#xAC1C;
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
                    &#xC0AC;&#xC5C5; &#xBD84;&#xC57C; &#xC774;&#xBBF8;&#xC9C0; &#xCD94;&#xAC00;
                  </button>

                  <div className="mt-5">
                    <TextInput
                      label="\uC0AC\uC5C5 \uBD84\uC57C \uC774\uBBF8\uC9C0 \uC804\uD658 \uC2DC\uAC04(ms)"
                      value={String(content.services.slideIntervalMs || 4000)}
                      onChange={(value) => updateServices('slideIntervalMs', Number(value) || 4000)}
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-bold text-slate-700">&#xB4F1;&#xB85D;&#xB41C; &#xC0AC;&#xC5C5; &#xBD84;&#xC57C; &#xC774;&#xBBF8;&#xC9C0;</p>

                  {serviceImages.length > 0 ? (
                    <div className="space-y-4">
                      {serviceImages.map((image, index) => (
                        <div key={`${image}-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                          <img
                            src={serviceImagePreviewUrls[image] || image}
                            alt={`\uC0AC\uC5C5 \uBD84\uC57C \uC774\uBBF8\uC9C0 ${index + 1}`}
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
                              &#xC774; &#xC774;&#xBBF8;&#xC9C0; &#xC0AD;&#xC81C;
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyImageBox
                      text="\uB4F1\uB85D\uB41C \uC0AC\uC5C5 \uBD84\uC57C \uC774\uBBF8\uC9C0\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4."
                      subText="\uC774\uBBF8\uC9C0\uAC00 \uC5C6\uC73C\uBA74 \uAE30\uBCF8 \uC548\uB0B4 \uBC15\uC2A4\uAC00 \uD45C\uC2DC\uB429\uB2C8\uB2E4."
                    />
                  )}
                </div>
              </div>
            </AdminSection>

            <AdminSection
              title="\uC778\uC99D\uC11C \u00B7 \uC0C1\uD328 \u00B7 \uD2B9\uD5C8 \uC790\uB8CC \uAD00\uB9AC"
              description="\uD648\uD398\uC774\uC9C0\uC5D0\uB294 \uD0ED \uC5C6\uC774 \uBAA8\uB4E0 \uC774\uBBF8\uC9C0\uAC00 \uD55C\uB208\uC5D0 \uBCF4\uC774\uB294 \uAC24\uB7EC\uB9AC\uB85C \uD45C\uC2DC\uB429\uB2C8\uB2E4. \uC5EC\uAE30\uC11C\uB294 \uBD84\uB958\uBCC4\uB85C \uC5C5\uB85C\uB4DC\uD558\uACE0 \uC0AD\uC81C\uB9CC \uC27D\uAC8C \uAD00\uB9AC\uD569\uB2C8\uB2E4."
            >
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white">
                      <ImageIcon size={22} />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900">&#xC790;&#xB8CC; &#xC5C5;&#xB85C;&#xB4DC;</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        &#xBD84;&#xB958;&#xB97C; &#xACE0;&#xB974;&#xACE0; &#xC5EC;&#xB7EC; &#xC774;&#xBBF8;&#xC9C0;&#xB97C; &#xD55C; &#xBC88;&#xC5D0; &#xCD94;&#xAC00;&#xD560; &#xC218; &#xC788;&#xC2B5;&#xB2C8;&#xB2E4;.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="mb-2 text-sm font-bold text-slate-700">&#xC5C5;&#xB85C;&#xB4DC;&#xD560; &#xBD84;&#xB958;</p>
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
                            {tab.images?.length || 0}&#xC7A5;
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
                          &#xC120;&#xD0DD;&#xB41C; &#xD30C;&#xC77C; {selectedAchievementImages.length}&#xAC1C;
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
                    &#xC120;&#xD0DD;&#xD55C; &#xBD84;&#xB958;&#xC5D0; &#xC774;&#xBBF8;&#xC9C0; &#xCD94;&#xAC00;
                  </button>

                  <div className="mt-5 rounded-2xl bg-white p-4 text-sm text-slate-600">
                    <p className="font-bold text-slate-900">&#xD604;&#xC7AC; &#xC804;&#xCCB4; &#xB4F1;&#xB85D; &#xC218;: {totalAchievementImages}&#xC7A5;</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      &#xD648;&#xD398;&#xC774;&#xC9C0;&#xC5D0;&#xC11C;&#xB294; &#xBD84;&#xB958;&#xC640; &#xC0C1;&#xAD00;&#xC5C6;&#xC774; &#xBAA8;&#xB4E0; &#xC774;&#xBBF8;&#xC9C0;&#xAC00; &#xD55C; &#xC904; &#xAC24;&#xB7EC;&#xB9AC; &#xD615;&#xD0DC;&#xB85C; &#xC815;&#xB9AC;&#xB418;&#xC5B4; &#xD45C;&#xC2DC;&#xB429;&#xB2C8;&#xB2E4;.
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
                            &#xB4F1;&#xB85D;&#xB41C; &#xC774;&#xBBF8;&#xC9C0; {tab.images?.length || 0}&#xC7A5;
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedAchievementTabId(tab.id)}
                          className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
                        >
                          &#xC774; &#xBD84;&#xB958;&#xC5D0; &#xCD94;&#xAC00;
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                        {tab.images && tab.images.length > 0 ? (
                          tab.images.map((image, index) => (
                            <div key={`${image}-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                              <div className="aspect-[3/4] bg-white p-2">
                                <img
                                  src={achievementImagePreviewUrls[image] || image}
                                  alt={`${tab.label} \uC774\uBBF8\uC9C0 ${index + 1}`}
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
                                  &#xC0AD;&#xC81C;
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 md:col-span-3">
                            &#xC544;&#xC9C1; &#xB4F1;&#xB85D;&#xB41C; &#xC774;&#xBBF8;&#xC9C0;&#xAC00; &#xC5C6;&#xC2B5;&#xB2C8;&#xB2E4;.
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AdminSection>

            <AdminSection title="\uD68C\uC0AC \uAE30\uBCF8 \uC815\uBCF4" description="\uD68C\uC0AC\uBA85, \uB300\uD45C\uC790, \uC5F0\uB77D\uCC98, \uC8FC\uC18C \uB4F1 \uD648\uD398\uC774\uC9C0 \uC804\uBC18\uC5D0 \uC0AC\uC6A9\uB418\uB294 \uC815\uBCF4\uC785\uB2C8\uB2E4.">
              <div className="grid gap-5 md:grid-cols-2">
                <TextInput label="\uD68C\uC0AC\uBA85" value={content.company.name} onChange={(value) => updateCompany('name', value)} />
                <TextInput label="\uC601\uBB38 \uD68C\uC0AC\uBA85" value={content.company.englishName} onChange={(value) => updateCompany('englishName', value)} />
                <TextInput label="\uB300\uD45C\uC790" value={content.company.representative} onChange={(value) => updateCompany('representative', value)} />
                <TextInput label="\uC774\uBA54\uC77C" type="email" value={content.company.email} onChange={(value) => updateCompany('email', value)} />
                <TextInput label="\uC804\uD654\uBC88\uD638" value={content.company.phone} onChange={(value) => updateCompany('phone', value)} />
                <TextInput label="\uD329\uC2A4\uBC88\uD638" value={content.company.fax} onChange={(value) => updateCompany('fax', value)} />
                <TextInput label="\uC8FC\uC18C" value={content.company.address} onChange={(value) => updateCompany('address', value)} />
                <TextInput label="\uC0AC\uC5C5\uC790\uB4F1\uB85D\uBC88\uD638" value={content.company.businessNumber} onChange={(value) => updateCompany('businessNumber', value)} />
                <div className="md:col-span-2">
                  <TextInput label="\uD478\uD130 \uC601\uBB38 \uBB38\uAD6C" value={content.company.tagline} onChange={(value) => updateCompany('tagline', value)} />
                </div>
              </div>
            </AdminSection>

            <AdminSection title="\uBA54\uC778 \uD654\uBA74" description="\uD648\uD398\uC774\uC9C0 \uCCAB \uD654\uBA74\uC5D0 \uBCF4\uC774\uB294 \uD070 \uBB38\uAD6C\uC640 \uBC84\uD2BC\uC785\uB2C8\uB2E4.">
              <div className="grid gap-5 md:grid-cols-2">
                <TextInput label="\uC0C1\uB2E8 \uC601\uBB38 \uBB38\uAD6C" value={content.hero.eyebrow} onChange={(value) => updateHero('eyebrow', value)} />
                <TextInput label="\uAC15\uC870\uD560 \uB2E8\uC5B4" value={content.hero.highlight} onChange={(value) => updateHero('highlight', value)} />
                <div className="md:col-span-2">
                  <TextInput label="\uD070 \uC81C\uBAA9" value={content.hero.title} onChange={(value) => updateHero('title', value)} />
                </div>
                <div className="md:col-span-2">
                  <TextArea label="\uC124\uBA85 \uBB38\uAD6C" rows={4} value={content.hero.description} onChange={(value) => updateHero('description', value)} />
                </div>
                <TextInput label="\uCCAB \uBC88\uC9F8 \uBC84\uD2BC \uBB38\uAD6C" value={content.hero.primaryButton.label} onChange={(value) => updateHero('primaryButton', { ...content.hero.primaryButton, label: value })} />
                <TextInput label="\uCCAB \uBC88\uC9F8 \uBC84\uD2BC \uB9C1\uD06C" value={content.hero.primaryButton.href} onChange={(value) => updateHero('primaryButton', { ...content.hero.primaryButton, href: value })} />
                <TextInput label="\uB450 \uBC88\uC9F8 \uBC84\uD2BC \uBB38\uAD6C" value={content.hero.secondaryButton.label} onChange={(value) => updateHero('secondaryButton', { ...content.hero.secondaryButton, label: value })} />
                <TextInput label="\uB450 \uBC88\uC9F8 \uBC84\uD2BC \uB9C1\uD06C" value={content.hero.secondaryButton.href} onChange={(value) => updateHero('secondaryButton', { ...content.hero.secondaryButton, href: value })} />
              </div>
            </AdminSection>

            <AdminSection title="\uD68C\uC0AC \uC18C\uAC1C" description="\uD68C\uC0AC \uC18C\uAC1C \uC139\uC158\uC758 \uC81C\uBAA9\uACFC \uBCF8\uBB38\uC785\uB2C8\uB2E4.">
              <div className="grid gap-5 md:grid-cols-2">
                <TextInput label="\uC18C\uC81C\uBAA9" value={content.about.eyebrow} onChange={(value) => updateAbout('eyebrow', value)} />
                <TextInput label="\uC624\uB978\uCABD \uBC15\uC2A4 \uC81C\uBAA9" value={content.about.visualTitle} onChange={(value) => updateAbout('visualTitle', value)} />
                <div className="md:col-span-2">
                  <TextArea label="\uC18C\uAC1C \uC81C\uBAA9" rows={3} value={content.about.title} onChange={(value) => updateAbout('title', value)} />
                </div>
                <TextInput label="\uC624\uB978\uCABD \uBC15\uC2A4 \uBCF4\uC870 \uBB38\uAD6C" value={content.about.visualSubtitle} onChange={(value) => updateAbout('visualSubtitle', value)} />
                <TextInput
                  label="\uD68C\uC0AC\uC18C\uAC1C \uC2AC\uB77C\uC774\uB4DC \uC804\uD658 \uC2DC\uAC04(ms)"
                  value={String(content.about.slideIntervalMs || 4000)}
                  onChange={(value) => updateAbout('slideIntervalMs', Number(value) || 4000)}
                />
              </div>

              <div className="mt-6 space-y-4">
                {content.about.paragraphs.map((paragraph, index) => (
                  <TextArea
                    key={index}
                    label={`\uC18C\uAC1C \uBCF8\uBB38 ${index + 1}`}
                    value={paragraph}
                    onChange={(value) => updateAboutParagraph(index, value)}
                  />
                ))}
              </div>
            </AdminSection>

            <AdminSection title="\uC8FC\uC694 \uC0AC\uC5C5 \uBD84\uC57C" description="\uC0AC\uC5C5 \uBD84\uC57C \uCE74\uB4DC\uC758 \uC81C\uBAA9, \uC124\uBA85, \uC544\uC774\uCF58 \uC774\uB984\uC744 \uC218\uC815\uD569\uB2C8\uB2E4.">
              <div className="grid gap-5 md:grid-cols-2">
                <TextInput
                  label="\uC18C\uC81C\uBAA9"
                  value={content.services.eyebrow}
                  onChange={(value) => updateServices('eyebrow', value)}
                />
                <TextInput
                  label="\uC81C\uBAA9"
                  value={content.services.title}
                  onChange={(value) => updateServices('title', value)}
                />
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {content.services.items.map((item, index) => (
                  <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="mb-4 font-bold text-slate-900">&#xC0AC;&#xC5C5; &#xBD84;&#xC57C; {index + 1}</h3>
                    <div className="space-y-4">
                      <TextInput label="\uC81C\uBAA9" value={item.title} onChange={(value) => updateService(index, 'title', value)} />
                      <TextArea label="\uC124\uBA85" value={item.description} onChange={(value) => updateService(index, 'description', value)} />
                      <TextInput label="\uC544\uC774\uCF58 \uC774\uB984" value={item.icon} onChange={(value) => updateService(index, 'icon', value)} />
                    </div>
                  </div>
                ))}
              </div>
            </AdminSection>

            <AdminSection title="\uC804\uBB38 \uAE30\uC220" description="\uCF5C\uB81B\uCC99, MCT, CNC \uB4F1 \uC804\uBB38 \uAE30\uC220 \uAD00\uB828 \uBB38\uAD6C\uC785\uB2C8\uB2E4.">
              <div className="grid gap-5 md:grid-cols-2">
                <TextInput label="\uC18C\uC81C\uBAA9" value={content.expertise.eyebrow} onChange={(value) => updateExpertise('eyebrow', value)} />
                <TextInput label="\uC81C\uBAA9" value={content.expertise.title} onChange={(value) => updateExpertise('title', value)} />
                <div className="md:col-span-2">
                  <TextInput label="\uBA54\uC778 \uC81C\uBAA9" value={content.expertise.mainTitle} onChange={(value) => updateExpertise('mainTitle', value)} />
                </div>
                <div className="md:col-span-2">
                  <TextArea label="\uBA54\uC778 \uC124\uBA85" value={content.expertise.mainDescription} onChange={(value) => updateExpertise('mainDescription', value)} />
                </div>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {content.expertise.points.map((point, index) => (
                  <TextInput
                    key={index}
                    label={`\uAE30\uC220 \uD3EC\uC778\uD2B8 ${index + 1}`}
                    value={point}
                    onChange={(value) => updateExpertisePoint(index, value)}
                  />
                ))}
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {content.expertise.cards.map((card, index) => (
                  <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="mb-4 font-bold text-slate-900">&#xAE30;&#xC220; &#xCE74;&#xB4DC; {index + 1}</h3>
                    <div className="space-y-4">
                      <TextInput label="\uC81C\uBAA9" value={card.title} onChange={(value) => updateExpertiseCard(index, 'title', value)} />
                      <TextArea label="\uC124\uBA85" value={card.description} onChange={(value) => updateExpertiseCard(index, 'description', value)} />
                    </div>
                  </div>
                ))}
              </div>
            </AdminSection>

            <AdminSection title="\uACBD\uC7C1\uB825" description="\uBBFC\uC601\uC815\uBC00\uC758 \uAC15\uC810 \uCE74\uB4DC\uC785\uB2C8\uB2E4.">
              <div className="grid gap-5 md:grid-cols-2">
                <TextInput
                  label="\uC18C\uC81C\uBAA9"
                  value={content.strengths.eyebrow}
                  onChange={(value) =>
                    setContent((prev) =>
                      prev ? { ...prev, strengths: { ...prev.strengths, eyebrow: value } } : prev
                    )
                  }
                />
                <TextInput
                  label="\uC81C\uBAA9"
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
                    <h3 className="mb-4 font-bold text-slate-900">&#xACBD;&#xC7C1;&#xB825; {index + 1}</h3>
                    <div className="space-y-4">
                      <TextInput label="\uC81C\uBAA9" value={item.title} onChange={(value) => updateStrength(index, 'title', value)} />
                      <TextArea label="\uC124\uBA85" value={item.description} onChange={(value) => updateStrength(index, 'description', value)} />
                      <TextInput label="\uC544\uC774\uCF58 \uC774\uB984" value={item.icon} onChange={(value) => updateStrength(index, 'icon', value)} />
                    </div>
                  </div>
                ))}
              </div>
            </AdminSection>

            <AdminSection title="\uBB38\uC758 \uC601\uC5ED" description="\uBB38\uC758\uD558\uAE30 \uC139\uC158\uACFC \uC774\uBA54\uC77C \uBC84\uD2BC \uBB38\uAD6C\uC785\uB2C8\uB2E4.">
              <div className="grid gap-5 md:grid-cols-2">
                <TextInput label="\uBB38\uC758 \uC81C\uBAA9" value={content.contact.title} onChange={(value) => updateContact('title', value)} />
                <TextInput label="\uBC84\uD2BC \uC81C\uBAA9" value={content.contact.emailButtonTitle} onChange={(value) => updateContact('emailButtonTitle', value)} />
                <div className="md:col-span-2">
                  <TextArea label="\uBB38\uC758 \uC124\uBA85" value={content.contact.description} onChange={(value) => updateContact('description', value)} />
                </div>
                <TextInput label="\uBC84\uD2BC \uC124\uBA85" value={content.contact.emailButtonDescription} onChange={(value) => updateContact('emailButtonDescription', value)} />
                <TextInput label="\uBC84\uD2BC \uC791\uC740 \uBB38\uAD6C" value={content.contact.emailButtonSmallText} onChange={(value) => updateContact('emailButtonSmallText', value)} />
              </div>
            </AdminSection>

            <AdminSection title="\uD478\uD130" description="\uD558\uB2E8 \uC800\uC791\uAD8C \uBB38\uAD6C\uC785\uB2C8\uB2E4.">
              <TextInput label="\uC800\uC791\uAD8C \uBB38\uAD6C" value={content.footer.copyrightText} onChange={(value) => updateFooter('copyrightText', value)} />
            </AdminSection>

            <div className="sticky bottom-4 z-20 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-600">
                  &#xC218;&#xC815; &#xD6C4; &#xBC18;&#xB4DC;&#xC2DC; <strong className="text-slate-900">&#xC800;&#xC7A5;&#xD558;&#xAE30;</strong>&#xB97C; &#xB20C;&#xB7EC;&#xC57C; &#xD648;&#xD398;&#xC774;&#xC9C0;&#xC5D0; &#xBC18;&#xC601;&#xB429;&#xB2C8;&#xB2E4;.
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isBusy || !content}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isBusy ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  &#xC800;&#xC7A5;&#xD558;&#xAE30;
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
          <span>&#xB7;</span>
          <Mail size={14} />
          <span>GitHub Contents API</span>
          <span>&#xB7;</span>
          <MapPin size={14} />
          <span>Cloudflare Pages</span>
        </div>
      </footer>
    </div>
  );
}
