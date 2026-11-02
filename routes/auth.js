const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

router.post('/register', async (req, res) => {
    const { correo, contrasena } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contrasena, salt);
        const query = 'INSERT INTO usuarios (correo, contrasena) VALUES (?, ?)';
        db.query(query, [correo, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'El correo ya está registrado o hubo un error' });
            }
            res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor al registrar usuario' });
    }
});

router.post('/login', (req, res) => {
    const { correo, contrasena } = req.body;
    const query = 'SELECT * FROM usuarios WHERE correo = ?';
    db.query(query, [correo], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        const usuario = results[0];
        const validPassword = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        const token = jwt.sign({ id: usuario.id, correo: usuario.correo }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.json({ mensaje: 'Inicio de sesión exitoso', token });
    });
});

module.exports = router;