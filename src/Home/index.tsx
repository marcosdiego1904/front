import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import "./HomeSearchAndCategories.css";
import { getCategories } from "../services/api";
// import Categories from "../../pages/learnsection/categories/Categories"; // Removed
import HomeCategoryHighlights from "./HomeCategoryHighlights"; // Added
import { useAuth } from "../auth/context/AuthContext";
import '../styles/global-design-system.css';

const Home = () => {
  // Estado para almacenar las categorías
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  // Estado para ocultar la sección Home cuando se hace scroll
  const [scrolledToCategories, setScrolledToCategories] = useState(false);

  // Estado para mostrar el mensaje de alerta
  const [showAuthMessage, setShowAuthMessage] = useState(false);

  // Referencia a la sección de categorías
  const categoriesRef = useRef<HTMLDivElement | null>(null);

  // Hook para navegación
  const navigate = useNavigate();

  // Obtener el contexto de autenticación
  const { isAuthenticated } = useAuth();

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

    // Verificar si hay un mensaje de autenticación en la URL
    if (window.location.search.includes('authRequired=true')) {
      setShowAuthMessage(true);
      // Ocultar el mensaje después de 5 segundos
      setTimeout(() => {
        setShowAuthMessage(false);
      }, 5000);
    }
  }, []);

  // Función para manejar el clic en "My Learned Verses"
  const handleLearnedVersesClick = () => {
    if (isAuthenticated) {
      // Si está autenticado, redirigir al dashboard con un hash para la sección de versículos memorizados
      navigate('/dashboard#memorizedVerses');
    } else {
      // Si no está autenticado, redirigir a la página de registro con un parámetro para mostrar un mensaje
      navigate('/register?authRequired=true');
    }
  };

  return (
    <>
      {/* Sección Home con clase condicional para ocultarla cuando se llega a categorías */}
      <div className={`main-cont ${scrolledToCategories ? "hidden-home" : ""}`}>
        {/* Mensaje de alerta para autenticación - ahora dentro de main-cont */}
        {showAuthMessage && (
          <div className="bible-auth-alert">
            <div className="bible-alert-content">
              <span className="alert-icon">⚠️</span>
              <span>To view your memorized verses, you need to create an account or sign in.</span>
              <button className="close-bible-alert" onClick={() => setShowAuthMessage(false)}>×</button>
            </div>
          </div>
        )}

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
              <button className="button learned-btn" onClick={handleLearnedVersesClick}>
                My Learned Verses
              </button>
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
        className="pt-1"
      >
        {/* <Categories /> */}
        <HomeCategoryHighlights />

        {/* NEWLY INSERTED JSX FOR SEARCH AND CATEGORIES */}
       
      </div>
    </>
  );
};

export default Home;