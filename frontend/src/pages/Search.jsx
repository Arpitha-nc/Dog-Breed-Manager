import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import useBreedData from "../hooks/useBreedData";

const Search = () => {
  const { breeds, images } = useBreedData(true);

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
  };

  const filteredBreeds = Object.keys(breeds).filter((breed) =>
    breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content text-center flex-col gap-6">
          <div className="max-w-md w-full relative">
            <h1 className="text-3xl sm:text-4xl font-bold">Hello there</h1>
            <p className="py-4 text-base sm:text-lg">
              Welcome to search your favorite dog breeds!
            </p>
            <label className="input">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input
                type="search"
                placeholder="Search"
                value={searchTerm}
                onChange={handleInputChange}
                className="grow"
              />
            </label>

            {searchTerm && filteredBreeds.length > 0 && (
              <ul className="absolute z-10 w-full mt-2 bg-base-100 rounded-md shadow-md max-h-64 overflow-y-auto">
                {filteredBreeds.map((breed) => (
                  <li
                    key={breed}
                    className="flex items-center p-2 hover:bg-base-300 cursor-pointer"
                    onClick={() => navigate(`/breed/${breed}`)}
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
              <ul className="absolute z-10 w-full mt-2 bg-base-100 rounded-md shadow-md">
                <li className="p-2 text-center text-gray-500">
                  No breeds found.
                </li>
              </ul>
            )}

            <button
              className="btn btn-primary mt-8 w-full sm:w-auto"
              onClick={() => navigate("/alldogs")}
            >
              View All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
