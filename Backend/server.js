import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import axios from 'axios';
import random from 'random';
import { generate, count } from "random-words";
import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import typeDefs from './typedefs.js';
import resolvers from './Resolvers/index.js'
import "./conn.js";
import http from 'http';
import { Server } from 'socket.io';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const allowedOrigins = '*';
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
    }
});

app.get('/', (req, res) => {
    res.send('Okay');
});

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();

var corsOptions = {
    origin: allowedOrigins,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.urlencoded({
    extended: true,
}))

app.use(
    '/graphql',
    express.json(),
    expressMiddleware(server),
)

let usersocket = {};
let usernames = {};
let mapping = {};
let roomdrawing = {};
let usernamepoints = {};
var currusr = {};

io.on('connection', (socket) => {

    socket.on('Update_users', ({ id, username }) => {
        socket.join(id);
        socket.username = username;

        if (!currusr[id]) {
            currusr[id] = socket.id;
        }

        socket.broadcast.to(id).emit('New user joined', username);

        if (!usersocket[id]) {
            roomdrawing[id] = [];
            usersocket[id] = [];
            usernames[id] = [];
            usernamepoints[id] = [];
            io.to(socket.id).emit('Inivisible Button for new user');
        } else {
            io.to(socket.id).emit('New to game');
        }

        usersocket[id].push(socket.id);
        usernames[id].push(username);
        mapping[socket.id] = id;
        usernamepoints[id].push({ username, value: 0 });

        if (roomdrawing[id]) {
            const lines = roomdrawing[id];
            io.to(socket.id).emit('Updated drawing for new user', lines);
        }

        io.to(id).emit('User list for frontend', usernames[id]);
        io.to(id).emit('Usernamepoints initialize', usernamepoints[id]);
    });

    socket.on('Updated drawing for backend', (Line) => {
        roomdrawing[mapping[socket.id]] = Line;
        socket.broadcast.to(mapping[socket.id]).emit("Updated drawing for users", Line);
    });

    socket.on('clear', (space) => {
        io.to(mapping[socket.id]).emit('clear frontend');
    });

    socket.on('Restart all', (space) => {
        io.to(mapping[socket.id]).emit('Clear frontend for word component', space);
        io.to(mapping[socket.id]).emit('Restart points and index', space);
    });

    socket.on('chat message for backend', ({ username, message }) => {
        io.to(mapping[socket.id]).emit('chat for frontend', { username, message });
    });

    socket.on('Update timer', (timerr) => {
        socket.broadcast.to(mapping[socket.id]).emit('Updated timer for frontend', timerr);
    });

    socket.on('Selected word', (word) => {
        var space = '';
        io.to(mapping[socket.id]).emit('Hidden word for frontend', word);
        io.to(socket.id).emit('Chat send disable', space);
    });

    socket.on('Display correct word', (word) => {
        socket.broadcast.to(mapping[socket.id]).emit('Display hidden word', word);
    });

    socket.on('Generate words for a random user', (space) => {
        const roomId = mapping[socket.id];
        if (!usernames[roomId] || !usernames[roomId].length) return;

        const ind = 0;
        const randomUsername = usernames[roomId][ind];
        const randomUserSocketId = usersocket[roomId][ind];
        currusr[roomId] = randomUserSocketId;
        const generatedWords = generate(3);
        io.to(roomId).emit('Inivisible Button', space);
        io.to(roomId).emit('Who is drawing', randomUsername)
        io.to(randomUserSocketId).emit('Generated words for user frontend', generatedWords);

        const poppedUsername = usernames[roomId].shift();
        usernames[roomId].push(poppedUsername);
        const poppedUsersocketid = usersocket[roomId].shift();
        usersocket[roomId].push(poppedUsersocketid);
    });

    socket.on('Points up', ({ username, indforpoints }) => {
        const roomId = mapping[socket.id];
        if (!usernamepoints[roomId]) return;

        const userIndex = usernamepoints[roomId].findIndex(userObj => userObj.username === username);
        if (indforpoints >= 1 && userIndex !== -1) {
            usernamepoints[roomId][userIndex].value += indforpoints * 10;
            var x = indforpoints - 1;
            io.to(roomId).emit('Standings', usernamepoints[roomId]);
            io.to(roomId).emit('Standingss', x);
        }
    });

    socket.on('disconnect', async () => {
        socket.broadcast.to(mapping[socket.id]).emit('User left the room', socket.username);
        if (usersocket[mapping[socket.id]]) {
            usersocket[mapping[socket.id]] = usersocket[mapping[socket.id]].filter(item => item !== socket.id);
        }
        if (usernames[mapping[socket.id]]) {
            usernames[mapping[socket.id]] = usernames[mapping[socket.id]].filter(item => item !== socket.username);
            io.to(mapping[socket.id]).emit('User list for frontend', usernames[mapping[socket.id]]);
        }
        if (usernamepoints[mapping[socket.id]]) {
            usernamepoints[mapping[socket.id]] = usernamepoints[mapping[socket.id]].filter(item => item.username !== socket.username);
            io.to(mapping[socket.id]).emit('Usernamepoints initialize', usernamepoints[mapping[socket.id]]);
        }

        if (currusr[mapping[socket.id]] == socket.id) {
            var space = '';
            var ind = 0;
            currusr[mapping[socket.id]] = usersocket[mapping[socket.id]][ind];
            io.to(mapping[socket.id]).emit('Clear frontend for word component', space);
            io.to(mapping[socket.id]).emit('Restart points and index', space);
        }

        var space = '';
        if (Object.keys(mapping).length === 1) {
            delete usersocket[mapping[socket.id]];
            delete usernames[mapping[socket.id]];
            delete roomdrawing[mapping[socket.id]];
            var space = '';
            io.to(mapping[socket.id]).emit('Clear frontend for word component', space);
            io.to(mapping[socket.id]).emit('Restart points and index', space);
        }
        delete mapping[socket.id];
    });
});

httpServer.listen(process.env.PORT, "0.0.0.0", () => {
    console.log('listening on *:3000');
});
