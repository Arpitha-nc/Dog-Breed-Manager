const BreedModal = ({
  id,
  title,
  breedName,
  newType,
  onNameChange,
  onTypeChange,
  onSubmit,
  disableNameInput = false,
}) => {
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await onSubmit();
  };

  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>

        <label className="label" htmlFor={`${id}-breed-name`}>
          <span className="label-text">Breed Name</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full mb-4"
          value={breedName}
          onChange={onNameChange}
          disabled={disableNameInput}
          id={`${id}-breed-name`}
        />

        <label className="label" htmlFor={`${id}-new-type`}>
          <span className="label-text">Add New Type</span>
        </label>
        <input
          id={`${id}-new-type`}
          type="text"
          className="input input-bordered w-full mb-4"
          value={newType}
          onChange={onTypeChange}
        />

        <div className="modal-action">
          <button
            className="btn"
            onClick={handleFormSubmit}
            data-testid={`${id}-submit-button`}
          >
            Save
          </button>
          <button
            onClick={() => document.getElementById(id).close()}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            data-testid={`${id}-close-button`}
          >
            ✕
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default BreedModal;
