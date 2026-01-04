# AI Article Summarizer Frontend

This is the React + TypeScript + Vite frontend for the AI Article Summarizer project.
It provides a modern, responsive user interface to summarize articles using the backend API.

Backend repository can be found [here](https://github.com/victorlaitila/ai-article-summarizer-backend/)

## Live Demo
The app is live here: [AI Article Summarizer](https://victorlaitila.github.io/ai-article-summarizer/)

**NOTE:** The demo uses a mock server with static data and does not call the actual backend API in order to avoid deployment costs.

## Features
- **Multiple Input Sources:** Enter article content via URL, free text, or file upload (.txt, .pdf)
- **Summarization Modes:**
  - Default (balanced summary)
  - Bullet points
  - Simplified (short and simple summary)
- **Keyword Generation:** Automatically generated keywords based on article content with text highlighting
- **Text-to-Speech:** Listen to both the full article and summary
- **Summary Management:** Save, search, sort, and manage your summaries
- **Internationalization:** Multi-language support (English, Finnish, Swedish)
- **Export Options:** Copy, share, and download summaries
- **Responsive Design:** Works seamlessly on desktop and mobile devices

## Tech Stack
- **React 19** with TypeScript
- **Vite** for fast development and optimized builds
- **TailwindCSS 4** with custom animations
- **Radix UI** and **Headless UI** for accessible components
- **i18next** for internationalization
- **Wink-NLP** and **Compromise** for natural language processing
- **Vitest** and **Testing Library** for comprehensive testing
- **ESLint** for code quality
- **GitHub Pages** for deployment

## Installation

1. Clone the repository:

```bash
git clone https://github.com/victorlaitila/ai-article-summarizer.git
cd ai-article-summarizer
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests in watch mode
- `npm run test:ci` - Run tests with coverage
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues
- `npm run type-check` - Check TypeScript types
- `npm run validate` - Run type-check, lint, and tests
- `npm run deploy` - Deploy to GitHub Pages

## Environment Setup

The app uses the backend API URL from the configuration. For local development, ensure the backend server is running at `http://localhost:8000`.

## Project Structure

```
src/
├── components/     # React components
├── contexts/       # React context providers
├── hooks/          # Custom React hooks
├── api/            # API client functions
├── utils/          # Utility functions
├── locales/        # Translation files
└── animations/     # Lottie animations
```