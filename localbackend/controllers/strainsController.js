const { v4: uuidv4 } = require('uuid');
const { readJSONFile, writeJSONFile } = require('../config/dataManager');

const STRAINS_FILE = 'strains.json';

function getStrains() {
  return readJSONFile(STRAINS_FILE);
}

function saveStrains(strains) {
  return writeJSONFile(STRAINS_FILE, strains);
}

function getAllStrains(req, res) {
  try {
    const strains = getStrains();
    res.json(strains);
  } catch (error) {
    console.error('Error fetching strains:', error);
    res.status(500).json({ error: 'Failed to fetch strains' });
  }
}

function getStrainById(req, res) {
  try {
    const { id } = req.params;
    const strains = getStrains();
    const strain = strains.find(s => s.id === id);

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

    if (!strainData.name) {
      return res.status(400).json({ error: 'Strain name is required' });
    }

    const strains = getStrains();

    const newStrain = {
      id: uuidv4(),
      ...strainData,
      createdAt: new Date().toISOString()
    };

    strains.push(newStrain);
    saveStrains(strains);

    console.log(`New strain created: ${newStrain.name}`);

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

    const strains = getStrains();
    const index = strains.findIndex(s => s.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Strain not found' });
    }

    strains[index] = {
      ...strains[index],
      ...updateData,
      id,
      updatedAt: new Date().toISOString()
    };

    saveStrains(strains);

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

    const strains = getStrains();
    const index = strains.findIndex(s => s.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Strain not found' });
    }

    const deletedStrain = strains.splice(index, 1)[0];
    saveStrains(strains);

    console.log(`Strain deleted: ${deletedStrain.name}`);

    res.json({ message: 'Strain deleted successfully', strain: deletedStrain });
  } catch (error) {
    console.error('Error deleting strain:', error);
    res.status(500).json({ error: 'Failed to delete strain' });
  }
}

module.exports = {
  getAllStrains,
  getStrainById,
  createStrain,
  updateStrain,
  deleteStrain
};
