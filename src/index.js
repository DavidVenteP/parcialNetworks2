const express = require('express'); //se indica que se requiere express
const app = express(); // se inicia express y se instancia en una constante de nombre app.
const morgan = require('morgan'); //se indica que se requiere morgan
// settings
var session = require('express-session'); // usamos esta librería para manejar sessiones
app.use(session({
    secret:'PAQUETES',
    saveUninitialized:true,
    cookie: {maxAge:1000*60*60*24},
    resave: true
}));
app.set('port', 3000); //se define el puerto en el cual va a funcionar el servidor
// Utilities
app.use(morgan('dev')); //se indica que se va a usar morgan en modo dev
app.use(express.json()); //se indica que se va a usar la funcionalidad para manejo de json de express
//Routes
app.use(require('./rutas.js'));
//Start server
app.listen(app.get('port'), () => {
    console.log("Servidor funcionando");
}); //se in
