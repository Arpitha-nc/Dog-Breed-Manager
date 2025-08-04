import { useState } from "react";
import BreedCard from "../components/BreedCard";
import { useToast } from "../components/ToastContainer";
import BreedModal from "../components/BreedModal";
import Navbar from "../components/Navbar";
import useBreedData from "../hooks/useBreedData";
import api from "../lib/api";
import { PlusIcon } from "@heroicons/react/24/solid";
import ConfirmationModal from "../components/ConfirmationModal";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const Dashboard = () => {
  const {
    breeds,
    images: breedImages,
    page,
    totalPages,
    fetchBreeds,
    isLoading,
    error,
  } = useBreedData();

  const { addToast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [breedName, setBreedName] = useState("");
  const [breedType, setBreedType] = useState("");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [breedToDelete, setBreedToDelete] = useState(null);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openDeleteConfirm = (breed) => {
    setBreedToDelete(breed);
    setIsDeleteConfirmOpen(true);
  };
  const closeDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setBreedToDelete(null);
  };

  const handleAddBreed = async () => {
    const trimmedBreed = breedName.trim();
    const typesArray = breedType
      .split(",")
      .map((type) => type.trim())
      .filter((type) => type);

    if (!trimmedBreed) {
      addToast("Breed name is required.", "warning");
      return;
    }

    try {
      const res = await api.post("/dogs", {
        breed: trimmedBreed,
        types: typesArray,
      });

      if (res.data && res.data.error) {
        throw new Error(res.data.error);
      }

      setBreedName("");
      setBreedType("");
      closeAddModal();
      addToast(`Breed "${trimmedBreed}" added successfully!`, "success");
      fetchBreeds(page);
    } catch (err) {
      console.error("Add failed", err);
      addToast(err.message || "Failed to add new breed.", "error");
    }
  };

  const handleUpdate = async (name, newTypes) => {
    const trimmedTypes = newTypes
      .split(",")
      .map((type) => type.trim())
      .filter((type) => type.length > 0);

    try {
      const res = await api.put(`/dogs/${name}`, {
        types: trimmedTypes,
      });

      if (res.data && res.data.error) {
        throw new Error(res.data.error);
      }

      fetchBreeds(page);
      addToast(`Breed "${name}" updated successfully!`, "success");
    } catch (err) {
      console.error("Update failed", err?.response?.data || err.message);
      addToast(err.message || `Failed to update breed "${name}".`, "error");
    }
  };

  const handleDelete = async () => {
    if (breedToDelete) {
      try {
        const res = await api.delete(`/dogs/${breedToDelete}`);

        if (res.data && res.data.error) {
          throw new Error(res.data.error);
        }

        fetchBreeds(page);
        addToast(`Breed "${breedToDelete}" deleted successfully!`, "success");
        closeDeleteConfirm();
      } catch (err) {
        console.error("Delete failed", err?.response?.data || err.message);
        addToast(
          err.message || `Failed to delete breed "${breedToDelete}".`,
          "error"
        );
        closeDeleteConfirm();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Navbar />
      <main className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
            onClick={openAddModal}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Breed
          </button>
        </div>

        {isLoading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(breeds).map(([breed, types]) => (
              <BreedCard
                key={breed}
                breed={{ name: breed, types }}
                image={breedImages[breed]}
                onUpdate={handleUpdate}
                onDelete={openDeleteConfirm}
              />
            ))}
          </div>
        )}

        <BreedModal
          isOpen={isAddModalOpen}
          closeModal={closeAddModal}
          title="Add New Breed"
          breedName={breedName}
          newType={breedType}
          onNameChange={(e) => setBreedName(e.target.value)}
          onTypeChange={(e) => setBreedType(e.target.value)}
          onSubmit={handleAddBreed}
        />

        <ConfirmationModal
          isOpen={isDeleteConfirmOpen}
          closeModal={closeDeleteConfirm}
          onConfirm={handleDelete}
          title="Confirm Deletion"
          message={`Are you sure you want to delete ${
            breedToDelete || "this"
          } breed? This action cannot be undone.`}
        />
      </main>
      <div className="flex justify-center my-6">
        <div className="flex items-center rounded-lg shadow-md overflow-hidden bg-white border border-gray-200">
          <button
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border-r border-gray-200"
            disabled={page === 1 || isLoading}
            onClick={() => fetchBreeds(page - 1)}
          >
            « Previous
          </button>

          <span className="px-4 py-2 text-gray-800 font-medium">
            Page {page} of {totalPages}
          </span>

          <button
            className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border-l border-gray-200"
            disabled={page === totalPages || isLoading}
            onClick={() => fetchBreeds(page + 1)}
          >
            Next »
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
