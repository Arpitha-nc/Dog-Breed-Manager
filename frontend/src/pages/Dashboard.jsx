import { useEffect, useState } from "react";
import BreedCard from "../components/BreedCard";
import BreedModal from "../components/BreedModal";
import Navbar from "../components/Navbar";
import api from "../lib/api";

const Dashboard = () => {
  const [breeds, setBreeds] = useState([]);
  const [breedName, setBreedName] = useState("");
  const [breedType, setBreedType] = useState("");

  const fetchBreeds = async () => {
    try {
      const res = await api.get("/dogs");
      setBreeds(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  useEffect(() => {
    fetchBreeds();
  }, []);
  const handleAddBreed = async () => {
    const trimmedBreed = breedName.trim();
    const typesArray = breedType
      .split(",")
      .map((type) => type.trim())
      .filter((type) => type);
    if (!trimmedBreed) {
      console.error("Breed name is required.");
      return;
    }

    try {
      await api.post("/dogs", {
        breed: trimmedBreed,
        types: typesArray,
      });
      setBreedName("");
      setBreedType("");
      document.getElementById("add-modal").close();
      fetchBreeds();
    } catch (err) {
      console.error("Add failed", err?.response?.data || err.message);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Dog Breeds</h1>
          <button
            className="btn btn-primary"
            onClick={() => document.getElementById("add-modal").showModal()}
          >
            Add Breed
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {breeds &&
            Object.entries(breeds).map(([breed, types]) => (
              <BreedCard
                key={breed}
                breed={{ name: breed, types }}
                refreshData={fetchBreeds}
              />
            ))}
        </div>

        <BreedModal
          id="add-modal"
          title="Add New Breed"
          breedName={breedName}
          newType={breedType}
          onNameChange={(e) => setBreedName(e.target.value)}
          onTypeChange={(e) => setBreedType(e.target.value)}
          onSubmit={handleAddBreed}
        />
      </main>
    </div>
  );
};

export default Dashboard;
