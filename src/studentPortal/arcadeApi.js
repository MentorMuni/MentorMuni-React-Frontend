/**
 * Aptitude Arcade — AI question pack generation.
 */
import { studentApi, StudentApiError } from './studentApi';
import { QUESTIONS_PER_GAME } from './constants/arcadeGameUtils';

export { StudentApiError };

/**
 * @param {string} gameId
 * @param {{ count?: number }} [opts]
 * @returns {Promise<{ game_id: string, count: number, questions: object[], source?: string, model?: string }>}
 */
export async function generateArcadeQuestions(gameId, opts = {}) {
  const count = opts.count ?? QUESTIONS_PER_GAME;
  return studentApi.post('/student/aptitude-arcade/generate', {
    game_id: gameId,
    count,
  });
}
