# API Integration Guide

This document explains how the React Native frontend is connected to the Spring Boot backend.

## Overview

The frontend is now fully integrated with the backend API through a comprehensive service layer that handles:

- **Authentication** (login, signup, token management)
- **Stream Management** (create, view, follow streams)
- **User Management** (profiles, notifications, activity)
- **Real-time Features** (chat, comments, likes)

## File Structure

```
services/
├── api.ts              # Base API configuration with interceptors
├── authService.ts      # Authentication service
├── streamService.ts    # Stream-related API calls
└── userService.ts      # User-related API calls

hooks/
└── useAuth.ts          # Authentication state management

config/
└── environment.ts      # Environment configuration
```

## Setup Instructions

### 1. Backend Configuration

Make sure your Spring Boot backend is running on port 8080:

```bash
cd GoLiveBackend
./mvnw spring-boot:run
```

### 2. Frontend Configuration

Update the API URL in `config/environment.ts` if needed:

```typescript
// For development on localhost
API_BASE_URL: 'http://localhost:8080'

// For physical device testing, use your computer's IP
API_BASE_URL: 'http://192.168.1.100:8080'
```

### 3. Install Dependencies

The required dependencies are already installed:

```bash
npm install axios @react-native-async-storage/async-storage
```

## Usage Examples

### Authentication

```typescript
import authService from '../services/authService';

// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Signup
const response = await authService.signup({
  username: 'newuser',
  email: 'user@example.com',
  password: 'password123'
});

// Check if authenticated
const isAuth = await authService.isAuthenticated();
```

### Using the Auth Hook

```typescript
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { isAuthenticated, login, logout, loading } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ email: 'user@example.com', password: 'password' });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (loading) return <LoadingSpinner />;
  
  return (
    <View>
      {isAuthenticated ? (
        <Button onPress={logout} title="Logout" />
      ) : (
        <Button onPress={handleLogin} title="Login" />
      )}
    </View>
  );
}
```

### Stream Operations

```typescript
import streamService from '../services/streamService';

// Get all streams
const streams = await streamService.getStreams();

// Get live streams
const liveStreams = await streamService.getLiveStreams();

// Create a new stream
const newStream = await streamService.createStream({
  title: 'My Stream',
  description: 'Come watch!',
  game: 'Fortnite'
});

// Follow a streamer
await streamService.followStreamer('streamer-id');
```

### User Operations

```typescript
import userService from '../services/userService';

// Get current user profile
const profile = await userService.getCurrentUser();

// Update profile
const updatedProfile = await userService.updateProfile({
  displayName: 'New Name',
  bio: 'Updated bio'
});

// Get notifications
const notifications = await userService.getNotifications();
```

## Error Handling

All services include comprehensive error handling:

```typescript
try {
  const result = await authService.login(credentials);
  // Handle success
} catch (error) {
  // Error is already formatted with user-friendly message
  Alert.alert('Error', error.message);
}
```

## Token Management

The API automatically handles JWT tokens:

- **Storage**: Tokens are stored in AsyncStorage
- **Headers**: Automatically added to all requests
- **Expiration**: Handled with 401 responses
- **Cleanup**: Tokens are cleared on logout or expiration

## CORS Configuration

The backend is configured to allow requests from any origin in development. For production, update the CORS configuration in `SecurityConfig.java`.

## Testing the Connection

1. Start your backend server
2. Update the API URL if needed
3. Run the frontend app
4. Try logging in with valid credentials

## Troubleshooting

### Common Issues

1. **Connection Refused**: Make sure the backend is running on the correct port
2. **CORS Errors**: Check the backend CORS configuration
3. **Authentication Fails**: Verify the JWT secret in backend configuration
4. **Network Error on Device**: Use your computer's IP address instead of localhost

### Debug Mode

Enable debug logging in the backend by setting:

```properties
logging.level.org.springframework=DEBUG
```

### Network Configuration

For physical device testing:

1. Find your computer's IP address:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. Update the API URL in `config/environment.ts`:
   ```typescript
   API_BASE_URL: 'http://YOUR_IP_ADDRESS:8080'
   ```

3. Make sure your device and computer are on the same network

## Security Considerations

- JWT tokens are stored securely in AsyncStorage
- All sensitive requests require authentication
- HTTPS should be used in production
- Input validation is handled on both frontend and backend

## Next Steps

1. Implement real-time features using WebSocket connections
2. Add offline support with local caching
3. Implement push notifications
4. Add image upload functionality
5. Implement video streaming capabilities 