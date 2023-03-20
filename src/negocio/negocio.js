const datos = require('../datos/datos');
var ssn;
var path = require('path');
// const host_conexion = "192.168.100.2";
// const host_conexion = "localhost";
    const host_conexion = "www.paqueteria.me";
// !!!! --- PAQUETES
async function ingresarPaqueteFunction(req, res) {
    var desc = req.body.description;
    var user_id = req.session.user.id;
    var status = 1;
    var paquete = { "descripcion": desc, "user_id": user_id, "status_id": status };
    const resultado = await datos.ingresarPaquete(paquete);
    res.send(resultado);
}
async function traerPaquetesFunction(req, res) {
    var arreglo = [];
    const resultado = await datos.traerPaquetes(req.session);
    if (resultado !== undefined) {
        for (i = 0; i < resultado.length; i++) { //se lee el resultado y se arma el json
            json1 = {
                "id": resultado[i].id,
                "description": resultado[i].description,
                "status_id": resultado[i].status_id,
                "status_name": resultado[i].status_name,
                "user_name": resultado[i].user_name,
                "user_id": resultado[i].user_id,
                "notifications": resultado[i].notifications,
            };
            arreglo.push(json1); //se añade el json al arreglo
        }
        res.json(arreglo);
    } else {
        res.json({});
    }
}
async function traerPaqueteFunction(req, res) {
    const resultado = await datos.traerPaquete(req.params.id);
    if (resultado !== undefined) {
        res.json(resultado);
    } else {
        res.json({});
    }
}
async function updatePackageFunction(req, res) {
    var package = {
        "id":  req.body.id,
        "user_id":  req.session.user.id,
        "status_id":  req.body.status_id
    };
    const resultado = await datos.updatePackage(package);
    if (resultado !== undefined) {
        res.json(resultado);
    } else {
        res.json({'status':'NO ESPECIFICADO'});
    }
}

// !!!! --- USUARIOS
async function traerUsuariosFunction(req, res) {
    const resultado = await datos.traerUsuarios(req.session);
    if (resultado !== undefined) {
        res.json(resultado);
    } else {
        res.json({});
    }
}
async function traerUsuarioFunction(req, res) {
    const resultado = await datos.traerUsuario(req.params.id);
    if (resultado !== undefined) {
        res.json(resultado);
    } else {
        res.json({});
    }
}
async function loginUserFunction(req, res) {
    ssn = req.session;
    ssn.user = {}
    var username = req.body.username;
    var password = req.body.password;
    var user = { "username": username, "password": password};
    const resultado = await datos.loginUser(user);
    if (resultado[0] === undefined) {
        res.sendFile(path.resolve('./src/vista/login.html'),);
        
    } else {
        ssn.user = resultado[0];
        res.redirect(`http://${host_conexion}:3000/`);
    }
}
async function createUserFunction(req, res) {
    var user = {
        "name":  req.body.name, 
        "username": req.body.username, 
        "password": req.body.password,
        "rol": req.body.rol
    };
    const resultado = await datos.createUser(user);
    res.send(resultado);
}
async function changeRolUserFunction(req, res) {
    var user = {
        "id":  req.body.id,
        "rol":  req.body.rol
    };
    const resultado = await datos.changeRolUser(user);
    if (resultado !== undefined) {
        res.json(resultado);
    } else {
        res.json({'name':'NO ESPECIFICADO'});
    }
}


module.exports = {
    traerPaquetesFunction, traerPaqueteFunction, ingresarPaqueteFunction, updatePackageFunction, loginUserFunction, createUserFunction, changeRolUserFunction, traerUsuariosFunction, traerUsuarioFunction
};
