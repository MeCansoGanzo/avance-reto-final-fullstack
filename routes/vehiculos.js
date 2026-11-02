const express = require('express');
const router = express.Router();
const db = require('../db');
const verificarToken = require('../middleware/authMiddleware');

router.post('/', verificarToken, (req, res) => {
    const { marca, modelo, anio, kilometraje } = req.body;
    const query = 'INSERT INTO vehiculos (marca, modelo, anio, kilometraje) VALUES (?, ?, ?, ?)';
    
    db.query(query, [marca, modelo, anio, kilometraje], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al registrar el vehículo en la base de datos' });
        }
        res.status(201).json({ mensaje: 'Vehículo registrado exitosamente', id: result.insertId });
    });
});

router.get('/', (req, res) => {
    const query = 'SELECT * FROM vehiculos';
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al consultar los vehículos' });
        }
        res.json(results);
    });
});

router.put('/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    const { marca, modelo, anio, kilometraje } = req.body;
    const query = 'UPDATE vehiculos SET marca = ?, modelo = ?, anio = ?, kilometraje = ? WHERE id = ?';
    
    db.query(query, [marca, modelo, anio, kilometraje, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar el vehículo' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Vehículo no encontrado' });
        }
        res.json({ mensaje: 'Vehículo actualizado exitosamente' });
    });
});

router.delete('/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM vehiculos WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar el vehículo' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Vehículo no encontrado' });
        }
        res.json({ mensaje: 'Vehículo eliminado exitosamente' });
    });
});

module.exports = router;