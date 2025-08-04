import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

const BreedModal = ({
  isOpen,
  closeModal,
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
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/10" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all relative">
                <DialogTitle
                  as="h3"
                  className="text-xl font-bold leading-6 text-gray-900 mb-4"
                >
                  {title}
                </DialogTitle>

                <form onSubmit={handleFormSubmit}>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="breed-name"
                    >
                      Breed Name
                    </label>
                    <input
                      type="text"
                      id="breed-name"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={breedName}
                      onChange={onNameChange}
                      disabled={disableNameInput}
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="new-type"
                    >
                      Types (comma-separated)
                    </label>
                    <input
                      id="new-type"
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={newType}
                      onChange={onTypeChange}
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-600 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md font-semibold hover:bg-gray-400 transition-colors"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </form>

                <button
                  type="button"
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                  onClick={closeModal}
                  aria-label="Close dialog"
                >
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BreedModal;
