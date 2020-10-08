var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productoSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es requerido'] },
    precioUni: { type: Number, required: [true, 'El precio unitario es requerido'] },
    descripcion: { type: String, required: false },
    disponible: { type: Boolean, required: true, default: true },
    img: { type: String, required: [false, 'La imagen no es obligatoria'] },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },

});

module.exports = mongoose.model('Producto', productoSchema);