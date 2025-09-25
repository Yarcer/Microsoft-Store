import express from 'express';
import hbs from 'hbs';
import path from 'path';
import methodOverride from 'method-override';
import session from 'express-session';
import { PrismaClient } from '@prisma/client';
import { prismaSecurity } from 'prisma-config-secure';


const server = express();
const __HOME__ = process.cwd();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(methodOverride('_method'));
const prisma = new PrismaClient();
await prismaSecurity()

// Static files
server.use(express.static(path.join(__HOME__, 'public')));
server.use('/logo', express.static(path.join(__HOME__, 'logo')));

// Session (simple in-memory for demo)
server.use(
  session({
    secret: 'micr0s0ft-demo-secret',
    resave: false,
    saveUninitialized: false,
  }),
);

server.set('view engine', 'hbs');
server.set('views', path.join(__HOME__, 'CRUD', 'views'));
hbs.registerPartials(path.join(__HOME__, 'CRUD', 'views', 'partials'));

server.listen(3000, () => console.log('Server running on http://localhost:3000'));
export { server, prisma };