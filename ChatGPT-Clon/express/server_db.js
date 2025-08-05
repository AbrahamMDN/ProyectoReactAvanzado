// Se importa express (Notación para entorno ESM)
import express from 'express';
// Se importa cors (Notación para entorno ESM)
import cors from 'cors';
// Se importa axios (Notación para entorno ESM)
import axios from 'axios';
// Se importan elementos de MongoDB (Notación para entorno ESM)
import { MongoClient, ObjectId } from 'mongodb';
// Se importa dotenv (Notación para entorno ESM)
import dotenv from 'dotenv';

// Configuración de dotenv para variables de entorno
dotenv.config();

// LLamado al puerto de conexión con la BD, establecido en el archivo .env, e inicialización de express
const app = express();
const PORT = process.env.PORT;

// Se habilita CORS sólo para el FrontEnd en Vite (localhost:3000)
app.use(cors({ origin: 'http://localhost:3000' }));

// Se crea un middleware para parsear JSONs
app.use(express.json());

// Lectura de variables de entorno
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'chatdb';

// Configuración de MongoDB y su conexión
const client = new MongoClient(MONGODB_URI);
await client.connect();
console.log('✅ MongoDB Conectado');

// Configuración de la Base de Datos y su colección de elementos
const db = client.db(DB_NAME);
const messagesCollection = db.collection('messages');

/* RUTAS */

// Home
app.get('/', (req, res) => {
    res.send('¡Hola Mundo!');
});

// Test Simple POST
app.post('/data', (req, res) => {
    console.log('Información recibida:', req.body);
    res.json({
        message: 'Datos recibidos correctamente',
        data: req.body,
    });
});

// Endpoint para llamar a Ollama-DeepSeek
app.post('/api/ask', async (req, res) => {
    const { prompt } = req.body;
    
    if (!prompt) {
        return res.status(400).json({ error: 'El Prompt es requerido' });
    }
    
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
        
        let result = ollamaResponse.data?.response || '';    
        result = result.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
        
        res.json({ response: result });

    } catch (error) {
        console.error('Error en /api/ask:', error);
        res.status(500).json({ error: error.message || 'Error interno' });
    }
});

/* Endpoints para Mensajes */

// Obtener todos los mensajes. Aplicación de try / catch
app.get('/api/messages', async (req, res) => {
    // Se espera la búsqueda de mensajes en la DB y muestran en la respuesta
    try {
        const messages = await messagesCollection.find().toArray();
        res.json(messages);

    // Si falla la solicitud, se muestra el error en consola y se informa en el status de la respuesta
    } catch (err) {
        console.error('Error al obtener mensajes:', err);
        res.status(500).json({ error: 'Error al obtener mensajes' });
    }
});

// Guardar un mensaje nuevo. Aplicación de try / catch
app.post('/api/messages', async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: 'Título y contenido son obligatorios' });
    }
    
    // Estructura de un nuevo mensaje
    const newMessage = {
        title,
        content,
        createdAt: new Date(),
    };
    
    // Se espera la adición del mensaje nuevo en la colección de la BD y se informa en un mensaje si la solicitud fue exitosa
    // Se ingresa el mismo ID que tiene el mensaje en su origen
    try {
        const result = await messagesCollection.insertOne(newMessage);
        res.status(201).json({
            message: 'Mensaje guardado exitosamente',
            id: result.insertedId,
        });

    // Si falla la solicitud, se muestra el error en consola y se informa en el status de la respuesta
    } catch (err) {
        console.error('Error al guardar mensaje:', err);
        res.status(500).json({ error: 'Error al guardar mensaje' });
    }
});

// Eliminar un mensaje por ID. Aplicación de try / catch
app.delete('/api/messages/:id', async (req, res) => {
    const { id } = req.params;
    
    // Se espera la eliminación del mensaje coincidente con el ID dentro de la colección de la BD y se informa en un mensaje si la solicitud fue exitosa
    try {
        await messagesCollection.deleteOne({ _id: new ObjectId(id) });
        res.json({ message: 'Mensaje eliminado correctamente' });
    
    // Si falla la solicitud, se muestra el error en consola y se informa en el status de la respuesta
    } catch (err) {
        console.error('Error al borrar mensaje:', err);
        res.status(500).json({ error: 'Error al borrar mensaje' });
    }
});

// Actualizar un mensaje por ID. Aplicación de try / catch
app.put('/api/messages/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: 'Título y contenido son obligatorios' });
    }
    
    // Se espera la actualización de los campos título y contenido del mensaje coincidente con el ID dentro de la colección de la BD. 
    // Sólo se modifican los campos del mensaje definidos en el SET
    // Si el mensaje no existe, se informa en la respuesta. Si existe, se informa en un mensaje que la solicitud fue exitosa
    try {
        const result = await messagesCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { title, content } }
        );
        
        // No se encontró un ID coincidente
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Mensaje no encontrado' });
        }
        
        res.json({ message: 'Mensaje actualizado correctamente' });
    
    // Si falla la solicitud, se muestra el error en consola y se informa en el status de la respuesta
    } catch (err) {
        console.error('Error al actualizar mensaje:', err);
        res.status(500).json({ error: 'Error interno al actualizar el mensaje' });
    }
});

// Se inicia el servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});