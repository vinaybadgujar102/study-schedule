"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { TopicCard } from "@/components/TopicCard";
import { AddTopicForm } from "@/components/AddTopicForm";
import { useTopicsStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { formatRelativeDate } from "@/lib/date";

export default function Home() {
  const { status } = useSession();
  const [loading, setLoading] = useState(true);

  const { topics, setTopics, getTodaysTopics } = useTopicsStore();
  const todaysTopics = getTodaysTopics();

  // Fetch topics when the component mounts or session changes
  useEffect(() => {
    const fetchTopics = async () => {
      if (status === "authenticated") {
        try {
          setLoading(true);
          const response = await fetch("/api/topics");
          if (response.ok) {
            const data = await response.json();
            setTopics(data);
          }
        } catch (error) {
          console.error("Error fetching topics:", error);
        } finally {
          setLoading(false);
        }
      } else if (status === "unauthenticated") {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [status, setTopics]);

  // Handle adding a new topic
  const handleAddTopic = async (title: string, notes: string) => {
    try {
      const response = await fetch("/api/topics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, notes }),
      });

      if (response.ok) {
        const newTopic = await response.json();
        setTopics([...topics, newTopic]);
      }
    } catch (error) {
      console.error("Error adding topic:", error);
    }
  };

  // Handle reviewing a topic
  const handleReview = async (
    id: string,
    nextReview: Date,
    interval: number,
    rating: "hard" | "normal" | "easy"
  ) => {
    try {
      const response = await fetch(`/api/topics/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nextReview, interval, rating }),
      });

      if (response.ok) {
        const updatedTopic = await response.json();
        setTopics(
          topics.map((topic) => (topic.id === id ? updatedTopic : topic))
        );
      }
    } catch (error) {
      console.error("Error updating topic:", error);
    }
  };

  // Handle deleting a topic
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/topics/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTopics(topics.filter((topic) => topic.id !== id));
      }
    } catch (error) {
      console.error("Error deleting topic:", error);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">Loading...</div>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (status !== "authenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-6">
          <h1 className="text-3xl font-bold mb-6">Study Schedule</h1>
          <p className="mb-8">
            A spaced repetition app to help you remember what you learn.
          </p>
          <Button onClick={() => signIn("google")}>Sign in with Google</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Study Schedule</h1>

      <AddTopicForm onAddTopic={handleAddTopic} />

      {todaysTopics.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Today&apos;s Reviews ({todaysTopics.length})
          </h2>
          <div className="space-y-4">
            {todaysTopics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onReview={handleReview}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">No Reviews Today</h2>
          <p className="text-slate-500">
            You don&apos;t have any topics to review today. Add a new topic to
            get started!
          </p>
        </div>
      )}

      {topics.length > todaysTopics.length && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Upcoming Reviews</h2>
          <div className="space-y-2">
            {topics
              .filter((topic) => !todaysTopics.includes(topic))
              .sort((a, b) => a.nextReview.getTime() - b.nextReview.getTime())
              .map((topic) => (
                <div
                  key={topic.id}
                  className="flex justify-between items-center p-3 bg-slate-50 rounded"
                >
                  <div>
                    <div className="font-medium">{topic.title}</div>
                    <div className="text-sm text-slate-500">
                      {formatRelativeDate(topic.nextReview)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
