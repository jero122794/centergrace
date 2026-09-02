// packages/utils/src/youtube.ts
const YOUTUBE_ID_LENGTH = 11;

const YOUTUBE_PATTERNS: RegExp[] = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
  /^([A-Za-z0-9_-]{11})$/,
];

/**
 * Extracts a YouTube video ID from a URL or raw 11-character ID.
 */
export const extractYoutubeId = (input: string): string | null => {
  const trimmed = input.trim();
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match?.[1] && match[1].length === YOUTUBE_ID_LENGTH) {
      return match[1];
    }
  }
  return null;
};
