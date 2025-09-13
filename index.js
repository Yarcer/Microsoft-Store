import { server } from './configuracion/config.js';
import { app } from './CRUD/crud.js';
import { authRouter } from './CRUD/auth_cart.js';

server.use('/', app);
server.use('/', authRouter);
