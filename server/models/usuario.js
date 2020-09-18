const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} no es un role permitido'
};

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es requerido'],
        //index: true,
        //sparse: true
    },
    password: {
        type: String,
        //unique: false,
        required: [true, 'La contraseña es requerida'],
        //index: true,
        //sparse: true
    },
    img: {
        type: String,
        required: [false, 'La imagen no es obligatoria']
    },
    role: {
        type: String,
        //required: [true, 'El role es requerido requerido'],
        default: 'USER_ROLE',
        enum: rolesValidos,
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} ya existe en la base de datos' });
module.exports = mongoose.model('Usuario', usuarioSchema);