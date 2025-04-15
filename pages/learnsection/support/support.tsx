import React, { useState, useEffect } from "react";
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

  // Testimonial data
  const testimonials = [
    {
      text: "Esta app cambió mi relación con la Palabra. Después de años intentando memorizar versículos sin éxito, finalmente puedo recordarlos cuando más los necesito. Es como llevar un tesoro en mi corazón.",
      author: "María S.",
      country: "México"
    },
    {
      text: "Como pastor, recomiendo esta herramienta a toda mi congregación. El método paso a paso es brillante y he visto cómo ha transformado la vida espiritual de muchos en nuestra iglesia.",
      author: "Pastor David L.",
      country: "Colombia"
    },
    {
      text: "Soy maestra de escuela dominical y esta app ha revolucionado cómo enseño la Palabra a mis alumnos. ¡Ahora los niños memorizan con entusiasmo y compiten por quién aprende más versículos!",
      author: "Carolina P.",
      country: "España"
    },
    {
      text: "Todos los días en el tren uso la app para memorizar un nuevo versículo. Este hábito ha sido un ancla espiritual en tiempos difíciles. Agradezco de corazón el trabajo del desarrollador.",
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

  // Sharing functionality
  const shareApp = (platform: string) => {
    const url = window.location.origin;
    const text = "¡Descubrí una increíble app para memorizar versículos bíblicos! Me está ayudando a guardar la Palabra en mi corazón ✨";
    
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
        shareUrl = `mailto:?subject=App para memorizar versículos bíblicos&body=${encodeURIComponent(text + "\n\n" + url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="support-page">
      <div className="support-container">
        <h1 className="support-title">Apoya este ministerio</h1>
        
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
              <i className="bi bi-play-circle-fill"></i> Mi historia en video
            </button>
          </div>
        </div>
        
        {/* Why support is needed - more visual with progress bars */}
        <div className="support-why">
          <h2>¿Por qué tu apoyo es importante?</h2>
          <p className="support-intro">
            Como desarrollador independiente, mantengo esta app con recursos limitados. 
            Tu apoyo hace posible que este ministerio digital siga creciendo.
          </p>
          
          <div className="expense-cards">
            <div className="expense-card">
              <div className="expense-icon">
                <i className="bi bi-server"></i>
              </div>
              <h4>Hosting y Base de Datos</h4>
              <div className="expense-details">
                <div className="expense-progress-container">
                  <div className="expense-progress-label">
                    <span>Costo mensual</span>
                    <span>Cubierto: 65%</span>
                  </div>
                  <div className="expense-progress-bar">
                    <div className="expense-progress-fill" style={{width: "65%"}}></div>
                  </div>
                </div>
                <p>El almacenamiento de datos y servidores confiables son esenciales para mantener la app funcionando sin interrupciones.</p>
              </div>
            </div>
            
            <div className="expense-card">
              <div className="expense-icon">
                <i className="bi bi-translate"></i>
              </div>
              <h4>Traducción al Español</h4>
              <div className="expense-details">
                <div className="expense-progress-container">
                  <div className="expense-progress-label">
                    <span>Proyecto en progreso</span>
                    <span>Completado: 40%</span>
                  </div>
                  <div className="expense-progress-bar">
                    <div className="expense-progress-fill" style={{width: "40%"}}></div>
                  </div>
                </div>
                <p>Mi prioridad es hacer que la app sea accesible para la comunidad hispana, comenzando con una traducción completa.</p>
              </div>
            </div>
            
            <div className="expense-card">
              <div className="expense-icon">
                <i className="bi bi-phone"></i>
              </div>
              <h4>App Móvil Nativa</h4>
              <div className="expense-details">
                <div className="expense-progress-container">
                  <div className="expense-progress-label">
                    <span>Proyecto futuro</span>
                    <span>Fondos: 25%</span>
                  </div>
                  <div className="expense-progress-bar">
                    <div className="expense-progress-fill" style={{width: "25%"}}></div>
                  </div>
                </div>
                <p>Una app nativa para Android e iOS permitirá memorizar versículos en cualquier momento y lugar, incluso sin conexión.</p>
              </div>
            </div>
            
            <div className="expense-card">
              <div className="expense-icon">
                <i className="bi bi-clock-history"></i>
              </div>
              <h4>Tiempo de Desarrollo</h4>
              <div className="expense-details">
                <div className="expense-time-info">
                  <div className="time-metric">
                    <span className="time-number">15+</span>
                    <span className="time-label">horas semanales</span>
                  </div>
                  <div className="time-metric">
                    <span className="time-number">60+</span>
                    <span className="time-label">horas mensuales</span>
                  </div>
                </div>
                <p>Tu apoyo me permite dedicar más tiempo a mejorar la app, añadir nuevas funciones y mantener todo funcionando sin problemas.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Ways to support - now with interactive elements */}
        <div className="ways-to-support">
          <h2>¿Cómo puedes ayudar?</h2>
          
          <div className="support-options">
            <div className="support-option donate-option">
              <div className="support-icon">
                <i className="bi bi-heart-fill"></i>
              </div>
              <div className="ribbon">Mayor impacto</div>
              <h3>Apóyanos Económicamente</h3>
              <p>
                Tu contribución, por pequeña que sea, ayuda a mantener vivo este ministerio. 
                La opción mensual permite una planificación más estable.
              </p>
              <div className="donation-container">
                <div className="donation-tiers">
                  <button className="donation-tier">$5</button>
                  <button className="donation-tier">$10</button>
                  <button className="donation-tier active">$20</button>
                  <button className="donation-tier">$50</button>
                  <button className="donation-tier">Otro</button>
                </div>
                <div className="donation-buttons">
                  <button className="support-btn">Donación única</button>
                  <button className="support-btn support-btn-secondary">Apoyo mensual</button>
                </div>
              </div>
            </div>
            
            <div className="support-option share-option">
              <div className="support-icon">
                <i className="bi bi-share-fill"></i>
              </div>
              <h3>Comparte la App</h3>
              <p>
                ¿Te ha ayudado esta app a memorizar Escrituras? ¡Compártela con amigos, familia e iglesia! 
                Esta simple acción puede tener un gran impacto en la vida de otros creyentes.
              </p>
              <div className="share-message">
                <p>"He encontrado una app increíble para memorizar versículos bíblicos. ¡Deberías probarla!"</p>
                <div className="share-copy-btn" onClick={() => {
                  navigator.clipboard.writeText("He encontrado una app increíble para memorizar versículos bíblicos: " + window.location.origin);
                  alert("¡Mensaje copiado al portapapeles!");
                }}>
                  <i className="bi bi-clipboard"></i> Copiar
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
              <h3>Ora y Comparte tu Testimonio</h3>
              <p>
                Tus oraciones por este ministerio son invaluables. También te invito a compartir 
                cómo la app ha impactado tu vida espiritual.
              </p>
              <div className="testimonial-form">
                <textarea 
                  placeholder="Comparte cómo ha impactado esta app tu vida espiritual..." 
                  rows={3}
                  value={formData.message}
                  onChange={handleInputChange}
                  name="message"
                ></textarea>
                <button className="support-btn testimonial-btn">Enviar testimonio</button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Impact slider - user testimonials with auto rotation */}
        <div className="impact-section">
          <h2>Impacto en la Comunidad</h2>
          
          <div className="impact-metrics">
            <div className="impact-metric">
              <div className="metric-number">12,500+</div>
              <div className="metric-label">Versículos memorizados</div>
            </div>
            <div className="impact-metric">
              <div className="metric-number">3,200+</div>
              <div className="metric-label">Usuarios activos</div>
            </div>
            <div className="impact-metric">
              <div className="metric-number">18+</div>
              <div className="metric-label">Países alcanzados</div>
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
        
        {/* Vision roadmap - more visually engaging */}
        <div className="vision-section">
          <h2>Visión de Futuro</h2>
          <p className="vision-intro">Con tu apoyo, este es el camino que estamos recorriendo:</p>
          
          <div className="roadmap-container">
            <div className="roadmap-timeline"></div>
            
            <div className="roadmap-item">
              <div className="roadmap-point current">
                <div className="roadmap-point-inner"></div>
              </div>
              <div className="roadmap-content">
                <div className="roadmap-icon">
                  <i className="bi bi-translate"></i>
                </div>
                <h3>Traducción al Español</h3>
                <p>Hacer la app completamente accesible para la comunidad hispana</p>
                <div className="roadmap-status">
                  <div className="status-label">En progreso</div>
                  <div className="status-bar">
                    <div className="status-fill" style={{width: "40%"}}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="roadmap-item">
              <div className="roadmap-point">
                <div className="roadmap-point-inner"></div>
              </div>
              <div className="roadmap-content">
                <div className="roadmap-icon">
                  <i className="bi bi-phone"></i>
                </div>
                <h3>Aplicaciones Móviles Nativas</h3>
                <p>Desarrollar apps dedicadas para iOS y Android con soporte offline</p>
                <div className="roadmap-status">
                  <div className="status-label">Próximamente</div>
                </div>
              </div>
            </div>
            
            <div className="roadmap-item">
              <div className="roadmap-point">
                <div className="roadmap-point-inner"></div>
              </div>
              <div className="roadmap-content">
                <div className="roadmap-icon">
                  <i className="bi bi-people"></i>
                </div>
                <h3>Funciones Grupales</h3>
                <p>Herramientas para iglesias y grupos pequeños para memorizar juntos</p>
                <div className="roadmap-status">
                  <div className="status-label">Planificado</div>
                </div>
              </div>
            </div>
            
            <div className="roadmap-item">
              <div className="roadmap-point">
                <div className="roadmap-point-inner"></div>
              </div>
              <div className="roadmap-content">
                <div className="roadmap-icon">
                  <i className="bi bi-globe2"></i>
                </div>
                <h3>Más Idiomas</h3>
                <p>Expandir a otros idiomas para alcanzar a creyentes en todo el mundo</p>
                <div className="roadmap-status">
                  <div className="status-label">Visión Futura</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact form - with interactive elements */}
        <div className="support-contact">
          <h2>Hablemos</h2>
          <p className="contact-intro">
            ¿Tienes preguntas sobre cómo apoyar este ministerio o sugerencias para mejorarlo? 
            Me encantaría escucharte.
          </p>
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className={`form-group ${formData.name ? 'has-value' : ''}`}>
              <label htmlFor="name">Nombre</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Tu nombre" 
              />
            </div>
            
            <div className={`form-group ${formData.email ? 'has-value' : ''}`}>
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Tu email" 
              />
            </div>
            
            <div className={`form-group ${formData.message ? 'has-value' : ''}`}>
              <label htmlFor="message">Mensaje</label>
              <textarea 
                id="message" 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tu mensaje" 
                rows={4}
              ></textarea>
            </div>
            
            <button type="submit" className="contact-submit">
              <span>Enviar Mensaje</span>
              <i className="bi bi-send"></i>
            </button>
            
            {thankYouVisible && (
              <div className="form-thank-you">
                <i className="bi bi-check-circle"></i>
                <p>¡Gracias por tu mensaje! Te responderé lo antes posible.</p>
              </div>
            )}
          </form>
        </div>
        
        {/* Thank you section - more heartfelt */}
        <div className="thank-you-section">
          <div className="thank-you-icon">
            <i className="bi bi-heart-fill"></i>
          </div>
          <h2>¡Gracias!</h2>
          <p>
            Tu apoyo, oraciones y ánimo significan mucho. Juntos podemos llevar la 
            Palabra de Dios a más corazones y vidas.
          </p>
          <div className="scripture-sign">
            <p>"La hierba se seca y la flor se cae, pero la palabra del Señor permanece para siempre."</p>
            <span>- 1 Pedro 1:24-25</span>
          </div>
        </div>
      </div>
      
      {/* Video Modal - more engaging */}
      {showVideo && (
        <div className="video-modal" onClick={() => setShowVideo(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>La Historia detrás de Lamp to my feet</h3>
              <button className="close-btn" onClick={() => setShowVideo(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="video-container">
              {isVideoLoaded ? null : (
                <div className="video-loading">
                  <div className="loading-spinner"></div>
                  <p>Cargando video...</p>
                </div>
              )}
              <div className={`video-player ${isVideoLoaded ? 'loaded' : ''}`}>
                {/* Replace with actual video embed when available */}
                <div className="video-placeholder">
                  <div className="play-icon">
                    <i className="bi bi-play-circle"></i>
                  </div>
                  <p>El video estará disponible pronto</p>
                  <button className="video-placeholder-btn" onClick={() => setShowVideo(false)}>
                    Cerrar
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