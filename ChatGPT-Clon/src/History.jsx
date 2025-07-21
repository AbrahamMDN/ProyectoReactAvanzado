// Importación de ícono vectorial
import { ChatIcon } from "./assets/chat-icon.jsx";

// Creación del esqueleto del componente que manejará el historial de interacciones
export default function History() {
  return (
    <div className="flex flex-col h-screen w-64 bg-gray-900 text-white p-4">
        {/* Encabezado y botón: Elemento visual que resalta la ubicación del historial en el Front para su interacción */}
      <section className="flex flex-col items-start">
        <span className="mb-4">
          <img src="https://img.icons8.com/nolan/512/deepseek.png" alt="Whale" className="w-32 h-32"/>
        </span>
        <div className="p-1 mt-4">
          <button className="flex p-2 bg-blue-600 rounded-lg w-full">
            <ChatIcon />
            Nuevo chat
          </button>
        </div>
      </section>
      {/* Búsquedas recientes o recomendaciones de promts */}
      <section className="flex-1 overflow-y-auto mt-4 mb-4">
        <ul className="space-y-2 text-sm mt-4">
          <li>Búsqueda avanzada</li>
          <li>¿Qué es DeepSeek?</li>
          <li>¿Cómo funciona una IA?</li>
          <li>¿Qué es Ollama?</li>
        </ul>
      </section>
    </div>
  );
};