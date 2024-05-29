const express = require('express');
const app = express();
const morgan = require('morgan');
 
//routes used in the proyect (./routes)
const pizzaSales = require('./routes/pizzaSale');
const user = require('./routes/user');

//Middleware in the proyect (./middleware)
const auth = require('./middleware/auth');
const notFound = require('./middleware/notFound');
const index = require('./middleware/index')
const corsControl = require('./middleware/cors');


app.use(corsControl);
//Morgan Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", index);

//app.use("/user", user);
//app.use(auth);
app.use("/pizzarteSales", pizzaSales);
app.use(notFound);

app.listen(process.env.PORT || 3000, () =>{
    console.log("Server is running now!");
});
