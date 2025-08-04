const Dog = require("../models/dogs.model");
const logger = require("../logger");
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const dogDoc = await Dog.findOne();
    if (!dogDoc) {
      logger.warn("No dog data found in database during getDogs request.");
      return res.status(404).send("No data found");
    }

    const fullData = dogDoc.toObject();
    const allBreeds = Object.entries(fullData).filter(
      ([key]) => !["_id", "createdAt", "updatedAt", "__v"].includes(key)
    );
    const total = allBreeds.length;
    const paginated = allBreeds.slice(skip, skip + limit);
    const paginatedObject = Object.fromEntries(paginated);

    logger.info(
      `Successfully retrieved ${paginated.length} dog breeds for page ${page}`
    );

    res.status(200).send({
      data: paginatedObject,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    logger.error(`Error in getDogs: ${err.message}`, { stack: err.stack });
    res.status(500).send("An internal server error occurred.");
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
    if (!dogDoc || !(id in dogDoc)) {
      logger.warn(`Attempted to get non-existent breed: ${id}`);
      return res.status(404).send("Breed not found");
    }
    logger.info(`Successfully retrieved dog breed: ${id}`);
    res.status(200).send({ [id]: dogDoc[id] });
  } catch (err) {
    logger.error(`Error in getDog for id ${req.params.id}: ${err.message}`, {
      stack: err.stack,
    });
    res.status(500).send("An internal server error occurred.");
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
    if (!breed) {
      logger.warn("Attempted to add a dog with no breed specified.");
      return res.status(400).send("Breed name is required");
    }

    const dogDoc = await Dog.findOne();
    if (!dogDoc) {
      logger.error("No dog data document found during addDog operation.");
      return res.status(404).send("No dog data document found");
    }

    dogDoc.set(breed, types || []);
    dogDoc.markModified(breed);
    await dogDoc.save();

    const updatedDogDoc = await Dog.findOne();
    if (!updatedDogDoc || !(breed in updatedDogDoc.toObject())) {
      logger.error(`Failed to retrieve added breed '${breed}' after save.`);
      return res
        .status(500)
        .send({ error: "Failed to retrieve added breed after save." });
    }

    logger.info(`Successfully added new dog breed: ${breed}`);
    res.status(201).send({ [breed]: updatedDogDoc[breed] });
  } catch (err) {
    logger.error(
      `Error in addDog for breed ${req.body.breed}: ${err.message}`,
      { stack: err.stack }
    );
    res.status(500).send({ error: "An internal server error occurred." });
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
      logger.error("No dog data document found during updateDog operation.");
      return res.status(404).send("No dog data document found to update");
    }

    if (!(id in dogDoc.toObject())) {
      logger.warn(`Attempted to update non-existent breed: ${id}`);
      return res.status(404).send("Breed not found for update");
    }

    const currentTypes = dogDoc[id];
    const typesAreEqual =
      JSON.stringify(currentTypes) === JSON.stringify(types);

    if (typesAreEqual) {
      logger.info(`No change detected for breed: ${id}. Update skipped.`);
      return res
        .status(200)
        .send({ [id]: types, message: "No change detected" });
    }

    dogDoc.set(id, types);
    dogDoc.markModified(id);
    await dogDoc.save();

    logger.info(`Successfully updated dog breed: ${id}`);
    res.status(200).send({ [id]: types });
  } catch (err) {
    logger.error(`Error in updateDog for id ${req.params.id}: ${err.message}`, {
      stack: err.stack,
    });
    res.status(500).send({ error: "An internal server error occurred." });
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
    if (!dogDoc || !(id in dogDoc)) {
      logger.warn(`Attempted to delete non-existent breed: ${id}`);
      return res.status(404).send("Breed not found");
    }

    dogDoc.set(id, undefined);
    dogDoc.markModified(id);
    await dogDoc.save();

    logger.info(`Successfully deleted dog breed: ${id}`);
    res.status(200).send({ message: `Breed '${id}' deleted` });
  } catch (err) {
    logger.error(`Error in deleteDog for id ${req.params.id}: ${err.message}`, {
      stack: err.stack,
    });
    res.status(500).send({ error: "An internal server error occurred." });
  }
};

module.exports = {
  getDogs,
  getDog,
  addDog,
  updateDog,
  deleteDog,
};
