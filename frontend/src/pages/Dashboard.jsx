import { useState } from "react";
import BreedCard from "../components/BreedCard";
import { useToast } from "../components/ToastContainer";
import BreedModal from "../components/BreedModal";
import Navbar from "../components/Navbar";
import useBreedData from "../hooks/useBreedData";
import api from "../lib/api";
import { PlusIcon } from "@heroicons/react/24/solid";
const Dashboard = () => {
  const {
    breeds,
    images: breedImages,
    page,
    totalPages,
    fetchBreeds,
  } = useBreedData();

  const { addToast } = useToast();
  const [breedName, setBreedName] = useState("");
  const [breedType, setBreedType] = useState("");

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
      addToast(`Breed "${trimmedBreed}" added successfully!`, "success");
      fetchBreeds();
    } catch (err) {
      console.error("Add failed", err);
      addToast("Failed to add new breed.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            className="btn btn-primary gap-2"
            onClick={() => document.getElementById("add-modal").showModal()}
          >
            <PlusIcon className="w-5 h-5" />
            Add Breed
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(breeds).map(([breed, types]) => (
            <BreedCard
              key={breed}
              breed={{ name: breed, types }}
              image={breedImages[breed]}
              refreshData={fetchBreeds}
              addToast={addToast}
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
      <div className="flex justify-center my-6">
        <div className="join">
          <button
            className="join-item btn"
            disabled={page === 1}
            onClick={() => fetchBreeds(page - 1)}
          >
            «
          </button>
          <button className="join-item btn">Page {page}</button>
          <button
            className="join-item btn"
            disabled={page === totalPages}
            onClick={() => fetchBreeds(page + 1)}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
