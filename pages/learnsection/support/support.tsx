import React, { useState, useEffect, useRef } from "react";

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
      text: "THIS IS A DRAFT This app changed my relationship with the Word. After years of trying to memorize verses without success, I can finally remember them when I need them most. It's like carrying a treasure in my heart.",
      author: "María S.",
      country: "Mexico"
    },
    {
      text: "THIS IS A DRAFT As a pastor, I recommend this tool to my entire congregation. The step-by-step method is brilliant and I've seen how it has transformed the spiritual life of many in our church.",
      author: "Pastor David L.",
      country: "Colombia"
    },
    {
      text: "THIS IS A DRAFT I'm a Sunday school teacher and this app has revolutionized how I teach the Word to my students. Now the children memorize with enthusiasm and compete to see who learns more verses!",
      author: "Carolina P.",
      country: "Spain"
    },
    {
      text: "THIS IS A DRAFT Every day on the train I use the app to memorize a new verse. This habit has been a spiritual anchor in difficult times. I am deeply grateful for the developer's work.",
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

    const paypalUsername = "MBarzola9";
    window.open(`https://www.paypal.me/${paypalUsername}/${donationAmount}`, '_blank');

    if (isMonthly) {
      alert("For monthly support, please consider setting up a recurring payment directly in PayPal after completing your donation. Thank you for your continued support!");
    }
  };

  // Handle donation tier selection
  const selectDonationTier = (amount: string) => {
    selectedAmount.current = amount;
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
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white pt-24 pb-12 relative overflow-hidden">
      {/* Background decorative elements - matching homepage */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-gray-200/30 via-gray-300/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-gray-300/25 via-gray-200/15 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-amber-100/10 via-orange-100/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold text-[#2C3E50] text-center mb-12">
          Support this <span className="text-transparent bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text">ministry</span>
        </h1>

        {/* Developer personal message */}
        <div className="bg-gradient-to-br from-white/70 to-amber-50/40 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 mb-12 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-white text-5xl shadow-lg">
                <i className="bi bi-person-circle"></i>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-[#2C3E50] mb-3">Hello! I'm the creator of Lamp to my feet</h3>
              <p className="text-[#2C3E50]/80 text-lg leading-relaxed mb-3">
                As an independent developer, I created this tool to make Bible memorization accessible and effective for all believers. This project was born from my own struggle to memorize Scripture and has grown thanks to the support of people like you.
              </p>
              <p className="text-[#2C3E50]/70 italic bg-white/60 rounded-lg p-4 mb-3">
                <i className="bi bi-quote text-amber-600"></i> Every testimony of spiritual growth through this app reminds me why I dedicate my time and resources to this ministry. <i className="bi bi-quote text-amber-600"></i>
              </p>
              <p className="text-[#2C3E50]/80 text-lg leading-relaxed">
                Has Lamp to my feet helped you engrave God's Word in your heart? Your support allows this tool to continue equipping God's people with Scripture as spiritual armor for daily battles.
              </p>
            </div>
          </div>
        </div>

        {/* Why support is needed */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2C3E50] text-center mb-6">
            Why is your <span className="text-transparent bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text">support</span> important?
          </h2>
          <p className="text-[#2C3E50]/80 text-lg text-center max-w-3xl mx-auto mb-12 leading-relaxed">
            As an independent developer, I maintain this app with limited resources. Your support makes it possible for this digital ministry to continue growing.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-sm border border-amber-100/50 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white text-3xl w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <i className="bi bi-server"></i>
              </div>
              <h4 className="text-xl font-bold text-[#2C3E50] text-center mb-3">Hosting and Database</h4>
              <div className="bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full" style={{width: "65%"}}></div>
              </div>
              <p className="text-sm text-[#2C3E50]/70 mb-2">Monthly cost</p>
              <p className="text-[#2C3E50]/80 leading-relaxed">Reliable data storage and servers are essential to keep the app running without interruptions.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-amber-100/50 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white text-3xl w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <i className="bi bi-translate"></i>
              </div>
              <h4 className="text-xl font-bold text-[#2C3E50] text-center mb-3">Spanish Translation</h4>
              <div className="bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full" style={{width: "40%"}}></div>
              </div>
              <p className="text-sm text-[#2C3E50]/70 mb-2">Project in progress</p>
              <p className="text-[#2C3E50]/80 leading-relaxed">My priority is to make the app accessible to the Hispanic community, starting with a complete translation.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-amber-100/50 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white text-3xl w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <i className="bi bi-phone"></i>
              </div>
              <h4 className="text-xl font-bold text-[#2C3E50] text-center mb-3">Native Mobile App</h4>
              <div className="bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full" style={{width: "25%"}}></div>
              </div>
              <p className="text-sm text-[#2C3E50]/70 mb-2">Future project</p>
              <p className="text-[#2C3E50]/80 leading-relaxed">A native app for Android and iOS will allow memorizing verses anytime, anywhere, even offline.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-amber-100/50 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white text-3xl w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <i className="bi bi-clock-history"></i>
              </div>
              <h4 className="text-xl font-bold text-[#2C3E50] text-center mb-3">Development Time</h4>
              <div className="flex justify-around mb-3">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">15+</div>
                  <div className="text-sm text-[#2C3E50]/70">hours weekly</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">60+</div>
                  <div className="text-sm text-[#2C3E50]/70">hours monthly</div>
                </div>
              </div>
              <p className="text-[#2C3E50]/80 leading-relaxed">Your support allows me to dedicate more time to improving the app, adding new features, and keeping everything running smoothly.</p>
            </div>
          </div>
        </div>

        {/* Ways to support */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2C3E50] text-center mb-12">
            How can you <span className="text-transparent bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text">help?</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Donate Option */}
            <div className="relative bg-white/80 backdrop-blur-sm border border-amber-100/50 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 flex flex-col">
              <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full transform rotate-12">
                Greatest impact
              </div>
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600 text-4xl w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <i className="bi bi-heart-fill"></i>
              </div>
              <h3 className="text-2xl font-bold text-[#2C3E50] text-center mb-4">Support Us Financially</h3>
              <p className="text-[#2C3E50]/80 text-center mb-6 leading-relaxed flex-grow">
                Your contribution, however small, helps keep this ministry alive. The monthly option allows for more stable planning.
              </p>
              <div className="space-y-4">
                <div className="flex flex-wrap justify-center gap-2">
                  {['5', '10', '20', '50'].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => selectDonationTier(amount)}
                      className={`w-14 h-14 rounded-xl font-bold text-lg transition-all duration-200 ${
                        selectedAmount.current === amount
                          ? 'bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-amber-500 text-[#2C3E50] scale-110'
                          : 'bg-gray-100 border-2 border-transparent text-[#2C3E50]/70 hover:border-amber-300 hover:bg-white'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      const amount = prompt("Enter donation amount:", "20");
                      if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
                        selectedAmount.current = amount;
                      }
                    }}
                    className="w-14 h-14 rounded-xl font-bold text-lg bg-gray-100 border-2 border-transparent text-[#2C3E50]/70 hover:border-amber-300 hover:bg-white transition-all duration-200"
                  >
                    Other
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handlePayPalDonation(selectedAmount.current, false)}
                    className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    One-time donation
                  </button>
                  <button
                    onClick={() => handlePayPalDonation(selectedAmount.current, true)}
                    className="w-full bg-white border-2 border-[#2C3E50] text-[#2C3E50] font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 hover:scale-105 transition-all duration-300"
                  >
                    Monthly support
                  </button>
                </div>
              </div>
            </div>

            {/* Share Option */}
            <div className="bg-white/80 backdrop-blur-sm border border-amber-100/50 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 flex flex-col">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 text-4xl w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <i className="bi bi-share-fill"></i>
              </div>
              <h3 className="text-2xl font-bold text-[#2C3E50] text-center mb-4">Share the App</h3>
              <p className="text-[#2C3E50]/80 text-center mb-6 leading-relaxed flex-grow">
                Has this app helped you memorize Scripture? Share it with friends, family, and church! This simple action can have a big impact on the lives of other believers.
              </p>
              <div className="space-y-4">
                <div className="bg-gray-100 rounded-lg p-4 text-sm italic text-[#2C3E50]/80 border-b-2 border-dashed border-gray-300">
                  "I found an amazing app for memorizing Bible verses. You should try it!"
                </div>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => shareApp('facebook')}
                    className="w-12 h-12 bg-[#3b5998] hover:bg-[#2d4373] text-white rounded-full flex items-center justify-center text-xl shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300"
                  >
                    <i className="bi bi-facebook"></i>
                  </button>
                  <button
                    onClick={() => shareApp('twitter')}
                    className="w-12 h-12 bg-[#1da1f2] hover:bg-[#1a8cd8] text-white rounded-full flex items-center justify-center text-xl shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300"
                  >
                    <i className="bi bi-twitter"></i>
                  </button>
                  <button
                    onClick={() => shareApp('whatsapp')}
                    className="w-12 h-12 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full flex items-center justify-center text-xl shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300"
                  >
                    <i className="bi bi-whatsapp"></i>
                  </button>
                  <button
                    onClick={() => shareApp('email')}
                    className="w-12 h-12 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center text-xl shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300"
                  >
                    <i className="bi bi-envelope"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Pray Option */}
            <div className="bg-white/80 backdrop-blur-sm border border-amber-100/50 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 flex flex-col">
              <div className="bg-gradient-to-br from-green-100 to-green-200 text-green-600 text-4xl w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <i className="bi bi-chat-heart-fill"></i>
              </div>
              <h3 className="text-2xl font-bold text-[#2C3E50] text-center mb-4">Pray and Share Your Testimony</h3>
              <p className="text-[#2C3E50]/80 text-center mb-6 leading-relaxed flex-grow">
                Your prayers for this ministry are invaluable. I also invite you to share how the app has impacted your spiritual life.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => {
                    const mailtoLink = `mailto:marcosbarzola@devbymarcos.com?subject=My Testimony for Lamp to my feet&body=${encodeURIComponent(formData.message)}`;
                    window.open(mailtoLink, '_blank');
                  }}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Send testimony
                </button>
                <p className="text-xs text-center text-[#2C3E50]/60">
                  Send your testimony directly to: <a href="mailto:marcosbarzola@devbymarcos.com" className="text-green-600 hover:underline font-semibold">marcosbarzola@devbymarcos.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Impact section */}
        <div className="bg-gradient-to-br from-amber-50/30 via-orange-50/20 to-yellow-50/30 rounded-2xl p-12 mb-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-yellow-200/20 to-amber-200/20 rounded-full blur-xl"></div>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#2C3E50] text-center mb-12 relative z-10">
            Community <span className="text-transparent bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text">Impact</span>
          </h2>

          <div className="flex flex-wrap justify-around gap-8 mb-12 relative z-10">
            <div className="text-center">
              <div className="text-5xl font-bold text-[#2C3E50] mb-2">7+</div>
              <div className="text-lg text-[#2C3E50]/70">Verses memorized</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#2C3E50] mb-2">3+</div>
              <div className="text-lg text-[#2C3E50]/70">Active users</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#2C3E50] mb-2">2+</div>
              <div className="text-lg text-[#2C3E50]/70">Countries reached</div>
            </div>
          </div>

          {/* Testimonial Carousel */}
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
              <div className="flex transition-transform duration-500 ease-out" style={{transform: `translateX(-${activeTestimonial * 100}%)`}}>
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="min-w-full p-8">
                    <div className="text-4xl text-amber-600/20 mb-4">
                      <i className="bi bi-quote"></i>
                    </div>
                    <p className="text-lg text-[#2C3E50]/90 italic mb-6 leading-relaxed">{testimonial.text}</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-[#2C3E50]">{testimonial.author}</div>
                        <div className="text-sm text-[#2C3E50]/60 flex items-center gap-1">
                          <i className="bi bi-geo-alt-fill"></i> {testimonial.country}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial ? 'bg-amber-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                ></button>
              ))}
            </div>
          </div>
        </div>

        {/* Thank you section */}
        <div className="relative bg-white/80 backdrop-blur-sm border border-amber-100/50 rounded-2xl p-12 text-center shadow-lg">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">
            <i className="bi bi-heart-fill"></i>
          </div>
          <h2 className="text-3xl font-bold text-[#2C3E50] mb-4 mt-4">Thank You!</h2>
          <p className="text-lg text-[#2C3E50]/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Your support, prayers, and encouragement mean a lot. Together we can bring God's Word to more hearts and lives.
          </p>
          <div className="max-w-xl mx-auto italic text-[#2C3E50]/80">
            <p className="text-lg mb-2">"The grass withers and the flower falls, but the word of the Lord remains forever."</p>
            <span className="text-amber-600 font-semibold">- 1 Peter 1:24-25</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
