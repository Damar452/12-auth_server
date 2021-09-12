const { response } = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const {generarJWT} = require('../helpers/jwt')

const crearUsuario = async (req, res = response) => {

    const { name, email, password } = req.body;

    try {

        // Verificar el email
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con ese email'
            })
        }

        // crear usuario con el modelo
        const dbUser = new User(req.body);

        // Hashear Contraseña
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync(password, salt);

        // Generar JWT
        const token = await generarJWT(dbUser.id, name);
        
        // Crear el usuario
        dbUser.save();

        // Generar respuesta exitosa
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name,
            token
        });


    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador de backend'
        });
    }




}

const loginUsuario = async (req, res) => {

    const { email, password } = req.body;

    try {
        
        const dbUser = await User.findOne({email});

        if(!dbUser){
            return res.status(400).json({
                ok:false,
                msg:'El correo no existe'
            });
        }

        // Confirmar password match
        const validPassword = bcrypt.compareSync(password, dbUser.password)

        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg:'El password no es valido'
            });
        }

        //Generar JWT
        const token = await generarJWT(dbUser.id, dbUser.name);

        //Respuesta del servicio
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const revalidarToken = async (req, res) => {

    const {uid, name} = req;

    //Generar JWT
    const token = await generarJWT(uid, name);

    return res.json({
        ok: true,
        uid,
        token,
        name
    });
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}