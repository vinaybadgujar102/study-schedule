import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Update a topic (including revising it)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "Topic ID is required" },
      { status: 400 }
    );
  }

  try {
    // Check if the topic belongs to the user
    const existingTopic = await prisma.topic.findUnique({
      where: { id },
    });

    if (!existingTopic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Type assertion for session.user.id
    const userId = session.user.id as string | undefined;

    if (userId !== existingTopic.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { nextReview, interval, rating } = await req.json();

    // Update the topic
    const updatedTopic = await prisma.topic.update({
      where: { id },
      data: {
        nextReview: nextReview ? new Date(nextReview) : undefined,
        interval: interval !== undefined ? interval : undefined,
        history: rating
          ? [
              ...((existingTopic.history as any) || []),
              { date: new Date().toISOString(), rating },
            ]
          : undefined,
      },
    });

    return NextResponse.json(updatedTopic);
  } catch (error) {
    console.error("Error updating topic:", error);
    return NextResponse.json(
      { error: "Failed to update topic" },
      { status: 500 }
    );
  }
}

// Delete a topic
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "Topic ID is required" },
      { status: 400 }
    );
  }

  try {
    // Check if the topic belongs to the user
    const existingTopic = await prisma.topic.findUnique({
      where: { id },
    });

    if (!existingTopic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Type assertion for session.user.id
    const userId = session.user.id as string | undefined;

    if (userId !== existingTopic.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the topic
    await prisma.topic.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting topic:", error);
    return NextResponse.json(
      { error: "Failed to delete topic" },
      { status: 500 }
    );
  }
}
