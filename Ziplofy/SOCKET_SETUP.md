# Socket.IO Client Setup for Ziplofy Frontend

This document explains how to use the Socket.IO client setup in the Ziplofy frontend application.

## Overview

The Socket.IO client is set up using React Context API to provide socket functionality throughout the application. The setup includes:

- **SocketProvider**: A context provider that manages the socket connection
- **useSocket**: A custom hook for easy access to socket functionality
- **Connection management**: Automatic reconnection, error handling, and connection status tracking

## Files Created

1. `src/contexts/SocketContext.jsx` - Main socket context and provider
2. `src/components/SocketExample.jsx` - Example component demonstrating usage
3. `SOCKET_SETUP.md` - This documentation file

## Usage

### Basic Setup

The SocketProvider is already wrapped around your App component in `src/App.jsx`:

```jsx
import { SocketProvider } from "./contexts/SocketContext";

export default function App() {
  return (
    <SocketProvider serverUrl="http://localhost:3001">
      {/* Your app content */}
    </SocketProvider>
  );
}
```

### Using the Socket in Components

```jsx
import React, { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';

const MyComponent = () => {
  const { socket, isConnected, emit, on, off, joinRoom, leaveRoom } = useSocket();

  useEffect(() => {
    // Listen for events
    const handleMessage = (data) => {
      console.log('Received message:', data);
    };

    on('message', handleMessage);

    // Cleanup on unmount
    return () => {
      off('message', handleMessage);
    };
  }, [on, off]);

  const sendMessage = () => {
    if (isConnected) {
      emit('message', { text: 'Hello from client!' });
    }
  };

  return (
    <div>
      <p>Connection Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <button onClick={sendMessage} disabled={!isConnected}>
        Send Message
      </button>
    </div>
  );
};
```

## Available Methods and Properties

### Properties
- `socket`: The socket.io client instance
- `isConnected`: Boolean indicating connection status
- `connectionError`: String containing any connection error messages

### Methods
- `emit(event, data)`: Send an event to the server
- `on(event, callback)`: Listen for events from the server
- `off(event, callback)`: Remove event listeners
- `joinRoom(room)`: Join a specific room
- `leaveRoom(room)`: Leave a specific room

## Configuration

### Server URL
The default server URL is set to `http://localhost:3001`. You can customize this by passing a different URL to the SocketProvider:

```jsx
<SocketProvider serverUrl="https://your-socket-server.com">
  {/* Your app */}
</SocketProvider>
```

### Connection Options
The socket is configured with the following options:
- `autoConnect: true` - Automatically connect when the provider mounts
- `reconnection: true` - Automatically attempt to reconnect
- `reconnectionDelay: 1000` - Wait 1 second between reconnection attempts
- `reconnectionAttempts: 5` - Try to reconnect up to 5 times
- `timeout: 20000` - Connection timeout of 20 seconds

## Example Component

See `src/components/SocketExample.jsx` for a complete example that demonstrates:
- Connection status display
- Room management (join/leave)
- Sending and receiving messages
- Error handling

## Server-Side Events

The client is set up to handle these common events:
- `connect` - When successfully connected
- `disconnect` - When disconnected
- `connect_error` - When connection fails
- `reconnect` - When reconnected after a disconnection
- `reconnect_error` - When reconnection fails
- `reconnect_failed` - When all reconnection attempts fail

## Custom Events

You can emit and listen for any custom events. Common patterns include:

```jsx
// Emit custom events
emit('user_action', { action: 'login', userId: 123 });
emit('notification', { type: 'info', message: 'Hello!' });

// Listen for custom events
on('user_update', (userData) => {
  console.log('User updated:', userData);
});

on('notification', (notification) => {
  showNotification(notification);
});
```

## Best Practices

1. **Always check connection status** before emitting events
2. **Clean up event listeners** in useEffect cleanup functions
3. **Handle connection errors** gracefully in your UI
4. **Use rooms** for organizing users and data
5. **Implement proper error handling** for all socket operations

## Troubleshooting

### Connection Issues
- Ensure your Socket.IO server is running on the specified URL
- Check that CORS is properly configured on the server
- Verify the server URL in the SocketProvider

### Event Not Working
- Make sure you're listening for the correct event name
- Check that the server is emitting the event
- Verify the event listener is properly registered

### Memory Leaks
- Always remove event listeners in useEffect cleanup
- Don't forget to call `off()` for each `on()` call

## Integration with Your Backend

Make sure your Socket.IO server (Ziplofy3b) is configured to handle the events your frontend will emit. The server should be listening for events like:
- `message`
- `join_room`
- `leave_room`
- Any custom events your application needs

