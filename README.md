# DevCon 🚀

**DevCon** (Conference App) is a modern, full-stack application built to manage, navigate, and enhance conference experiences. Powered by the latest Next.js 16 and React 19, it integrates intelligent AI features, secure authentication, and a responsive, animated UI.

## ✨ Features

- **Modern Tech Stack**: Built with [Next.js 16](https://nextjs.org) (App Router) and [React 19](https://react.dev).
- **Intelligent Capabilities**: Integrates Vercel's [AI SDK](https://sdk.vercel.ai/docs) and Google Generative AI for smart scheduling, querying, or automated assistance.
- **Secure Authentication**: Robust user authentication handling via [NextAuth](https://next-auth.js.org/) / [Better Auth](https://github.com/better-auth/better-auth).
- **Database Integration**: Reliable data storage and modeling using [MongoDB](https://www.mongodb.com/) and [Mongoose](https://mongoosejs.com/).
- **Beautiful UI**: Styled with [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/), and [Radix UI](https://www.radix-ui.com/) primitives.
- **Smooth Animations**: Interactive and fluid animations powered by [Motion](https://motion.dev/) and `tw-animate-css`.
- **Media Management**: Cloud-based image and media handling with [Cloudinary](https://cloudinary.com/).

## 🛠️ Built With

* **Framework:** Next.js 16.1, React 19.2
* **Styling:** Tailwind CSS, PostCSS, clsx, tailwind-merge
* **UI Components:** Shadcn UI, Radix UI, Lucide React, react-day-picker
* **Database:** MongoDB, Mongoose
* **Authentication:** NextAuth.js, Better Auth
* **AI & LLM:** @ai-sdk/google, @ai-sdk/react, ai
* **Validation:** Zod
* **Package Manager:** Bun

## 🚀 Getting Started

### Prerequisites

Ensure you have [Bun](https://bun.sh/) installed, as the project uses a `bun.lock` file. You will also need a MongoDB URI and API keys for Cloudinary, Google AI, and Auth.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sekhar08/DevCon.git
   cd DevCon
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your keys (examples):
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key
   CLOUDINARY_URL=your_cloudinary_url
   ```

4. Run the development server:
   ```bash
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📁 Project Structure

- `/app` - Next.js App Router pages, layouts, and API routes.
- `/components` - Reusable UI components (including Shadcn components).
- `/database` - Database connection utilities and Mongoose schemas.
- `/hooks` - Custom React hooks.
- `/lib` - Utility functions, configurations, and AI tooling.
- `/public` - Static assets and public resources.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/sekhar08/DevCon/issues).
