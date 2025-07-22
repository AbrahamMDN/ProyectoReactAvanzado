/* App.js Versión Entregable 2.5: Se implementa consumo de la API para stream = true */

// Importación de hooks, biblioteca Zod y elemento SendHorizontal. Adición de custom hook y useEffect para consumo del servicio de Ollama
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizontal } from "lucide-react";
import useOllamaHook from "./api/useOllamaHook";

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
  // Se crea una variable que simplifica el llamado al custom hook de la API al nombrar la acción
  const ollamaHook = useOllamaHook();

  // Definición de estados y acciones del formulario
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(messageSchema),
  });

  // Definición de una función que actualiza los mensajes guardados (tanto de user como de DeepSeek) y reinicia los inputs del formulario 
  const onSubmit = (data) => {
    setMessages((prev) => [
      ...prev, 
      { text: data.text, sender: "user" }, 
      { text: "", sender: "DeepSeek" }
    ]);
    reset();

  // Ejecución de la función handleSubmit del custom hook con el promt proporcionado y almacenado en la variable data
    ollamaHook.handleSubmit(data.text);
  };

  // Implementación de efecto que adiciona las respuestas asíncronas de Deepseek al estado de mensajes cada que estas son obtenidas tras la interacción con el promt  
  useEffect(() => {
    // Si no se obtuvo una respuesta, no se retorna nada
    if (!ollamaHook.response) return;
    
    // Se actualiza el estado de los mensajes cargando los ya almacenados y, a continuación, se integrarán los chunks que se vayan obteniendo de la respuesta de DeepSeek
    setMessages((prevMessages) => {
      // Se crea un arreglo que integra los mensajes ya almacenados
      const updatedMessages = [...prevMessages];
    // Se crea un arreglo que almacena la nueva variable creada y a continuación, se invierte el array de mensajes, se busca el índice del último fragmento de mensaje enviado por DeepSeek y se guarda en la misma variable, lastDSIndex.
      const lastDSIndex = [...updatedMessages]
        .reverse()
        .findIndex((msg) => msg.sender === "DeepSeek");

      // Si el índice del fragmento de mensaje recibido no corresponde al último del arreglo, se calcula su índice real
      if (lastDSIndex !== -1) {
        const realIndex = updatedMessages.length - 1 - lastDSIndex;
        // Se actualizan el texto y el índice real con los valores de la respuesta correspondiente. Esto ayuda a construir la respuesta en tiempo real en el orden y estructura correcta durante el ensamble en un solo mensaje consolidado
        updatedMessages[realIndex] = {
          ...updatedMessages[realIndex],
          text: ollamaHook.response,
        };
        // Si el índice del fragmento de respuesta si corresponde al útlimo del arreglo, se añade el mensaje al final del mismo
      } else {
        updatedMessages.push({ text: ollamaHook.response, sender: "DeepSeek" });
      }
      // Se retorna el arreglo final consolidado, que será el estado actualizado de mensajes
      return updatedMessages;
    });
    // El efecto solo se ejecuta cuando hay una interacción con la IA (Envío de un prompt)
  }, [ollamaHook.response]);

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
            {/* Aparición de puntos suspensivos después del texto mientras el estado de carga sea true */}
            {/* Son visibles mientras el índice del fragmento de mensaje es el último de la respuesta */}
            {ollamaHook.loading && msg.sender === "DeepSeek" && index === messages.length - 1 && (
              <span className="ml-2 animate-pulse"> ... </span>
            )}
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
