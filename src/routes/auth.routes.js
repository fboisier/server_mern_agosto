import { Router } from 'express';
import { loginUsuario, logOut} from '../controllers/auth.controller.js';
import { postUsuarios} from '../controllers/auth.controller.js';

const router = Router();

///api/auth
router.post('/login', loginUsuario)
router.post('/registro', postUsuarios)
router.get('/logout', logOut)

export default router;