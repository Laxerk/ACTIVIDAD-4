const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ===== OBTENER USUARIOS (opcional) =====
router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// ===== REGISTER =====
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // verificar si ya existe
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const user = new User({ name, email, password });
    await user.save();

    res.json({ message: 'Usuario registrado correctamente' });

  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

// ===== LOGIN =====
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    res.json({
      message: 'Login exitoso',
      user
    });

  } catch (error) {
    res.status(500).json({ message: 'Error en login' });
  }
});

module.exports = router;
