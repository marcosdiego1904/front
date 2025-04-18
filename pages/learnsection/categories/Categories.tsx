import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCategories,
  getSubcategories,
  getVerses,
} from "../../../src/services/api";
import "./style.css";

const Categories = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [subcategories, setSubcategories] = useState<{
    [key: number]: { id: number; category_id: number; name: string }[];
  }>({});
  const [openCategories, setOpenCategories] = useState<number[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [verses, setVerses] = useState<
    {
      id: number;
      text_nlt: string;
      verse_reference: string;
      context_nlt: string;
    }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>(
    {}
  );

  // Create a direct mapping from category names to their exact image filenames
  const categoryToImageMap: { [key: string]: string } = {
    "Christian Life": "/images/christian-life.jpg",
    "Relationships & Emotions": "/images/relationships-&-emotions.jpg",
    "Spiritual Strength": "/images/spiritual-strength.jpg",
    "Struggles & Overcoming": "/images/struggles-&-overcoming.jpg",
    "Hope & Salvation": "/images/hope-&-salvation.jpg",
    "God in Action": "/images/god-in-action.jpg",
  };

  // Preload images to improve perceived performance
  const preloadImages = () => {
    Object.values(categoryToImageMap).forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  };

  // Function to handle image errors
  const handleImageError = (categoryId: number) => {
    console.log(`Error loading image for category ID: ${categoryId}`);
    setImageErrors((prev) => ({ ...prev, [categoryId]: true }));
  };

  useEffect(() => {
    // Start preloading images immediately
    preloadImages();

    // Check if we have cached categories data
    const cachedCategories = localStorage.getItem("categoriesData");
    const cachedSubcategories = localStorage.getItem("subcategoriesData");
    const cacheTimestamp = localStorage.getItem("cacheTimestamp");

    // Use cache if it exists and is less than 1 hour old
    const cacheExpired =
      !cacheTimestamp || Date.now() - parseInt(cacheTimestamp) > 3600000;

    if (cachedCategories && cachedSubcategories && !cacheExpired) {
      try {
        setCategories(JSON.parse(cachedCategories));
        setSubcategories(JSON.parse(cachedSubcategories));
        setLoading(false);
        console.log("Using cached data");
        return; // Skip API calls if using cached data
      } catch (error) {
        console.error("Error parsing cached data:", error);
        // If there's an error parsing the cache, continue to fetch from API
      }
    }

    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        console.log("Categorías recibidas:", data);

        let processedCategories: { id: number; name: string }[] = [];
        if (Array.isArray(data)) {
          processedCategories = data;
        } else if (data && typeof data === "object") {
          processedCategories = Object.values(data) as {
            id: number;
            name: string;
          }[];
          console.log("Convertido a array:", processedCategories);
        } else {
          console.error("El formato de datos recibido no es compatible:", data);
          processedCategories = [];
        }

        setCategories(processedCategories);

        // Cache the categories
        localStorage.setItem(
          "categoriesData",
          JSON.stringify(processedCategories)
        );

        // Fetch subcategories in parallel
        if (processedCategories.length > 0) {
          const fetchAllSubcategories = async () => {
            const subMap: {
              [key: number]: {
                id: number;
                category_id: number;
                name: string;
              }[];
            } = {};

            // Use Promise.all to fetch all subcategories in parallel
            await Promise.all(
              processedCategories.map(async (category) => {
                try {
                  const data = await getSubcategories(category.id);
                  subMap[category.id] = data;
                } catch (error) {
                  console.error(
                    `Error fetching subcategories for category ${category.id}:`,
                    error
                  );
                }
              })
            );

            setSubcategories(subMap);

            // Cache the subcategories
            localStorage.setItem("subcategoriesData", JSON.stringify(subMap));
            localStorage.setItem("cacheTimestamp", Date.now().toString());

            setLoading(false);
          };

          fetchAllSubcategories();
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const toggleCategory = (categoryId: number) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubcategoryClick = async (subcategory: {
    id: number;
    name: string;
  }) => {
    setLoading(true);
    setSelectedSubcategory(subcategory);

    try {
      const versesData = await getVerses(subcategory.id);
      console.log("Versículos obtenidos:", versesData);
      setVerses(versesData);
    } catch (error) {
      console.error("Error obteniendo versículos:", error);
      setVerses([]);
    }

    setLoading(false);
  };

  const handleReturn = () => {
    setSelectedSubcategory(null);
    setVerses([]);
  };

  const handleVerseClick = (verse: {
    id: number;
    text_nlt: string;
    verse_reference: string;
    context_nlt: string;
  }) => {
    console.log("Navegando con versículo:", verse);
    navigate("/learn", { state: { selectedVerse: verse } });
  };

  // Get a gradient background for fallback
  const getGradientBackground = (categoryId: number): string => {
    const gradientColors = [
      "linear-gradient(135deg, #4A00E0, #8E2DE2)", // Purple
      "linear-gradient(135deg, #2193b0, #6dd5ed)", // Blue
      "linear-gradient(135deg, #11998e, #38ef7d)", // Green
      "linear-gradient(135deg, #F2994A, #F2C94C)", // Orange
      "linear-gradient(135deg, #ee0979, #ff6a00)", // Red-Orange
      "linear-gradient(135deg, #8A2387, #E94057, #F27121)", // Vivid gradient
    ];

    // Use category ID to select a gradient (modulo to prevent out of bounds)
    const colorIndex = (categoryId - 1) % gradientColors.length;
    return gradientColors[colorIndex];
  };

  // Enhanced loading state with skeleton UI
  const renderLoadingState = () => {
    return (
      <div className="cat-categories-container">
        {[1, 2, 3, 4, 5, 6].map((placeholder) => (
          <div key={placeholder} className="cat-category-wrapper">
            <div className="cat-category-card cat-skeleton-card">
              <div className="cat-overlay"></div>
              <div className="cat-skeleton-title"></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Enhanced loading state for verses
  const renderLoadingVerses = () => {
    return (
      <div className="cat-verses-list">
        {[1, 2, 3].map((placeholder) => (
          <div key={placeholder} className="cat-verse-card cat-skeleton-verse">
            <div className="cat-skeleton-verse-text"></div>
            <div className="cat-skeleton-verse-reference"></div>
            <div className="cat-skeleton-verse-context"></div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="main-cont">
      <div className="cat-categories-section">
        {!selectedSubcategory ? (
          <>
            <div className="cat-intro-container">
              <div className="cat-intro-text">
                <h1>We want to help you find the perfect verse for you</h1>
                <p>
                  That's why we've organized the verses into categories that
                  reflect the situations and emotions we face as Christians.
                </p>
              </div>
            </div>

            {loading || categories.length === 0 ? (
              renderLoadingState() // Use skeleton UI instead of text
            ) : (
              <div className="cat-categories-container">
                {categories.map((category) => {
                  // Get the image path from our mapping
                  const imagePath = categoryToImageMap[category.name];

                  return (
                    <div key={category.id} className="cat-category-wrapper">
                      <div
                        className="cat-category-card"
                        style={{
                          backgroundImage:
                            imageErrors[category.id] || !imagePath
                              ? getGradientBackground(category.id)
                              : `url(${imagePath})`,
                        }}
                        onClick={() => toggleCategory(category.id)}
                      >
                        {/* Hidden image to detect loading errors */}
                        {imagePath && (
                          <img
                            src={imagePath}
                            alt=""
                            style={{ display: "none" }}
                            onError={() => handleImageError(category.id)}
                          />
                        )}

                        <div className="cat-overlay"></div>
                        <h2>{category.name}</h2>
                        <div className="cat-toggle-icon">
                          {openCategories.includes(category.id) ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 15L12 8L19 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                      </div>

                      {openCategories.includes(category.id) && (
                        <div className="cat-subcategory-container">
                          {subcategories[category.id]?.length > 0 ? (
                            subcategories[category.id].map((sub) => (
                              <button
                                key={sub.id}
                                className="cat-subcategory-button"
                                onClick={() => handleSubcategoryClick(sub)}
                              >
                                {sub.name}
                              </button>
                            ))
                          ) : (
                            <p className="cat-loading-text">Loading subcategories...</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="cat-verses-section">
            <button className="cat-back-button" onClick={handleReturn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="cat-back-icon">
                <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Return
            </button>
            <h1 className="cat-subcategory-title">{selectedSubcategory.name}</h1>

            {/* Added guidance text for users */}
            {!loading && verses.length > 0 && (
              <div className="cat-verse-guidance">
                <p className="cat-verse-guide-text">
                  <span className="cat-verse-guide-icon">👆</span>
                  Click on a verse to begin memorizing it
                </p>
              </div>
            )}

            {loading ? (
              renderLoadingVerses() // Use skeleton UI for verses
            ) : (
              <div className="cat-verses-list">
                {verses.length === 0 ? (
                  <p className="cat-no-verses">No verses available.</p>
                ) : (
                  verses.map((verse) => (
                    <div
                      key={verse.id}
                      className="cat-verse-card"
                      onClick={() => handleVerseClick(verse)}
                    >
                      <p className="cat-verse-text">"{verse.text_nlt}"</p>
                      <p className="cat-verse-reference">
                        - {verse.verse_reference}
                      </p>
                      <p className="cat-verse-context">{verse.context_nlt}</p>
                      <div className="cat-verse-read-more">
                        <span>Learn this verse</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;