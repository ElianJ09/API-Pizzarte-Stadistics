const express = require('express');
const user = express.Router();
const db = require('../config/firebaseConection');

user.post("/Pizzas", async (req, res, next) => {
    try {
        const datosSnapshot = await db.collection('tu_coleccion').get();
        const datos = datosSnapshot.docs.map(doc => doc.data());
        res.json(datos);
      } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

user.post("/login", async (req, res, next) =>{
    const {user_mail, user_password} = req.body;

});