const Medicine = require('../models/Medicine');

exports.searchMedicines = async (req, res) => {
  try {
    const { q, location } = req.query;
    let filter = {};
    
    if (q) filter.name = { $regex: q, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };
    
    const medicines = await Medicine.find(filter);
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Search failed' });
  }
};

exports.addMedicine = async (req, res) => {
  try {
    const medicine = new Medicine(req.body);
    await medicine.save();
    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add medicine' });
  }
};

exports.getMyMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ pharmacyId: req.params.pharmacyId });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch medicines' });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, { stock: req.body.stock }, { new: true });
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: 'Update failed' });
  }
};

exports.deleteMedicine = async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed' });
  }
};