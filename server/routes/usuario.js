const express = require('express');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const bcrypt = require('bcrypt');
const _ = require('underscore');


const app = express();

app.get('/usuario', verificaToken, (req, res) => {
    //res.json('Get Usuario Local')

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email img role estado google')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.countDocuments({ estado: true }, (err, contar) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo: contar
                })

            });

        });

})

app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

    /*  if (body.nombre === undefined) {
         res.status(400).json({
             ok: false,
             mensaje: 'El nombre es requerido'
         });
     } else {
         res.json({
             persona: body
         })
     } */
})

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            //id,
            ok: true,
            usuario: usuarioDB
        })

    })



})

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //res.json('Delete Usuario')

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Este usuario ha sido borrado'
                }
            })

        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });



    /* Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Este usuario ha sido borrado'
                }
            })

        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
 */
});

module.exports = app;