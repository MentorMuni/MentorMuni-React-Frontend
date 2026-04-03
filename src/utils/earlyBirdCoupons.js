import rawCodes from '../data/earlyBirdCouponCodes.txt?raw';

const CODES = rawCodes
  .split(/\r?\n/)
  .map((s) => s.trim())
  .filter(Boolean);

/**
 * Returns one random early-bird coupon from `earlyBirdCouponCodes.txt`.
 */
export function pickRandomEarlyBirdCoupon() {
  if (CODES.length === 0) return 'MM-EB-UNAVAILABLE';
  const i = Math.floor(Math.random() * CODES.length);
  return CODES[i];
}

export function getEarlyBirdCouponPoolSize() {
  return CODES.length;
}
