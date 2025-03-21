import React from "react";
import { Topic } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { formatRelativeDate, formatDateDistance } from "@/lib/date";
import { calculateNextReview } from "@/lib/spaced-repetition";

interface TopicCardProps {
  topic: Topic;
  onReview: (
    id: string,
    nextReview: Date,
    newInterval: number,
    rating: "hard" | "normal" | "easy"
  ) => void;
  onDelete: (id: string) => void;
}

export function TopicCard({ topic, onReview, onDelete }: TopicCardProps) {
  const handleReview = (rating: "hard" | "normal" | "easy") => {
    const { nextReview, newInterval } = calculateNextReview(
      rating,
      topic.interval
    );
    onReview(topic.id, nextReview, newInterval, rating);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{topic.title}</CardTitle>
        <CardDescription>
          Next review: {formatRelativeDate(topic.nextReview)} (
          {formatDateDistance(topic.nextReview)})
        </CardDescription>
      </CardHeader>

      <CardContent>
        {topic.notes && (
          <div className="mb-4 whitespace-pre-wrap">{topic.notes}</div>
        )}

        <div className="text-xs text-muted-foreground">
          Interval: {topic.interval} day{topic.interval !== 1 ? "s" : ""}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleReview("hard")}
          >
            Hard
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleReview("normal")}
          >
            Good
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleReview("easy")}
          >
            Easy
          </Button>
        </div>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(topic.id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
