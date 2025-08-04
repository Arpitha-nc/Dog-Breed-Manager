import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useBreedData from "../hooks/useBreedData";
import LoadingSpinner from "../components/LoadingSpinner";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const BreedDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { breeds, images, isLoading: isBreedDataLoading } = useBreedData(true);

  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState("");
  const breedTypes = breeds[name] || [];
  const image = images[name];

  useEffect(() => {
    if (image) {
      setIsImageLoading(true);
      setImageSrc(image);
    }
  }, [image]);

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    console.error("Image failed to load:", imageSrc);
    setIsImageLoading(false);
  };

  if (isBreedDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner message="Fetching breed data..." />
      </div>
    );
  }

  if (!breeds[name]) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 text-center">
        <h1 className="text-3xl font-bold text-red-600">Breed Not Found</h1>
        <p className="mt-4 text-lg text-gray-700">
          The dog breed "{name}" could not be found.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          Go to Search
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex justify-start mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </button>
      </div>

      <div className="bg-black text-white rounded-xl shadow-lg overflow-hidden">
        <figure className="p-4 relative min-h-[200px] flex items-center justify-center">
          {isImageLoading && <LoadingSpinner message="Loading image..." />}
          <img
            src={imageSrc}
            alt={name}
            className={`rounded-xl object-cover w-full max-h-96 ${
              isImageLoading ? "hidden" : "block"
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </figure>
        <div className="p-6">
          <h1 className="capitalize text-3xl font-bold">{name}</h1>
          <h2 className="text-xl font-semibold mt-4 mb-2">Types:</h2>
          {breedTypes.length > 0 ? (
            <ul className="list-disc list-inside">
              {breedTypes.map((type, idx) => (
                <li key={idx} className="capitalize">
                  {type}
                </li>
              ))}
            </ul>
          ) : (
            <p className="italic text-gray-500">No types available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreedDetail;
