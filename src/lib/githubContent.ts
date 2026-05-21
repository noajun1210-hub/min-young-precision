const GITHUB_OWNER = 'noajun1210-hub';
const GITHUB_REPO = 'min-young-precision';
const GITHUB_BRANCH = 'main';
const SITE_CONTENT_PATH = 'src/data/siteContent.json';

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

export const githubContentConfig = {
  owner: GITHUB_OWNER,
  repo: GITHUB_REPO,
  branch: GITHUB_BRANCH,
  path: SITE_CONTENT_PATH,
};
