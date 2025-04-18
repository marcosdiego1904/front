import React, { useState, useEffect, useRef } from "react";
import "./constStyle.css";

const SupportPage: React.FC = () => {
  // States for interactive elements
  const [showVideo, setShowVideo] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [thankYouVisible, setThankYouVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  
  // Track selected donation amount
  const selectedAmount = useRef("20");

  // Testimonial data
  const testimonials = [
    {
      text: "This app changed my relationship with the Word. After years of trying to memorize verses without success, I can finally remember them when I need them most. It's like carrying a treasure in my heart.",
      author: "María S.",
      country: "Mexico"
    },
    {
      text: "As a pastor, I recommend this tool to my entire congregation. The step-by-step method is brilliant and I've seen how it has transformed the spiritual life of many in our church.",
      author: "Pastor David L.",
      country: "Colombia"
    },
    {
      text: "I'm a Sunday school teacher and this app has revolutionized how I teach the Word to my students. Now the children memorize with enthusiasm and compete to see who learns more verses!",
      author: "Carolina P.",
      country: "Spain"
    },
    {
      text: "Every day on the train I use the app to memorize a new verse. This habit has been a spiritual anchor in difficult times. I am deeply grateful for the developer's work.",
      author: "Roberto M.",
      country: "Argentina"
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit form handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Normally would send data to backend
    console.log("Form submitted:", formData);
    
    // Show thank you message
    setThankYouVisible(true);
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      message: ""
    });
    
    // Hide thank you message after 5 seconds
    setTimeout(() => {
      setThankYouVisible(false);
    }, 5000);
  };

  // PayPal donation handler
  const handlePayPalDonation = (amount: string, isMonthly: boolean) => {
    // Get the selected amount or use the default
    const donationAmount = amount || selectedAmount.current || "20";
    
    // For personal PayPal account, PayPal.me is the simplest approach
    // Replace "YourPayPalUsername" with your actual PayPal username
    const paypalUsername = "MBarzola9";
    window.open(`https://www.paypal.me/${paypalUsername}/${donationAmount}`, '_blank');
    
    // For monthly donations, inform users to set it up manually
    if (isMonthly) {
      alert("For monthly support, please consider setting up a recurring payment directly in PayPal after completing your donation. Thank you for your continued support!");
    }
  };

  // Handle donation tier selection
  const selectDonationTier = (amount: string) => {
    // Update the ref with selected amount
    selectedAmount.current = amount;
    
    // Update the UI - remove active class from all tiers
    document.querySelectorAll('.donation-tier').forEach(el => {
      el.classList.remove('active');
    });
    
    // Add active class to the selected tier
    if (amount !== "other") {
      document.querySelector(`.donation-tier[data-amount="${amount}"]`)?.classList.add('active');
    } else {
      // For "Other" option, we'll keep it active but prompt for amount
      document.querySelector(`.donation-tier[data-amount="other"]`)?.classList.add('active');
    }
  };

  // Sharing functionality
  const shareApp = (platform: string) => {
    const url = window.location.origin;
    const text = "I discovered an amazing app for memorizing Bible verses! It's helping me store the Word in my heart ✨";
    
    let shareUrl = "";
    
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=App for memorizing Bible verses&body=${encodeURIComponent(text + "\n\n" + url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="support-page">
      <div className="support-container">
        <h1 className="support-title">Support this ministry</h1>
        
        {/* Developer personal message - enhanced with pulse effect */}
        <div className="developer-message">
          <div className="dev-photo-wrapper">
            <div className="dev-photo">
              <i className="bi bi-person-circle"></i>
            </div>
            <div className="dev-photo-pulse"></div>
          </div>
          
          <div className="message-content">
            <h3>Hello! I'm the creator of Lamp to my feet</h3>
            <p>
            As an independent developer, I created this tool to make Bible memorization accessible and effective for all believers. This project was born from my own struggle to memorize Scripture and has grown thanks to the support of people like you.
            </p>
            <p className="dev-personal-note">
              <i className="bi bi-quote"></i> Every testimony of spiritual growth through this app reminds me why I dedicate my time and resources to this ministry.
              <i className="bi bi-quote"></i>
            </p>
            <p>
            Has Lamp to my feet helped you engrave God's Word in your heart? Your support allows this tool to continue equipping God's people with Scripture as spiritual armor for daily battles.
            </p>
            <button className="video-btn pulse-btn" onClick={() => setShowVideo(true)}>
              <i className="bi bi-play-circle-fill"></i> My story in video
            </button>
          </div>
        </div>
        
        {/* Why support is needed - more visual with progress bars */}
        <div className="support-why">
          <h2>Why is your support important?</h2>
          <p className="support-intro">
            As an independent developer, I maintain this app with limited resources. 
            Your support makes it possible for this digital ministry to continue growing.
          </p>
          
          <div className="expense-cards">
            <div className="expense-card">
              <div className="expense-icon">
                <i className="bi bi-server"></i>
              </div>
              <h4>Hosting and Database</h4>
              <div className="expense-details">
                <div className="expense-progress-container">
                  <div className="expense-progress-label">
                    <span>Monthly cost</span>
                    <span>Covered: 65%</span>
                  </div>
                  <div className="expense-progress-bar">
                    <div className="expense-progress-fill" style={{width: "65%"}}></div>
                  </div>
                </div>
                <p>Reliable data storage and servers are essential to keep the app running without interruptions.</p>
              </div>
            </div>
            
            <div className="expense-card">
              <div className="expense-icon">
                <i className="bi bi-translate"></i>
              </div>
              <h4>Spanish Translation</h4>
              <div className="expense-details">
                <div className="expense-progress-container">
                  <div className="expense-progress-label">
                    <span>Project in progress</span>
                    <span>Completed: 40%</span>
                  </div>
                  <div className="expense-progress-bar">
                    <div className="expense-progress-fill" style={{width: "40%"}}></div>
                  </div>
                </div>
                <p>My priority is to make the app accessible to the Hispanic community, starting with a complete translation.</p>
              </div>
            </div>
            
            <div className="expense-card">
              <div className="expense-icon">
                <i className="bi bi-phone"></i>
              </div>
              <h4>Native Mobile App</h4>
              <div className="expense-details">
                <div className="expense-progress-container">
                  <div className="expense-progress-label">
                    <span>Future project</span>
                    <span>Funds: 25%</span>
                  </div>
                  <div className="expense-progress-bar">
                    <div className="expense-progress-fill" style={{width: "25%"}}></div>
                  </div>
                </div>
                <p>A native app for Android and iOS will allow memorizing verses anytime, anywhere, even offline.</p>
              </div>
            </div>
            
            <div className="expense-card">
              <div className="expense-icon">
                <i className="bi bi-clock-history"></i>
              </div>
              <h4>Development Time</h4>
              <div className="expense-details">
                <div className="expense-time-info">
                  <div className="time-metric">
                    <span className="time-number">15+</span>
                    <span className="time-label">hours weekly</span>
                  </div>
                  <div className="time-metric">
                    <span className="time-number">60+</span>
                    <span className="time-label">hours monthly</span>
                  </div>
                </div>
                <p>Your support allows me to dedicate more time to improving the app, adding new features, and keeping everything running smoothly.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Ways to support - now with interactive elements */}
        <div className="ways-to-support">
          <h2>How can you help?</h2>
          
          <div className="support-options">
            <div className="support-option donate-option">
              <div className="support-icon">
                <i className="bi bi-heart-fill"></i>
              </div>
              <div className="ribbon">Greatest impact</div>
              <h3>Support Us Financially</h3>
              <p>
                Your contribution, however small, helps keep this ministry alive. 
                The monthly option allows for more stable planning.
              </p>
              <div className="donation-container">
                <div className="donation-tiers">
                  <button 
                    className="donation-tier" 
                    data-amount="5"
                    onClick={() => selectDonationTier("5")}
                  >$5</button>
                  <button 
                    className="donation-tier" 
                    data-amount="10"
                    onClick={() => selectDonationTier("10")}
                  >$10</button>
                  <button 
                    className="donation-tier active" 
                    data-amount="20"
                    onClick={() => selectDonationTier("20")}
                  >$20</button>
                  <button 
                    className="donation-tier" 
                    data-amount="50"
                    onClick={() => selectDonationTier("50")}
                  >$50</button>
                  <button 
                    className="donation-tier" 
                    data-amount="other"
                    onClick={() => {
                      const amount = prompt("Enter donation amount:", "20");
                      if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
                        selectedAmount.current = amount;
                        selectDonationTier("other");
                      }
                    }}
                  >Other</button>
                </div>
                <div className="donation-buttons">
                  <button 
                    className="support-btn"
                    onClick={() => handlePayPalDonation(selectedAmount.current, false)}
                  >One-time donation</button>
                  <button 
                    className="support-btn support-btn-secondary"
                    onClick={() => handlePayPalDonation(selectedAmount.current, true)}
                  >Monthly support</button>
                </div>
                <div className="legal-links">
                  <p>
                    By making a donation, you accept our <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="support-option share-option">
              <div className="support-icon">
                <i className="bi bi-share-fill"></i>
              </div>
              <h3>Share the App</h3>
              <p>
                Has this app helped you memorize Scripture? Share it with friends, family, and church! 
                This simple action can have a big impact on the lives of other believers.
              </p>
              <div className="share-message">
                <p>"I found an amazing app for memorizing Bible verses. You should try it!"</p>
                <div className="share-copy-btn" onClick={() => {
                  navigator.clipboard.writeText("I found an amazing app for memorizing Bible verses: " + window.location.origin);
                  alert("Message copied to clipboard!");
                }}>
                  <i className="bi bi-clipboard"></i> Copy
                </div>
              </div>
              <div className="share-buttons">
                <button className="share-btn facebook" onClick={() => shareApp('facebook')}>
                  <i className="bi bi-facebook"></i>
                </button>
                <button className="share-btn twitter" onClick={() => shareApp('twitter')}>
                  <i className="bi bi-twitter"></i>
                </button>
                <button className="share-btn whatsapp" onClick={() => shareApp('whatsapp')}>
                  <i className="bi bi-whatsapp"></i>
                </button>
                <button className="share-btn email" onClick={() => shareApp('email')}>
                  <i className="bi bi-envelope"></i>
                </button>
              </div>
            </div>
            
            <div className="support-option pray-option">
              <div className="support-icon">
                <i className="bi bi-chat-heart-fill"></i>
              </div>
              <h3>Pray and Share Your Testimony</h3>
              <p>
                Your prayers for this ministry are invaluable. I also invite you to share 
                how the app has impacted your spiritual life.
              </p>
              <div className="testimonial-form">
                <textarea 
                  placeholder="Share how this app has impacted your spiritual life..." 
                  rows={3}
                  value={formData.message}
                  onChange={handleInputChange}
                  name="message"
                ></textarea>
                <button className="support-btn testimonial-btn">Send testimony</button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Rest of the existing component remains the same */}
        {/* Impact slider - user testimonials with auto rotation */}
        <div className="impact-section">
          <h2>Community Impact</h2>
          
          <div className="impact-metrics">
            <div className="impact-metric">
              <div className="metric-number">12,500+</div>
              <div className="metric-label">Verses memorized</div>
            </div>
            <div className="impact-metric">
              <div className="metric-number">3,200+</div>
              <div className="metric-label">Active users</div>
            </div>
            <div className="impact-metric">
              <div className="metric-number">18+</div>
              <div className="metric-label">Countries reached</div>
            </div>
          </div>
          
          <div className="testimonial-carousel">
            <div className="testimonial-slides" style={{transform: `translateX(-${activeTestimonial * 100}%)`}}>
              {testimonials.map((testimonial, index) => (
                <div className="testimonial-slide" key={index}>
                  <div className="testimonial-card">
                    <div className="testimonial-content">
                      <div className="testimonial-quote">
                        <i className="bi bi-quote"></i>
                      </div>
                      <p>{testimonial.text}</p>
                      <div className="testimonial-author-info">
                        <div className="testimonial-author-avatar">
                          {testimonial.author.charAt(0)}
                        </div>
                        <div className="testimonial-author-details">
                          <span className="testimonial-author-name">{testimonial.author}</span>
                          <span className="testimonial-author-location">
                            <i className="bi bi-geo-alt-fill"></i> {testimonial.country}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="testimonial-controls">
              {testimonials.map((_, index) => (
                <button 
                  key={index} 
                  className={`testimonial-dot ${index === activeTestimonial ? 'active' : ''}`}
                  onClick={() => setActiveTestimonial(index)}
                ></button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Thank you section at the end */}
        <div className="thank-you-section">
          <div className="thank-you-icon">
            <i className="bi bi-heart-fill"></i>
          </div>
          <h2>Thank You!</h2>
          <p>
            Your support, prayers, and encouragement mean a lot. Together we can bring 
            God's Word to more hearts and lives.
          </p>
          <div className="scripture-sign">
            <p>"The grass withers and the flower falls, but the word of the Lord remains forever."</p>
            <span>- 1 Peter 1:24-25</span>
          </div>
        </div>
      </div>
      
      {/* Video Modal - more engaging */}
      {showVideo && (
        <div className="video-modal" onClick={() => setShowVideo(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>The Story behind Lamp to my feet</h3>
              <button className="close-btn" onClick={() => setShowVideo(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="video-container">
              {isVideoLoaded ? null : (
                <div className="video-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading video...</p>
                </div>
              )}
              <div className={`video-player ${isVideoLoaded ? 'loaded' : ''}`}>
                {/* Replace with actual video embed when available */}
                <div className="video-placeholder">
                  <div className="play-icon">
                    <i className="bi bi-play-circle"></i>
                  </div>
                  <p>Video will be available soon</p>
                  <button className="video-placeholder-btn" onClick={() => setShowVideo(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportPage;