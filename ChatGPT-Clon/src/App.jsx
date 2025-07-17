/* App.js Versión Entregable 1*/

// rafce: Para crear estructura de un App.jsx limpia

import React, { useState } from 'react';
// SendHorizontal es un ícono de la biblioteca lucide-react que se utilizará para indicar un botón de envío
import { SendHorizontal } from "lucide-react";

export default function App(){
  // Se definen los estados iniciales para los inputs del usuario y los mensajes guardados en memoria.
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Definición de una función que confirma en consola el envío del mensaje 
  const sendMessage = () => {
    console.log("Sending message:", input);
  };

  return(
    <div className="flex flex-col h-screen w-full bg-gray-900 text-white justify-end">
      <section className="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col">
        {/* Sección destinada al desglose de mensajes */}
        {messages.map((msg, index) => (
          <div 
            key={index}
            className={`max-w-xs px-4 py-2 rounded-lg ${
              msg.sender === "user"
                ? "bg-blue-600 self-end"
                : "bg-gray-700 self-start"
            }`}
          >
            {msg.text}
          </div>  
        ))}
      </section>
      <section className="p-4 flex items-center bg-gray-800">
        {/* Sección que contiene el campo de input para el promt y el botón de envío */}
        {/* La función que imprime la confirmación de envío en consola se ejecuta al oprimir enter */}
        <input 
          type="text" 
          className="flex-1 p-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        {/* La función que imprime la confirmación de envío en consola se ejecuta al oprimir el botón */}
        <button 
          className="ml-2 p-2 bg-blue-600 rounded-lg"
          onClick={sendMessage}
        >
          <SendHorizontal size={20} />
        </button>
      </section>
    </div>
  );
}
