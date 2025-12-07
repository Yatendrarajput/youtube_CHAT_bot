# 🎥 YouTube Chat Assistant

> An AI-powered Chrome extension that lets you have intelligent conversations with YouTube videos

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)

## 📖 Overview

YouTube Chat Assistant is a Chrome extension that enables users to ask questions about any YouTube video and receive accurate, context-aware answers. Built with a powerful RAG (Retrieval-Augmented Generation) architecture, it processes video transcripts and uses AI to provide intelligent responses based solely on the video content.

### ✨ Key Features

- 🎯 **Instant Video Understanding** - Automatically processes video transcripts in seconds
- 💬 **Natural Conversations** - Ask questions in plain English and get clear answers
- 🎨 **Beautiful Interface** - Clean, modern chat UI that slides seamlessly over YouTube
- ⚡ **Fast & Accurate** - Powered by OpenAI GPT-4o-mini for reliable responses
- 🔒 **Privacy-Focused** - Your questions and conversations stay private
- 🎓 **Context-Aware** - Answers are grounded only in video content (no hallucinations)

## 🎬 Demo

![Demo GIF](demo.gif)

*Ask questions like:*
- "What are the main points discussed?"
- "Can you explain the section about X?"
- "What solution does the speaker propose?"

## 🏗️ Architecture
```
┌─────────────────┐
│  Chrome Ext     │  User Interface
│  (React/JS)     │
└────────┬────────┘
         │ HTTP
┌────────▼────────┐
│  FastAPI        │  Backend API
│  Python Server  │
└────────┬────────┘
         │
    ┌────▼────┐
    │  FAISS  │  Vector Database
    │ Storage │
    └────┬────┘
         │
┌────────▼────────┐
│  OpenAI API     │  AI Services
│  GPT-4o-mini    │
└─────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.19+ or 22.12+
- **Python** 3.8+
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))
- **Chrome Browser**

### Installation

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Yatendrarajput/youtube_CHAT_bot
cd youtube_CHAT_bot
```

#### 2️⃣ Setup Backend
```bash
cd youtube-chat-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "OPENAI_API_KEY=your_api_key_here" > .env
```

**Start the backend server:**
```bash
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

#### 3️⃣ Setup Frontend (Chrome Extension)
```bash
cd ../youtube-chat-extension

# Install dependencies
npm install

# Build extension
npm run build
```

#### 4️⃣ Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (top-right toggle)
3. Click **"Load unpacked"**
4. Select the `youtube-chat-extension/dist` folder
5. The extension icon should appear in your toolbar!

## 📱 Usage

1. **Open any YouTube video** with captions/subtitles
2. **Click the purple chat button** in the bottom-right corner
3. **Wait 5-10 seconds** while the video is processed
4. **Start asking questions!** Type your question and press Enter

### Example Questions
```
🎯 General Understanding:
- "What is this video about?"
- "Summarize the main points"
- "What are the key takeaways?"

🔍 Specific Details:
- "What did the speaker say about [topic]?"
- "Can you explain the section on [concept]?"
- "What examples were given?"

📊 Analysis:
- "What problem does this video address?"
- "What solutions are proposed?"
- "Who is the target audience?"
```

## 🛠️ Tech Stack

### Frontend
- **React** - UI components
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Vanilla JS** - Content script

### Backend
- **FastAPI** - Web framework
- **Python** - Core language
- **LangChain** - RAG framework
- **FAISS** - Vector similarity search
- **OpenAI API** - Embeddings & LLM

### Infrastructure
- **YouTube Transcript API** - Caption extraction
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

## 📂 Project Structure
```
youtube-chat-assistant/
├── youtube-chat-backend/
│   ├── main.py                  # FastAPI application
│   ├── services/
│   │   ├── transcript_service.py # YouTube transcript extraction
│   │   └── rag_service.py        # RAG logic & vector DB
│   ├── models/
│   │   └── schemas.py            # Pydantic models
│   ├── requirements.txt
│   └── .env                      # API keys (not committed)
│
└── youtube-chat-extension/
    ├── src/
    │   ├── content.js            # Injected on YouTube pages
    │   ├── background.js         # Extension service worker
    │   ├── App.jsx               # Popup component
    │   ├── main.jsx              # React entry point
    │   └── index.css             # Global styles
    ├── public/
    │   ├── manifest.json         # Extension config
    │   └── icons/                # Extension icons
    ├── dist/                     # Built extension (load this)
    ├── vite.config.js
    └── package.json
```

## 🔧 Configuration

### Backend Configuration

Edit `youtube-chat-backend/.env`:
```env
OPENAI_API_KEY=sk-...your-key-here...
```

### Frontend Configuration

Edit `src/content.js` to change API endpoint:
```javascript
const API_URL = 'http://localhost:8000';  // Change for production
```

## 🧪 Testing

### Test Backend API
```bash
# Health check
curl http://localhost:8000/api/health

# Process a video
curl -X POST http://localhost:8000/api/process-video \
  -H "Content-Type: application/json" \
  -d '{"video_id": "dQw4w9WgXcQ"}'

# Ask a question
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"video_id": "dQw4w9WgXcQ", "question": "What is this video about?"}'
```

### Test Extension

1. Go to any YouTube video (e.g., `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
2. Open DevTools Console (F12)
3. Look for: `YouTube Chat Extension loaded`
4. Click the chat button and check for errors

## 📊 Performance

| Metric | Value |
|--------|-------|
| Video Processing Time | 5-15 seconds (typical) |
| Question Response Time | 2-5 seconds |
| Max Video Length | Unlimited (with captions) |
| Concurrent Users | Depends on server capacity |
| API Cost per Video | ~$0.01-0.05 (OpenAI) |

## 🐛 Troubleshooting

### "No captions available"
**Cause**: Video doesn't have English captions  
**Solution**: Try a different video with subtitles

### "Backend not reachable"
**Cause**: Backend server not running  
**Solution**: Run `python main.py` in backend folder

### Extension not appearing
**Cause**: Build files missing  
**Solution**: Run `npm run build` and reload extension

### Slow processing
**Cause**: Long video or slow internet  
**Solution**: Wait patiently, typical videos take 5-15 seconds

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Use ESLint for JavaScript
- Write descriptive commit messages
- Add tests for new features
- Update documentation


## 🙏 Acknowledgments

- [LangChain](https://langchain.com/) for the RAG framework
- [OpenAI](https://openai.com/) for GPT and embeddings
- [FastAPI](https://fastapi.tiangolo.com/) for the excellent web framework
- [YouTube Transcript API](https://github.com/jdepoix/youtube-transcript-api) for transcript extraction

## 📧 Contact

**Yatendra Rajput** - [yatendra1456@gmail.com](https://gmail.com/yatendra1456@gmail.com)

Project Link: [https://github.com/Yatendrarajput/youtube_CHAT_bot](https://github.com/Yatendrarajput/youtube_CHAT_bot.git)

---

⭐ **If you find this project helpful, please consider giving it a star!**

## 🗺️ Roadmap

- [ ] Multi-language support
- [ ] Chat history persistence
- [ ] Export conversations
- [ ] Video timestamp linking
- [ ] Multi-video conversations
- [ ] Voice input support
- [ ] Video summarization
- [ ] Browser support (Firefox, Edge)


---

Made with ❤️ by [Yatendra Rajput]
