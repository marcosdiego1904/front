import { NavLink } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import imag from '../oil-lamp.png'

import "./nav.css";

const Navbar = () => {
  return (
    <>
      {/* Ajustamos la clase del nav */}
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#16223d" }}>
        <div className="container-fluid">
          <NavLink to="/" className="logo">
            Lamp to my feet <img src={imag} alt="" />
          </NavLink>

          {/* Ajustamos la clase del botón para usar el ícono de Bootstrap por defecto */}
          <button
            className="navbar-toggler" 
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            {/* Deja solo la clase navbar-toggler-icon */}
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
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
