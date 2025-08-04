// Importación de componentes, métodos de inicialización, wrappers y estilos 
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import History from "./History.jsx";

// Incorporación del componente History a la estructura de ejecución 
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="grid grid-cols-[auto_1fr] h-screen">
      <History />
      <App />
    </div>
  </StrictMode>,
)
