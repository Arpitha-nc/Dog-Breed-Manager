const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../../index.js");
const Dog = require("../../models/dogs.model.js");

let mongoServer;

beforeEach(async () => {
  process.env.NODE_ENV = "test";
  if (!mongoServer) {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {});
  }
  await Dog.deleteMany({});

  const allDogBreeds = {
    Labrador: ["Yellow", "Black", "Chocolate"],
    "German Shepherd": ["Black and Tan", "Sable"],
    "Golden Retriever": ["Golden"],
    Poodle: ["Standard", "Miniature", "Toy"],
    Bulldog: ["English", "French"],
    Beagle: ["Lemon", "Red"],
    Pug: ["Fawn", "Black"],
    Rottweiler: ["Black and Mahogany"],
    Dachshund: ["Smooth", "Wire-haired"],
    Boxer: ["Fawn", "Brindle"],
  };
  await Dog.create(allDogBreeds);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("GET /dogs", () => {
  test("should return paginated dog breeds with default parameters", async () => {
    const res = await request(app).get("/dogs");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("data");
    expect(Object.keys(res.body.data).length).toBe(9);
    expect(res.body).toHaveProperty("total");
    expect(res.body.total).toBe(10);
    expect(res.body).toHaveProperty("page");
    expect(res.body.page).toBe(1);
    expect(res.body).toHaveProperty("totalPages");
    expect(res.body.totalPages).toBe(2);
  });

  test("should return paginated dog breeds with custom parameters", async () => {
    const res = await request(app).get("/dogs?page=2&limit=5");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("data");
    expect(Object.keys(res.body.data).length).toBe(5);
    expect(res.body).toHaveProperty("total");
    expect(res.body.total).toBe(10);
    expect(res.body).toHaveProperty("page");
    expect(res.body.page).toBe(2);
    expect(res.body).toHaveProperty("totalPages");
    expect(res.body.totalPages).toBe(2);
  });

  test("should return the remaining dog breeds on the last page", async () => {
    const res = await request(app).get("/dogs?page=2&limit=9");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("data");
    expect(Object.keys(res.body.data).length).toBe(1);
    expect(res.body.page).toBe(2);
    expect(res.body.totalPages).toBe(2);
  });

  test("should return an empty data object for a non-existent page", async () => {
    const res = await request(app).get("/dogs?page=3&limit=9");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("data");
    expect(Object.keys(res.body.data).length).toBe(0);
    expect(res.body.page).toBe(3);
  });

  test("should return 404 if no dog data found", async () => {
    await Dog.deleteMany({});
    const res = await request(app).get("/dogs");
    expect(res.statusCode).toEqual(404);
    expect(res.text).toEqual("No data found");
  });
});

describe("GET /dogs/:id", () => {
  test("should return a specific dog breed", async () => {
    const res = await request(app).get("/dogs/Labrador");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ Labrador: ["Yellow", "Black", "Chocolate"] });
  });

  test("should return 404 if breed not found", async () => {
    const res = await request(app).get("/dogs/Husky");
    expect(res.statusCode).toEqual(404);
    expect(res.text).toEqual("Breed not found");
  });
});

describe("POST /dogs", () => {
  test("should add a new dog breed", async () => {
    const newBreed = { breed: "Pug", types: ["Fawn", "Black"] };
    const res = await request(app).post("/dogs").send(newBreed);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({ Pug: ["Fawn", "Black"] });

    const updatedDoc = await Dog.findOne();
    expect(updatedDoc.toObject()).toHaveProperty("Pug", ["Fawn", "Black"]);
  });

  test("should add a new dog breed without types", async () => {
    const newBreed = { breed: "Beagle" };
    const res = await request(app).post("/dogs").send(newBreed);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({ Beagle: [] });

    const updatedDoc = await Dog.findOne();
    expect(updatedDoc.toObject()).toHaveProperty("Beagle", []);
  });

  test("should return 400 if breed name is missing", async () => {
    const res = await request(app)
      .post("/dogs")
      .send({ types: ["Test"] });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual("Breed name is required");
  });

  test("should return 404 if no dog data document found (should ideally not happen after seeding)", async () => {
    await Dog.deleteMany({});
    const res = await request(app)
      .post("/dogs")
      .send({ breed: "Husky", types: ["Siberian"] });
    expect(res.statusCode).toEqual(404);
    expect(res.text).toEqual("No dog data document found");
  });
});

describe("PUT /dogs/:id", () => {
  test("should update an existing dog breed", async () => {
    const res = await request(app)
      .put("/dogs/Labrador")
      .send({ types: ["Yellow", "Black", "Chocolate", "White"] });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      Labrador: ["Yellow", "Black", "Chocolate", "White"],
    });

    const updatedDoc = await Dog.findOne();
    expect(updatedDoc.toObject()).toHaveProperty("Labrador", [
      "Yellow",
      "Black",
      "Chocolate",
      "White",
    ]);
  });

  test("should return 404 if breed not found for update", async () => {
    const res = await request(app)
      .put("/dogs/UnknownBreed")
      .send({ types: ["New Type"] });

    expect(res.statusCode).toEqual(404);
    expect(res.text).toEqual("Breed not found for update");
  });

  test("should return 200 with message if no change detected", async () => {
    const res = await request(app)
      .put("/dogs/Labrador")
      .send({ types: ["Yellow", "Black", "Chocolate"] });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      Labrador: ["Yellow", "Black", "Chocolate"],
      message: "No change detected",
    });
  });
});

describe("DELETE /dogs/:id", () => {
  test("should delete an existing dog breed", async () => {
    const res = await request(app).delete("/dogs/Labrador");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: "Breed 'Labrador' deleted" });

    const updatedDoc = await Dog.findOne();
    expect(updatedDoc.toObject()).not.toHaveProperty("Labrador");
  });

  test("should return 404 if breed not found for deletion", async () => {
    const res = await request(app).delete("/dogs/NonExistentBreed");
    expect(res.statusCode).toEqual(404);
    expect(res.text).toEqual("Breed not found");
  });
});
