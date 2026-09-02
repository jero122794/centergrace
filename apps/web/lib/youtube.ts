// apps/web/lib/youtube.ts
export const extractYoutubeId = (input: string): string | null => {
  const match = input.trim().match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})|^([A-Za-z0-9_-]{11})$/);
  return match?.[1] ?? match?.[2] ?? null;
};

export const youtubeEmbedUrl = (id: string): string => `https://www.youtube.com/embed/${id}`;
