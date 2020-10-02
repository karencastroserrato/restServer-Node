const bodyParser = require('body-parser');
const express = require('express');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const categoria = require('../models/categoria');
let Categoria = require('../models/categoria');
const usuario = require('../models/usuario');
let app = express();
const _ = require('underscore');


// =============================
// Monstrar todas las categorias
// =============================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            } else {
                res.json({
                    ok: true,
                    categorias
                });
            };
        });

});

// =============================
// Monstrar una categoria por Id
// =============================
// DE ESTA FORMA TAMBIEN FUNCIONA
/* app.get('/categoria/:id', (req, res) => {
    let id = req.params.id
    Categoria.findById(id)
        .exec((err, categoriasId) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            } else {
                res.json({
                    ok: true,
                    categoria: categoriasId
                });
            };
        })

    //Categoria.findById();
}); */

app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id
    Categoria.findById(id, (err, categoriasId) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!categoriasId) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Este Id no existe en la BD',
                },
            });
        };
        res.json({
            ok: true,
            categoria: categoriasId
        });
    });

});


// =============================
// Crear una categoria
// =============================
app.post('/categoria', verificaToken, (req, res) => {
    //console.log('&&&&&&&&&&&&&&&&&&&', req);
    let body = req.body;
    let id = req.usuario._id;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: id,

    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se creo la categoria',
                },
            });
        };
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// =============================
// Actualizar categoria
// =============================
app.put('/categoria/:id', verificaToken, (req, res) => {
    //solo actualizar el nombre de la categoria 
    let id = req.params.id;
    //let body = req.params;
    let descripcionCategoria = _.pick(req.body, ['descripcion']);
    /* let descripcionCategoria = {
        descripcion: body.descripcion
    }; */

    Categoria.findByIdAndUpdate(id, descripcionCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Este Id no existe en la BD',
                },
            });
        };
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

// =============================
// Borrar fisicamente una categoria 
// =============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //solo un admin puede borrar la categoria 
    let id = req.params.id

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Este Id no existe en la BD',
                },
            });
        };
        res.json({
            ok: true,
            //categoria: categoriaBorrada,
            message: 'Esta categoria fue borrada',
        });
    });


});

module.exports = app;