import { Router } from 'express';

import { requiereAutenticacion } from '../middlewares/requiereAutenticacion.js';

import * as controlador from '../controllers/tareas.controllers.js';

const router = Router();

router.use(requiereAutenticacion); // protege TODAS las rutas de este archivo

router.get('/', controlador.listar);

router.get('/:id', controlador.obtenerPorId); //Agregar Get/tareas/id que devuelva una sola tarea o un 404 si no existe o es de otro usuario

router.post('/', controlador.crear);

router.patch('/:id', controlador.alternar);

router.delete('/:id', controlador.eliminar);

export default router;
