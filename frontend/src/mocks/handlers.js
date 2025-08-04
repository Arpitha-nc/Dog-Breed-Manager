import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/dogs", () => {
    return HttpResponse.json(
      {
        Labrador: ["Yellow", "Black", "Chocolate"],
        "German Shepherd": ["Black and Tan", "Sable"],
        "Golden Retriever": ["Golden"],
        Poodle: ["Standard", "Toy"],
      },
      { status: 200 }
    );
  }),
  http.post("/dogs", async ({ request }) => {
    const data = await request.json();
    const { breed, types } = data;
    if (!breed) {
      return HttpResponse.json(
        { error: "Breed name is required" },
        { status: 400 }
      );
    }
    return HttpResponse.json({ [breed]: types }, { status: 201 });
  }),
  http.put("/dogs/:breedName", async ({ params, request }) => {
    const { breedName } = params;
    const data = await request.json();
    const { types } = data;
    if (breedName === "UnknownBreed") {
      return HttpResponse.json("Breed not found for update", { status: 404 });
    }
    if (
      breedName === "Labrador" &&
      JSON.stringify(types) === JSON.stringify(["Yellow", "Black", "Chocolate"])
    ) {
      return HttpResponse.json(
        { [breedName]: types, message: "No change detected" },
        { status: 200 }
      );
    }
    return HttpResponse.json({ [breedName]: types }, { status: 200 });
  }),
  http.delete("/dogs/:breedName", ({ params }) => {
    const { breedName } = params;
    if (breedName === "NonExistentBreed") {
      return HttpResponse.json("Breed not found for deletion", { status: 404 });
    }
    return HttpResponse.json(null, { status: 204 });
  }),
];
