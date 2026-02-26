import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext' 
import './index.css'
import App from './App.jsx'
import './firebase'  // initializes Firebase

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* AuthProvider makes the logged-in user available everywhere */}
    <AuthProvider>

      {/* Router will be handling navigation between pages */}
      <BrowserRouter>
        <App />
      </BrowserRouter>

    </AuthProvider>
  </StrictMode>
);
