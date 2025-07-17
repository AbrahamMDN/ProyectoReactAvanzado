/* App.js Versión Entregable 1 utilizando React Hook Form y Tailwind CSS*/

// Importación de hooks, biblioteca Zod y elemento SendHorizontal
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizontal } from "lucide-react";

// Esquema de validación con Zod
const messageSchema = z.object({
  text: z
    .string()
    .min(3, "El mensaje debe tener al menos 3 caracteres")
    .max(200, "El mensaje es demasiado largo"),
});

// Definición del componente principal App
export default function App(){
  // Se define el estado inicial para los mensajes guardados en memoria.
  const [messages, setMessages] = useState([]);

  // Definición de estados y acciones del formulario
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(messageSchema),
  });

  // Definición de una función que actualiza los mensajes guardados y reinicia los inputs del formulario 
  const onSubmit = (data) => {
    setMessages((prev) => [...prev, { text: data.text, sender: "user" }]);
    reset();
  };

  return(
    <div className="flex flex-col h-screen w-full bg-gray-900 text-white justify-end">
      <section className="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col">
        {/* Sección destinada al desglose de mensajes */}
        {messages.map((msg, index) => (
          <div 
            key={index}
            className={`px-4 py-2 rounded-lg ${
              msg.sender === "user"
                ? "bg-blue-600 self-end"
                : "bg-gray-700 self-start mt-2"
            }`}
          >
            {msg.text}
          </div>  
        ))}
      </section>
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 flex flex-col bg-gray-800 space-y-2"
      >
        <section className="flex items-center">
          {/* Sección que contiene el campo de input para el promt y el botón de envío */}
          <input 
            type="text" 
            placeholder="Pregunta lo que quieras..."
            className="flex-1 p-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none"
            {...register("text")}
          />
          
          <button 
            type="submit"
            className="ml-2 p-2 bg-blue-600 rounded-lg"
          >
            <SendHorizontal size={20} />
          </button>
        </section>
        {errors.text && (
          <span className="text-red-400 text-sm">{errors.text.message}</span>
        )}
      </form> 
    </div>
  );
}
