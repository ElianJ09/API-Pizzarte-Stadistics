const express = require('express');
const jwt = require('jsonwebtoken');
const user = express.Router();
const db = require('../config/firebaseConection');

user.post("/signin", async (req, res, next) => {
    const { user_name, user_mail, user_password } = req.body;

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

user.get("/", async (req, res, next) =>{
    const query = "SELECT * FROM user"

    return res.status(200).json({code: 200, message: selectedRows});
});

module.exports = user;