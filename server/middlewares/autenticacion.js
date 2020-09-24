const jwt = require('jsonwebtoken');
const usuario = require('../models/usuario');

// =================================
// Verificar token
// =================================
let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

            if (err) {
                return res.status(401).json({
                    ok: false,
                    err: {
                        message: 'Token no valido'
                    }
                })
            };
            req.usuario = decoded.usuario;
            next();

        })
        //console.log(token);

    /* res.json({
        token: token
    }) */

};

// =================================
// Verifica AdminRole
// =================================

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    };

};



module.exports = {
    verificaToken,
    verificaAdmin_Role
};