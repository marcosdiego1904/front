import { BrowserRouter, useRoutes } from "react-router-dom";
import Home from "../src/Home/index";
import LearnSection from "../pages/learnsection/Learn";
import Navbar from "./Navbar";
import "./App.css";

function App() {
  const AppRoutes = () => {
    return useRoutes([
      { path: "/", element: <Home /> },
      { path: "/learn", element: <LearnSection /> }, // 🔹 Ruta correcta
    ]);
  };

  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
