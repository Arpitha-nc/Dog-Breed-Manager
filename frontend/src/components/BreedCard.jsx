import { useState } from "react";
import BreedModal from "./BreedModal";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Listbox, ListboxOptions, ListboxOption } from "@headlessui/react";

const BreedCard = ({ breed, image, onUpdate, onDelete }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newType, setNewType] = useState(breed.types.join(", "));

  const openEditModal = () => {
    setNewType(breed.types.join(", "));
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => setIsEditModalOpen(false);

  const handleUpdateSubmit = () => {
    onUpdate(breed.name, newType);
    closeEditModal();
  };

  return (
    <div className="bg-black text-white rounded-lg shadow-md relative min-h-full flex flex-col">
      <div className="p-6 flex-grow">
        <h2 className="text-2xl font-bold mb-4">{breed.name}</h2>
        <div className="aspect-square w-full overflow-hidden rounded-lg mb-4">
          <img
            src={image}
            alt={breed.name}
            className="w-full h-full object-cover"
          />
        </div>
        <Listbox value={null} onChange={() => {}} disabled>
          <ListboxOptions
            static
            className="flex flex-wrap gap-2 bg-gray-800 rounded-md shadow-inner p-3 my-4"
          >
            {breed.types.length > 0 ? (
              breed.types.map((type, idx) => (
                <ListboxOption
                  key={idx}
                  value={type}
                  className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium cursor-default"
                >
                  {type}
                </ListboxOption>
              ))
            ) : (
              <span className="p-1 text-gray-400">No types available.</span>
            )}
          </ListboxOptions>
        </Listbox>
      </div>

      <div className="p-4 flex justify-end gap-2">
        <button
          className="flex items-center px-4 py-2  text-white bg-blue-600 rounded-md text-sm font-medium hover:bg-blue-800 hover:text-white transition-colors"
          onClick={openEditModal}
        >
          <PencilSquareIcon className="w-4 h-4 mr-1" />
          Edit
        </button>
        <button
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
          onClick={() => onDelete(breed.name)}
        >
          <TrashIcon className="w-4 h-4 mr-1" />
          Delete
        </button>
      </div>

      <BreedModal
        isOpen={isEditModalOpen}
        closeModal={closeEditModal}
        title={`Edit Breed: ${breed.name}`}
        breedName={breed.name}
        newType={newType}
        onNameChange={() => {}}
        onTypeChange={(e) => setNewType(e.target.value)}
        onSubmit={handleUpdateSubmit}
        disableNameInput={true}
      />
    </div>
  );
};

export default BreedCard;
