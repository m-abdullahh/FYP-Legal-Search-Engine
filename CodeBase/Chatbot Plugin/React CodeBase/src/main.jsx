import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Function to get API endpoint
function getApiEndpoint() {
  // Check if chatbotConfig is defined (in WordPress)
  if (window.chatbotConfig && window.chatbotConfig.apiUrl) {
    return window.chatbotConfig.apiUrl;
  }
  // Fallback to local development
  return 'http://127.0.0.1:8000/search/chatbot/';
}

// Only render if the WordPress-specific root exists
if (document.getElementById('chatbot-root')) {
  createRoot(document.getElementById('chatbot-root')).render(
    <StrictMode>
      <App apiEndpoint={getApiEndpoint()} />
    </StrictMode>,
  )
}