const { v4: uuidv4 } = require('uuid');
const { readUserJSONFile, writeUserJSONFile, readJSONFile } = require('../config/dataManager');
const { getUserStrains, getGlobalStrains } = require('./strainsController');

function getUserSessions(userId) {
  return readUserJSONFile(userId, 'sessions.json');
}

function saveUserSessions(userId, sessions) {
  return writeUserJSONFile(userId, 'sessions.json', sessions);
}

function getAllUsersIds() {
  const { readJSONFile } = require('../config/dataManager');
  const users = readJSONFile('users.json');
  return users.map(u => u.id);
}

function getAllSessions(req, res) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    let sessions = getUserSessions(userId);
    
    const { limit } = req.query;
    
    sessions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    if (limit) {
      sessions = sessions.slice(0, parseInt(limit));
    }
    
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
}

function getSessionById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const sessions = getUserSessions(userId);
    const session = sessions.find(s => s.id === id && s.userId === userId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
}

function createSession(req, res) {
  try {
    const sessionData = req.body;
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!sessionData.strainId && !sessionData.strainName) {
      return res.status(400).json({ error: 'Strain information is required' });
    }

    const sessions = getUserSessions(userId);

    const newSession = {
      id: uuidv4(),
      ...sessionData,
      userId,
      createdAt: new Date().toISOString()
    };

    sessions.push(newSession);
    saveUserSessions(userId, sessions);

    console.log(`New session created by user: ${userId}`);

    res.status(201).json(newSession);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
}

function updateSession(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const sessions = getUserSessions(userId);
    const index = sessions.findIndex(s => s.id === id && s.userId === userId);

    if (index === -1) {
      return res.status(404).json({ error: 'Session not found or not authorized' });
    }

    sessions[index] = {
      ...sessions[index],
      ...updateData,
      id,
      userId,
      updatedAt: new Date().toISOString()
    };

    saveUserSessions(userId, sessions);

    console.log(`Session updated: ${id}`);

    res.json(sessions[index]);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
}

function deleteSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const sessions = getUserSessions(userId);
    const index = sessions.findIndex(s => s.id === id && s.userId === userId);

    if (index === -1) {
      return res.status(404).json({ error: 'Session not found or not authorized' });
    }

    const deletedSession = sessions.splice(index, 1)[0];
    saveUserSessions(userId, sessions);

    console.log(`Session deleted: ${id}`);

    res.json({ message: 'Session deleted successfully', session: deletedSession });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
}

function getAllSessionsHelper(userId) {
  let sessions = getUserSessions(userId);
  sessions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return sessions;
}

function getSessionByIdHelper(id, userId) {
  const sessions = getUserSessions(userId);
  const session = sessions.find(s => s.id === id && s.userId === userId);

  if (!session) {
    throw new Error('Session not found or not authorized');
  }

  return session;
}

function createSessionHelper(sessionData) {
  if (!sessionData.userId) {
    throw new Error('User ID is required');
  }

  if (!sessionData.strainId && !sessionData.strainName) {
    throw new Error('Strain information is required');
  }

  const sessions = getUserSessions(sessionData.userId);

  const newSession = {
    id: uuidv4(),
    ...sessionData,
    createdAt: new Date().toISOString()
  };

  sessions.push(newSession);
  saveUserSessions(sessionData.userId, sessions);

  console.log(`New session created by user: ${sessionData.userId}`);

  return newSession;
}

function updateSessionHelper(id, updateData, userId) {
  const sessions = getUserSessions(userId);
  const index = sessions.findIndex(s => s.id === id && s.userId === userId);

  if (index === -1) {
    throw new Error('Session not found or not authorized');
  }

  sessions[index] = {
    ...sessions[index],
    ...updateData,
    id,
    userId,
    updatedAt: new Date().toISOString()
  };

  saveUserSessions(userId, sessions);

  console.log(`Session updated: ${id}`);

  return sessions[index];
}

function deleteSessionHelper(id, userId) {
  const sessions = getUserSessions(userId);
  const index = sessions.findIndex(s => s.id === id && s.userId === userId);

  if (index === -1) {
    throw new Error('Session not found or not authorized');
  }

  const deletedSession = sessions.splice(index, 1)[0];
  saveUserSessions(userId, sessions);

  console.log(`Session deleted: ${id}`);

  return { message: 'Session deleted successfully', session: deletedSession };
}

module.exports = {
  getAllSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  getAllSessionsHelper,
  getSessionByIdHelper,
  createSessionHelper,
  updateSessionHelper,
  deleteSessionHelper
};
