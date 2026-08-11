const MAX_FILES = 3;
const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = new Set(['image/png', 'image/jpeg', 'image/webp']);

export function fileToAttachment(file) {
  return new Promise((resolve, reject) => {
    if (!file || !ALLOWED.has(file.type)) {
      reject(new Error('Use a PNG, JPEG, or WebP screenshot.'));
      return;
    }
    if (file.size > MAX_BYTES) {
      reject(new Error('Each image must be 2 MB or smaller.'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that image.'));
    reader.onload = () => {
      const result = String(reader.result || '');
      const data = result.includes(',') ? result.split(',', 1)[1] : result;
      resolve({
        filename: file.name || 'screenshot.png',
        content_type: file.type,
        data_base64: data,
      });
    };
    reader.readAsDataURL(file);
  });
}

export async function filesToAttachments(fileList) {
  const files = Array.from(fileList || []).slice(0, MAX_FILES);
  return Promise.all(files.map(fileToAttachment));
}

export function attachmentSrc(file) {
  if (!file?.data_base64) return '';
  const type = file.content_type || 'image/png';
  if (String(file.data_base64).startsWith('data:')) return file.data_base64;
  return `data:${type};base64,${file.data_base64}`;
}

export const HELP_LIMITS = { MAX_FILES, MAX_BYTES };
