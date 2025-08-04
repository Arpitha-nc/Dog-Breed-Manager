import { useEffect, useState, useCallback } from "react";
import api from "../lib/api";
import PlaceholderDogImage from "../assets/NotFound.png";
import { useToast } from "../components/ToastContainer";

const PLACEHOLDER_IMAGE_URL = PlaceholderDogImage;

const fetchBreedImages = async (breedList, addToast) => {
  const imgMap = {};
  const failedBreeds = [];

  await Promise.all(
    Object.keys(breedList).map(async (breed) => {
      try {
        const res = await fetch(
          `https://dog.ceo/api/breed/${breed.toLowerCase()}/images`
        );

        const data = await res.json();

        if (data.status === "error") {
          if (data.message.includes("Breed not found")) {
            console.warn(
              `Image not found for breed "${breed}" on Dog CEO API. Using placeholder.`
            );
            imgMap[breed] = PLACEHOLDER_IMAGE_URL;
            failedBreeds.push(breed);
          } else {
            console.error(
              `Dog CEO API error for ${breed}: ${data.message}. Using placeholder.`
            );
            imgMap[breed] = PLACEHOLDER_IMAGE_URL;
            failedBreeds.push(breed);
          }
        } else if (!res.ok) {
          console.error(
            `Failed to fetch image for ${breed}: ${res.statusText}. Using placeholder.`
          );
          imgMap[breed] = PLACEHOLDER_IMAGE_URL;
          failedBreeds.push(breed);
        } else {
          imgMap[breed] = data.message?.[0] || PLACEHOLDER_IMAGE_URL;
        }
      } catch (err) {
        console.error(
          `Network or unexpected error fetching image for ${breed}:`,
          err
        );
        imgMap[breed] = PLACEHOLDER_IMAGE_URL;
        failedBreeds.push(breed);
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const limit = 9;
  const { addToast } = useToast();

  const fetchBreeds = useCallback(
    async (pageNumber = 1) => {
      setIsLoading(true);
      setError(null);
      try {
        let currentBreeds = {};
        if (fetchAll) {
          let currentPage = 1;
          let totalPages = 1;

          const firstRes = await api.get(`/dogs?page=1&limit=${limit}`);
          if (!firstRes.data || firstRes.data.error) {
            throw new Error(
              firstRes.data.error || "Failed to fetch breeds (initial page)."
            );
          }
          currentBreeds = { ...firstRes.data.data };
          totalPages = firstRes.data.totalPages;

          if (totalPages > 1) {
            for (currentPage = 2; currentPage <= totalPages; currentPage++) {
              const pageRes = await api.get(
                `/dogs?page=${currentPage}&limit=${limit}`
              );
              if (!pageRes.data || pageRes.data.error) {
                throw new Error(
                  pageRes.data.error ||
                    `Failed to fetch breeds (page ${currentPage}).`
                );
              }
              currentBreeds = { ...currentBreeds, ...pageRes.data.data };
            }
          }
          setBreeds(currentBreeds);
          setPage(1);
          setTotalPages(1);
        } else {
          const res = await api.get(`/dogs?page=${pageNumber}&limit=${limit}`);
          if (!res.data || res.data.error) {
            throw new Error(res.data.error || "Failed to fetch breeds.");
          }
          currentBreeds = res.data.data;
          setBreeds(currentBreeds);
          setTotalPages(res.data.totalPages);
          setPage(res.data.page);
        }

        const breedImages = await fetchBreedImages(currentBreeds, addToast);
        setImages(breedImages);
      } catch (err) {
        console.error("Error fetching breeds:", err);
        setError(
          err.message ||
            "An unexpected error occurred while fetching breed data."
        );
        addToast(err.message || "Failed to fetch breed data.", "error");
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAll, limit, addToast]
  );

  useEffect(() => {
    fetchBreeds();
  }, [fetchBreeds]);

  return { breeds, images, page, totalPages, isLoading, error, fetchBreeds };
};

export default useBreedData;
