import React from "react";
import "./construction.css";

const AboutPage: React.FC = () => {
  return (
    <div className="construction-page">
      <div className="container py-5 mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="construction-container p-4 text-center">
              <h1 className="mb-4">About Us</h1>
              
              {/* Construction notice */}
              <div className="construction-notice mb-4">
                <div className="construction-icon">
                  <svg viewBox="0 0 100 100" width="120" height="120">
                    <circle cx="50" cy="50" r="45" fill="#16223d" stroke="#ffc107" strokeWidth="2"/>
                    <path fill="#ffc107" d="M50 20 L55 23 L55 35 L45 35 L45 23 Z" />
                    <path fill="#ffc107" d="M50 20 L55 23 L55 35 L45 35 L45 23 Z" transform="rotate(45 50 50)" />
                    <path fill="#ffc107" d="M50 20 L55 23 L55 35 L45 35 L45 23 Z" transform="rotate(90 50 50)" />
                    <path fill="#ffc107" d="M50 20 L55 23 L55 35 L45 35 L45 23 Z" transform="rotate(135 50 50)" />
                    <path fill="#ffc107" d="M50 20 L55 23 L55 35 L45 35 L45 23 Z" transform="rotate(180 50 50)" />
                    <path fill="#ffc107" d="M50 20 L55 23 L55 35 L45 35 L45 23 Z" transform="rotate(225 50 50)" />
                    <path fill="#ffc107" d="M50 20 L55 23 L55 35 L45 35 L45 23 Z" transform="rotate(270 50 50)" />
                    <path fill="#ffc107" d="M50 20 L55 23 L55 35 L45 35 L45 23 Z" transform="rotate(315 50 50)" />
                    <circle cx="50" cy="50" r="20" fill="#16223d" stroke="#ffc107" strokeWidth="2"/>
                    <path fill="#f8f9fa" d="M40 40 L60 60 M40 60 L60 40" strokeWidth="5" stroke="#f8f9fa"/>
                  </svg>
                </div>
                <h2 className="text-warning pulse-text">Under Construction</h2>
                <p className="lead">
                  We're currently building this page to share our story with you.
                </p>
                <p>
                  Thank you for your interest in Lamp to my feet. We're working hard to 
                  create an amazing experience. This page will be available soon!
                </p>
              </div>
              
              {/* Coming soon message */}
              <div className="coming-soon mt-4">
                <h3>Coming Soon</h3>
                <ul className="list-unstyled">
                  <li>✨ Our mission and vision</li>
                  <li>✨ Who we are</li>
                  <li>✨ How we started</li>
                  <li>✨ Contact information</li>
                </ul>
              </div>
              
              {/* Return to home button */}
              <button 
                onClick={() => window.location.href = "/"} 
                className="btn btn-primary mt-4"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;