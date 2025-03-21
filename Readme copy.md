# Spaced Repetition Web App - Technical Documentation

## Overview

This is a web application that allows users to log topics they have recently learned and schedule revisions based on the **spaced repetition** technique. Users can view their revision schedule on a calendar, revise topics, and adjust future review dates based on difficulty ratings (**Hard, Normal, Easy**). The app supports **browser notifications** and **authentication** for syncing data across devices.

---

## Tech Stack

| Component         | Technology                             |
| ----------------- | -------------------------------------- |
| **Frontend**      | Next.js (App Router), TypeScript       |
| **UI**            | Tailwind CSS, ShadCN/UI                |
| **State Mgmt**    | Zustand                                |
| **Backend**       | Next.js API Routes (Server Actions)    |
| **Database**      | PostgreSQL (via Prisma ORM)            |
| **Auth**          | NextAuth.js (with Google login)        |
| **Notifications** | Browser Notifications (Service Worker) |

---

## Features

### 1. **User Actions**

- **Add a Topic**: Users input a topic name and optional notes. The topic is assigned spaced repetition review dates.
- **View Revision Schedule**: Calendar view highlights scheduled reviews.
- **Revise a Topic**: Users mark a topic as **Hard / Normal / Easy**, adjusting future schedules dynamically.
- **Get Notifications**: Browser notifications remind users of daily revisions.
- **Login System**: Users sign in with Google to sync across devices.

### 2. **Spaced Repetition Algorithm**

- **Default Review Intervals**: `Day 1 → Day 3 → Day 7 → Day 14 → Day 30`
- **Adjustments Based on Feedback**:
  - **Hard** → `nextReview = today + 2 days`
  - **Normal** → `nextReview = today + interval × 1.5`
  - **Easy** → `nextReview = today + interval × 2`

---

## Database Schema (Prisma)

```prisma
model User {
  id        String  @id @default(uuid())
  email     String  @unique
  name      String?
  topics    Topic[]
}

model Topic {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  title       String
  notes       String?
  addedAt     DateTime @default(now())
  nextReview  DateTime
  interval    Int      // Days until next review
  history     Json     // [{ date: timestamp, rating: 'hard' | 'normal' | 'easy' }]
}
```

---

## API Routes

### **Auth Routes (NextAuth.js)**

- `POST /api/auth/signin` → User login
- `POST /api/auth/signout` → Logout

### **Topic Routes**

- `POST /api/topics` → Add a new topic
- `GET /api/topics` → Fetch all topics (for logged-in user)
- `PUT /api/topics/:id` → Update topic (adjust next review date)
- `DELETE /api/topics/:id` → Delete a topic

---

## Frontend Pages (Next.js App Router)

### `app/(dashboard)/page.tsx` - Dashboard

- Displays today's scheduled topics for review.
- Allows marking topics as **Hard, Normal, Easy**.

### `app/(calendar)/page.tsx` - Calendar View

- Users can view upcoming review dates.
- Clicking a date shows topics scheduled for that day.

### `app/(topics)/new/page.tsx` - Add Topic Page

- Form to input topic title and notes.
- Handles topic creation and initial scheduling.

### `app/(review)/[id]/page.tsx` - Review Page

- Displays topic details.
- Users select **Hard, Normal, Easy**, triggering schedule updates.

---

## Browser Notifications (Service Worker)

### **Notification Logic**

- Service Worker registers daily notifications at **midnight** for that day's topics.
- When a topic is marked as **Hard/Normal/Easy**, update notifications.

### **Implementation**

1. **Register Service Worker** in `app/layout.tsx`:

   ```tsx
   useEffect(() => {
     if ("serviceWorker" in navigator) {
       navigator.serviceWorker.register("/sw.js");
     }
   }, []);
   ```

2. **Service Worker (`public/sw.js`)**:
   ```js
   self.addEventListener("push", (event) => {
     const data = event.data.json();
     self.registration.showNotification(data.title, {
       body: data.body,
       icon: "/icon.png",
     });
   });
   ```

---

## Next Steps & Enhancements

🚀 **Future Features**:

- **Dark Mode Toggle** 🌙
- **Streak System** (to gamify learning 📈)
- **AI-based Topic Summaries** ✨
- **Mobile PWA Support** 📱

**MVP Completion Criteria:**
✔ Users can add topics ✅
✔ Users can see revision schedule ✅
✔ Users can mark difficulty ✅
✔ Notifications work ✅
✔ Login & sync implemented ✅

---

## Ready to Build? 🚀
