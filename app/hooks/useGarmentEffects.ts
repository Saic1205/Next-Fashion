

import { useEffect, useCallback, useRef, RefObject } from "react";
import { ImageType } from "../data/garments";
import { loadMoreImages } from "../actions/loadMoreImages";

export const useGarmentEffects = (
  images: ImageType[],
  setImages: React.Dispatch<React.SetStateAction<ImageType[]>>,
  page: number,
  setPage: React.Dispatch<React.SetStateAction<number>>,
  loading: boolean,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  hasMore: boolean,
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>,
  setScrollPosition: React.Dispatch<React.SetStateAction<number>>,
  isModalOpen: boolean,
  selectedProduct: ImageType | null,
  imageRefs: RefObject<(HTMLDivElement | null)[]>
) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const loadMoreImagesFromServer = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newImages = await loadMoreImages(page + 1, 10);

      if (newImages.length > 0) {
        setImages((prevImages) => [...prevImages, ...newImages]);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more images:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, setImages, setPage, setLoading, setHasMore]);

  const lastImageElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMoreImagesFromServer();
          }
        },
        { threshold: 0.7 }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMoreImagesFromServer]
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setScrollPosition]);

  useEffect(() => {
    if (images.length === 0) {
      loadMoreImagesFromServer();
    }
  }, [images.length, loadMoreImagesFromServer]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const ratio = entry.intersectionRatio;
            const target = entry.target as HTMLElement;
            const imageId = parseInt(target.getAttribute("data-id") || "0", 10);

            if (
              !isModalOpen ||
              (isModalOpen && imageId === selectedProduct?.id)
            ) {
              if (ratio > 0.8) {
                target.style.filter = "grayscale(0%)";
              } else {
                const grayscaleValue = 100 - (ratio / 0.8) * 100;
                target.style.filter = `grayscale(${grayscaleValue}%)`;
              }
            } else if (isModalOpen && imageId !== selectedProduct?.id) {
              target.style.filter = "grayscale(100%)";
            }
          } else if (!isModalOpen) {
            entry.target.setAttribute("style", "filter: grayscale(100%)");
          }
        });
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
        rootMargin: "0px 0px -20% 0px",
      }
    );

    const currentImageRefs = imageRefs.current;

    currentImageRefs?.forEach((ref, index) => {
      if (ref) {
        ref.setAttribute("data-id", images[index].id.toString());
        observer.observe(ref);
      }
    });

    return () => {
      currentImageRefs?.forEach((ref) => {
        if (ref) {
          observer.unobserve(ref);
        }
      });
    };
  }, [isModalOpen, selectedProduct, images, imageRefs]);

  return { lastImageElementRef };
};
