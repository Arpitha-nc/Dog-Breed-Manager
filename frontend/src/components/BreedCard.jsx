import { useId, useState } from "react";
import BreedModal from "./BreedModal";
import api from "../lib/api";

const BreedCard = ({ breed, refreshData }) => {
  const editModalId = useId();

  const [editedName, setEditedName] = useState(breed.name);
  const [newType, setNewType] = useState("");
  const handleUpdate = async () => {
    const trimmedTypes = newType
      .split(",")
      .map((type) => type.trim())
      .filter((type) => type.length > 0);

    try {
      const res = await api.put(`/dogs/${breed.name}`, {
        types: trimmedTypes,
      });

      if (res.status === 200) {
        refreshData();
        setNewType("");
        const modal = document.getElementById(editModalId);
        if (modal) modal.close();
      }
    } catch (err) {
      console.error("Update failed", err?.response?.data || err.message);
    }
  };
  const handleDelete = async () => {
    try {
      await api.delete(`/dogs/${breed.name}`);
      refreshData();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="card bg-blue-950 text-white shadow-md">
      <div className="card-body">
        <h2 className="card-title">{breed.name}</h2>

        <ul className="list bg-black rounded-box shadow-md">
          {breed.types.map((type, idx) => (
            <li
              key={idx}
              className="p-4 border-t border-blue-300 first:border-none text-white"
            >
              {type}
            </li>
          ))}
        </ul>

        <div className="pt-4 flex justify-end gap-2">
          <button
            className="btn btn-outline btn-sm text-white border-white"
            onClick={() => {
              setEditedName(breed.name);
              setNewType(breed.types.join(", "));
              document.getElementById(editModalId).showModal();
            }}
          >
            Edit
          </button>

          <button
            className="btn btn-outline btn-sm btn-error"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>

      <BreedModal
        id={editModalId}
        title={`Edit Breed: ${breed.name}`}
        breedName={editedName}
        newType={newType}
        onNameChange={(e) => setEditedName(e.target.value)}
        onTypeChange={(e) => setNewType(e.target.value)}
        onSubmit={handleUpdate}
        disableNameInput={true}
      />
    </div>
  );
};

export default BreedCard;
