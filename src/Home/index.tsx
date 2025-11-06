import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: '3rem',
        color: '#16223d',
        marginBottom: '1rem'
      }}>
        New Homepage Coming Soon
      </h1>
      <p style={{
        fontSize: '1.25rem',
        color: '#6c757d',
        marginBottom: '2rem',
        maxWidth: '600px'
      }}>
        We're redesigning our homepage to serve you better.
        In the meantime, you can still access all features through the navigation menu.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {!isAuthenticated ? (
          <>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '12px 24px',
                fontSize: '1rem',
                backgroundColor: '#16223d',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              style={{
                padding: '12px 24px',
                fontSize: '1rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Get Started
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '12px 24px',
              fontSize: '1rem',
              backgroundColor: '#16223d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Go to Dashboard
          </button>
        )}
        <button
          onClick={() => navigate('/about')}
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default Home;
