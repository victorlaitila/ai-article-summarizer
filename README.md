# AI Article Summarizer Frontend

This is the React + Vite frontend for the AI Article Summarizer project.
It provides a user interface to summarize articles using the backend API.

Backend repository can be found [here](https://github.com/victorlaitila/ai-article-summarizer-backend/)

## Live Demo
The app is live here: [AI Article Summarizer](https://victorlaitila.github.io/ai-article-summarizer/)

NOTE: the demo uses a mock server with static data and does not call the actual backend API in order to avoid deployment costs.

## Features
- Enter the article content (URL/free text/file) to get the full article and a summarized version
- Choose between different summarization modes:
  - Default (balanced summary)
  - Bullet points
  - Simplified (short and simple summary)
- Keywords are generated based on the article content and these can be highlighted in the text
- Both the article and summary have text-to-speech functionality
- Article summaries can be copied, shared and downloaded

## Tech Stack
- React
- TailwindCSS
- Axios for API calls
- GitHub Pages for deployment

## Installation
Clone the repository:

```bash
git clone https://github.com/victorlaitila/ai-article-summarizer.git
cd ai-article-summarizer
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```