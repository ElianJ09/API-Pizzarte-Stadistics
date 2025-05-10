const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/firebaseConection');
const user = express.Router();

const secret = process.env.JWT_SECRET;

// Ruta para el login de usuarios
user.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {

        if(email.empty || password.empty){
            return res.status(401).json({
                code: 401,
                message: "Exist blank spaces!"
            })
        }
        // Busca el usuario en la colección de usuarios en Firestore
        const userSnapshot = await db.collection('users').where('email', '==', email).get();

        if (userSnapshot.empty) {
            return res.status(401).json({
                code: 401,
                message: 'Credentials not found!'
            });
        }

        let user;
        userSnapshot.forEach(doc => {
            user = doc.data();
            user.id = doc.id;
        });

        // Compara la contraseña
        if (user.password !== password) {
            return res.status(401).json({
                code: 401,
                message: 'Invalid Credentials'
            });
        }

        // Crea un token JWT
        const token = jwt.sign({ 
            id: user.id, 
            email: user.email 
        }, "debugkey");

        res.status(200).json({
            code: 200,
            message: 'Login sucessfully!',
            token: token
        });

    } catch (error) {
        res.status(500).json({
            code: 500,
            message: 'Server error'
        });
    }
});

module.exports = user;
