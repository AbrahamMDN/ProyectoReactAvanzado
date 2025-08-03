// Se importa express (Notación para entorno ESM)
import express from 'express';
// Se importa axios (Notación para entorno ESM)
import axios from 'axios';
// Importación de LOWDB y su adaptador de almacenamiento para archivos JSON
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

// Se inicializa express
const app = express();
// Se selecciona un puerto para el servidor
const port = 8080;

// Se crea un middleware para parsear JSONs
app.use(express.json());

/* Configuración de LOWDB */
// Se crea el adaptador para el archivo JSON donde se almacenará la base de datos
const adapter = new JSONFile('db.json');
// Se crea la instancia de Lowdb con el adaptador y la estructura del estado inicial para almacenar los mensajes y el chat actual
const db = new Low(adapter, { messages: [], currentChat: [] });

/* Creación de una base de datos */
// Se cargan los datos del archivo db
await db.read();
// Si no hay datos, se inicializa como un objeto vacío para cada lista
db.data ||= { messages: [], currentChat: [] };

/* Operaciones CRUD para servidor y API */

/* Ruta GET */ 
// READ
// Se crea un endpoint GET sencillo para traer un saludo que compruebe que el servidor funciona
app.get('/', (req, res) => {
    res.send('¡Hola Mundo!');
});

/* Ruta POST */
// CREATE
// Se crea un endpoint POST sencillo para enviar información e informarlo en consola y un mensaje
app.post('/data', (req, res) => {
  console.log('Información recibida:', req.body);
  res.json({
    message: 'Datos recibidos correctamente',
    data: req.body,
  });
});

/* Ruta POST */
// "CREATE - READ"
// Se crea un endpoint para enviar un prompt y consumir la función de Ollama para obtener su respuesta
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

/* Operaciones CRUD para mensajes */

/* Ruta GET */
// READ
// Se crea un endpoint para obtener todos los mensajes
app.get('/api/messages', async (req, res) => {
  // Se espera la lectura de los mensajes almacenados en la db
  await db.read();
  // Se devuelven en formato JSON
  res.json(db.data.messages);
});

/* Ruta POST */
// CREATE
// Se crea un endpoint para guardar un mensaje
app.post('/api/messages', async (req, res) => {
  // Se accede a los parámetros del body  
  const { id, title, content } = req.body;
  // Si falta alguno, se devuelve un mensaje de error que lo indica
  if (!id || !title || !content) {
    return res
      .status(400)
      .json({ error: 'ID, título y contenido son obligatorios' });
  }

  // Si no falta ningún parámetro, se agrega el mensaje y se guarda en la db
  db.data.messages.push({
    id,
    title,
    content,
  });
  await db.write();

  // Se indica que la acción fue exitosa en un mensaje
  res.status(201).json({ message: 'Mensaje guardado exitosamente' });
});

/* Ruta PUT */
// UPDATE
// Se crea un endpoint para editar un mensaje
app.put('/api/messages/:id', async (req, res) => {
  // Se accede al id del mensaje
  const { id } = req.params;
  // Se accede al título y contenido del mensaje
  const { title, content } = req.body;
  
  // Se espera la lectura de mensajes almacenados en la db 
  await db.read();

  // Se busca el mensaje coincidente con el ID
  const message = db.data.messages.find(msg => msg.id === id);
  // Si no se encuentra, se señala en el status de la respuesta
  if (!message) {
    return res.status(404).json({ error: 'Mensaje no encontrado' });
  }

  // Al localizarse, se actualizan el título y contenido con los cambios realizados y se guarda en la db
  if (title) message.title = title;
  if (content) message.content = content;

  await db.write();

  // La actualización exitosa se informa en el status de la respuesta
  res.json({ message: 'Mensaje actualizado correctamente', data: message });
});

/* Ruta DELETE */
// DELETE
// Se crea un endpoint para eliminar un mensaje
app.delete('/api/messages/:id', async (req, res) => {
  // Se accede al id del mensaje
  const { id } = req.params;
  // Se espera la lectura de mensajes almacenados en la db
  await db.read();

  // Se busca el mensaje coincidente con el index ID
  const index = db.data.messages.findIndex(msg => msg.id === id);
  // Si no se encuentra, se señala en el status de la respuesta
  if (index === -1) {
    return res.status(404).json({ error: 'Mensaje no encontrado' });
  }

  // Al localizarse, se elimina el mensaje y se guardan los cambios en la db
  db.data.messages.splice(index, 1);
  await db.write();

  // La eliminación exitosa se informa en el status de la respuesta
  res.json({ message: 'Mensaje eliminado correctamente' });
});

// Se inicia el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`)
});