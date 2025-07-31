const Dog = require("../models/dogs.model");

/**
 * @swagger
 * /dogs:
 *   get:
 *     summary: Get all dog breeds
 *     responses:
 *       200:
 *         description: A list of dog breeds
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

const getDogs = async (req, res) => {
  try {
    const dogDoc = await Dog.findOne();
    if (!dogDoc) return res.status(404).send("No data found");
    const { ...breeds } = dogDoc.toObject();
    res.status(200).send(breeds);
  } catch (err) {
    res.status(400).send(err);
  }
};

/**
 * @swagger
 * /dogs/{id}:
 *   get:
 *     summary: Get a dog breed by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The breed name
 *     responses:
 *       200:
 *         description: A single dog breed and its types
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
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

/**
 * @swagger
 * /dogs:
 *   post:
 *     summary: Add a new dog breed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - breed
 *             properties:
 *               breed:
 *                 type: string
 *               types:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: The created dog breed
 */
const addDog = async (req, res) => {
  try {
    const { breed, types } = req.body;
    if (!breed) return res.status(400).send("Breed name is required");

    const dogDoc = await Dog.findOne();
    if (!dogDoc) return res.status(404).send("No dog data document found");

    dogDoc.set(breed, types || []);
    dogDoc.markModified(breed);
    await dogDoc.save();

    const updatedDogDoc = await Dog.findOne();
    if (!updatedDogDoc || !(breed in updatedDogDoc.toObject())) {
      return res
        .status(500)
        .send({ error: "Failed to retrieve added breed after save." });
    }

    res.status(201).send({ [breed]: updatedDogDoc[breed] });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

/**
 * @swagger
 * /dogs/{id}:
 *   put:
 *     summary: Update a dog's breed types
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The breed name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               types:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Updated dog breed
 */
const updateDog = async (req, res) => {
  try {
    const { id } = req.params;
    const { types } = req.body;

    const dogDoc = await Dog.findOne();
    if (!dogDoc) {
      return res.status(404).send("No dog data document found to update");
    }

    if (!(id in dogDoc.toObject())) {
      return res.status(404).send("Breed not found for update");
    }

    const currentTypes = dogDoc[id];

    const typesAreEqual =
      JSON.stringify(currentTypes) === JSON.stringify(types);

    if (typesAreEqual) {
      return res
        .status(200)
        .send({ [id]: types, message: "No change detected" });
    }

    dogDoc.set(id, types);
    dogDoc.markModified(id);

    await dogDoc.save();

    res.status(200).send({ [id]: types });
  } catch (err) {
    console.error("Error in updateDog:", err);
    res.status(400).send({ error: err.message });
  }
};

/**
 * @swagger
 * /dogs/{id}:
 *   delete:
 *     summary: Delete a dog breed
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Confirmation of deletion
 */
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
