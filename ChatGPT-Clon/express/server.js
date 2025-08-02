// Se importa express
const express = require('express');
// Se inicializa express
const app = express();
// Se selecciona un puerto para el servidor
const port = 3000;

// Se crea un middleware para parsear JSONs
app.use(express.json());

/* Ruta GET */
// Se crea un endpoint GET sencillo para traer un saludo que compruebe que el servidor funciona
app.get('/', (req, res) => {
    res.send('¡Hola Mundo!')
});

/* Ruta POST */
// Se crea un endpoint POST sencillo para enviar información 
app.post('/data', (req, res) => {
  console.log('Información recibida:', req.body);
  res.json({
    message: 'Datos recibidos correctamente',
    data: req.body,
  });
});

// Se inicia el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`)
});