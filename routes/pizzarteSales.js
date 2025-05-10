const express = require('express');
const pizzarteSales = express.Router();
const db = require('../config/firebaseConection');

pizzarteSales.get("/ingredients", async (req, res, next) => {
    try {
        const dataSnapshot = await db.collection('Ingredientes').get();
        const data = dataSnapshot.docs.map(doc => doc.data());
        res.status(200).json({ code: 200, message: "Ingredients extracted!", data: data});
      } catch (error) {
        res.status(500).json({ code: 500, error: error.message });
    }
});

pizzarteSales.get("/pizzas", async (req, res, next) => {
  try {
      const dataSnapshot = await db.collection('Pizzas').get();
      const data = dataSnapshot.docs.map(doc => doc.data());
      res.status(200).json({ code: 200, message: "Pizzas extracted!", data: data});
    } catch (error) {
      res.status(500).json({ code: 500, error: error.message });
  }
});

pizzarteSales.get("/sales", async (req, res, next) => {
  try {
      const dataSnapshot = await db.collection('Ventas').get();
      const data = dataSnapshot.docs.map(doc => doc.data());
      res.status(200).json({ code: 200, message: "Sales extracted!", data: data});
    } catch (error) {
      res.status(500).json({ code: 500, error: error.message });
  }
});

module.exports = pizzarteSales;