# StudyGen AI 🚀

![StudyGen AI Banner](https://img.shields.io/badge/StudyGen-AI-6366f1?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)

**StudyGen AI** is an advanced, AI-powered study assistant built to help students learn faster and smarter. It instantly converts any uploaded PDF, image, or text into a complete, personalized study material package within seconds. 

Whether you're uploading a short poem or a long research paper, in English or Hindi, StudyGen AI dynamically analyzes the content and extracts practice questions, smart summaries, key concepts, and important vocabulary.

---

## ✨ Key Features

- **📄 Universal Content Uploads**: Upload PDFs, Images (via Gemini Vision API), or paste raw text. The application processes and reads it instantly.
- **🌐 Multilingual & Bi-directional Support**: Fully supports English and Hindi. Upload content in Hindi and get your study material generated entirely in Hindi. Smart translation buttons allow you to instantly toggle summaries between English and Hindi.
- **📝 Dynamic Question Generation**: Automatically generates 25+ practice questions covering 10 different formats (MCQs, Fill in the Blanks, True/False, Short/Long Answer, Match the Following, Assertion & Reason, HOTS, and Application Based).
- **💡 Smart Summaries**: Generates dynamically scaled summaries ranging from concise one-liners to highly detailed 1000+ word deep-dives based on the document's original length.
- **📚 Advanced Vocabulary Analyzer**: Automatically extracts and explains difficult words (providing meaning, synonyms, antonyms, parts of speech, and Hinglish explanations). Includes a **Custom Word Analyzer** to search and analyze any word on the fly.
- **💾 Save as PDF & Print**: Effortlessly export your generated study material as a cleanly formatted, high-quality PDF using `html2canvas` and `jsPDF`.
- **🕰️ Session History & State Management**: Automatically saves your generated study sessions to your local history, allowing you to quickly re-open, view, and manage past documents at any time.
- **🎨 Premium UI/UX**: Features a highly responsive, modern glassmorphism design with sleek animations, dark/light mode toggles, and mobile-friendly layouts.

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript, powered by Vite for lightning-fast HMR and builds.
- **Styling**: Modern CSS3 with CSS Variables, Flexbox/Grid, and responsive media queries.
- **AI Engine**: Google Gemini API (`@google/genai`). Utilizes `gemini-2.5-flash` with robust fallback chains to `gemini-2.0-flash` and `gemini-2.0-flash-lite` for high availability.
- **PDF Generation**: `jspdf` and `html2canvas` for precise DOM-to-PDF rendering.
- **Icons**: `lucide-react` for beautiful, consistent iconography.
- **Routing**: `react-router-dom` for seamless SPA navigation.

---

## 🚀 Getting Started

Follow these instructions to run StudyGen AI on your local machine.

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- A Google Gemini API Key (Get one for free from [Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/studygen-ai.git
   cd studygen-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
   *(Note: Users can also input their API key dynamically through the Settings page in the UI).*

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the App**
   Open your browser and navigate to `http://localhost:5173`.

---

## 🏗️ Architecture & Implementation Details

- **Model Fallback Logic**: Implemented a highly resilient AI service layer that detects `429 Quota Exhausted` or `503 Service Unavailable` errors and automatically cascades requests through a fallback array of available Gemini models.
- **Local Storage Caching**: Heavy usage of browser `localStorage` to cache API keys, active session study material, and a historical array of past generations to prevent redundant AI API calls and save quota.
- **Vision Integration**: Bypassed traditional OCR bottlenecks by routing image files directly into the Gemini Vision API payload, significantly increasing parsing accuracy for handwritten notes and textbook snapshots.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
