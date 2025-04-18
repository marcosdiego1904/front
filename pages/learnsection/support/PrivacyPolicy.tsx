import React from "react";
import "./constStyle.css";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="support-page">
      <div className="privacy-container">
        <h1>Privacy Policy - Lamp to my feet</h1>
        
        <section>
          <h2>1. Information We Collect</h2>
          <p>
            "Lamp to my feet" collects limited information necessary for the operation
            of the application, including:
          </p>
          <ul>
            <li>Account information (if you register): email and name</li>
            <li>Saved verses and memorization progress</li>
            <li>Basic technical information about your device and connection</li>
          </ul>
        </section>
        
        <section>
          <h2>2. Donations and Payments</h2>
          <p>
            When you make a donation, the transaction is processed by PayPal. We do not store
            or have access to your financial information such as credit card numbers or
            bank credentials. PayPal provides us with basic information about the transaction.
          </p>
        </section>
        
        <section>
          <h2>3. Use of Information</h2>
          <p>
            We use the collected information to:
          </p>
          <ul>
            <li>Provide and improve our services</li>
            <li>Process donations</li>
            <li>Communicate with you about updates or changes</li>
          </ul>
        </section>
        
        <section>
          <h2>4. Sharing Information</h2>
          <p>
            We do not sell or share your personal information with third parties, except when
            necessary to provide our services (such as payment processors)
            or when required by law.
          </p>
        </section>
        
        <section>
          <h2>5. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal data.
            To exercise these rights, please contact us through the support form.
          </p>
        </section>
        
        <div className="privacy-footer">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;