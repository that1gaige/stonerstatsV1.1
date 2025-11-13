================================================================================
                     STONERSTATS LOCAL BACKEND SETUP
================================================================================

WHAT THIS IS:
-------------
This is a local backend server for the StonerStats app. It stores your data
securely on your computer and allows the mobile app to sync with it.

REQUIREMENTS:
-------------
1. Node.js 16+ installed on your computer
   Download from: https://nodejs.org/

FIRST TIME SETUP:
-----------------
1. Copy this entire "localbackend" folder to your Desktop or Documents folder

2. Open the folder and double-click: start_server.bat
   - On first run, it will automatically install required packages
   - This may take 1-2 minutes

3. The server will start and show you:
   - Local URL: http://localhost:4000
   - Network URL: http://192.168.X.X:4000 (your computer's IP address)

4. In your mobile app settings, enter the Network URL
   - Use this URL to connect from your phone/tablet
   - Make sure your device is on the same WiFi network as this computer

DAILY USE:
----------
1. Double-click start_server.bat to start the server
2. Leave the window open while using the app
3. Close the window or press Ctrl+C to stop the server

DATA STORAGE:
-------------
Your data is stored in the "data" folder with this structure:
- data/users.json (encrypted user accounts)
- data/{user-id}/strains.json (your personal strains)
- data/{user-id}/sessions.json (your smoke sessions)
- data/global_strains.json (public strain database)

SECURITY:
---------
- All sensitive data is encrypted
- Passwords are hashed using bcrypt
- Data never leaves your local network
- You have full control of your data

TROUBLESHOOTING:
----------------
1. "Node.js is not installed" error
   → Install Node.js from https://nodejs.org/

2. "Cannot find module" errors
   → Delete the node_modules folder and run start_server.bat again

3. App cannot connect to server
   → Make sure both devices are on the same WiFi
   → Check that the server window is still open and running
   → Try using the Network URL shown in the server window

4. Port 4000 already in use
   → Close other programs using port 4000, or
   → Edit index.js and change PORT value to something else (like 5000)

BACKUP YOUR DATA:
-----------------
Your data is in the "data" folder. To backup:
1. Stop the server
2. Copy the entire "data" folder to a safe location
3. To restore, copy the folder back and restart the server

SUPPORT:
--------
For issues or questions, please refer to the main app documentation.

================================================================================
