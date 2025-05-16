# 🧠 RAG-Powered Chatbot – Backend (Node.js + Express)

This is the **backend** service for a Retrieval-Augmented Generation (RAG) powered chatbot that answers user queries based on ~50 news articles.

---

## 🚀 Features

- Ingest and embed ~50 news articles
- Vector similarity search using Qdrant
- RAG response generation using Gemini API
- Redis-based session history
- Optional PostgreSQL storage using Prisma ORM
- RESTful API for chat interface and session handling

---

## 📦 Tech Stack

| Component       | Technology            |
|----------------|------------------------|
| Language        | Node.js + TypeScript   |
| Framework       | Express.js             |
| ORM             | Prisma                 |
| Vector DB       | Qdrant                 |
| Embeddings      | Jina Embeddings API    |
| LLM             | Google Gemini API      |
| Cache           | Redis                  |
| Database        | PostgreSQL             |

---

## 🧩 Environment Variables

Create a `.env` file in the root of your backend project:

```env
PORT=4000
LIMIT=50

# RSS Feed
FEED_URL="https://rss.app/feeds/tg0sSV95lxz4SIkt.xml"

# Jina Embeddings
JINA_API_URL="https://r.jina.ai/"
JINA_API_KEY="your_jina_api_key"
JINA_EMBED_URL="https://api.jina.ai/v1/embeddings"

# Qdrant Vector Store
QDRANT_API_KEY="your_qdrant_api_key"
QDRANT_HOST="your_qdrant_host"
QDRANT_COLLECTION="news_embeddings"

# Gemini LLM
GEMINI_API_KEY="your_gemini_api_key"
GEMINI_API_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

# Redis
REDIS_USERNAME=default
REDIS_URL=redis://default:password@host:port

# PostgreSQL + Prisma
DATABASE_URL="postgresql://username:password@localhost:5432/chat-bot"

## Clone and Install
git clone https://github.com/darshil481/chat-bot-backend.git
npm install

## Initialize Prisma + PostgreSQL

npx prisma generate
npx prisma migrate dev --name init

##  Run Development Server
npm run start
