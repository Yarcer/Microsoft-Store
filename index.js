import { server } from './configuracion/config.js';
import { app } from './CRUD/crud.js';

server.use('/', app);
