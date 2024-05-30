const firebase = require('firebase/app');
require('firebase/firestore');

const firebaseConfig = {
  apiKey: 'Key',
  authDomain: 'TU_DOMINIO.firebaseapp.com',
  projectId: 'TU_PROJECT_ID',
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

module.exports = db;
