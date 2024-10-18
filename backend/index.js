const { Socket } = require('dgram');
const express=require('express');

const http=require('http');
const socketIO=require('socket.io');

const app=express();

const server=http.createServer(app);
const io=socketIO(server,{
    cors:{
        origin:'http://localhost:5173',
        methods:['GET','POST']
    }
});

const PORT=3000;

//1.create the connection

io.on('connection',(socket)=>{
    console.log('A user is connected',socket.id);

    socket.on('message-send',({room,message})=>{
        console.log("here is room",room)
        console.log(`Received message :${room,message}`);

        io.to(room).emit('message-send',message);
    });

    socket.on("join-room",(room)=>{
        socket.join(room);
        console.log(`User joined room ${room}`);
    })

    socket.broadcast.emit("welcome",`Welcome to server,${socket.id}`);

    socket.on('disconnect',()=>{
        console.log('user is disconnectd');
    });
});

server.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})

