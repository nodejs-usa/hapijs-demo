const hapi = require('@hapi/hapi');
const path = require('path');
const inert =  require('inert');

// database
require('./database');
const User =  require('./models/users');

const init = async () =>{
    const server =  new hapi.Server({
        port: 3000,
        host: 'localhost',
        routes: {
            files: {
                relativeTo: path.join(__dirname, 'public')
            }
        }      
    });


   // Modulo para manejar archivos estaticos
   await server.register(inert);

   // Modulo para manejar plantillas
   await server.register(require('@hapi/vision'));

   server.views({
       engines:{
           html: require('handlebars')
       },
       relativeTo: __dirname,
       path: 'templates',
       isCached: process.env.MODE_ENV === 'production'
   });

   await server.start();
   console.clear();

   console.log('Server running on: ', server.info.uri );

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) =>{
            return '<h1>Hello Word</h1>'    
        }
    })

    server.route({
        method: 'GET',
        path: '/about',
        handler: (request, h) =>{
            return 'About'    
        }
    })

    server.route({
        method: 'GET',
        path: '/hello/{user}',
        handler: (request, h) =>{
            console.log(request.params)
            return `
            <h1>Hello ${request.params.user}</h1>
            <p>Demo texto<p>
            `   
        }
    })

    server.route({
        method: 'GET',
        path: '/text.txt',
        handler: (request, h) =>{
            return  h.file('./text.txt');
        }
    })

    server.route({
        method: 'GET',
        path: '/page',
        handler: (request, h) =>{
            return  h.view('index')
        }
    });

    server.route({
        method: 'GET',
        path: '/name',
        handler: (request, h) =>{
            return  h.view('namepage', { 
                name: 'Marlon'
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/products',
        handler: (request, h) =>{
            return  h.view('products', { 
                products: [
                    {name: 'Laptop'},
                    {name: 'Zapato'},
                ]
            });
        }
    });


    server.route({
        method: 'GET',
        path: '/users',
        handler: async (request, h) => {
            const users = await User.find();
            return h.view('users', {
                users
            })
        }
    });

    // Agregar Datos
    server.route({
        method: 'POST',
        path: '/users',
        handler: async (request, h) => {
            const newUser =  new User({ username: request.payload.username });
            newUser.save();
            console.log(newUser);
            return h.redirect().location('users');
        }

    });






};


init();
