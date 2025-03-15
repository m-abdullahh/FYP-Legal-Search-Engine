## 📚 Introduction
An AI-driven legal research platform built to simplify complex legal information using intelligent text classification, ordinance mapping, and judgment forecasting—focusing on IPR cases (trademark, copyright) via NLP and Deep Learning.

- ⚖️ Uses PAK-LEGAL-BERT for legal text classification
- 💬 Integrated AI chatbot (Naive Bayes + Gemini API) for smart case summaries
- 🔍 Enables advanced semantic search & document categorization
- 🖥️ Frontend in React, backend in Node.js, ML service in Flask



## Interface Overview
<img src="https://i.imgur.com/3DwY8x0.gif" style="width:680em">

## 🧰 Tech Stack

| Layer     | Technologies |
|-----------|--------------|
| **Frontend** | React, Vite, Tailwind, Radix UI, Axios |
| **Backend**  | Node.js, Express, MongoDB, Mongoose, JWT |
| **ML API**   | Flask, SVM, RF, XGBoost, BERT, Gemini AI |

---

## ⚡ Setup Instructions

> **Prerequisites:** Node.js v14+, Python 3.8+, MongoDB  

### ➤ Frontend
```bash
cd frontend
npm install
npm run dev
```

### ➤ Backend
```bash
cd backend
npm install
npm start
```

### ➤ ML Service
```bash
cd API
pip install -r main_requirements.txt
python app.py
```

---

## API Endpoints

### Search Routes

- `GET /search/genericsearch`: Generic document search
- `GET /search/trademarksearch`: Trademark-specific search
- `GET /search/judgementclassification`: Classify legal judgements
- `GET /search/chatbot`: AI-powered legal assistant


