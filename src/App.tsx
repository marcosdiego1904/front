import { BrowserRouter, useRoutes, Navigate } from "react-router-dom";
import Home from "../src/Home/index";
import LearnSection from "../pages/learnsection/Learn";
import Navbar from "./Navbar";
import "./App.css";

// Import authentication components
import Login from "./auth/components/registratrion/Login";
import Register from "./auth/components/registratrion/Register";
import ForgotPassword from "./auth/components/ForgotPassword";
import UserProfile from "./auth/components/UserProfile";
import Dashboard from "./auth/components/Dashboard";
import { AuthProvider, useAuth } from "./auth/context/AuthContext";

// Import the About and Support components
import AboutPage from "../pages/learnsection/about";
import SupportPage from "../pages/learnsection/support";

// En src/index.tsx o App.tsx
import './styles/global-design-system.css';

// Custom wrapper for protected routes that works with useRoutes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Routes component that uses useRoutes
const AppRoutes = () => {
  return useRoutes([
    // Public routes
    { path: "/", element: <Home /> },
    { path: "/learn", element: <LearnSection /> },
    
    // Add the new About and Support routes
    { path: "/about", element: <AboutPage /> },
    { path: "/support", element: <SupportPage /> },
    
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    
    // Protected routes
    { 
      path: "/dashboard", 
      element: <ProtectedRoute><Dashboard /></ProtectedRoute> 
    },
    { 
      path: "/profile", 
      element: <ProtectedRoute><UserProfile /></ProtectedRoute> 
    },
    // Add more routes as needed
  ]);
};

// Main App component
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;