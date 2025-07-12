const db = require('../models');
const MealTariffMaster = db.MealTariffMaster;

exports.getAll = async (req, res) => {
  try {
    const tariffs = await MealTariffMaster.findAll();
    res.json(tariffs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const exists = await MealTariffMaster.findOne({ where: { property_id: req.body.property_id } });
    if (exists) {
      return res.status(400).json({ error: 'A tariff for this property already exists.' });
    }
    const tariff = await MealTariffMaster.create(req.body);
    res.status(201).json(tariff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    // If property_id is being changed, ensure no duplicate
    const current = await MealTariffMaster.findByPk(id);
    if (!current) return res.status(404).json({ error: 'Meal tariff not found' });
    if (req.body.property_id && req.body.property_id !== current.property_id) {
      const exists = await MealTariffMaster.findOne({ where: { property_id: req.body.property_id } });
      if (exists) {
        return res.status(400).json({ error: 'A tariff for this property already exists.' });
      }
    }
    const [updated] = await MealTariffMaster.update(req.body, { where: { id } });
    if (updated) {
      const updatedTariff = await MealTariffMaster.findByPk(id);
      res.json(updatedTariff);
    } else {
      res.status(404).json({ error: 'Meal tariff not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await MealTariffMaster.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Meal tariff deleted' });
    } else {
      res.status(404).json({ error: 'Meal tariff not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
