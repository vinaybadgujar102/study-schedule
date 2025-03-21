import { create } from "zustand";

interface TopicHistory {
  date: string; // ISO date string
  rating: "hard" | "normal" | "easy";
}

export interface Topic {
  id: string;
  userId: string;
  title: string;
  notes?: string;
  addedAt: Date;
  nextReview: Date;
  interval: number;
  history: TopicHistory[];
}

interface TopicsState {
  topics: Topic[];
  setTopics: (topics: Topic[]) => void;
  addTopic: (topic: Topic) => void;
  updateTopic: (
    id: string,
    nextReview: Date,
    interval: number,
    rating: "hard" | "normal" | "easy"
  ) => void;
  deleteTopic: (id: string) => void;
  getTodaysTopics: () => Topic[];
  getTopicsByDate: (date: Date) => Topic[];
}

export const useTopicsStore = create<TopicsState>((set, get) => ({
  topics: [],

  setTopics: (topics) => set({ topics }),

  addTopic: (topic) =>
    set((state) => ({
      topics: [...state.topics, topic],
    })),

  updateTopic: (id, nextReview, interval, rating) =>
    set((state) => ({
      topics: state.topics.map((topic) => {
        if (topic.id === id) {
          return {
            ...topic,
            nextReview,
            interval,
            history: [
              ...topic.history,
              { date: new Date().toISOString(), rating },
            ],
          };
        }
        return topic;
      }),
    })),

  deleteTopic: (id) =>
    set((state) => ({
      topics: state.topics.filter((topic) => topic.id !== id),
    })),

  getTodaysTopics: () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return get().topics.filter((topic) => {
      const reviewDate = new Date(topic.nextReview);
      reviewDate.setHours(0, 0, 0, 0);

      return reviewDate >= today && reviewDate < tomorrow;
    });
  },

  getTopicsByDate: (date) => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    return get().topics.filter((topic) => {
      const reviewDate = new Date(topic.nextReview);
      reviewDate.setHours(0, 0, 0, 0);

      return reviewDate >= targetDate && reviewDate < nextDate;
    });
  },
}));
