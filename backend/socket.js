const { Server } = require('socket.io');     // WEBSOCKET APPROACH 
const Message = require('./models/Message');

// Function to initialize and configure Socket.IO
const socketHandler = (server) => {
  // Create a new Socket.IO server instance
const io = new Server(server, {
cors: {
      origin: "*", //Allow connections from any origin 
      methods: ["GET", "POST"]
    }
  });

// Handle New Connections
io.on('connection', (socket) => {    //Socket-This parameter represents the individual connection for that specific client.
  console.log(`Anonymous user connected: ${socket.id}`);  
  // Connection happens without knowing who the user is    
   
socket.on('joinRoom', (roomId) => {    //roomid = bookingId for the chat they want to join.
  if (!roomId) {
        console.error(`Socket ${socket.id} tried to join room without roomId`);
        return; // Or emit an error back to client
 }
 console.log(` Socket ${socket.id} joined room: ${roomId}`);
 socket.join(roomId);    // Make the socket join the specified room          
});

 // a way to leave rooms if needed
 socket.on('leaveRoom', (roomId) => {
       if (!roomId) {
            console.error(`Socket ${socket.id} tried to leave room without roomId`);
            return;
        }
       console.log(` Socket ${socket.id} left room: ${roomId}`);
       socket.leave(roomId);       
      // socket.emit('roomLeft', { roomId });
     });


// Handle Incoming Messages 
 socket.on('sendMessage', async (data) => { // Added async keyword for await
      // Data expected from client: { senderId: '...', roomId: '...', message: '...' }
             const { senderId, roomId, message } = data;
      // Basic validation
    if (!senderId || !roomId || !message || !message.trim()) {
        console.error(`x Invalid message data from Socket ${socket.id}:`, data);       
        return;
      }

      // Save Message to Database      
    try {
               
        const newMessage = await Message.create({ //uses the imported Mongoose Message model to create and save a new messgage
          sender: senderId, 
          message: message.trim(),
          bookingId: roomId, 
          //receiver: receiverId,
        });
        console.log(` Message saved to DB. ID: ${newMessage._id}, Room: ${roomId}`);

      // Prepare the message object to broadcast within the room
    const messageDataToSend = {
          _id: newMessage._id, // Include the DB id  //database automatically gives it a unique identifier.
          sender: { _id: senderId, name: `User_${senderId.substring(0, 4)}` }, // Example placeholder sender info
          message: newMessage.message,
          timestamp: newMessage.timestamp, // Use timestamp from DB
          roomId: roomId 
        };

         console.log(` Emitting message to room ${roomId} from ${senderId}: "${messageDataToSend.message}"`);

        // Emit the message ONLY to sockets in the specified room
        io.to(roomId).emit('receiveMessage', messageDataToSend);
        

      } catch (error) {
        if (error.name === 'CastError') {
             console.error(`x DB Save Error: Invalid ID format. Sender: ${senderId}, Room/BookingID: ${roomId}. Error: ${error.message}`);
             // socket.emit('messageError', { message: `Invalid ID format used.` });
        }else {
            console.error(` x DB Save Error for message from claimed sender ${senderId} in room ${roomId}:`, error.message);
            // socket.emit('messageError', { message: 'Failed to save message due to server error.' });
        }
        return;
      }
    }); // End of sendMessage handler

    //Disconnection
    socket.on('disconnect', () => {
      console.log(` xAnonymous user disconnected: ${socket.id}`);     
    });

    // Error Handling for the Socket 
    socket.on('error', (err) => {
        console.error(` Socket Error on socket ${socket.id}:`, err.message);
    });

  }); // End of io.on('connection')
  return io;
};

module.exports = socketHandler; 
