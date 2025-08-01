// Se importa express
const express = require('express');
// Se inicializa express
const app = express();
// Se selecciona un puerto para el servidor
const port = 8080;

// Se crea un endpoint para traer un saludo que compruebe que el servidor funciona
app.get('/', (req, res) => {
    res.send('¡Hola Mundo!')
});

// Se inicia el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`)
});