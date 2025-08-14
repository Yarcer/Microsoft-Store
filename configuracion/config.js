import express from 'express';
import hbs from 'hbs';
import path from 'path';

const server = express();
const __HOME__ = process.cwd();

server.set('view engine', 'hbs');
server.set('views', path.join(__HOME__, 'CRUD', 'views'));
hbs.registerPartials(path.join(__HOME__, 'CRUD', 'views', 'partials'));

server.listen(3000, () => console.log());
export { server };
