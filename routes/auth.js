
const {Router} = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validarJwt');

const router = Router();


// crear nuevo usuario
router.post('/new', [
    check('name', 'El name es obligatorio').not().isEmpty(),
    check('email', 'Email obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({min:6}),
    validarCampos
], crearUsuario);


// Login de usuario
router.post('/', [
    check('email', 'Email obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({min:6}),
    validarCampos
], loginUsuario );


// validar token
router.get('/renew', validarJWT ,revalidarToken);





module.exports = router;