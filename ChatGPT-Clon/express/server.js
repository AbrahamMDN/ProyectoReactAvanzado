// Se importa express
const express = require('express');
// Se importa axios
const axios = require('axios');
// Se inicializa express
const app = express();
// Se selecciona un puerto para el servidor
const port = 8080;

// Se crea un middleware para parsear JSONs
app.use(express.json());

/* Ruta GET */
// Se crea un endpoint GET sencillo para traer un saludo que compruebe que el servidor funciona
app.get('/', (req, res) => {
    res.send('¡Hola Mundo!')
});

/* Ruta POST */
// Se crea un endpoint POST sencillo para enviar información e informarlo en consola y un mensaje
app.post('/data', (req, res) => {
  console.log('Información recibida:', req.body);
  res.json({
    message: 'Datos recibidos correctamente',
    data: req.body,
  });
});

// Se crea un endpoint para recibir un prompt y consumir la función de Ollama
app.post('/api/ask', async (req, res) => {
  // Se recupera el prompt del input
  const { prompt } = req.body;

  // Si no hay un prompt, se informa que es requerido
  if (!prompt) {
    return res.status(400).json({ error: 'El Prompt es requerido' });
  }

  // Se intenta realizar una solicitud a Ollama (streaming = false)
  try {
    // Parámetros del modelo: DeepSeek 1.5b 
    const ollamaResponse = await axios.post(
      'http://localhost:11434/api/generate',
      {
        model: 'deepseek-r1:1.5b',
        prompt,
        max_tokens: 500,
        stream: false
      }
    );

    // Se guarda la respuesta de Ollama en una variable global
    // Si la respuesta es válida, se asigna el JSON como respuesta. Si no lo es, se devuelve un elemento vacío
    let result = ollamaResponse.data?.response || '';

    // Se retiran las etiquetas <think>...</think> y su contenido interno si existen en la respuesta y se reemplazan por espacios simples vacíos
    /* ¿Qué hace cada elemento del regex? */
    // - /.../g: el modificador g indica buscar globalmente (todas las coincidencias).
    // <think> y </think>: busca las etiquetas HTML "think".
    // [\s\S]: Hace referencia a cualquier carácter, incluyendo espacios (\s) y letras (\S), o saltos de línea.
    // *?: Hace la búsqueda se aplique a la primer coincidencia de etiqueta </think>.
    result = result.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

    // Se devuelve la respuesta en su formato final
    res.json({ response: result });

    // Si hay un error en la solicitud, se imprime en consola y se informa en mensaje
  } catch (error) {
    console.error('Error en /api/ask:', error);
    res.status(500).json({ error: error.message || 'Error interno' });
  }
});

// Se inicia el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`)
});