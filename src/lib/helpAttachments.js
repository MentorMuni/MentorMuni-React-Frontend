const MAX_FILES = 3;
const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/webp']);

export const HELP_ATTACHMENT_HINT =
  'PNG, JPEG, or WebP only · up to 2 MB per image · max 3 images · optional';

export const HELP_LIMITS = { MAX_FILES, MAX_BYTES, ALLOWED_TYPES: ['PNG', 'JPEG', 'WebP'] };

function inferContentType(file) {
  const type = String(file?.type || '').toLowerCase();
  if (ALLOWED.has(type)) return type === 'image/jpg' ? 'image/jpeg' : type;
  const name = String(file?.name || '').toLowerCase();
  if (name.endsWith('.png')) return 'image/png';
  if (name.endsWith('.webp')) return 'image/webp';
  if (name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'image/jpeg';
  return '';
}

export function fileToAttachment(file) {
  return new Promise((resolve, reject) => {
    const contentType = inferContentType(file);
    if (!file || !contentType) {
      reject(
        new Error('Use a PNG, JPEG, or WebP image (max 2 MB). iPhone HEIC photos are not supported — take a screenshot instead.')
      );
      return;
    }
    if (file.size > MAX_BYTES) {
      reject(new Error('Each image must be 2 MB or smaller. Try a smaller screenshot.'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that image. Try another file.'));
    reader.onload = () => {
      const result = String(reader.result || '');
      const data = result.includes(',') ? result.split(',', 1)[1] : result;
      if (!data || data.length < 8) {
        reject(new Error('That image looks empty. Pick a different file.'));
        return;
      }
      resolve({
        filename: file.name || 'screenshot.png',
        content_type: contentType,
        data_base64: data,
      });
    };
    reader.readAsDataURL(file);
  });
}

export async function filesToAttachments(fileList, { existingCount = 0 } = {}) {
  const remaining = Math.max(0, MAX_FILES - existingCount);
  if (remaining <= 0) {
    throw new Error(`You can attach at most ${MAX_FILES} images. Remove one to add another.`);
  }
  const files = Array.from(fileList || []).slice(0, remaining);
  if (!files.length) return [];
  return Promise.all(files.map(fileToAttachment));
}

export function attachmentSrc(file) {
  if (!file?.data_base64) return '';
  const type = file.content_type || 'image/png';
  if (String(file.data_base64).startsWith('data:')) return file.data_base64;
  return `data:${type};base64,${file.data_base64}`;
}

export function isValidAttachment(file) {
  return Boolean(file?.data_base64 && String(file.data_base64).length >= 8 && file?.content_type);
}

export function sanitizeAttachments(list) {
  return (list || []).filter(isValidAttachment).slice(0, MAX_FILES);
}
