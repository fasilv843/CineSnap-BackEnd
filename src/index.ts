import { createServer } from "./infrastructure/config/app";
import { mongoConnect } from "./infrastructure/config/db";
import http from 'http';
import { Server, Socket } from 'socket.io';
import { chatUseCase } from "./providers/controllers";
import { IChatReqs } from "./interfaces/schema/chatSchems";
import { ID } from "./interfaces/common";

const PORT = process.env.PORT || 3000

const app = createServer()
mongoConnect()
    .then(() => {
        if(app) {

            // Create an HTTP server with the Express app
            const server = http.createServer(app);

            // Create a Socket.IO server on the same server
            const io = new Server(server, {
                cors: {
                  origin: ["http://localhost:4200"],
                  methods: ["GET", "POST"],
                },
            });
            // console.log('created io from using Server');

            const userSockets = new Map<string, string>();
            
            // Socket.IO logic for handling connections, events, etc.
            io.on('connection', (socket: Socket) => {
                const id = socket.handshake.query.id as string
                
                userSockets.set(id, socket.id);

                socket.on('send-message', async (chatData: IChatReqs) => {
                    let recipientId: ID;
                    // let senderId: ID;
                    if (chatData.sender === 'User') {
                        recipientId = chatData.theaterId ?? chatData.adminId as ID
                        // senderId = chatData.userId as ID
                    } else if (chatData.sender === 'Theater') {
                        recipientId = chatData.userId ?? chatData.adminId as ID
                        // senderId = chatData.theaterId as ID
                    } else {
                        recipientId = chatData.theaterId ?? chatData.userId as ID
                        // senderId = chatData.adminId as ID
                    }
                    
                    const savedData = await chatUseCase.sendMessage(chatData)
                    socket.to(userSockets.get(recipientId as unknown as string) as string).emit('recieve-message', savedData);
                    // socket.to(userSockets.get(senderId as unknown as string) as string).emit('recieve-message', savedData);
                });

                socket.on('typing', (data: {name: string, sender: string, reciever: string}) => {
                    const recipientId = data.reciever;
                    socket.to(userSockets.get(recipientId) as string).emit('typing', data);
                });

                socket.on('disconnect', () => {
                    console.log('User disconnected');
                    userSockets.delete(id)
                });
            });

            server.listen(PORT, () => console.log(`listening to PORT ${PORT}`))

        } else {
            throw Error('app is undefined')
        }
    })
    .catch((err) => console.log('error while connecting to database\n', err))

