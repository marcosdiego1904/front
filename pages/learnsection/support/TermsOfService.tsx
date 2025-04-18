import React from "react";
import "./constStyle.css";

const TermsOfService: React.FC = () => {
  return (
    <div className="support-page">
      <div className="terms-container">
        <h1>Terms of Service - Lamp to my feet</h1>
        
        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to "Lamp to my feet," an application dedicated to helping users
            memorize Bible verses. These Terms of Service govern the use of our
            application and the voluntary donation process.
          </p>
        </section>
        
        <section>
          <h2>2. Donations</h2>
          <p>
            Donations to "Lamp to my feet" are completely voluntary and non-refundable.
            By making a donation, you agree that you are supporting the development and
            maintenance of this application without expectation of receiving specific
            products or services in return.
          </p>
          <p>
            Donations will primarily be used for:
          </p>
          <ul>
            <li>Covering hosting and server costs</li>
            <li>Ongoing development of new features</li>
            <li>Application maintenance</li>
          </ul>
        </section>
        
        <section>
          <h2>3. Use of Service</h2>
          <p>
            "Lamp to my feet" is provided "as is," without warranties of any kind.
            We strive to offer a reliable service, but we cannot guarantee that
            the application will be available at all times or free of errors.
          </p>
        </section>
        
        <section>
          <h2>4. Intellectual Property</h2>
          <p>
            The biblical content available in this application is subject to copyright
            by its respective owners and is used with permission or under fair use principles.
            The structure, design, and code of the application are the property of the developer.
          </p>
        </section>
        
        <section>
          <h2>5. Limitation of Liability</h2>
          <p>
            The developer of "Lamp to my feet" will not be liable for direct,
            indirect, incidental, or consequential damages that may arise from the use
            or inability to use this application.
          </p>
        </section>
        
        <section>
          <h2>6. Contact</h2>
          <p>
            If you have questions about these terms or any aspect of the application,
            you can contact us through the form in the Support section.
          </p>
        </section>
        
        <div className="terms-footer">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;