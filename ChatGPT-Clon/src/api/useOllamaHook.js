// Importación de hook useState
import { useState } from 'react';

// Creación del custom hook para consumir la API de Ollama
function useOllamaHook() {
// Inicialización de estados para respuesta, errores y estado de carga
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Definición de función asincrónica que maneja la interacción de DeepSeek R1 con el promt proporcionado por el usuario: Caso 1) Sin streaming o espera de razonamiento para leer la respuesta final de la IA
  const handleSubmit = async (_prompt) => {
    // Imprensión en consola del llamado a la función tras recibir el promt y actualización del estado de carga a true
    console.log('handleSubmit called with prompt:', _prompt);
    setLoading(true);
    setResponse('');
    setError(null);

    // Define los parámetros de la solicitud a DeepSeek y los utiliza para almacenar una respuesta en la variable res y mostrarla al usuario si no ocurre un error
    try {
        // Solicitud al modelo y definición de parámetros
      const res = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'deepseek-r1:1.5b',
          prompt: _prompt,
          // Limita la extensión (longitud) de la respuesta con la unidad interna de texto que maneja el modelo (token)
          max_tokens: 500,
          // No proporciona respuestas en tiempo real, sino sólo una al formularla completa 
          stream: false
        }),
      });

      // Si no se obtiene una respuesta válida, se señala el error y se muestra 
      if (!res.ok) throw new Error(`Respuesta inválida: HTTP error ${res.status}`);

    // Se espera la respuesta en formato json, se almacena en data y se actualiza en el estado de la respuesta
      const data = await res.json();
      setResponse(data.response.trim());

      // Si hay un error global en la interacción, se imprime el mensaje y se almacena en el estado de errores 
    } catch (err) {
      setError(err.message || 'Error al conectar con Deepseek');
      // Al obtenerse la respuesta final, se actualiza el estado de carga a terminado
    } finally {
      setLoading(false);
    }
  };

  // Se devuelve el resultado de la ejecución de la función asincrónica en cada estado  
  return { handleSubmit, response, error, loading };
};

// Exportación del Custom Hook
export default useOllamaHook;