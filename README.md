# AI Resume Analyzer 🚀

A modern, fast, and intelligent AI-powered Resume Analyzer designed to help job seekers optimize their resumes, improve ATS readability, and get actionable feedback to land their dream job. 

Built with a stunning glassmorphism design, real-time PDF scanning, and serverless AI functions.

## 🌟 Features

- **Instant AI Feedback**: Uses AI to process and deeply analyze your resume against provided job descriptions.
- **ATS Score Calculation**: Get a detailed ATS (Applicant Tracking System) score out of 100 with optimization tips.
- **Dynamic PDF Processing**: Real-time client-side PDF-to-image conversion for fast previews without heavy server load.
- **Track Applications**: A beautiful dashboard to track the resumes you've analyzed, along with their scores and data.
- **Premium UI/UX**: Built with a sleek glassmorphism aesthetic, modern diagonal gradients, interactive animations, and responsive CSS Grid layouts.
- **Serverless Backend (BaaS)**: Fully powered by Puter.js for zero-config authentication, key-value data storage, object storage, and AI processing.

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 (via React Router / Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (with custom Tailwind themes and utility classes)
- **Backend/Services**: [Puter.js](https://puter.com/) (Auth, KV Store, Cloud File Storage, AI Chat/Vision)
- **PDF Processing**: pdfjs-dist

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/megha-2309/ai_resume_analyzer.git
   cd ai_resume_analyzer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open the app:**
   Visit `http://localhost:5173` (or the port specified in your console) in your web browser.

## 📂 Project Structure

```text
├── app/
│   ├── components/       # Reusable UI components (Navbar, ResumeCard, ATS, Summary, etc.)
│   ├── lib/              # Utility functions and SDK configs (puter.ts, pdf2img.ts, utils.ts)
│   ├── routes/           # Application pages and routing logic (home, upload, resume details)
│   ├── app.css           # Global CSS, Tailwind configurations, and custom gradient aesthetic
│   └── root.tsx          # Application root wrapper
├── public/               # Static assets like images and icons
└── package.json          # Project dependencies and npm scripts
```

## 💡 How it works

1. **Sign In**: Secure authentication managed automatically by Puter.js.
2. **Upload**: Provide your target Job Title, Company, Job Description, and upload your PDF Resume. 
3. **Analyze**: The app turns your PDF into a preview image and uploads it securely to Puter's cloud storage. It then sends the context to Puter's AI models.
4. **Review**: The AI rapidly generates a dynamic JSON response containing your personalized summary, ATS score, missing keywords, and formatting tips, which the app renders in a beautiful rich format.
5. **Manage**: Your dashboard automatically remembers your previous scans. Want to remove one? Just hit the trash icon to instantly remove it from cloud storage.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/megha-2309/ai_resume_analyzer/issues).

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
