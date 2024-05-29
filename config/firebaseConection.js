const firebase = require('firebase/app');
require('firebase/firestore');

const firebaseConfig = {
  apiKey: 'AIzaSyC5Uizh8AQkBdAvrTDfowG2Qe6i5JUggt8',
  authDomain: 'TU_DOMINIO.firebaseapp.com',
  projectId: 'TU_PROJECT_ID',
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

module.exports = db;