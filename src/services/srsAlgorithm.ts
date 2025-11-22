import { addDays } from 'date-fns';

export interface ReviewResult {
  interval: number;
  easeFactor: number;
  repetitions: number;
  nextReview: Date;
}

export const calculateReview = (
  quality: number, // 0-5 (0=blackout, 5=perfect)
  previousInterval: number,
  previousEaseFactor: number,
  previousRepetitions: number
): ReviewResult => {
  let interval: number;
  let easeFactor: number;
  let repetitions: number;

  if (quality >= 3) {
    // Correct response
    if (previousRepetitions === 0) {
      interval = 1;
    } else if (previousRepetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(previousInterval * previousEaseFactor);
    }
    repetitions = previousRepetitions + 1;
    
    // Update ease factor
    easeFactor = previousEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  } else {
    // Incorrect response
    repetitions = 0;
    interval = 1;
    easeFactor = previousEaseFactor;
  }

  // Ease factor lower bound
  if (easeFactor < 1.3) easeFactor = 1.3;

  return {
    interval,
    easeFactor,
    repetitions,
    nextReview: addDays(new Date(), interval),
  };
};
