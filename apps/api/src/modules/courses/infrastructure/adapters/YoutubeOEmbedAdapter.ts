// apps/api/src/modules/courses/infrastructure/adapters/YoutubeOEmbedAdapter.ts
import { extractYoutubeId } from '../../../../shared/utils/youtube';
import { AppError } from '../../../../shared/utils/app-error';

export interface YoutubeMetadata {
  youtubeId: string;
  youtubeTitle: string;
  youtubeThumbnail: string;
}

/**
 * Validates a YouTube URL through oEmbed and returns canonical metadata.
 */
export class YoutubeOEmbedAdapter {
  async resolve(urlOrId: string): Promise<YoutubeMetadata> {
    const youtubeId = extractYoutubeId(urlOrId);
    if (!youtubeId) {
      throw AppError.unprocessable('Invalid YouTube URL or ID');
    }
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`;
    const started = Date.now();
    const response = await fetch(oembedUrl);
    if (!response.ok) {
      throw AppError.unprocessable('YouTube video could not be validated');
    }
    const payload = (await response.json()) as { title?: string; thumbnail_url?: string };
    return {
      youtubeId,
      youtubeTitle: payload.title ?? 'YouTube video',
      youtubeThumbnail: payload.thumbnail_url ?? '',
      latencyMs: Date.now() - started,
    } as YoutubeMetadata & { latencyMs?: number };
  }
}
