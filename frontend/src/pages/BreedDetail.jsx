import { useParams, useNavigate } from "react-router-dom";
import useBreedData from "../hooks/useBreedData";

const BreedDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { breeds, images } = useBreedData(true);

  const breedTypes = breeds[name] || [];
  const image = images[name];

  if (!breeds[name]) {
    return (
      <div className="text-center text-error text-lg">Breed not found</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex justify-start mb-4">
        <button onClick={() => navigate(-1)} className="btn btn-primary btn-md">
          ← Back
        </button>
      </div>

      <div className="card bg-black shadow-xl">
        <figure className="p-4">
          <img
            src={image}
            alt={name}
            className="rounded-xl object-cover w-full max-h-96"
          />
        </figure>
        <div className="card-body">
          <h1 className="card-title capitalize text-3xl">{name}</h1>

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
