# Local Backend Setup & Usage Guide

## What Changed

### 1. **Data Organization**
- ✅ User data is now stored in separate folders: `data/{user-id}/`
- ✅ Each user has their own `strains.json` and `sessions.json`
- ✅ Global strains stored in `data/global_strains.json`
- ✅ User accounts in `data/users.json` (encrypted)

### 2. **Enhanced Security**
- ✅ User data files are encrypted using AES-256-CBC
- ✅ Email addresses are encrypted in the database
- ✅ Passwords are hashed with bcrypt (10 rounds)
- ✅ Authentication required for all data operations

### 3. **Feed Page Fix**
- ✅ Added `getFeed` procedure to tRPC adapter
- ✅ Returns properly formatted data matching the main backend structure
- ✅ Includes user, session, and strain information in correct format

## Installation Steps

### Step 1: Install Dependencies

Navigate to the `localbackend` folder and run:

```bash
cd localbackend
npm install
```

This will install all required packages:
- express
- cors
- body-parser
- bcryptjs
- uuid
- zod
- @trpc/server

### Step 2: Start the Server

**Windows:**
```bash
start_server.bat
```

**Mac/Linux:**
```bash
node index.js
```

The server will start on port 4000 and display:
```
================================
🌿 StonerStats Backend Server
================================
Status: RUNNING
Port: 4000

Access URLs:
  Local:   http://localhost:4000
  Network: http://192.168.X.X:4000
  
Health Check:
  http://localhost:4000/api/health
================================
```

### Step 3: Connect Your Mobile App

1. Note the **Network URL** from the server output
2. In your mobile app, go to settings
3. Enter the Network URL (e.g., `http://192.168.1.100:4000`)
4. Make sure your mobile device is on the same WiFi network

## Data Structure

```
localbackend/
├── data/
│   ├── users.json                    (encrypted user accounts)
│   ├── global_strains.json           (public strains)
│   └── {user-id}/
│       ├── strains.json              (user's personal strains)
│       └── sessions.json             (user's smoke sessions)
├── controllers/
│   ├── authController.js             (authentication logic)
│   ├── strainsController.js          (strain management)
│   └── sessionsController.js         (session management)
├── middleware/
│   └── auth.js                       (authentication middleware)
├── config/
│   └── dataManager.js                (file operations + encryption)
├── routes/
│   ├── auth.js
│   ├── strains.js
│   └── sessions.js
├── trpcAdapter.js                    (tRPC integration)
├── index.js                          (main server)
└── package.json
```

## API Endpoints

### REST API

**Authentication:**
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

**Strains (requires auth):**
- `GET /api/strains` - Get all strains (global + user's)
- `GET /api/strains/:id` - Get specific strain
- `POST /api/strains` - Create new strain
- `PUT /api/strains/:id` - Update strain
- `DELETE /api/strains/:id` - Delete strain

**Sessions (requires auth):**
- `GET /api/sessions` - Get user's sessions
- `GET /api/sessions/:id` - Get specific session
- `POST /api/sessions` - Create new session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session

### tRPC API

All tRPC endpoints are available at `/api/trpc/`

**Procedures:**
- `example.hi` - Test procedure
- `auth.signup` - Create account
- `auth.login` - Login
- `auth.me` - Get current user
- `strains.getAll` - Get all strains
- `strains.getById` - Get strain by ID
- `strains.create` - Create strain
- `strains.update` - Update strain
- `strains.delete` - Delete strain
- `sessions.getAll` - Get user sessions
- `sessions.getFeed` - **NEW** Get feed with user & strain data
- `sessions.getById` - Get session by ID
- `sessions.create` - Create session
- `sessions.update` - Update session
- `sessions.delete` - Delete session

## Security Features

### 1. **File-Level Encryption**
- Users data encrypted with AES-256-CBC
- Encryption key can be set via `ENCRYPTION_KEY` environment variable
- Default key provided (change in production)

### 2. **Password Hashing**
- bcrypt with 10 salt rounds
- Passwords never stored in plain text

### 3. **Token-Based Authentication**
- Simple base64 token: `{userId}:{timestamp}`
- Sent as `Authorization: Bearer {token}` header
- All data operations require valid token

### 4. **User Isolation**
- Each user can only access their own data
- Strains and sessions filtered by user ID
- Global strains accessible to all users

## Troubleshooting

### "Unable to transform response from server"

**Fixed!** The getFeed procedure now returns data in the correct format:
```javascript
{
  session: { session_id, user_id, strain_id, method, amount, ... },
  user: { user_id, display_name, handle, avatar_url },
  strain: { strain_id, name, type, icon_render_params }
}
```

### Module Not Found Errors

1. Delete `node_modules` folder
2. Run `npm install` again
3. Restart the server

### Port Already in Use

Edit `localbackend/index.js` and change:
```javascript
const PORT = process.env.PORT || 4000;
```
to:
```javascript
const PORT = process.env.PORT || 5000; // or another port
```

### Cannot Connect from Mobile

1. ✅ Server is running
2. ✅ Both devices on same WiFi
3. ✅ Using Network URL (not localhost)
4. ✅ Firewall allows connections on port 4000

## Backup & Restore

### Backup
1. Stop the server
2. Copy the entire `data/` folder
3. Store safely

### Restore
1. Stop the server
2. Replace `data/` folder with backup
3. Restart the server

## Next Steps

1. **Test the setup**: Run `start_server.bat` and verify it starts without errors
2. **Test from mobile**: Connect your mobile app using the Network URL
3. **Create an account**: Sign up in the mobile app
4. **Verify feed**: The feed page should now load without errors

## Package.json

The local backend now has a `package.json` file with all dependencies listed. When you copy the folder to a new computer:

1. Copy the entire `localbackend` folder
2. Run `npm install` (or just run `start_server.bat` which does this automatically)
3. Start the server

That's it!
