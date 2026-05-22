const GITHUB_OWNER = 'noajun1210-hub';
const GITHUB_REPO = 'min-young-precision';
const GITHUB_BRANCH = 'main';
const SITE_CONTENT_PATH = 'src/data/siteContent.json';
const UPLOADS_DIRECTORY = 'public/uploads';

type GitHubFileResponse = {
  name: string;
  path: string;
  sha: string;
  content: string;
  encoding: string;
};

type GitHubUpdateResponse = {
  content: {
    name: string;
    path: string;
    sha: string;
  };
  commit: {
    sha: string;
    message: string;
  };
};

type GitHubDeleteResponse = {
  commit: {
    sha: string;
    message: string;
  };
};

function cleanToken(token: string) {
  const trimmedToken = token.trim();

  if (!trimmedToken) {
    throw new Error('GitHub 토큰을 입력해주세요.');
  }

  return trimmedToken;
}

function encodeBase64Unicode(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}

function decodeBase64Unicode(value: string) {
  const binary = atob(value.replace(/\n/g, ''));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

function encodeArrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}

function getSafeImageExtension(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

  if (allowedExtensions.includes(extension)) {
    return extension;
  }

  if (file.type === 'image/png') return 'png';
  if (file.type === 'image/webp') return 'webp';
  if (file.type === 'image/gif') return 'gif';

  return 'jpg';
}

function makeHeroImageFileName(file: File) {
  const extension = getSafeImageExtension(file);
  return `hero-background-${Date.now()}.${extension}`;
}

function makeAboutImageFileName(file: File) {
  const extension = getSafeImageExtension(file);
  return `about-slide-${Date.now()}.${extension}`;
}

function makeAchievementImageFileName(file: File, tabId: string) {
  const extension = getSafeImageExtension(file);
  const safeTabId = tabId.replace(/[^a-zA-Z0-9-_]/g, '') || 'achievement';

  return `achievement-${safeTabId}-${Date.now()}.${extension}`;
}

function normalizePublicImagePath(publicPath: string) {
  const trimmedPath = publicPath.trim();

  if (!trimmedPath) {
    throw new Error('삭제할 이미지 경로가 없습니다.');
  }

  if (trimmedPath.startsWith('https://') || trimmedPath.startsWith('http://')) {
    const url = new URL(trimmedPath);
    return `public${url.pathname}`;
  }

  if (trimmedPath.startsWith('/')) {
    return `public${trimmedPath}`;
  }

  return `public/${trimmedPath}`;
}

function validateImageFile(file: File) {
  if (!file.type.startsWith('image/')) {
    throw new Error('이미지 파일만 업로드할 수 있습니다.');
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error('이미지는 5MB 이하 파일만 업로드해주세요.');
  }
}

async function githubRequest<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`https://api.github.com${endpoint}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${cleanToken(token)}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let message = 'GitHub 요청 중 오류가 발생했습니다.';

    try {
      const errorData = await response.json();
      message = errorData.message || message;
    } catch {
      message = response.statusText || message;
    }

    if (response.status === 401) {
      throw new Error('GitHub 토큰이 올바르지 않거나 만료되었습니다.');
    }

    if (response.status === 403) {
      throw new Error('GitHub 토큰 권한이 부족합니다. 저장소 Contents 읽기/쓰기 권한을 확인해주세요.');
    }

    if (response.status === 404) {
      throw new Error('GitHub 저장소 또는 파일을 찾을 수 없습니다.');
    }

    throw new Error(message);
  }

  return response.json();
}

async function uploadImageToGitHub(
  token: string,
  file: File,
  fileName: string,
  commitMessage: string
) {
  validateImageFile(file);

  const githubPath = `${UPLOADS_DIRECTORY}/${fileName}`;
  const publicPath = `/uploads/${fileName}`;
  const buffer = await file.arrayBuffer();
  const content = encodeArrayBufferToBase64(buffer);

  await githubRequest<GitHubUpdateResponse>(
    `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${githubPath}`,
    token,
    {
      method: 'PUT',
      body: JSON.stringify({
        message: commitMessage,
        content,
        branch: GITHUB_BRANCH,
      }),
    }
  );

  return {
    githubPath,
    publicPath,
  };
}

export async function getSiteContentFile(token: string) {
  return githubRequest<GitHubFileResponse>(
    `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${SITE_CONTENT_PATH}?ref=${GITHUB_BRANCH}`,
    token
  );
}

export async function loadSiteContent(token: string) {
  const file = await getSiteContentFile(token);
  const rawContent = decodeBase64Unicode(file.content);

  return {
    sha: file.sha,
    rawContent,
    content: JSON.parse(rawContent),
  };
}

export async function saveSiteContent(token: string, content: unknown) {
  const currentFile = await getSiteContentFile(token);
  const nextContent = `${JSON.stringify(content, null, 2)}\n`;

  return githubRequest<GitHubUpdateResponse>(
    `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${SITE_CONTENT_PATH}`,
    token,
    {
      method: 'PUT',
      body: JSON.stringify({
        message: 'Update site content from admin page',
        content: encodeBase64Unicode(nextContent),
        sha: currentFile.sha,
        branch: GITHUB_BRANCH,
      }),
    }
  );
}

export async function uploadHeroBackgroundImage(token: string, file: File) {
  const fileName = makeHeroImageFileName(file);

  return uploadImageToGitHub(
    token,
    file,
    fileName,
    'Upload hero background image'
  );
}

export async function uploadAboutSlideImage(token: string, file: File) {
  const fileName = makeAboutImageFileName(file);

  return uploadImageToGitHub(
    token,
    file,
    fileName,
    'Upload about slide image'
  );
}

export async function uploadAchievementImage(
  token: string,
  file: File,
  tabId: string
) {
  const fileName = makeAchievementImageFileName(file, tabId);

  return uploadImageToGitHub(
    token,
    file,
    fileName,
    `Upload achievement image for ${tabId}`
  );
}

export async function deleteUploadedImage(token: string, publicPath: string) {
  const githubPath = normalizePublicImagePath(publicPath);

  const file = await githubRequest<GitHubFileResponse>(
    `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${githubPath}?ref=${GITHUB_BRANCH}`,
    token
  );

  return githubRequest<GitHubDeleteResponse>(
    `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${githubPath}`,
    token,
    {
      method: 'DELETE',
      body: JSON.stringify({
        message: 'Delete uploaded image',
        sha: file.sha,
        branch: GITHUB_BRANCH,
      }),
    }
  );
}

export const githubContentConfig = {
  owner: GITHUB_OWNER,
  repo: GITHUB_REPO,
  branch: GITHUB_BRANCH,
  path: SITE_CONTENT_PATH,
  uploadsDirectory: UPLOADS_DIRECTORY,
};
