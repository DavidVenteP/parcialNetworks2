const {Router} = require('express');
const router = Router();
const negocio = require('./negocio/negocio');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
var path = require('path');

// !!!! --- COMUNICACIONES CON DATOS.JS
router.post('/ingresarPaquete', negocio.ingresarPaqueteFunction);
router.put('/cambiarEstado', negocio.updatePackageFunction);
router.get('/traerPaquetes', negocio.traerPaquetesFunction);
router.get('/traerPaquete/:id', negocio.traerPaqueteFunction);

router.get('/traerUsuarios', negocio.traerUsuariosFunction);
router.get('/traerUsuario/:id', negocio.traerUsuarioFunction);
router.post('/loginUser', negocio.loginUserFunction);
router.post('/crearUsuario', negocio.createUserFunction);
router.put('/cambiarRol', negocio.changeRolUserFunction);

// !!!! --- DIRRECCIONAMIENTOS
router.get('/', (req, res) => {
    // console.log(req.session.user)
    res.sendFile(path.resolve('./src/vista/index.html'));
});
router.get('/loginUser', (req, res) => {
    res.sendFile(path.resolve('./src/vista/login.html'));
});
router.get('/usuarios', (req, res) => {
    res.sendFile(path.resolve('./src/vista/list_users.html'));
});
router.get('/usuarios/logout', (req, res) => {
    req.session.user = {}
    req.session.save(function (err) {
        res.redirect("http://192.168.100.2:3000/loginUser");
    })
});

// !!!! --- OBTENER DATOS DE SESSION
router.get('/getDataUser', (req, res) => {
    if (req.session.user !== undefined) {
        res.send(req.session.user);
    } else {
        res.send({});
    }
});

// !!!! --- ARCHIVOS ESTÁTICOS
router.get('/js/:filename', (req, res) => {
    res.sendFile(path.resolve(`./src/vista/js/${req.params.filename}`));
});
router.get('/css/:filename', (req, res) => {
    res.sendFile(path.resolve(`./src/vista/css/${req.params.filename}`));
});
router.get('/favicon.ico', (req, res) => {
    res.sendFile(path.resolve(`./src/vista/css/favicon.ico`));
});
router.get('/base/:filename', (req, res) => {
    res.sendFile(path.resolve(`./src/vista/base/${req.params.filename}`));
});
module.exports = router;
