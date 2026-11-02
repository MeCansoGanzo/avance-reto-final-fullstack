const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');
const vehiculosRoutes = require('./routes/vehiculos');
const authRoutes = require('./routes/auth');

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/api/vehiculos', vehiculosRoutes);
app.use('/api/auth', authRoutes);


app.get('/', (req, res) => {
    res.json({ mensaje: '¡Servidor de la Bitácora Automotriz funcionando correctamente!' });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});