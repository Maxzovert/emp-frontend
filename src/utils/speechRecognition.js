/**
 * Browser Web Speech helpers tuned for short chat prompts.
 * Prefer utterance mode (not endless continuous) for speed + accuracy.
 */

export function getSpeechRecognitionCtor() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function resolveSpeechLang() {
  if (typeof navigator === "undefined") return "en-US";
  const raw = String(navigator.language || navigator.languages?.[0] || "en-US");
  // Keep BCP-47 tags the Speech API accepts (e.g. en-US, en-GB, hi-IN).
  if (/^[a-z]{2}(-[A-Za-z]{2,8})?$/.test(raw)) return raw;
  return "en-US";
}

export function normalizeTranscript(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .trim();
}

export function pickBestTranscript(result) {
  if (!result?.length) return "";
  let best = result[0];
  for (let i = 1; i < result.length; i += 1) {
    const alt = result[i];
    if ((alt?.confidence ?? 0) > (best?.confidence ?? 0)) best = alt;
  }
  return normalizeTranscript(best?.transcript || "");
}

export function joinTranscriptParts(...parts) {
  return normalizeTranscript(parts.filter(Boolean).join(" "));
}

/**
 * Warm the mic with speech-oriented constraints before recognition starts.
 * Speeds up first capture and improves clarity on noisy devices.
 */
export async function warmMicrophone() {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
    return null;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1,
      },
      video: false,
    });
    return stream;
  } catch {
    return null;
  }
}

export function stopMediaStream(stream) {
  if (!stream) return;
  for (const track of stream.getTracks()) {
    try {
      track.stop();
    } catch {
      // ignore
    }
  }
}
