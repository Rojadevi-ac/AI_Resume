# AI-Based Smart Resume Analyzer

A full-stack web application designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS) by comparing them against job descriptions using NLP.

## Features
- **User Authentication**: Secure JWT-based signup and login system.
- **Resume Upload**: Upload PDF, DOCX, or Image (OCR) resumes.
- **NLP Analysis**: Uses `spaCy` to extract skills and keywords and compare them against the job description.
- **ATS Score**: Calculates an ATS compatibility score, identifies matched and missing keywords.
- **Actionable Insights**: AI-generated suggestions to improve the resume.
- **Analytics Dashboard**: View history and score progressions using interactive charts.
- **PDF Reports**: Download a detailed PDF report of your resume analysis.
- **AI Chatbot**: A built-in virtual assistant for quick resume tips.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Vite, Framer Motion, Recharts
- **Backend**: Python, Flask, Flask-JWT-Extended, spaCy, PyPDF2, pdfplumber, pytesseract, ReportLab
- **Database**: MongoDB

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas URI
- Tesseract-OCR installed on your system (for image resume parsing)

### 1. Clone & Setup Database
Ensure your MongoDB server is running. The default connection looks for `mongodb://localhost:27017/smart_resume_analyzer`.

### 2. Backend Setup
```bash
cd backend
python -m venv venv

# Activate venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
# Alternatively: pip install flask flask-cors flask-jwt-extended pymongo bcrypt python-dotenv werkzeug spacy PyPDF2 pdfplumber python-docx pytesseract reportlab

# Download spaCy model
python -m spacy download en_core_web_sm

# Create .env file with MONGO_URI, JWT_SECRET_KEY
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Running the Application
**Backend:**
```bash
cd backend
python app.py
```

**Frontend:**
```bash
cd frontend
npm run dev
```

The app should now be running at `http://localhost:5173`.

### 5. Live Demo

[Live Application](https://ai-resume-analyzer-y7i0.onrender.com)

