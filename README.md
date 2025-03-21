# Study Schedule - Spaced Repetition Learning App

A web application that helps you remember what you learn through the scientifically proven spaced repetition technique. Schedule your learning, track progress, and never forget important topics again.

## 🚀 Features

- **Add Topics**: Input what you've learned and automatically schedule review sessions
- **Smart Scheduling**: Dynamic spaced repetition algorithm adapts to your learning performance
- **Review Calendar**: Visual calendar showing upcoming review sessions
- **Difficulty Rating**: Mark topics as Hard/Normal/Easy to adjust future review intervals
- **Browser Notifications**: Get reminders for daily study sessions
- **Cross-device Sync**: Sign in with Google to access your topics anywhere

## 💻 Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, React
- **UI**: Tailwind CSS, ShadCN/UI
- **State Management**: Zustand
- **Backend**: Next.js API Routes with Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google login

## 🛠️ Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/study-schedule.git
cd study-schedule
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="your-postgresql-connection-string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

4. **Set up the database**

```bash
npx prisma migrate dev
```

5. **Start the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report Bugs**

   - Open an issue with a clear and detailed description
   - Include steps to reproduce, expected behavior, and screenshots if possible

2. **Suggest Features**

   - Use the issue tracker to suggest new features
   - Describe the feature, why it would be useful, and how it should work

3. **Submit Pull Requests**

   - Fork the repository
   - Create a new branch for your feature (`git checkout -b feature/amazing-feature`)
   - Commit your changes (`git commit -m 'Add some amazing feature'`)
   - Push to the branch (`git push origin feature/amazing-feature`)
   - Open a Pull Request

4. **Code Style**
   - Follow the existing code style and conventions
   - Write clean, readable, and well-documented code
   - Include tests for new features

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Built with [Next.js](https://nextjs.org)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Date handling with [date-fns](https://date-fns.org)
