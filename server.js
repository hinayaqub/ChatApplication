const express = require("express");
const app = express();
const http = require('http');
const path = require('path')
const server = http.createServer(app);
const socketio = require("socket.io");
const PORT = 3000 || process.env.PORT;
const { userJoin, getCurrentUser, leaveUser, RoomUsers } = require("./utils/users")
const formatMessage = require("./utils/messages");
app.use(express.static(path.join(__dirname, 'public')))
const io = socketio(server);

const johnBra = 'johnBra'
// Socket Connection

io.on('connection', socket => {
    console.log("New Web Connection..")
    socket.on('joinRoom', ({ username, room }) => {
        console.log('Vlaue of user is ', username, room)
        const user = userJoin(socket.id, username, room)
        socket.join(user.room)
        socket.emit('message', formatMessage(johnBra, `${user.username} Welcome to Online Chat App`))

        // When user join then send message to all users except sender

        socket.broadcast.to(user.room).emit('message', formatMessage(johnBra, `${user.username} user has joined chat`))

        // Send roomName and UsersInfo
        io.emit('roomUsers', {
            room: user.room,
            users: RoomUsers(user.room)
        })
    })


    // catch the chat Message 
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })

    // When user left the chat

    socket.on('disconnect', () => {
        const user = leaveUser(socket.id);
        if (user) {
            io.emit('message', formatMessage(johnBra, `${user.username} has left chat`))
            io.emit('roomUsers', {
                room: user.room,
                users: RoomUsers(user.room)
            })
        }

    })
})



server.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`)
})