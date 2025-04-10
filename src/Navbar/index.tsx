// Modificación del Navbar.tsx para manejar el desplazamiento suave a categorías

import { NavLink } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import imag from "../oil-lamp.png";
import { useAuth } from "../auth/context/AuthContext";
import { useState, useEffect } from "react";
import "./nav.css";

const Navbar = () => {
  // Get authentication state and functions from context
  const { user, isAuthenticated, logout } = useAuth();
  // State para controlar la visibilidad del sidebar
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Función para desplazarse a la sección de categorías
  const scrollToCategories = () => {
    // Si ya estamos en la página de inicio, desplazarse a la sección de categorías
    if (location.pathname === '/') {
      // Buscar el elemento con la referencia a las categorías
      const categoriesSection = document.getElementById('categories-section');
      if (categoriesSection) {
        categoriesSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Si no estamos en la página de inicio, navegar a la página de inicio
      // y establecer un flag para indicar que debe desplazarse
      navigate('/?scrollToCategories=true');
    }
  };

  // Efecto para manejar el desplazamiento cuando se carga la página de inicio
  useEffect(() => {
    if (location.pathname === '/' && location.search.includes('scrollToCategories=true')) {
      // Usar setTimeout para asegurar que la página se ha cargado completamente
      setTimeout(() => {
        const categoriesSection = document.getElementById('categories-section');
        if (categoriesSection) {
          categoriesSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300); // Pequeño retraso para asegurar que los componentes se han montado
    }
  }, [location]);

  // Función para alternar la visibilidad del sidebar
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Cerrar sidebar al cambiar de ruta o en pantallas grandes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup al desmontar
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setSidebarVisible(false);
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-dark"
        style={{ backgroundColor: "#16223d" }}
      >
        <div className="container-fluid">
          <NavLink to="/" className="logo">
            Lamp to my feet
            <img src={imag} alt="Lamp Icon" className="logo-icon" />
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              {/* Common links for all users */}
              <li className="nav-item">
                <NavLink to="/" className="nav-link">
                  <i className="bi bi-house-door me-2"></i>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                {/* Enlace modificado para usar la función de desplazamiento */}
                <a 
                  href="#" 
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToCategories();
                  }}
                >
                  <i className="bi bi-book me-2"></i>
                  Learn
                </a>
              </li>
              <li className="nav-item">
                <NavLink to="/about" className="nav-link">
                  <i className="bi bi-info-circle me-2"></i>
                  About
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/support" className="nav-link">
                  <i className="bi bi-heart me-2"></i>
                  Support Us
                </NavLink>
              </li>

              {/* Show Dashboard link only when authenticated */}
              {isAuthenticated && (
                <li className="nav-item">
                  <NavLink to="/dashboard" className="nav-link">
                    <i className="bi bi-grid me-2"></i>
                    Dashboard
                  </NavLink>
                </li>
              )}
            </ul>

            {/* Auth buttons/user info - right side */}
            <ul className="navbar-nav ms-lg-auto">
              {isAuthenticated ? (
                <>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="userDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="bi bi-person-circle me-1"></i>
                      {user?.username || "User"}
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                      <li>
                        <NavLink to="/profile" className="dropdown-item">
                          <i className="bi bi-person me-2"></i>
                          Profile
                        </NavLink>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="dropdown-item text-danger"
                        >
                          <i className="bi bi-box-arrow-right me-2"></i>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink to="/login" className="nav-link">
                      <i className="bi bi-box-arrow-in-right me-1"></i>
                      Login
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/register" className="nav-link">
                      <i className="bi bi-person-plus me-1"></i>
                      Register
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;