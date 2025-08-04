import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useBreedData from "../hooks/useBreedData";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import DogAnimations from "../components/DogAnimations";
import {
  MagnifyingGlassIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const Search = () => {
  const { breeds, images, isLoading, error } = useBreedData(true);

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
  };

  const filteredBreeds = Object.keys(breeds).filter((breed) =>
    breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);

  return (
    <div className="bg-base-200 min-h-screen relative overflow-hidden">
      <DogAnimations />

      <div className="flex items-center justify-center h-full pt-20 pb-10">
        <div className="text-center flex flex-col items-center gap-6 p-4 z-10 relative">
          <div className="max-w-md w-full">
            <h1 className="text-3xl sm:text-4xl font-bold">
              Welcome, Dog Lover!
            </h1>
            <p className="py-4 text-base sm:text-lg">
              Ready to meet your new best friend? Discover a world of dog breeds
              right at your fingertips.
            </p>

            {isLoading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}

            {!isLoading && !error && (
              <>
                <div className="relative" ref={searchContainerRef}>
                  <div className="flex items-center gap-2 p-3 bg-white text-gray-900 rounded-lg shadow-md border border-gray-300">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
                    <input
                      type="search"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={handleInputChange}
                      className="w-full bg-transparent focus:outline-none"
                    />
                  </div>

                  {searchTerm && filteredBreeds.length > 0 && (
                    <ul className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-lg max-h-64 overflow-y-auto">
                      {filteredBreeds.map((breed) => (
                        <li
                          key={breed}
                          className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSearchTerm("");
                            navigate(`/breed/${breed}`);
                          }}
                        >
                          {images[breed] && (
                            <img
                              src={images[breed]}
                              alt={breed}
                              className="w-10 h-10 rounded object-cover mr-3"
                            />
                          )}
                          <span className="capitalize">{breed}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {searchTerm && filteredBreeds.length === 0 && (
                    <ul className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-lg">
                      <li className="p-2 text-center text-gray-500">
                        No breeds found.
                      </li>
                    </ul>
                  )}
                </div>

                <button
                  className="mt-16 w-full sm:w-auto px-6 py-3 rounded-lg font-bold text-white bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 mx-auto"
                  onClick={() => navigate("/alldogs")}
                >
                  View all breeds
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
