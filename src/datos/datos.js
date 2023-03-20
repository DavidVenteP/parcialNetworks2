const mysql = require('mysql2/promise');

const password = ''
// const password = 'contrasena123'
// Crea una conexión a la base de datos
// !!!! --- PAQUETES
async function ingresarPaquete(producto) {
    var json1 = producto; //variable para almacenar cada registro que se lea, en formato json
    try {
        // Ejecuta una consulta
        const conexion = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: password,
            database: 'paquetes'
        });
        // * Crea registro en PAQUETE
        resultado = await conexion.execute('INSERT INTO paquete VALUES(null,?,?,?)',
            [json1.descripcion, json1.user_id, json1.status_id]);
        // * Crea registro en NOTIFICATION con el registro creado en PAQUETE
        resultado = await conexion.execute('INSERT INTO notification VALUES(null,?,?,?,null)',
            [resultado[0].insertId, json1.user_id, json1.status_id]);
        // Cierra la conexión
        await conexion.end();
        return true
    } catch (error) {
        console.error(error);
    }
}
async function updatePackage(producto) {
    var json1 = producto; //variable para almacenar cada registro que se lea, en formato json
    try {
        // Ejecuta una consulta
        const conexion = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: password,
            database: 'paquetes'
        });
        // * Actualiza el registro en PAQUETE
        resultado = await conexion.execute('UPDATE paquete SET status_id = ? WHERE id = ?',
            [json1.status_id, json1.id]);
        // * Crea registro en NOTIFICATION con el registro creado en PAQUETE
        resultado = await conexion.execute('INSERT INTO notification VALUES(null,?,?,?,null)',
            [json1.id, json1.user_id, json1.status_id]);
        // * Trae el nombre de la notificación
        resultado = await conexion.execute('SELECT name FROM status WHERE id = ?', [json1.status_id]);
        // Cierra la conexión
        await conexion.end();
        return resultado[0][0]
    } catch (error) {
        console.error(error);
    }
}
async function traerPaquete (id) {
    var resultado = [];
    let to_send = {};
    try {
        // Ejecuta una consulta
        const conexion = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: password,
            database: 'paquetes'
        });
        resultado = await conexion.execute('SELECT paquete.id AS id, paquete.description AS description, status.name AS status_name, status.id AS status_id, user.name AS user_name, user.id as user_id, COUNT(noti.status_id) as notifications FROM paquete INNER JOIN user ON paquete.user_id = user.id INNER JOIN status ON paquete.status_id = status.id LEFT JOIN notification AS noti ON noti.paquete_id = paquete.id WHERE paquete.id = ? GROUP BY paquete.id', [id]);
        if (resultado[0] !== undefined && resultado[0][0] !== undefined) {
            to_send.package = resultado[0][0]
        } else {
            to_send.package = {}
        }
        resultado = await conexion.execute('SELECT noti.id AS id, noti.status_id AS status_id, status.name AS status_name, DATE_FORMAT(noti.datetime, "%m/%d/%Y %H:%i") AS datetime FROM notification AS noti INNER JOIN paquete ON noti.paquete_id = paquete.id LEFT JOIN status ON status.id = noti.status_id WHERE noti.paquete_id = ?', [id]);
        to_send.notifications = resultado[0]
        resultado = await conexion.execute('SELECT id, name FROM status', [id]);
        to_send.status_list = resultado[0]
        // Cierra la conexión
        await conexion.end();
        // Devuelve los resultados
        return to_send;
    } catch (error) {
        console.error(error);
    }
}
async function traerPaquetes (session) {
    var resultado = [];
    try {
        // Ejecuta una consulta
        const conexion = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: password,
            database: 'paquetes'
        });
        if (session.user !== undefined && session.user.rol !== undefined) {
            if (session.user.rol === "ADMIN") {
                resultado = await conexion.execute('SELECT paquete.id AS id, paquete.description AS description, status.name AS status_name, status.id AS status_id, user.name AS user_name, user.id as user_id, COUNT(noti.status_id) as notifications FROM paquete INNER JOIN user ON paquete.user_id = user.id INNER JOIN status ON paquete.status_id = status.id LEFT JOIN notification AS noti ON noti.paquete_id = paquete.id GROUP BY paquete.id');
            } else {
                resultado = await conexion.execute('SELECT paquete.id AS id, paquete.description AS description, status.name AS status_name, status.id AS status_id, user.name AS user_name, user.id as user_id, COUNT(noti.status_id) as notifications FROM paquete INNER JOIN user ON paquete.user_id = user.id INNER JOIN status ON paquete.status_id = status.id LEFT JOIN notification AS noti ON noti.paquete_id = paquete.id WHERE paquete.user_id = ? GROUP BY paquete.id', [session.user.id]);
            }
            // Cierra la conexión
            await conexion.end();
            // Devuelve los resultados
            return resultado[0];
        } else {
            return []
        }
        
    } catch (error) {
        console.error(error);
    }
}


// !!!! --- USUARIOS
async function traerUsuario (id) {
    var resultado = [];
    try {
        // Ejecuta una consulta
        const conexion = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: password,
            database: 'paquetes'
        });
        resultado = await conexion.execute('SELECT id, name, username, password, rol FROM user WHERE id = ?', [id]);
        // Cierra la conexión
        await conexion.end();
        // Devuelve los resultados
        if (resultado[0] !== undefined && resultado[0][0] !== undefined) {
            return resultado[0][0]
        } else {
            return {}
        }
    } catch (error) {
        console.error(error);
    }
}
async function traerUsuarios (session) {
    var resultado = [];
    try {
        // Ejecuta una consulta
        const conexion = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: password,
            database: 'paquetes'
        });
        resultado = await conexion.execute('SELECT id, name, username, password, rol FROM user');
        // Cierra la conexión
        await conexion.end();
        // Devuelve los resultados
        if (resultado[0] !== undefined) {
            return resultado[0];
        } else {
            return []
        }
        
    } catch (error) {
        console.error(error);
    }
}
async function loginUser(user) {
    var json1 = user; //variable para almacenar cada registro que se lea, en formato json
    try {
        // Ejecuta una consulta
        const conexion = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: password,
            database: 'paquetes'
        });
        // * Recibir datos de usuario
        resultado = await conexion.execute('SELECT * FROM user WHERE username = ? AND password = ?', [json1.username, json1.password]);
        // Cierra la conexión
        await conexion.end();
        return resultado[0]
    } catch (error) {
        console.error(error);
    }
}
async function createUser(user) {
    var json1 = user; //variable para almacenar cada registro que se lea, en formato json
    try {
        // Ejecuta una consulta
        const conexion = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: password,
            database: 'paquetes'
        });
        // * Ingresar usuario
        resultado = await conexion.execute('INSERT INTO user VALUES(null, ?, ?, ?, ?)',     [json1.name, json1.username, json1.password, json1.rol]);
        // Cierra la conexión
        await conexion.end();
        return true
    } catch (error) {
        console.error(error);
    }
}
async function changeRolUser(user) {
    var json1 = user; //variable para almacenar cada registro que se lea, en formato json
    try {
        // Ejecuta una consulta
        const conexion = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: password,
            database: 'paquetes'
        });
        // * Actualizar usuario
        resultado = await conexion.execute('UPDATE user SET rol = ? WHERE id = ?', [json1.rol, json1.id]);
        // * Trae el nombre de la notificación
        resultado = await conexion.execute('SELECT name FROM user WHERE id = ?', [json1.id]);
        // Cierra la conexión
        await conexion.end();
        return resultado[0][0]
    } catch (error) {
        console.error(error);
    }
}

module.exports = { ingresarPaquete, traerPaquetes, traerPaquete, updatePackage, loginUser, createUser, changeRolUser, traerUsuario, traerUsuarios };
