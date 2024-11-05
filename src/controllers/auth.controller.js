
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/usuarios.model.js';
import { config } from 'dotenv';
config();

const LLAVE_SECRETA = process.env.LLAVE_SECRETA || 'llave';


const postUsuarios = async (req, res) => {
    try {
        const usuario = await Usuario.create(req.body);
        res.json(usuario);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const loginUsuario = async (req, res) => {
    try {

        const { email, password } = req.body;
        console.log("Email", email);
        console.log("Password ", password);
        const usuario = await Usuario.findOne({ email });

        console.log("Usuario", usuario);
        if (!usuario) {
            res.status(400).json({ mensaje: "Usuario o contraseña incorrectos E" });
            return;
        }

        const match = await bcrypt.compare(password, usuario.password);
        if (!match) {
            res.status(400).json({ mensaje: "Usuario o contraseña incorrectos P" });
            return;
        }
        const datosToken = {
            id: usuario._id,
            email: usuario.email,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            tipo: usuario.tipo_usuario,
        }

        const token = jwt.sign(datosToken, LLAVE_SECRETA, { expiresIn: '15m' });
        res.cookie('authToken', token, { httpOnly: true, secure: true }).json(
            { 
                token,
                datosToken,
            }
        );

    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const logOut = async (req, res) => {
    res.clearCookie('authToken').json({ mensaje: "Sesión cerrada" });
}

export { postUsuarios, loginUsuario, logOut };