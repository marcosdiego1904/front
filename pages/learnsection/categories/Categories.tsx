import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Para redirigir a la sección de aprendizaje
import { getCategories, getSubcategories, getVerses } from "../../../src/services/api";
import "./style.css";

const Categories = () => {
  const navigate = useNavigate(); // Hook para manejar la navegación

  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [subcategories, setSubcategories] = useState<{ [key: number]: { id: number; category_id: number; name: string }[] }>({});
  const [openCategories, setOpenCategories] = useState<number[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<{ id: number; name: string } | null>(null);
  const [verses, setVerses] = useState<{ id: number; text_nlt: string; verse_reference: string; context_nlt: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        console.log("Categorías recibidas:", data);
        
        // Verifica si data es un array y si no lo es, asegúrate de convertirlo
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data && typeof data === 'object') {
          // Si es un objeto, trata de convertirlo en array
          const categoriesArray = Object.values(data);
          console.log("Convertido a array:", categoriesArray);
          setCategories(categoriesArray as { id: number; name: string }[]);
        } else {
          console.error("El formato de datos recibido no es compatible:", data);
          setCategories([]); // Establece un array vacío como fallback
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

  // 🔥 Función para seleccionar un versículo y navegar a la sección de aprendizaje
  const handleVerseClick = (verse: { id: number; text_nlt: string; verse_reference: string; context_nlt: string }) => {
    console.log("Navegando con versículo:", verse); // Para verificar en consola
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
                That’s why we’ve organized the verses into categories that reflect the situations and emotions we face as Christians.
              </p>
            </div>

            {categories.length === 0 ? (
              <p>Loading categories...</p>
            ) : (
              <div className="categories-container">
                {categories.map((category) => (
                  <div key={category.id} className="category-wrapper">
                    <div
                      className="category-card"
                      style={{ backgroundImage: `url(../../../images/${category.name.toLowerCase().replace(/\s+/g, "-")}.jpg)` }}
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
                ))}
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
                      onClick={() => handleVerseClick(verse)} // Click para seleccionar versículo
                      style={{ cursor: "pointer" }} // Indica que es clickeable
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
