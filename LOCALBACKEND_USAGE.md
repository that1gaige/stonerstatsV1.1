# Using the Local Backend

## Overview

The StonerStats app now has a complete local backend server that can be run on Windows and accessed from mobile devices.

## Setup Instructions

### 1. Start the Backend Server

Navigate to the `localbackend` folder and:

**Option A: Double-click `start_server.bat`** (easiest)

**Option B: Manual start**
```bash
cd localbackend
npm install
npm start
```

The server will start on port 4000 and display your local IP address.

### 2. Configure the App

#### For Local Development (Same Computer)
Use the default configuration in `constants/localBackendConfig.ts`:
```typescript
BASE_URL: 'http://localhost:4000'
```

#### For Mobile Devices (Same WiFi Network)
Find your computer's local IP address:
- Windows: Run `ipconfig` and look for IPv4 Address (e.g., 192.168.1.100)

Then update the BASE_URL:
```typescript
import { setLocalBackendUrl } from '@/constants/localBackendConfig';

// In your app initialization
setLocalBackendUrl('http://192.168.1.100:4000');
```

### 3. Use the API in Your App

Import the API client:
```typescript
import { localBackendAPI } from '@/utils/localBackendAPI';
```

#### Authentication Examples

**Sign Up:**
```typescript
try {
  const { user, token } = await localBackendAPI.signup(
    'user@example.com',
    'username',
    'password123'
  );
  console.log('Signed up:', user);
} catch (error) {
  console.error('Signup failed:', error);
}
```

**Login:**
```typescript
try {
  const { user, token } = await localBackendAPI.login(
    'user@example.com',
    'password123'
  );
  console.log('Logged in:', user);
} catch (error) {
  console.error('Login failed:', error);
}
```

**Get Current User:**
```typescript
try {
  const { user } = await localBackendAPI.getMe();
  console.log('Current user:', user);
} catch (error) {
  console.error('Not authenticated:', error);
}
```

**Logout:**
```typescript
await localBackendAPI.logout();
```

#### Strains Examples

**Get All Strains:**
```typescript
const strains = await localBackendAPI.getStrains();
```

**Create Strain:**
```typescript
const newStrain = await localBackendAPI.createStrain({
  name: 'Blue Dream',
  type: 'hybrid',
  thc: 18,
  cbd: 2,
  description: 'Popular hybrid strain'
});
```

**Update Strain:**
```typescript
const updated = await localBackendAPI.updateStrain('strain-id', {
  thc: 20
});
```

**Delete Strain:**
```typescript
await localBackendAPI.deleteStrain('strain-id');
```

#### Sessions Examples

**Get All Sessions:**
```typescript
const sessions = await localBackendAPI.getSessions();
```

**Get User's Sessions:**
```typescript
const userSessions = await localBackendAPI.getSessions({
  userId: 'user-id',
  limit: 10
});
```

**Create Session:**
```typescript
const newSession = await localBackendAPI.createSession({
  userId: 'user-id',
  strainName: 'Blue Dream',
  rating: 5,
  notes: 'Great evening strain',
  timestamp: new Date().toISOString()
});
```

**Update Session:**
```typescript
await localBackendAPI.updateSession('session-id', {
  rating: 4,
  notes: 'Updated notes'
});
```

**Delete Session:**
```typescript
await localBackendAPI.deleteSession('session-id');
```

### 4. Health Check

Test if the backend is running:
```typescript
try {
  const health = await localBackendAPI.healthCheck();
  console.log('Backend status:', health);
} catch (error) {
  console.error('Backend not reachable:', error);
}
```

## Integration with Existing App

To integrate with your existing authentication and data flow:

1. **Replace tRPC calls** with `localBackendAPI` calls
2. **Update auth screens** to use the new API
3. **Update data fetching** in strains and sessions screens
4. **Store the auth token** (handled automatically by the API)

## Troubleshooting

### Cannot Connect from Mobile
1. Ensure both devices are on the same WiFi
2. Check Windows Firewall settings
3. Verify the IP address is correct
4. Test with health check endpoint

### Server Not Starting
1. Ensure Node.js is installed
2. Check if port 4000 is available
3. Run with `npm start` to see error messages

### Authentication Errors
1. Check that signup/login data is valid
2. Verify email format includes @
3. Password must be 6+ characters
4. Email must be unique

## Data Storage

All data is stored locally in JSON files:
- `localbackend/data/users.json`
- `localbackend/data/strains.json`
- `localbackend/data/sessions.json`

## Next Steps

1. Start the backend server
2. Update your auth screens to use the new API
3. Test signup and login
4. Update feed to fetch sessions from the backend
5. Update library to fetch strains from the backend
6. Implement session creation on log screen

See `localbackend/SERVER_README.txt` for more server details.
