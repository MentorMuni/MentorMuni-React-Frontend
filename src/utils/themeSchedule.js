/** Local time: Classic 07:00–18:59, Dark 19:00–06:59 */
export const CLASSIC_DAY_START_HOUR = 7;
export const CLASSIC_DAY_END_HOUR = 19;

/**
 * @param {Date} [date]
 * @returns {boolean} true when Dark theme (mm-new-ui) should be active
 */
export function isDarkThemeBySchedule(date = new Date()) {
  const hour = date.getHours();
  return hour < CLASSIC_DAY_START_HOUR || hour >= CLASSIC_DAY_END_HOUR;
}

/**
 * @param {Date} [date]
 * @returns {boolean} true when Classic theme should be active
 */
export function isClassicThemeBySchedule(date = new Date()) {
  return !isDarkThemeBySchedule(date);
}
