import { useEffect, useState, useCallback } from "react";
import api from "../lib/api";

const fetchBreedImages = async (breedList) => {
  const imgMap = {};
  await Promise.all(
    Object.keys(breedList).map(async (breed) => {
      try {
        const res = await fetch(
          `https://dog.ceo/api/breed/${breed.toLowerCase()}/images`
        );
        const data = await res.json();
        imgMap[breed] = data.message?.[0] || "";
      } catch {
        imgMap[breed] = "";
      }
    })
  );
  return imgMap;
};

const useBreedData = (fetchAll = false) => {
  const [breeds, setBreeds] = useState({});
  const [images, setImages] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 9;

  const fetchBreeds = useCallback(
    async (pageNumber = 1) => {
      try {
        if (fetchAll) {
          let allBreeds = {};
          let currentPage = 1;
          let totalPages = 1;

          const res = await api.get(`/dogs?page=1&limit=${limit}`);
          allBreeds = { ...allBreeds, ...res.data.data };
          totalPages = res.data.totalPages;

          if (totalPages > 1) {
            for (currentPage = 2; currentPage <= totalPages; currentPage++) {
              const pageRes = await api.get(
                `/dogs?page=${currentPage}&limit=${limit}`
              );
              allBreeds = { ...allBreeds, ...pageRes.data.data };
            }
          }

          setBreeds(allBreeds);
          setPage(1);
          setTotalPages(1);

          const breedImages = await fetchBreedImages(allBreeds);
          setImages(breedImages);
        } else {
          const res = await api.get(`/dogs?page=${pageNumber}&limit=${limit}`);
          const breedData = res.data.data;
          setBreeds(breedData);
          setTotalPages(res.data.totalPages);
          setPage(res.data.page);

          const breedImages = await fetchBreedImages(breedData);
          setImages(breedImages);
        }
      } catch (err) {
        console.error("Error fetching breeds", err);
      }
    },
    [fetchAll, limit]
  );

  useEffect(() => {
    fetchBreeds();
  }, [fetchBreeds]);

  return { breeds, images, page, totalPages, fetchBreeds };
};

export default useBreedData;
