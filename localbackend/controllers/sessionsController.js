const { v4: uuidv4 } = require('uuid');
const { readJSONFile, writeJSONFile } = require('../config/dataManager');

const SESSIONS_FILE = 'sessions.json';

function getSessions() {
  return readJSONFile(SESSIONS_FILE);
}

function saveSessions(sessions) {
  return writeJSONFile(SESSIONS_FILE, sessions);
}

function getAllSessions(req, res) {
  try {
    let sessions = getSessions();
    
    const { userId, limit } = req.query;
    
    if (userId) {
      sessions = sessions.filter(s => s.userId === userId);
    }
    
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
    const sessions = getSessions();
    const session = sessions.find(s => s.id === id);

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

    if (!sessionData.userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!sessionData.strainId && !sessionData.strainName) {
      return res.status(400).json({ error: 'Strain information is required' });
    }

    const sessions = getSessions();

    const newSession = {
      id: uuidv4(),
      ...sessionData,
      createdAt: new Date().toISOString()
    };

    sessions.push(newSession);
    saveSessions(sessions);

    console.log(`New session created by user: ${newSession.userId}`);

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

    const sessions = getSessions();
    const index = sessions.findIndex(s => s.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Session not found' });
    }

    sessions[index] = {
      ...sessions[index],
      ...updateData,
      id,
      updatedAt: new Date().toISOString()
    };

    saveSessions(sessions);

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

    const sessions = getSessions();
    const index = sessions.findIndex(s => s.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const deletedSession = sessions.splice(index, 1)[0];
    saveSessions(sessions);

    console.log(`Session deleted: ${id}`);

    res.json({ message: 'Session deleted successfully', session: deletedSession });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
}

function getAllSessionsHelper(userId) {
  let sessions = getSessions();
  sessions = sessions.filter(s => s.userId === userId);
  sessions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return sessions;
}

function getSessionByIdHelper(id, userId) {
  const sessions = getSessions();
  const session = sessions.find(s => s.id === id);

  if (!session) {
    throw new Error('Session not found');
  }

  if (session.userId !== userId) {
    throw new Error('Not authorized');
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

  const sessions = getSessions();

  const newSession = {
    id: uuidv4(),
    ...sessionData,
    createdAt: new Date().toISOString()
  };

  sessions.push(newSession);
  saveSessions(sessions);

  console.log(`New session created by user: ${newSession.userId}`);

  return newSession;
}

function updateSessionHelper(id, updateData, userId) {
  const sessions = getSessions();
  const index = sessions.findIndex(s => s.id === id);

  if (index === -1) {
    throw new Error('Session not found');
  }

  if (sessions[index].userId !== userId) {
    throw new Error('Not authorized');
  }

  sessions[index] = {
    ...sessions[index],
    ...updateData,
    id,
    updatedAt: new Date().toISOString()
  };

  saveSessions(sessions);

  console.log(`Session updated: ${id}`);

  return sessions[index];
}

function deleteSessionHelper(id, userId) {
  const sessions = getSessions();
  const index = sessions.findIndex(s => s.id === id);

  if (index === -1) {
    throw new Error('Session not found');
  }

  if (sessions[index].userId !== userId) {
    throw new Error('Not authorized');
  }

  const deletedSession = sessions.splice(index, 1)[0];
  saveSessions(sessions);

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
