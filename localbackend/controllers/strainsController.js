const { v4: uuidv4 } = require('uuid');
const { readUserJSONFile, writeUserJSONFile, readJSONFile } = require('../config/dataManager');

const GLOBAL_STRAINS_FILE = 'global_strains.json';

function getUserStrains(userId) {
  return readUserJSONFile(userId, 'strains.json');
}

function saveUserStrains(userId, strains) {
  return writeUserJSONFile(userId, 'strains.json', strains);
}

function getGlobalStrains() {
  return readJSONFile(GLOBAL_STRAINS_FILE);
}

function getAllStrains(req, res) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const userStrains = getUserStrains(userId);
    const globalStrains = getGlobalStrains();
    
    const allStrains = [...globalStrains, ...userStrains];
    res.json(allStrains);
  } catch (error) {
    console.error('Error fetching strains:', error);
    res.status(500).json({ error: 'Failed to fetch strains' });
  }
}

function getStrainById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const userStrains = getUserStrains(userId);
    const globalStrains = getGlobalStrains();
    const allStrains = [...globalStrains, ...userStrains];
    const strain = allStrains.find(s => s.id === id);

    if (!strain) {
      return res.status(404).json({ error: 'Strain not found' });
    }

    res.json(strain);
  } catch (error) {
    console.error('Error fetching strain:', error);
    res.status(500).json({ error: 'Failed to fetch strain' });
  }
}

function createStrain(req, res) {
  try {
    const strainData = req.body;
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!strainData.name) {
      return res.status(400).json({ error: 'Strain name is required' });
    }

    const strains = getUserStrains(userId);

    const newStrain = {
      id: uuidv4(),
      ...strainData,
      userId,
      createdAt: new Date().toISOString()
    };

    strains.push(newStrain);
    saveUserStrains(userId, strains);

    console.log(`New strain created: ${newStrain.name} by user ${userId}`);

    res.status(201).json(newStrain);
  } catch (error) {
    console.error('Error creating strain:', error);
    res.status(500).json({ error: 'Failed to create strain' });
  }
}

function updateStrain(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const strains = getUserStrains(userId);
    const index = strains.findIndex(s => s.id === id && s.userId === userId);

    if (index === -1) {
      return res.status(404).json({ error: 'Strain not found or not authorized' });
    }

    strains[index] = {
      ...strains[index],
      ...updateData,
      id,
      userId,
      updatedAt: new Date().toISOString()
    };

    saveUserStrains(userId, strains);

    console.log(`Strain updated: ${strains[index].name}`);

    res.json(strains[index]);
  } catch (error) {
    console.error('Error updating strain:', error);
    res.status(500).json({ error: 'Failed to update strain' });
  }
}

function deleteStrain(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const strains = getUserStrains(userId);
    const index = strains.findIndex(s => s.id === id && s.userId === userId);

    if (index === -1) {
      return res.status(404).json({ error: 'Strain not found or not authorized' });
    }

    const deletedStrain = strains.splice(index, 1)[0];
    saveUserStrains(userId, strains);

    console.log(`Strain deleted: ${deletedStrain.name}`);

    res.json({ message: 'Strain deleted successfully', strain: deletedStrain });
  } catch (error) {
    console.error('Error deleting strain:', error);
    res.status(500).json({ error: 'Failed to delete strain' });
  }
}

function getAllStrainsHelper(userId) {
  const userStrains = getUserStrains(userId);
  const globalStrains = getGlobalStrains();
  return [...globalStrains, ...userStrains];
}

function getStrainByIdHelper(id, userId) {
  const userStrains = getUserStrains(userId);
  const globalStrains = getGlobalStrains();
  const allStrains = [...globalStrains, ...userStrains];
  const strain = allStrains.find(s => s.id === id);

  if (!strain) {
    throw new Error('Strain not found');
  }

  if (strain.userId && strain.userId !== userId) {
    throw new Error('Not authorized');
  }

  return strain;
}

function createStrainHelper(strainData) {
  if (!strainData.name) {
    throw new Error('Strain name is required');
  }
  
  if (!strainData.userId) {
    throw new Error('User ID is required');
  }

  const strains = getUserStrains(strainData.userId);

  const newStrain = {
    id: uuidv4(),
    ...strainData,
    createdAt: new Date().toISOString()
  };

  strains.push(newStrain);
  saveUserStrains(strainData.userId, strains);

  console.log(`New strain created: ${newStrain.name}`);

  return newStrain;
}

function updateStrainHelper(id, updateData, userId) {
  const strains = getUserStrains(userId);
  const index = strains.findIndex(s => s.id === id && s.userId === userId);

  if (index === -1) {
    throw new Error('Strain not found or not authorized');
  }

  strains[index] = {
    ...strains[index],
    ...updateData,
    id,
    userId,
    updatedAt: new Date().toISOString()
  };

  saveUserStrains(userId, strains);

  console.log(`Strain updated: ${strains[index].name}`);

  return strains[index];
}

function deleteStrainHelper(id, userId) {
  const strains = getUserStrains(userId);
  const index = strains.findIndex(s => s.id === id && s.userId === userId);

  if (index === -1) {
    throw new Error('Strain not found or not authorized');
  }

  const deletedStrain = strains.splice(index, 1)[0];
  saveUserStrains(userId, strains);

  console.log(`Strain deleted: ${deletedStrain.name}`);

  return { message: 'Strain deleted successfully', strain: deletedStrain };
}

module.exports = {
  getAllStrains,
  getStrainById,
  createStrain,
  updateStrain,
  deleteStrain,
  getAllStrainsHelper,
  getStrainByIdHelper,
  createStrainHelper,
  updateStrainHelper,
  deleteStrainHelper
};
