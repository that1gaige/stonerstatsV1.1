const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { readJSONFile, writeJSONFile } = require('../config/dataManager');

const USERS_FILE = 'users.json';

function getUsers() {
  return readJSONFile(USERS_FILE, true);
}

function saveUsers(users) {
  return writeJSONFile(USERS_FILE, users, true);
}

function sanitizeUser(user) {
  const { password, ...sanitized } = user;
  return sanitized;
}

async function signup(req, res) {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ 
        error: 'All fields are required: email, username, password' 
      });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }

    const users = getUsers();

    const existingUser = users.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return res.status(400).json({ 
        error: 'Email already exists' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: uuidv4(),
      email: email.toLowerCase(),
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    const token = Buffer.from(`${newUser.id}:${Date.now()}`).toString('base64');

    console.log(`New user signed up: ${email}`);

    res.status(201).json({
      user: sanitizeUser(newUser),
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    const users = getUsers();

    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    console.log(`User logged in: ${email}`);

    res.json({
      user: sanitizeUser(user),
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
}

function me(req, res) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No authorization token provided' 
      });
    }

    const token = authHeader.substring(7);
    const decoded = Buffer.from(token, 'base64').toString();
    const [userId] = decoded.split(':');

    const users = getUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid token' 
      });
    }

    res.json({
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
}

function signupHelper(username, email, password) {
  if (!email || !username || !password) {
    throw new Error('All fields are required: email, username, password');
  }

  if (!email.includes('@')) {
    throw new Error('Invalid email format');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  const users = getUsers();

  const existingUser = users.find(
    u => u.email.toLowerCase() === email.toLowerCase()
  );

  if (existingUser) {
    throw new Error('Email already exists');
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = {
    id: uuidv4(),
    email: email.toLowerCase(),
    username,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  const token = Buffer.from(`${newUser.id}:${Date.now()}`).toString('base64');

  console.log(`New user signed up: ${email}`);

  return {
    user: sanitizeUser(newUser),
    token
  };
}

function loginHelper(email, password) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const users = getUsers();

  const user = users.find(
    u => u.email.toLowerCase() === email.toLowerCase()
  );

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isValidPassword = bcrypt.compareSync(password, user.password);

  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }

  const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

  console.log(`User logged in: ${email}`);

  return {
    user: sanitizeUser(user),
    token
  };
}

function verifyToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [userId] = decoded.split(':');

    const users = getUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
      return null;
    }

    return sanitizeUser(user);
  } catch (error) {
    return null;
  }
}

function getMe(userId) {
  const users = getUsers();
  const user = users.find(u => u.id === userId);

  if (!user) {
    throw new Error('User not found');
  }

  return {
    user: sanitizeUser(user)
  };
}

module.exports = {
  signup,
  login,
  me,
  signupHelper,
  loginHelper,
  verifyToken,
  getMe
};
