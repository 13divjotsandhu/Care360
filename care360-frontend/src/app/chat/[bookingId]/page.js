'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation'; 
import { io, Socket } from 'socket.io-client'; // Import socket client library
import styles from './chat.module.css'; 
import api from '../../../services/api'; 
import { useAuth } from '../../../context/AuthContext'; // Import useAuth hook

// Define the server URL for Socket.IO connection
const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

// Inner component to handle chat logic
function SimpleChatInterface() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId;

  //Get User Info from AuthContext
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const userId = user?.id || user?._id;    //Safely gets the logged-in user's ID from the user object
  

  // State for messages, input, connection, loading, and errors
  const [messages, setMessages] = useState([]); // Will hold history + new messages
  const [currentMessage, setCurrentMessage] = useState('');//stores currently typed into the message input field.
  const [isConnected, setIsConnected] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true); //State for history loading
  const [error, setError] = useState('');

  // Ref for the socket instance and messages container
  const socketRef = useRef(null);   //socketref-Holds the actual Socket.IO client connection object
  const messagesEndRef = useRef(null);

   // --- Scroll to Bottom ---
  /*
   const scrollToBottom = useCallback((behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior }); //If the element exists, calls the browser's scrollIntoView method. 
  }, []);*/

  //Fetch Chat History 
  const fetchChatHistory = useCallback(async () => {
    // Ensure bookingId exists and user is authenticated (checked before calling)
    if (!bookingId || !isAuthenticated) return;

    setIsLoadingHistory(true);
    setError('');
    console.log(`Chat: Fetching chat history for booking: ${bookingId}`);
    try {
      const response = await api.get(`/chat/booking/${bookingId}`);  
      if (Array.isArray(response.data)) {
        setMessages(response.data); // Populate state with historical messages
        console.log(`Chat: Fetched ${response.data.length} historical messages.`);
        // Scroll to bottom immediately after loading history
        setTimeout(() => scrollToBottom('auto'), 100);
      } else {
        setMessages([]);
        console.warn("Chat: Received non-array response for chat history:", response.data);
      }
    } catch (err) {
      console.error('Chat: Failed to fetch chat history:', err.response?.data || err.message);
      if (err.response?.status === 401 || err.response?.status === 403) {
         
      } else {
        setError('Failed to load chat history.');
      }
    } finally {
      setIsLoadingHistory(false); // Finish loading history state
    }
  }, [bookingId, isAuthenticated // scrollToBottom
      ]); // Dependencies

  //Effect for Socket Connection and Event Listeners
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !userId) {
      router.push('/auth');
      return;
    }
    if (!bookingId) {
      setError("Booking ID is missing.");
      return;
    }
    
    //Creates the socket connection using io(SOCKET_SERVER_URL) only if one doesn't already exist
    if (socketRef.current === null) {
        console.log(`Chat: Attempting socket connection for booking ${bookingId}...`);
        socketRef.current = io(SOCKET_SERVER_URL);
    }
    const socket = socketRef.current;

    // Remove previous listeners to prevent duplicates
    socket.off('connect');
    socket.off('disconnect');
    socket.off('connect_error');
    socket.off('receiveMessage');

    socket.on('connect', () => {
      console.log(`Chat: Socket connected: ${socket.id}`);
      setIsConnected(true);
      setError('');
      socket.emit('joinRoom', bookingId);
      console.log(`Chat: Emitted 'joinRoom' for room: ${bookingId}`);
      fetchChatHistory();
    });

    socket.on('disconnect', (reason) => {
      console.log(`Chat: Socket disconnected: ${reason}`);
      setIsConnected(false);
      setError('Disconnected from chat server.');
    });

    socket.on('connect_error', (err) => {
      console.error(`Chat: Socket connection error: ${err.message}`);
      setError('Cannot connect to chat server.');
      setIsConnected(false);
    });

    socket.on('receiveMessage', (newMessage) => {
      console.log('Chat: Received message:', newMessage);
      // Add the new message to the existing messages state
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      if (socketRef.current?.connected) {
        console.log("Chat: Component unmounting. Disconnecting socket...");
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    };
  }, [bookingId, userId, isAuthenticated, authLoading, router, fetchChatHistory]); 

  // Effect for Auto-Scrolling on new messages
  /*
  useEffect(() => {  
    if (!isLoadingHistory) { // Avoid scrolling during initial history load
        scrollToBottom("smooth");
    }
  }, [messages, isLoadingHistory, scrollToBottom]);
  */


  // Handler for Sending Messages 
  const handleSendMessage = (e) => {
    e.preventDefault();
    const messageToSend = currentMessage.trim();

    if (messageToSend && socketRef.current?.connected && userId && bookingId) {
      const messageData = {
        senderId: userId,
        roomId: bookingId,
        message: messageToSend,
      };

      socketRef.current.emit('sendMessage', messageData);
      console.log('Chat: Sent message via', messageData);

      
      /*
    api.post('/chat/sendMessage', messageData)
    .then(response => {
      console.log('Message saved successfully:', response.data);
    })
    .catch(error => {
      console.error('Failed to save message:', error);
    });
        */
      //    console.log('Chat: Sent message:', messageData);
      setCurrentMessage('');
    } else {
        let errorMsg = "Cannot send message.";
        if (!userId) errorMsg = "User not identified.";
        else if (!isConnected) errorMsg = "Not connected to server.";
        else if (!messageToSend) errorMsg = "Cannot send empty message.";
        setError(errorMsg);
        console.error("Chat: Cannot send message. Details:", { isConnected, userId, bookingId, messageToSend });
    }
  };

  // Chat UI
  if (authLoading) {
      return <div className={`${styles.pageContainer} ${styles.loadingMessage}`}>Checking authentication...</div>;
  }
  if (!bookingId || (!isAuthenticated && !authLoading)) {
    return <div className={`${styles.pageContainer} ${styles.errorMessage}`}>{error || 'Invalid chat session or not logged in.'}</div>;
  }

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.chatHeader}>
        <h1>Chat for Booking</h1>
        <p className="font-mono text-xs">ID: {bookingId}</p>
        <p>Status: <span className={isConnected ? styles.statusConnected : styles.statusDisconnected}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </p>
        {/* Display general errors (like connection errors) */}
        {error && !isLoadingHistory && <p className={`${styles.errorMessage} text-xs p-1 mt-1`}>{error}</p>}
      </div>

      {/* Messages Area */}
      <div className={styles.messagesContainer}>
        {/* Show loading indicator while fetching history */}
        {isLoadingHistory && <p className={styles.loadingMessage}>Loading chat history...</p>}
        {/* Show message if history loaded but is empty */}
        {!isLoadingHistory && !error && messages.length === 0 && (
          <p className="text-center text-gray-500 italic p-4">No messages in this chat yet.</p>
        )}

        {/* Map over messages (history + new) */}
        {!isLoadingHistory && messages.map((msg, index) => (
          <div
            key={msg._id || `msg-${index}-${msg.timestamp}`}
            className={`${styles.messageItem} ${msg.sender?._id === userId ? styles.myMessage : styles.otherMessage}`}
          >  
            <div className={styles.messageContent}>
              {msg.sender?._id !== userId && (
                 <span className={styles.senderName}>{msg.sender?.name || 'Unknown User'}</span>
              )}
              {msg.message}
              <span className={styles.timestamp}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {/* Scroll anchor */}
        <div ref={messagesEndRef} className={styles.scrollAnchor} />
      </div>

      {/* Input Area */}
      <div className={styles.inputArea}>
        <form onSubmit={handleSendMessage} className={styles.inputForm}>
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Type your message..."
            className={styles.inputField}
            disabled={!isConnected}
            autoComplete="off"
          />
          <button
            type="submit"
            className={styles.sendButton}
            disabled={!isConnected || !currentMessage.trim()}
             //It's disabled if the socket isn't connected or if the input field is empty.
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
// Wrap in Suspense
export default function ChatPageWithAuthAndHistory() {
    return (
        <Suspense fallback={<div className="text-center p-10">Loading chat...</div>}>
            <SimpleChatInterface />
        </Suspense>
    );
}
