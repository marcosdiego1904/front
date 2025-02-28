import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories, getSubcategories, getVerses } from "../../../src/services/api";
import "./style.css";

const Categories = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [subcategories, setSubcategories] = useState<{ [key: number]: { id: number; category_id: number; name: string }[] }>({});
  const [openCategories, setOpenCategories] = useState<number[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<{ id: number; name: string } | null>(null);
  const [verses, setVerses] = useState<{ id: number; text_nlt: string; verse_reference: string; context_nlt: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Add this state to track which paths work
  const [imagePaths, setImagePaths] = useState<{[key: number]: string}>({});
  const [imageErrors, setImageErrors] = useState<{[key: number]: boolean}>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        console.log("Categorías recibidas:", data);
        
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data && typeof data === 'object') {
          const categoriesArray = Object.values(data);
          console.log("Convertido a array:", categoriesArray);
          setCategories(categoriesArray as { id: number; name: string }[]);
        } else {
          console.error("El formato de datos recibido no es compatible:", data);
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchAllSubcategories = async () => {
      if (categories.length === 0) return;

      const subMap: { [key: number]: { id: number; category_id: number; name: string }[] } = {};
      for (const category of categories) {
        try {
          const data = await getSubcategories(category.id);
          subMap[category.id] = data;
        } catch (error) {
          console.error(`Error fetching subcategories for category ${category.id}:`, error);
        }
      }
      setSubcategories(subMap);
    };
    fetchAllSubcategories();
  }, [categories]);

  // Try multiple possible paths for images
  const testImagePaths = (categoryId: number, categoryName: string) => {
    // Format the category name for filenames
    const formattedName = categoryName
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    
    // Try different paths - we'll add these as <img> tags and see which ones load
    const possiblePaths = [
      `/images/${formattedName}.jpg`,                  // Absolute from root
      `./images/${formattedName}.jpg`,                 // From current directory
      `../images/${formattedName}.jpg`,                // One level up
      `../../images/${formattedName}.jpg`,             // Two levels up
      `../../../images/${formattedName}.jpg`,          // Three levels up
      `/assets/images/${formattedName}.jpg`,           // Common assets folder
      `/public/images/${formattedName}.jpg`,           // Public folder
      `/static/images/${formattedName}.jpg`,           // Static folder
      `${process.env.PUBLIC_URL}/images/${formattedName}.jpg` // Using PUBLIC_URL
    ];
    
    console.log(`Testing image paths for category: ${categoryName} (${categoryId})`);
    possiblePaths.forEach(path => {
      console.log(`  - Trying path: ${path}`);
    });
    
    // Return a default path for now - the hidden img tags will help determine which one works
    return `/images/${formattedName}.jpg`;
  };

  // Handle image load success
  const handleImageLoad = (categoryId: number, path: string) => {
    console.log(`✅ SUCCESS: Image loaded for category ${categoryId} with path: ${path}`);
    setImagePaths(prev => ({...prev, [categoryId]: path}));
  };

  // Handle image load error
  const handleImageError = (categoryId: number, path: string) => {
    console.log(`❌ ERROR: Failed to load image for category ${categoryId} with path: ${path}`);
    setImageErrors(prev => ({...prev, [categoryId]: true}));
  };

  const toggleCategory = (categoryId: number) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleSubcategoryClick = async (subcategory: { id: number; name: string }) => {
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

  const handleVerseClick = (verse: { id: number; text_nlt: string; verse_reference: string; context_nlt: string }) => {
    console.log("Navegando con versículo:", verse);
    navigate("/learn", { state: { selectedVerse: verse } });
  };

  return (
    <div className="main-cont">
      <div className="categories-section">
        {!selectedSubcategory ? (
          <>
            <div className="cat-text">
              <h1>We want to help you find the perfect verse for you</h1>
              <p>
                That's why we've organized the verses into categories that reflect the situations and emotions we face as Christians.
              </p>
            </div>

            {categories.length === 0 ? (
              <p>Loading categories...</p>
            ) : (
              <div className="categories-container">
                {categories.map((category) => {
                  // For each category, test all possible image paths
                  const imagePath = imagePaths[category.id] || testImagePaths(category.id, category.name);
                  
                  // For debugging, we'll add hidden images with different paths
                  const testPaths = [
                    `/images/${category.name.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-")}.jpg`,
                    `../images/${category.name.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-")}.jpg`,
                    `../../images/${category.name.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-")}.jpg`,
                    `../../../images/${category.name.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-")}.jpg`
                  ];
                  
                  return (
                    <div key={category.id} className="category-wrapper">
                      {/* Add hidden test images to see which paths work */}
                      {testPaths.map((path, index) => (
                        <img 
                          key={index}
                          src={path} 
                          alt="" 
                          style={{display: 'none'}} 
                          onLoad={() => handleImageLoad(category.id, path)}
                          onError={() => handleImageError(category.id, path)}
                        />
                      ))}
                      
                      <div
                        className="category-card"
                        style={{ 
                          // Fall back to a gradient if image fails
                          backgroundImage: imageErrors[category.id] 
                            ? 'linear-gradient(135deg, #007bff, #004bb3)' 
                            : `url(${imagePath})` 
                        }}
                        onClick={() => toggleCategory(category.id)}
                      >
                        <div className="overlay"></div>
                        <h2>{category.name}</h2>
                        <span className="toggle-icon">{openCategories.includes(category.id) ? "▲" : "▼"}</span>
                      </div>

                      {openCategories.includes(category.id) && (
                        <div className="subcategory-container">
                          {subcategories[category.id]?.length > 0 ? (
                            subcategories[category.id].map((sub) => (
                              <button
                                key={sub.id}
                                className="subcategory-button"
                                onClick={() => handleSubcategoryClick(sub)}
                              >
                                {sub.name}
                              </button>
                            ))
                          ) : (
                            <p>Loading subcategories...</p>
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
          <div className="verses-section">
            <button className="back-button" onClick={handleReturn}>← Return</button>
            <h1>{selectedSubcategory.name}</h1>
            {loading ? (
              <p>Loading verses...</p>
            ) : (
              <div className="verses-list">
                {verses.length === 0 ? (
                  <p>No verses available.</p>
                ) : (
                  verses.map((verse) => (
                    <div 
                      key={verse.id} 
                      className="verse-card"
                      onClick={() => handleVerseClick(verse)}
                      style={{ cursor: "pointer" }}
                    >
                      <p className="verse-text">"{verse.text_nlt}"</p>
                      <p className="verse-reference">- {verse.verse_reference}</p>
                      <p className="verse-context">{verse.context_nlt}</p>
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