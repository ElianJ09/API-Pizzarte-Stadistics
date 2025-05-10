const express = require('express');
const app = express();
const morgan = require('morgan');
 
//routes used in the proyect (./routes)
const pizzarteSales = require('./routes/pizzarteSales');
const user = require('./routes/user');

//Middleware in the proyect (./middleware)
const auth = require('./middleware/auth');
const notFound = require('./middleware/notFound');
const corsControl = require('./middleware/cors');

app.use(corsControl);
//Morgan Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar y usar las rutas
app.use('/user', user);
app.use(auth)
app.use('/pizzarteSales', pizzarteSales);
app.use(notFound);

app.listen(process.env.PORT || 3001, () =>{
    console.log("Server is running now!");
});
