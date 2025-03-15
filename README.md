# Legal Search Engine

A comprehensive search engine for legal documents, focusing on Property Right Ordinance and Pleaded Cases. This innovative system addresses the growing need for efficient legal document retrieval and analysis in the legal profession. By leveraging advanced machine learning technologies and natural language processing, it transforms the traditional document search process into an intelligent, context-aware system.

## Project Overview

In the rapidly evolving legal landscape, legal professionals face significant challenges in efficiently searching through vast collections of legal documents, ordinances, and court cases. This Legal Search Engine project introduces a revolutionary approach by combining multiple machine learning models, semantic search capabilities, and an AI-powered chatbot to provide precise, context-aware search results.

### Key Objectives

- **Efficient Document Retrieval**: Implement advanced search algorithms to quickly locate relevant legal documents, reducing research time for legal professionals.
- **Intelligent Classification**: Utilize multiple machine learning models (SVM, Random Forest, XGBoost) to accurately classify legal judgments and documents.
- **Natural Language Understanding**: Integrate Google's Gemini AI to enable natural language queries and provide intelligent, context-aware responses.
- **User-Centric Design**: Deliver an intuitive interface that simplifies complex legal document searches while maintaining comprehensive functionality.

### Innovation Highlights

- **Multi-Model Approach**: Combines different machine learning models to achieve higher accuracy in document classification and retrieval.
- **Semantic Search**: Implements BERT-based embeddings for understanding the context and meaning behind search queries.
- **Specialized Legal Focus**: Particularly optimized for Property Right Ordinance and Pleaded Cases, with dedicated features for trademark-related searches.
- **Progressive Web Application**: Offers a responsive, mobile-accessible interface with offline capabilities through PWA support.

## Interface Overview

### Search Interface

![Search Interface](https://placeholder.com/search-interface)
The main search interface provides an intuitive way to search through legal documents with advanced filtering options.

### Results Display

![Results Display](https://placeholder.com/results-display)
Search results are presented in a clean, organized format with key information highlighted for quick scanning.

### Chatbot Interface

![Chatbot Interface](https://placeholder.com/chatbot-interface)
The AI-powered chatbot interface allows natural language queries and provides intelligent responses.

### User Dashboard

![User Dashboard](https://placeholder.com/user-dashboard)
A comprehensive dashboard for managing search history, saved documents, and user preferences.

## Features

### Core Functionalities

- **Generic Search**: Advanced search functionality across legal documents
- **Trademark Search**: Specialized search for trademark-related documents and ordinances
- **Judgement Classification**: AI-powered classification of legal judgements
- **Chatbot Integration**: Intelligent legal assistant for document queries

### Technical Highlights

- Machine Learning Models for semantic search and document classification
- Multiple classification models (SVM, Random Forest, XGBoost)
- Integration with Google's Gemini AI for enhanced responses
- User authentication and search history tracking

## Architecture

The project follows a microservices architecture with three main components:

### Frontend (React + Vite)

- Modern UI built with React and Vite
- Responsive design with Tailwind CSS
- Component library using Radix UI
- PWA support for mobile accessibility

### Backend (Node.js + Express)

- RESTful API architecture
- User authentication and authorization
- Search history management
- MongoDB integration for data persistence

### ML Service (Flask)

- Handles all machine learning operations
- Multiple ML models for different search types
- Document classification services
- Semantic search capabilities

## Tech Stack

### Frontend

- React.js with Vite
- Tailwind CSS for styling
- Radix UI components
- Axios for API communication

### Backend

- Node.js & Express
- MongoDB with Mongoose
- JWT for authentication
- CORS enabled API

### ML Service

- Flask REST API
- SVM, Random Forest, XGBoost models
- BERT-based embeddings
- Google Gemini AI integration

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Python 3.8+
- MongoDB

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

### ML Service Setup

```bash
cd API
pip install -r main_requirements.txt
python app.py
```

## API Endpoints

### Search Routes

- `GET /search/genericsearch`: Generic document search
- `GET /search/trademarksearch`: Trademark-specific search
- `GET /search/judgementclassification`: Classify legal judgements
- `GET /search/chatbot`: AI-powered legal assistant

### User Routes

- Authentication endpoints
- Search history management
- User profile management

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details.
