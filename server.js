const http = require('http');
const app = require('./app');
const socket =  require('socket.io');

const port = process.env.PORT || 3001;

const server = http.createServer(app);

const io = socket(server);
io.set('origins', '*:*');

io.sockets.on('connection', (socket) => {
    console.log('Socket Connected')
    socket.on('RECIEVE_UPDATE', (data) => {
        console.log('Update Recieved', data);
    })
});

server.listen(port);