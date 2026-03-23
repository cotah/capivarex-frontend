/* ── Google Cast helpers ──────────────────────────── */

const APP_ID =
  process.env.NEXT_PUBLIC_CAST_APP_ID || 'CC1AD845'; // Default Media Receiver

type CastWindow = Window & {
  chrome?: { cast?: Record<string, unknown> };
  __onGCastApiAvailable?: (isAvailable: boolean) => void;
};

let castSession: Record<string, unknown> | null = null;

function getCast(): Record<string, unknown> | null {
  if (typeof window === 'undefined') return null;
  return (window as unknown as CastWindow).chrome?.cast ?? null;
}

/**
 * Initialise Cast SDK (called once when CastButton mounts).
 * Resolves `true` if a Cast device is available.
 */
export function initCast(): Promise<boolean> {
  return new Promise((resolve) => {
    const cc = getCast();
    if (!cc) return resolve(false);

    const SessionRequest = cc['SessionRequest'] as new (id: string) => unknown;
    const ApiConfig = cc['ApiConfig'] as new (
      sr: unknown,
      sl: (s: Record<string, unknown>) => void,
      rl: (a: string) => void,
    ) => unknown;
    const AVAILABLE = (cc['ReceiverAvailability'] as Record<string, string>)?.['AVAILABLE'];
    const initialize = cc['initialize'] as (
      config: unknown,
      ok: () => void,
      fail: () => void,
    ) => void;

    if (!SessionRequest || !ApiConfig || !initialize) return resolve(false);

    const sessionRequest = new SessionRequest(APP_ID);
    let receiverAvailable = false;

    const apiConfig = new ApiConfig(
      sessionRequest,
      (session) => {
        castSession = session;
      },
      (availability) => {
        receiverAvailable = availability === AVAILABLE;
      },
    );

    initialize(
      apiConfig,
      () => resolve(receiverAvailable),
      () => resolve(false),
    );
  });
}

/**
 * Request a Cast session from the user.
 */
export function requestSession(): Promise<Record<string, unknown> | null> {
  return new Promise((resolve) => {
    const cc = getCast();
    const reqSession = cc?.['requestSession'] as
      | ((
          ok: (s: Record<string, unknown>) => void,
          fail: () => void,
        ) => void)
      | undefined;
    if (!reqSession) return resolve(null);

    reqSession(
      (session) => {
        castSession = session;
        resolve(session);
      },
      () => resolve(null),
    );
  });
}

/**
 * Cast generic media (audio / video URL).
 */
export async function castMedia(
  mediaUrl: string,
  contentType = 'audio/mpeg',
  title?: string,
  imageUrl?: string,
) {
  const session = castSession ?? (await requestSession());
  if (!session) return;

  const cc = getCast();
  const media = cc?.['media'] as Record<string, unknown> | undefined;
  if (!media) return;

  const MediaInfo = media['MediaInfo'] as new (
    url: string,
    type: string,
  ) => Record<string, unknown>;
  const GenericMediaMetadata = media['GenericMediaMetadata'] as new () => Record<
    string,
    unknown
  >;
  const LoadRequest = media['LoadRequest'] as new (
    info: unknown,
  ) => unknown;

  if (!MediaInfo || !GenericMediaMetadata || !LoadRequest) return;

  const info = new MediaInfo(mediaUrl, contentType);
  const meta = new GenericMediaMetadata();
  meta['title'] = title ?? 'CAPIVAREX Media';
  if (imageUrl) meta['images'] = [{ url: imageUrl }];
  info['metadata'] = meta;

  const request = new LoadRequest(info);

  const loadMedia = session['loadMedia'] as
    | ((req: unknown, ok: () => void, fail: (e: unknown) => void) => void)
    | undefined;

  loadMedia?.(
    request,
    () => console.log('[Cast] Media loaded'),
    (err) => console.error('[Cast] Load error', err),
  );
}

/**
 * Cast a YouTube video by videoId.
 */
export async function castYouTube(videoId: string) {
  const session = castSession ?? (await requestSession());
  if (!session) return;

  const mediaUrl = `https://www.youtube.com/watch?v=${videoId}`;
  await castMedia(mediaUrl, 'video/mp4', `YouTube: ${videoId}`);
}
