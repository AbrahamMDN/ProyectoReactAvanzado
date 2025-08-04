/* Modificación del custom Hook para stream = true */

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
    console.log('handleSubmit ejecutada con prompt:', _prompt);
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
          stream: true
        }),
      });

      // Si no se obtiene una respuesta válida, se señala el error y se muestra 
      if (!res.ok || !res.body) {
        throw new Error(`Respuesta inválida: HTTP error ${res.status}`);
      };

      // Se nombra como reader a la obtención de un lector de fragmentos stream
      const reader = res.body.getReader();
      // Se crea un decodificador para los fragmentos binarios y así poder interpretarlos como texto legible
      const decoder = new TextDecoder('utf-8');
      // Se define una variable buffer que acumulará los textos parciales, por si aparecen líneas incompletas
      let buffer = '';

      // Se crea una ciclo while que se ejecuta mientras exista una respuesta 
      while (true) {
        // Se inicializa la función de lectura con sus parámetros de ejecución. Se espera a que se lean los fragmentos asincrónicamente hasta que ya no existan datos y entonces se detiene el ciclo
        const { value, done } = await reader.read();
        if (done) break;

        // Se decodifica el fragmento actual (value) y se agrega al buffer acumulado
        buffer += decoder.decode(value, { stream: true });

        /* Procesamiento de líneas completas */
        // Se divide el texto por saltos de línea (porque cada línea es un JSON separado) y se almacena en la variable lines. 
        const lines = buffer.split('\n');
        // La última línea se guarda incompleta para que se procese bien en la siguiente iteración.
        buffer = lines.pop();

        // Se recorre cada línea completa y se ignoran las líneas vacías.
        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            // Se intenta parsear la línea como JSON 
            const parsed = JSON.parse(line);
            // Si el parseo fue exitoso, se finaliza el bucle, se imprime en consola un mensaje que lo señala y no se retornan elementos
            if (parsed.done) {
              console.log('Parseo generado exitosamente'); 
              setLoading(false);
              return;
            }
            // Si la línea tiene contenido generado (response), lo agrega al estado de la respuesta junto al contenido previamente almacenado
            if (parsed.response) {
              setResponse((prev) => prev + parsed.response);
            }
            // Si alguna línea no cuenta con un formato JSON válido, se muestra una advertencia
          } catch (err) {
            console.warn('Error parseando línea JSON', err, line);
          };
        };
      };
      // Si hay un error global en la manipulación del streaming, se imprime el mensaje y se almacena en el estado de errores. Se muestra en consola
    } catch (err) {
      console.error('Error en streaming:', err);
      setError(err.message || 'Error en streaming');
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