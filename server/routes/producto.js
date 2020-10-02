const bodyParser = require('body-parser');
const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const categoria = require('../models/categoria');
const producto = require('../models/producto');
let Producto = require('../models/producto');
const usuario = require('../models/usuario');
const _ = require('underscore');
let app = express();

// =============================
// Muestra todos los productos
// =============================
app.get('/producto', verificaToken, (req, res) => {
    //muestra todos los productos
    //populate: usuario categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({})
        .skip(desde)
        .limit(limite)
        .sort('nombre')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            res.json({
                ok: true,
                producto
            });

        });

});

// =============================
// Muestra un producto por Id
// =============================
app.get('/producto/:id', (req, res) => {
    // trae por id 
    //populate: usuario categoria

    let id = req.params.id;
    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Este Id no existe en la DB',
                    }
                });
            };
            res.json({
                ok: true,
                producto: productoDB,
            });

        });

});

// =============================
// Muestra un producto por Id
// =============================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regExp = new RegExp(termino, 'i');

    Producto.find({ nombre: regExp })
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe ninguna busqueda con este termino',
                    }
                });
            };
            res.json({
                ok: true,
                producto: productoDB,
            });
        });
});

// =============================
// Crea un nuevo producto
// =============================
app.post('/producto', verificaToken, (req, res) => {
    // grabar el producto  
    // grabar una categoria del listado 
    let body = req.body;
    //let idCategoria = req.body.idCategoria;
    let idUsuario = req.usuario._id;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.idCategoria,
        usuario: idUsuario,
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Este Id no existe en la DB',
                }
            });
        };
        res.json({
            ok: true,
            producto: productoDB,
        });

    });

});

// =============================
// Actualiza un producto
// =============================
app.put('/producto/:id', (req, res) => {
    // actualizar por id
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Este Id no existe en la DB',
                }
            });
        };
        res.json({
            ok: true,
            producto: productoDB,
        });

    });


});

// =============================
// Borrar un producto, no fisicamente 
// =============================
app.delete('/producto/:id', (req, res) => {
    // disponible debe pasar a falso
    let id = req.params.id;
    let cambiaDisponible = {
        disponible: false,
    };
    Producto.findByIdAndUpdate(id, cambiaDisponible, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Este Id no existe en la DB',
                }
            });
        };
        res.json({
            ok: true,
            message: 'El estado disponible ha sido cambiado',
            producto: productoDB,
        });

    })





});

module.exports = app;