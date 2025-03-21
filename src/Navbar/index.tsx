import { NavLink } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import imag from '../oil-lamp.png';
import { useAuth } from "../auth/context/AuthContext";
import { useState, useEffect } from "react";
import "./nav.css";

const Navbar = () => {
  // Get authentication state and functions from context
  const { user, isAuthenticated, logout } = useAuth();
  // State para controlar la visibilidad del sidebar
  const [sidebarVisible, setSidebarVisible] = useState(false);

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

    window.addEventListener('resize', handleResize);
    
    // Cleanup al desmontar
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setSidebarVisible(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#16223d" }}>
        <div className="container-fluid">
          <NavLink to="/" className="logo">
            Lamp to my feet <img src={imag} alt="" />
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
              <li className="nav-item">
                <NavLink to="/" className="nav-link">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/learn" className="nav-link">
                  Learn
                </NavLink>
              </li>
              
              {/* Show these navigation items only when authenticated */}
              {isAuthenticated && (
                <>
                  <li className="nav-item">
                    <NavLink to="/dashboard" className="nav-link">
                      <i className="bi bi-grid me-2"></i>
                      Dashboard
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/profile" className="nav-link">
                      <i className="bi bi-person me-2"></i>
                      Profile
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/settings" className="nav-link">
                      <i className="bi bi-gear me-2"></i>
                      Settings
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
            
            {/* Auth buttons/user info - right side */}
            <ul className="navbar-nav ms-lg-auto">
              {isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <span className="nav-link">Hello, {user?.username || 'User'}</span>
                  </li>
                  <li className="nav-item">
                    <button 
                      onClick={handleLogout} 
                      className="btn btn-outline-warning btn-sm ms-2"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink to="/login" className="nav-link">
                      Login
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/register" className="nav-link">
                      Register
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Botón para mostrar/ocultar sidebar en pantallas pequeñas */}
      {isAuthenticated && (
        <button 
          className="sidebar-toggle-button" 
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <i className={`bi ${sidebarVisible ? 'bi-x' : 'bi-list'}`}></i>
        </button>
      )}

      {/* Sidebar para pantallas pequeñas - Solo visible cuando el usuario está autenticado */}
      {isAuthenticated && (
        <div className={`mobile-sidebar ${sidebarVisible ? 'show' : ''}`}>
          <div className="sidebar-header">
            <div className="lamp-icon">
              <img src={imag} alt="Lamp Icon" className="sidebar-lamp-icon" />
            </div>
            <h1 className="sidebar-title">Lamp to my feet</h1>
          </div>
          
          <nav className="sidebar-nav">
            <ul>
              <li className="sidebar-item">
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
                  onClick={() => setSidebarVisible(false)}
                >
                  <i className="bi bi-grid me-2"></i>
                  Dashboard
                </NavLink>
              </li>
              <li className="sidebar-item">
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
                  onClick={() => setSidebarVisible(false)}
                >
                  <i className="bi bi-person me-2"></i>
                  Profile
                </NavLink>
              </li>
              <li className="sidebar-item">
                <NavLink 
                  to="/settings" 
                  className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
                  onClick={() => setSidebarVisible(false)}
                >
                  <i className="bi bi-gear me-2"></i>
                  Settings
                </NavLink>
              </li>
            </ul>
          </nav>
          
          <div className="sidebar-footer">
            <button onClick={handleLogout} className="logout-button">
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </div>
        </div>
      )}
      
      {/* Overlay para cerrar el sidebar al hacer clic fuera de él */}
      {sidebarVisible && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarVisible(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;