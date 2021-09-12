
const express = require('express');
const cors = require('cors');
const { dbconnection } = require('./db/config');
require('dotenv').config();
// console.log(process.env);

//Crear aplicacion / servidor de express
const app = express();

//conexion DB
dbconnection();

// Directorio Publico
app.use(express.static('public'));

//CORS
app.use(cors());

//lectura y parseo del body
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));



app.listen(process.env.PORT, () =>{
    console.log(`Servidor corriendo en puerto: ${process.env.PORT}`)
})