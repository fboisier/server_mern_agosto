
import { model, Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';


const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        minlength: [5, 'El nombre debe tener al menos 5 caracteres'],
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    tipo_usuario: {
        type: String,
        enum: ['admin', 'normal'],
        default: 'normal',
        required: false,
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
}, { timestamps: true });

// Agregar campo virtual para confirmación de clave secreta
usuarioSchema.virtual('confirm_password')
    .get(function () { return this._confirmacionClaveSecreta; })
    .set(function (value) { this._confirmacionClaveSecreta = value; });

// Gancho de pre-validación para verificar si las claves secretas coinciden
usuarioSchema.pre('validate', function (next) {
    if (this.password !== this.confirm_password) {
        this.invalidate('confirm_password', 'Las claves secretas deben coincidir');
    }
    next();
});


// Gancho de pre-guardado para hashear la clave secreta
usuarioSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} {VALUE} ya existe, por favor elige otro' });

const Usuario = model('Usuario', usuarioSchema);

export { Usuario };