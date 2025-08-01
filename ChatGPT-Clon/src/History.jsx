// Importación de ícono vectorial, hooks y contexto global
import { ChatIcon } from "./assets/chat-icon.jsx";
import React, { useEffect, useState } from "react";
import { useGlobal } from "./context/GlobalContext";

// Creación del esqueleto del componente que manejará el historial de interacciones (sesiones)
export default function History() {
  // Se inicializa el estado de mensajes como una lista vacía
  const [messages, setMessages] = useState([]);
  // Se crea una variable que simplifica el llamado al contexto global
  const hook = useGlobal();
  // Se imprimen en consola los mensajes y el contexto global
  console.log(messages, hook);

  // Implementación del efecto que dispara eventos al contexto global cuando se cargan mensajes. Se ejecuta al montar la página
  useEffect(() => {
    const event = { type: "@load_messages" };
    // Se actualiza el estado de mensajes con los eventos aplicados al contexto
    setMessages(hook.dispatch(event));
    // eslint-disable-next-line
  }, []);

  // Se crea la función que guarda el historial
  const saveHistory = () => {
    // Se crea el evento que guarda el historial y lo aplica al contexto global
    const event = { type: "@save_history" };
    hook.dispatch(event);
    setTimeout(() => {
      // Se recarga la página y se muestra el historial actualizado en pantalla después de 1 segundo
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-gray-900 text-white p-4">
        {/* Encabezado y botón: Elemento visual que resalta la ubicación del historial en el Front para su interacción */}
      <section className="flex flex-col items-start">
        <span className="mb-4">
          <img src="https://img.icons8.com/nolan/512/deepseek.png" alt="Whale" className="w-32 h-32"/>
        </span>
        <div className="p-1 mt-4">
          {/* Botón que actualiza el historial de interacciones */}
          <button className="flex p-2 bg-blue-600 rounded-lg w-full hover:bg-blue-700 cursor-pointer" onClick={() => saveHistory()}>
            <ChatIcon />
            Nuevo chat
          </button>
        </div>
      </section>
      {/* Sección de últimas búsquedas del historial */}
      <section className="flex-1 overflow-y-auto mt-4 mb-4">
        <ul className="space-y-2 text-sm mt-4">
          {hook?.state?.messages?.map((msg, index) => (
            <li key={index} className="p-2 bg-gray-800 rounded-lg">
              {msg.title}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};