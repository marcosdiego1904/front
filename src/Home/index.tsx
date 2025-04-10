import { useState, useEffect, useRef } from "react";
import "./styles.css";
import { getCategories } from "../services/api";
import Categories from "../../pages/learnsection/categories/Categories";

const Home = () => {
  // Estado para almacenar las categorías
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  // Estado para ocultar la sección Home cuando se hace scroll
  const [scrolledToCategories, setScrolledToCategories] = useState(false);

  // Referencia a la sección de categorías
  const categoriesRef = useRef<HTMLDivElement | null>(null);

  // Obtener las categorías al cargar el componente
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  // Función para hacer scroll a la sección de categorías
  const scrollToCategories = () => {
    categoriesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Detectar el scroll y ocultar la sección Home cuando las categorías están en la parte superior
  useEffect(() => {
    const handleScroll = () => {
      if (categoriesRef.current) {
        const { top } = categoriesRef.current.getBoundingClientRect();
        setScrolledToCategories(top <= 10); // Oculta Home cuando la sección de categorías llega arriba
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Agregar un efecto para manejar el desplazamiento automático desde la URL
  useEffect(() => {
    // Verificar si hay un parámetro en la URL para desplazarse a las categorías
    if (window.location.search.includes('scrollToCategories=true')) {
      // Usar setTimeout para asegurar que el componente esté completamente montado
      setTimeout(() => {
        scrollToCategories();
      }, 300);
    }
  }, []);

  return (
    <>
      {/* Sección Home con clase condicional para ocultarla cuando se llega a categorías */}
      <div className={`main-cont ${scrolledToCategories ? "hidden-home" : ""}`}>
        <div className="left">
          <div className="text-cont">
            <h1>Strengthen Your Faith, One Verse at a Time!</h1>
            <p>
              Discover a revolutionary way to memorize Scripture. Simple, engaging, and effective – you'll never forget a verse again!
            </p>
            <div className="buttons">
              <button className="button get-started-btn" onClick={scrollToCategories}>
                Get Started Now!
              </button>
              <button className="button resume-btn">Resume Learning</button>
              <button className="button learned-btn">My Learned Verses</button>
            </div>

            <p style={{ marginTop: "40px" }}>
              Memorize your first verse in under 5 minutes – challenge yourself today!
            </p>
          </div>
        </div>
        <div className="right">
          <div className="image-overlay"></div>
        </div>
      </div>

      {/* Sección de categorías con referencia e ID para navegación */}
      <div 
        ref={categoriesRef} 
        id="categories-section" 
        className="pt-5"
      >
        <Categories />
      </div>
    </>
  );
};

export default Home;