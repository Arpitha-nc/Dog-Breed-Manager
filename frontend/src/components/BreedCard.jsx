import { useId, useState } from "react";
import BreedModal from "./BreedModal";
import api from "../lib/api";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";

const BreedCard = ({ breed, image, refreshData, addToast }) => {
  const editModalId = useId();

  const [editedName, setEditedName] = useState(breed.name);
  const [newType, setNewType] = useState(breed.types.join(", "));

  const handleUpdate = async () => {
    const trimmedTypes = newType
      .split(",")
      .map((type) => type.trim())
      .filter((type) => type.length > 0);

    try {
      await api.put(`/dogs/${breed.name}`, {
        types: trimmedTypes,
      });

      refreshData();
      setNewType("");
      const modal = document.getElementById(editModalId);
      if (modal) modal.close();
      addToast(`Breed "${breed.name}" updated successfully!`, "success");
    } catch (err) {
      console.error("Update failed", err?.response?.data || err.message);
      addToast(`Failed to update breed "${breed.name}".`, "error");
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${breed.name}?`)) {
      try {
        await api.delete(`/dogs/${breed.name}`);
        refreshData();
        addToast(`Breed "${breed.name}" deleted successfully!`, "success");
      } catch (err) {
        console.error("Delete failed", err?.response?.data || err.message);
        addToast(`Failed to delete breed "${breed.name}".`, "error");
      }
    }
  };

  return (
    <div className="card bg-black text-white shadow-md relative min-h-full">
      <div className="card-body">
        <h2 className="card-title">{breed.name}</h2>

        <figure className="aspect-h-1 aspect-w-1">
          <img
            src={image}
            alt={breed.name}
            className="w-full h-full object-cover"
          />
        </figure>

        <ul className="list bg-black rounded-box shadow-md my-4">
          {breed.types.length > 0
            ? breed.types.map((type, idx) => (
                <li
                  key={idx}
                  className="p-4 border-t border-blue-300 first:border-none text-white"
                >
                  {type}
                </li>
              ))
            : ""}
        </ul>
      </div>

      <div className="absolute bottom-4 right-4">
        <div className="flex justify-end gap-2">
          <button
            className="btn btn-outline btn-sm text-white border-white"
            onClick={() => {
              setEditedName(breed.name);
              setNewType(breed.types.join(", "));
              document.getElementById(editModalId).showModal();
            }}
          >
            <PencilSquareIcon className="w-4 h-4" />
            Edit
          </button>

          <button
            className="btn btn-outline btn-sm btn-error"
            onClick={handleDelete}
          >
            <TrashIcon className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <BreedModal
        id={editModalId}
        title={`Edit Breed: ${breed.name}`}
        breedName={editedName}
        newType={newType}
        onNameChange={() => {}}
        onTypeChange={(e) => setNewType(e.target.value)}
        onSubmit={handleUpdate}
        disableNameInput={true}
      />
    </div>
  );
};

export default BreedCard;
