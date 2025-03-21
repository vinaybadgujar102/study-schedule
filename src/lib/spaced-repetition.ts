/**
 * Calculate the next review date based on the difficulty rating and current interval
 */
export function calculateNextReview(
  rating: "hard" | "normal" | "easy",
  currentInterval: number
): { nextReview: Date; newInterval: number } {
  const today = new Date();
  let newInterval: number;

  switch (rating) {
    case "hard":
      // Hard: next review in 2 days
      newInterval = 2;
      break;
    case "normal":
      // Normal: next review in currentInterval * 1.5 days
      newInterval = Math.round(currentInterval * 1.5);
      break;
    case "easy":
      // Easy: next review in currentInterval * 2 days
      newInterval = currentInterval * 2;
      break;
  }

  // Calculate the next review date
  const nextReview = new Date(today);
  nextReview.setDate(nextReview.getDate() + newInterval);

  return { nextReview, newInterval };
}

/**
 * Get the default review intervals
 */
export function getDefaultIntervals(): number[] {
  return [1, 3, 7, 14, 30];
}

/**
 * Calculate the initial review schedule for a new topic
 */
export function calculateInitialSchedule(): Date[] {
  const intervals = getDefaultIntervals();
  const today = new Date();

  return intervals.map((interval) => {
    const reviewDate = new Date(today);
    reviewDate.setDate(reviewDate.getDate() + interval);
    return reviewDate;
  });
}
