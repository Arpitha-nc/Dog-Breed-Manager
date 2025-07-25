const Dog = require("../models/dogs.model");

const getDogs = async (req, res) => {
  try {
    const dogDoc = await Dog.findOne();
    if (!dogDoc) return res.status(404).send("No data found");
    const { _id, createdAt, updatedAt, __v, ...breeds } = dogDoc.toObject();
    res.status(200).send(breeds);
  } catch (err) {
    res.status(400).send(err);
  }
};

const getDog = async (req, res) => {
  try {
    const { id } = req.params;
    const dogDoc = await Dog.findOne();
    if (!dogDoc || !(id in dogDoc))
      return res.status(404).send("Breed not found");
    res.status(200).send({ [id]: dogDoc[id] });
  } catch (err) {
    res.status(400).send(err);
  }
};

const addDog = async (req, res) => {
  try {
    const { breed, types } = req.body;

    if (!breed) return res.status(400).send("Breed name is required");

    const dogDoc = await Dog.findOne();

    if (!dogDoc) return res.status(404).send("No dog data document found");

    dogDoc.set(breed, types || []);
    await dogDoc.save();

    res.status(201).send({ [breed]: dogDoc[breed] });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

const updateDog = async (req, res) => {
  try {
    const { id } = req.params;
    const dogDoc = await Dog.findOne();
    if (!dogDoc) return res.status(404).send("Dog data not found");
    dogDoc[id] = req.body.types || [];
    await dogDoc.save();
    res.status(200).send({ [id]: dogDoc[id] });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const deleteDog = async (req, res) => {
  try {
    const { id } = req.params;
    const dogDoc = await Dog.findOne();
    if (!dogDoc || !(id in dogDoc))
      return res.status(404).send("Breed not found");

    dogDoc.set(id, undefined);
    dogDoc.markModified(id);
    await dogDoc.save();

    res.status(200).send({ message: `Breed '${id}' deleted` });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports = {
  getDogs,
  getDog,
  addDog,
  updateDog,
  deleteDog,
};
