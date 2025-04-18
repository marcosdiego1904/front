import React, { useState } from "react";
import "./constStyle.css";

// Definiciones de tipos
interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

interface SectionHeaderProps {
  title: string;
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

interface TimelineItemProps {
  title: string;
  children: React.ReactNode;
}

interface BenefitProps {
  title: string;
  children: React.ReactNode;
}

interface FutureFeatureProps {
  icon: React.ReactNode;
  children: React.ReactNode;
}

interface TestimonialProps {
  quote: string;
  initials: string;
  name: string;
  title: string;
}

interface ExpandableTextProps {
  previewText: string;
  fullText: string;
}

// Componente para texto expandible
const ExpandableText: React.FC<ExpandableTextProps> = ({ previewText, fullText }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="expandable-text">
      <p>{expanded ? fullText : previewText}</p>
      <button 
        className="expandable-button" 
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Read less" : "Read more..."}
      </button>
    </div>
  );
};

// Componente reutilizable para secciones
const Section: React.FC<SectionProps> = ({ id, className = "", children }) => (
  <section id={id} className={`about-section ${className}`}>
    <div className="about-section-content">
      {children}
    </div>
  </section>
);

// Componente para encabezados de sección
const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
  <h2>{title}</h2>
);

// Componente para tarjetas de características
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, children }) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{children}</p>
  </div>
);

// Componente para elementos de la línea de tiempo
const TimelineItem: React.FC<TimelineItemProps> = ({ title, children }) => (
  <div className="timeline-item">
    <div className="timeline-point"></div>
    <div className="timeline-content">
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  </div>
);

// Componente para beneficios
const Benefit: React.FC<BenefitProps> = ({ title, children }) => (
  <div className="benefit">
    <h3>{title}</h3>
    <p>{children}</p>
  </div>
);

// Componente para características futuras
const FutureFeature: React.FC<FutureFeatureProps> = ({ icon, children }) => (
  <div className="future-feature">
    <div className="future-icon">{icon}</div>
    <p>{children}</p>
  </div>
);

// Componente para testimonios
const Testimonial: React.FC<TestimonialProps> = ({ quote, initials, name, title }) => (
  <div className="testimonial">
    <div className="testimonial-content">
      <p>"{quote}"</p>
    </div>
    <div className="testimonial-author">
      <div className="testimonial-avatar">
        <span>{initials}</span>
      </div>
      <div className="testimonial-info">
        <h4>{name}</h4>
        <p>{title}</p>
      </div>
    </div>
  </div>
);

const AboutPage: React.FC = () => {
  // Texto del "video" - primera parte visible y texto completo
  const videoPreviewText = "Hello! I'm so glad you're watching this video. If you're here, you've probably already taken the wonderful step of memorizing your first verse with Lamp to my feet, and that... that really excites me.";
  
  const videoFullText = `Hello! I'm so glad you're watching this video. If you're here, you've probably already taken the wonderful step of memorizing your first verse with Lamp to my feet, and that... that really excites me. You know, I've been reflecting on something that used to happen to me constantly. I would read my Bible, I understood how important it was, but in those challenging moments of life, when I needed most to remember what God says... I simply couldn't recall the exact verse, or I remembered it only partially.

And that's why I created Lamp to my feet. I wanted to help all of us equip ourselves with the most powerful spiritual tool there is: God's Word engraved in our hearts and minds.
Psalm 119:11 tells us that we store His word in our hearts so that we might not sin against Him. And verse 105 reminds us that His word is a lamp to our feet and a light to our path. These promises are real, but to experience them, we need to memorize Scripture effectively.

That's why I've designed an app that uses scientifically proven methods to help you memorize verses in a way that truly stays with you. We go step by step, breaking verses into manageable fragments, using different learning approaches, and reinforcing memorization effectively.

And to make it even more exciting, I've created a growth system for your biblical journey. We all start as Saul—before his transformation—and as we memorize more verses, we advance in our journey until we reach the wisdom of Solomon.

Seeing you grow in your knowledge of the Word, seeing that light become brighter in your life... that's my greatest desire with this application.

Are you ready to continue this journey with me? To equip yourself with God's Word in a way that will truly transform your life? Let's keep memorizing together, verse by verse, illuminating our path with eternal truth.
Thank you for being part of the Lamp to my feet family. See you at the next level of your spiritual growth!`;

  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About Lamp to my feet</h1>
          <p className="about-tagline">
            Illuminating the path to Scripture memorization
          </p>
          <div className="about-lamp-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ffc107" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8,4 C8,2.895 8.895,2 10,2 L14,2 C15.105,2 16,2.895 16,4 L16,5 L8,5 L8,4 Z" fill="#ffc107"/>
              <path d="M9,5 L15,5 L15,10 C15,12.761 12.761,16 10,16 L9,5 Z" fill="#ffc107"/>
              <path d="M10,16 L14,16 C12.5,18.5 11.5,18.5 10,16 Z" fill="#ffc107"/>
              <path d="M11.5,16 L11.5,20" stroke="#ffc107" strokeWidth="2"/>
              <path d="M9,20 L14,20" stroke="#ffc107" strokeWidth="2"/>
              <path d="M8,5 C7,7 7,15 10,16" stroke="#ffc107" strokeWidth="0.5" strokeDasharray="1,1"/>
              <path d="M16,5 C17,7 17,15 14,16" stroke="#ffc107" strokeWidth="0.5" strokeDasharray="1,1"/>
            </svg>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <Section id="mission">
        <SectionHeader title="Our Mission" />
        <p>
          At <strong>Lamp to my feet</strong>, we're dedicated to making Bible verse 
          memorization accessible, effective, and enjoyable for everyone. Our name comes 
          from Psalm 119:105: <em>"Your word is a lamp to my feet and a light to my path"</em> — 
          representing how Scripture illuminates our daily journey.
        </p>
      </Section>

      {/* Message from Founder - Desplegable en lugar del video */}
      <Section id="message" className="about-message">
        <SectionHeader title="A Message from Our Founder" />
        <div className="founder-message">
          <div className="founder-intro">
            <div className="founder-icon">👋</div>
          </div>
          <ExpandableText 
            previewText={videoPreviewText} 
            fullText={videoFullText}
          />
        </div>
      </Section>

      {/* Features Section */}
      <Section id="features" className="about-features">
        <SectionHeader title="What We Offer" />
        <p>
          We've created a revolutionary platform that transforms the way you memorize Scripture 
          using scientifically-proven learning techniques:
        </p>
        <div className="features-grid">
          <FeatureCard icon="📋" title="Step-by-Step Breakdown">
            We divide verses into manageable fragments, making them easier to absorb and remember.
          </FeatureCard>
          
          <FeatureCard icon="🔄" title="Interactive Learning">
            Through reading aloud, filling in blanks, and writing from memory, we engage multiple cognitive processes.
          </FeatureCard>
          
          <FeatureCard icon="📈" title="Progress Tracking">
            Our system tracks your progress, encouraging you to continue building your Biblical knowledge.
          </FeatureCard>
          
          <FeatureCard icon="📚" title="Personal Verse Library">
            Save all your memorized verses in one place for easy review.
          </FeatureCard>
        </div>
      </Section>

      {/* Origin Story - Text version */}
      <Section id="inspiration" className="about-story">
        <SectionHeader title="The Inspiration Behind Lamp to my feet" />
        <p>
          The idea for Lamp to my feet was born from a personal challenge: the 
          struggle to consistently memorize Scripture despite knowing its immense value. 
          Traditional memorization methods often felt tedious and ineffective, leading 
          to frustration and abandonment.
        </p>
        <p>
          As someone who studied both technology and cognitive science, I realized that 
          memorization is most effective when it engages multiple sensory and cognitive 
          pathways. This insight inspired me to create a tool that would apply these 
          scientific principles to Scripture memorization.
        </p>
      </Section>

      {/* Development Journey */}
      <Section id="journey" className="about-journey">
        <SectionHeader title="Development Journey" />
        <p>
          Building Lamp to my feet wasn't without its challenges:
        </p>
        <div className="timeline">
          <TimelineItem title="Technical Complexity">
            Creating a system that effectively breaks down verses required sophisticated algorithms to handle various linguistic structures.
          </TimelineItem>
          
          <TimelineItem title="User Experience Design">
            Balancing educational effectiveness with an engaging, frustration-free experience demanded countless iterations.
          </TimelineItem>
          
          <TimelineItem title="Content Management">
            Ensuring accurate verse representation while providing helpful context required careful attention to detail.
          </TimelineItem>
        </div>
        <div className="tech-stack">
          <h3>Built With Modern Technologies</h3>
          <div className="tech-list">
            <span className="tech-item">React.js</span>
            <span className="tech-item">TypeScript</span>
            <span className="tech-item">Responsive Design</span>
            <span className="tech-item">User Authentication</span>
            <span className="tech-item">Gamification</span>
          </div>
        </div>
      </Section>

      {/* Why Memorize */}
      <Section id="why" className="about-why">
        <SectionHeader title="Why Memorize Scripture?" />
        <div className="benefits-container">
          <Benefit title="Spiritual Nourishment">
            Having God's Word in your heart provides guidance, comfort, and wisdom.
          </Benefit>
          
          <Benefit title="Mental Exercise">
            Memorization strengthens cognitive functions and neural pathways.
          </Benefit>
          
          <Benefit title="Life Application">
            Readily available Scripture influences daily decisions and conversations.
          </Benefit>
          
          <Benefit title="Community Connection">
            Shared knowledge of Scripture strengthens faith communities.
          </Benefit>
        </div>
      </Section>
      
      {/* Testimonials */}
      <Section id="testimonials" className="about-testimonials">
        <SectionHeader title="What Users Are Saying" />
        <div className="testimonials-container">
          <Testimonial 
            quote="Lamp to my feet has transformed my Scripture memorization journey. The step-by-step approach makes even longer verses manageable. I've memorized more verses in three months than in the previous three years!"
            initials="JD"
            name="James Davis"
            title="Bible Study Leader"
          />
          
          <Testimonial 
            quote="As a Sunday school teacher, I've been recommending this tool to everyone. The way it breaks down verses and provides progressive practice is ingenious. My students are memorizing Scripture faster than ever."
            initials="MT"
            name="Maria Torres"
            title="Sunday School Teacher"
          />
          
          <Testimonial 
            quote="I was always struggling to memorize Scripture consistently. This app's approach using multiple learning styles has made all the difference. The ranking system keeps me motivated to continue growing my knowledge of God's Word."
            initials="RJ"
            name="Robert Johnson"
            title="Church Member"
          />
        </div>
      </Section>

      {/* Future Vision */}
      <Section id="future" className="about-future">
        <SectionHeader title="Looking Forward" />
        <p>
          We're just getting started! Our vision for Lamp to my feet includes:
        </p>
        <div className="future-features">
          <FutureFeature icon="🌟">
            Expanded verse collections organized by themes, books, and applications
          </FutureFeature>
          
          <FutureFeature icon="👥">
            Community features where users can create and share memorization plans
          </FutureFeature>
          
          <FutureFeature icon="🌐">
            Multi-language support to make Scripture memorization accessible globally
          </FutureFeature>
          
          <FutureFeature icon="📊">
            Advanced analytics to help users understand their learning patterns
          </FutureFeature>
          
          <FutureFeature icon="🔊">
            Audio features to support auditory learners and accessibility
          </FutureFeature>
        </div>
        <p>
          We're also exploring the development of mobile applications to make Scripture 
          memorization even more convenient.
        </p>
      </Section>

      {/* Join Our Journey */}
      <Section id="join" className="about-join">
        <SectionHeader title="Join Our Journey" />
        <p>
          Every verse memorized is a light added to your path. We invite you to experience 
          the joy and benefit of having God's Word written in your heart, one verse at a time.
        </p>
        <p>
          Whether you're a seasoned Scripture memorizer or just starting out, Lamp to my 
          feet is designed to meet you where you are and help you grow.
        </p>
        <div className="cta-container">
          <a href="/" className="about-cta-button">Start Memorizing Today</a>
        </div>
      </Section>

      {/* Contact Section */}
      <Section id="contact" className="about-contact">
        <SectionHeader title="Contact Us" />
        <p>
          Have questions, suggestions, or feedback? We'd love to hear from you! 
          Reach out through our contact form or follow us on social media.
        </p>
        <div className="contact-form">
          <form>
            <div className="form-group">
              <input type="text" placeholder="Your Name" />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Your Email" />
            </div>
            <div className="form-group">
              <textarea placeholder="Your Message"></textarea>
            </div>
            <button type="submit" className="contact-submit">Send Message</button>
          </form>
        </div>
      </Section>

      {/* Closing Quote */}
      <section className="about-quote">
        <div className="quote-content">
          <p className="quote-text">
            "I have hidden your word in my heart that I might not sin against you."
          </p>
          <p className="quote-source">— Psalm 119:11</p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;