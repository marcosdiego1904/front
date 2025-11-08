# Bible Romance - Design System Reference

## 🎨 Color Palette

### Primary Colors
- **Slate Dark**: `#2C3E50` - Primary text, headlines, dark UI elements
- **Slate 800**: `rgb(30, 41, 59)` - Buttons, navigation, dark sections
- **Slate 700-900**: Gradient variations for depth

### Accent Colors
- **Golden Yellow**: `#FFD700` - Primary accent, CTAs, highlights
- **Warm Amber**: `#E8B86D` - Secondary accent, gradients
- **Orange**: `#F59E0B` - Tertiary accent, warm touches

### Background Colors
- **Warm White**: `#FEFCF8` - Primary background (hero section)
- **Pure White**: `#FFFFFF` - Card backgrounds, clean sections
- **Light Gray**: `#F8F8F8` - Neutral backgrounds
- **Slate 800**: Background for dark sections

### Gradient Combinations
\`\`\`css
/* Warm Background Gradients */
background: linear-gradient(to bottom right, from-amber-50/50 via-orange-50/30 to-yellow-50/40);
background: linear-gradient(to top right, from-rose-50/25 via-transparent to-amber-50/35);

/* Gold Gradients */
background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #F59E0B 100%);
background: linear-gradient(to right, from-amber-600 to-orange-600);

/* Dark Gradients */
background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
background: linear-gradient(to right, from-slate-800 to-slate-900);
\`\`\`

---

## 📝 Typography System

### Font Families
- **Lora (Serif)**: Headlines, quotes, emotional content
  - Variable: `--font-lora`
  - Usage: `font-lora`
  
- **Nunito Sans (Sans-serif)**: Body text, UI elements, descriptions
  - Variable: `--font-nunito-sans`
  - Usage: `font-nunito-sans`

- **Inter (Sans-serif)**: Modern sections, clean UI
  - Usage: `font-inter`

### Typography Scale

#### Headlines
\`\`\`css
/* Extra Large - Hero Headlines */
text-3xl sm:text-4xl md:text-5xl lg:text-6xl
font-lora font-bold/font-black
color: #2C3E50
line-height: leading-tight

/* Large - Section Headers */
text-4xl md:text-5xl
font-inter/font-lora font-bold/font-black
color: #2C3E50

/* Medium - Subsections */
text-2xl sm:text-3xl
font-lora/font-inter font-bold
color: #2C3E50
\`\`\`

#### Body Text
\`\`\`css
/* Large Body */
text-lg sm:text-xl md:text-2xl
font-nunito-sans
color: #2C3E50 or #2C3E50/80
line-height: leading-relaxed

/* Standard Body */
text-base sm:text-lg md:text-xl
font-nunito-sans
color: #2C3E50
line-height: leading-relaxed

/* Small Body */
text-sm md:text-base
font-nunito-sans
color: #2C3E50/70 or #6B7280
\`\`\`

#### Special Typography
\`\`\`css
/* Pre-headlines (Eyebrows) */
text-sm sm:text-base md:text-lg
uppercase tracking-wide
font-nunito-sans font-medium
color: #FFD700

/* Quotes/Verses */
text-lg sm:text-xl md:text-2xl
font-lora italic
color: #F8F8F8 or #2C3E50
line-height: leading-relaxed/leading-snug
\`\`\`

---

## 🏗️ Layout Patterns

### Container Widths
\`\`\`css
max-w-4xl   /* Centered content, hero */
max-w-6xl   /* Standard sections */
max-w-7xl   /* Wide sections, navigation */
max-w-2xl   /* Focused cards */
max-w-3xl   /* Text content blocks */
\`\`\`

### Spacing System
\`\`\`css
/* Vertical Section Spacing */
py-16 sm:py-20 md:py-24  /* Large sections */
py-20                     /* Standard sections */
py-20 md:py-32           /* Extra large sections */

/* Horizontal Padding */
px-4 sm:px-6 lg:px-8     /* Container padding */
px-6                      /* Card padding */
px-8 sm:px-10            /* Large card padding */

/* Internal Spacing */
space-y-4 sm:space-y-6 md:space-y-8  /* Vertical stacking */
gap-6 sm:gap-8                        /* Grid gaps */
gap-8 mb-16                          /* Section internal spacing */
mb-12 sm:mb-16                       /* Section bottom margin */
\`\`\`

### Grid Systems
\`\`\`css
/* Three Column Grid */
grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8

/* Two Column Grid */
grid grid-cols-1 lg:grid-cols-12 gap-12
  lg:col-span-4  /* Left sidebar */
  lg:col-span-8  /* Right content */

/* Before/After Layout */
grid md:grid-cols-2 gap-8
\`\`\`

---

## 🎴 Card Styles

### Standard White Card
\`\`\`css
bg-white/80 backdrop-blur-sm
rounded-2xl
p-8 sm:p-10
shadow-lg hover:shadow-xl
border border-slate-200/50 or border-amber-100/50
transition-all duration-300
\`\`\`

### Golden Accent Card (Revealed State)
\`\`\`css
background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #F59E0B 100%)
rounded-3xl
p-6 sm:p-8
shadow-2xl
\`\`\`

### Dark Section Card
\`\`\`css
bg-white/5
rounded-2xl
p-12
min-h-[400px]
\`\`\`

### Glassmorphism Effect
\`\`\`css
backdrop-blur-sm or backdrop-blur-md
bg-white/80 or bg-white/95
border border-gray-200/50
\`\`\`

---

## 🎯 Button Styles

### Primary Dark Button
\`\`\`css
bg-gradient-to-r from-slate-800 to-slate-700
hover:from-slate-700 hover:to-slate-600
text-white
px-8 sm:px-10 py-4
rounded-xl
font-nunito-sans font-semibold
text-base sm:text-lg
min-h-[48px]
shadow-lg hover:shadow-xl
transform hover:scale-[1.02] hover:-translate-y-0.5
transition-all duration-300
border border-slate-700/50
\`\`\`

### Secondary Outline Button
\`\`\`css
border-2 border-[#2C3E50]
bg-white/80 backdrop-blur-sm
hover:bg-white
color: #2C3E50
px-6 sm:px-8 py-4
rounded-xl
font-nunito-sans font-medium
text-base sm:text-lg
min-h-[48px]
hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5
transition-all duration-300
\`\`\`

### Golden CTA Button
\`\`\`css
bg-gradient-to-r from-amber-600 to-orange-500
hover:from-amber-700 hover:to-orange-600
text-white
px-8 py-4
rounded-xl
font-semibold text-lg
shadow-lg hover:shadow-xl
transform hover:scale-105
transition-all duration-300
\`\`\`

### Method Section Button
\`\`\`css
bg-gradient-to-r from-[#2C3E50] to-[#34495E]
hover:from-[#34495E] hover:to-[#2C3E50]
text-white
px-10 py-4
rounded-xl
font-semibold text-lg
hover:shadow-2xl hover:-translate-y-1 hover:scale-105
transition-all duration-300
position: relative
overflow: hidden
\`\`\`

---

## ✨ Animation Patterns

### Scroll-Triggered Fade In
\`\`\`css
/* Base State */
opacity-0 translate-y-8

/* Visible State */
opacity-100 translate-y-0
transition-all duration-700/duration-800/duration-1000

/* With Delays */
delay-200, delay-400, delay-600, delay-800, delay-1400
\`\`\`

### Sequential Animation Pattern
\`\`\`javascript
setTimeout(() => setState(prev => ({ ...prev, header: true })), 200)
setTimeout(() => setState(prev => ({ ...prev, cards: true })), 600)
setTimeout(() => setState(prev => ({ ...prev, cta: true })), 1000)
\`\`\`

### Hover Transforms
\`\`\`css
/* Scale Up */
hover:scale-105 or hover:scale-[1.02]

/* Lift Effect */
hover:-translate-y-1 or hover:-translate-y-0.5 or hover:-translate-y-2

/* Combined */
transform transition-all duration-300
hover:scale-105 hover:-translate-y-2
\`\`\`

### Card 3D Tilt Effect
\`\`\`javascript
const handleMouseMove = (e) => {
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const rotateX = (y - centerY) / 10
  const rotateY = (centerX - x) / 10
  
  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
}
\`\`\`

### Pulse Animations
\`\`\`css
animate-pulse
/* Custom delays */
style={{ animationDelay: "1s" }}
style={{ animationDelay: "2s" }}
\`\`\`

### Fade In Keyframes
\`\`\`css
.animate-fade-in {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 1s ease-out forwards;
}

.animate-fade-in-delay-1 {
  animation: fadeInUp 1s ease-out 0.3s forwards;
}

.animate-fade-in-delay-2 {
  animation: fadeInUp 1s ease-out 0.6s forwards;
}

.animate-fade-in-delay-3 {
  animation: fadeInUp 1s ease-out 0.9s forwards;
}
\`\`\`

---

## 🌟 Decorative Elements

### Floating Orbs (Warm Theme)
\`\`\`jsx
<div className="absolute top-1/4 left-1/4 w-4 h-4 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full opacity-25 animate-pulse"
  style={{ transform: `translateY(${Math.sin(scrollY * 0.01) * 12}px)` }}
/>

<div className="absolute top-3/4 right-1/3 w-3 h-3 bg-gradient-to-br from-amber-200 to-yellow-200 rounded-full opacity-30 animate-pulse"
  style={{ animationDelay: "1s" }}
/>
\`\`\`

### Background Blur Circles
\`\`\`css
/* Large backdrop blur */
absolute inset-0 opacity-[30-40]
w-32 h-32 or w-40 h-40 or w-64 h-64
bg-gradient-to-br from-amber-200/20 to-orange-200/20
rounded-full blur-xl or blur-2xl or blur-3xl

/* Positioning */
top-20 left-10
bottom-20 right-10
top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
\`\`\`

### SVG Icons (Decorative)
\`\`\`jsx
{/* Book Icon */}
<svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="animate-pulse">
  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#D97706" strokeWidth="1.5" />
  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#D97706" strokeWidth="1.5" />
  <path d="M8 7h8M8 11h6" stroke="#D97706" strokeWidth="1" />
</svg>

{/* Star Icon */}
<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
    fill="#F59E0B" fillOpacity="0.4" />
</svg>

{/* Heart Icon */}
<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
    fill="#F59E0B" fillOpacity="0.3" />
</svg>
\`\`\`

### Dot Pattern Overlay
\`\`\`css
absolute inset-0 opacity-[0.03]
background-image: url("data:image/svg+xml,%3Csvg width='60' height='60'...")
\`\`\`

### Gradient Radial Background
\`\`\`css
absolute inset-0 bg-gradient-radial from-yellow-100/40 via-orange-50/15 to-transparent
\`\`\`

---

## 🎭 Interactive States

### Hover Card States
\`\`\`css
/* Standard Hover */
hover:shadow-xl
hover:border-amber-300
group-hover:border-amber-300

/* Scale Hover */
cursor-pointer
hover:scale-105 or hover:scale-[1.02]

/* Color Shift Hover */
hover:text-amber-700
group-hover:text-amber-600
group-hover:scale-110 (for icons)
\`\`\`

### Active/Selected States
\`\`\`css
/* Active Tab */
text-[#FFD700] bg-[#FFD700]/5
/* Inactive Tab */
text-[#888] hover:text-[#AAA] hover:bg-white/5

/* Active Indicator */
absolute left-0 top-0 bottom-0 w-0.5 bg-[#FFD700] rounded-r
\`\`\`

### Transition States
\`\`\`css
/* Fade Transition */
transition-opacity duration-300
opacity-0 → opacity-100

/* Transform Transition */
transition-all duration-300/duration-500/duration-700
translate-y-0 scale-100 → translate-y-8 scale-95
\`\`\`

---

## 📱 Responsive Breakpoints

### Custom Breakpoints
\`\`\`css
/* Extra Small - iPhone 12/12 Pro and up */
@media (min-width: 390px) {
  .xs\:block { display: block; }
}

/* Small - 640px */
sm:text-xl
sm:px-6
sm:space-y-6

/* Medium - 768px */
md:text-2xl
md:grid-cols-2
md:py-24

/* Large - 1024px */
lg:text-6xl
lg:col-span-8
lg:px-8
\`\`\`

### Mobile Optimizations
\`\`\`css
/* Mobile First Stack */
flex flex-col sm:flex-row
space-y-4 sm:space-y-0 sm:gap-4

/* Touch Targets */
min-h-[48px]  /* Minimum 48px for touch */

/* Responsive Text */
text-3xl sm:text-4xl md:text-5xl lg:text-6xl

/* Responsive Spacing */
pt-16 sm:pt-8 md:pt-0
py-20 sm:py-24 md:py-32
\`\`\`

---

## 🔍 Special Effects

### Glare Effect (Card Hover)
\`\`\`css
absolute inset-0 
opacity-0 group-hover:opacity-30 
transition-opacity duration-300
background: linear-gradient(45deg, transparent 30%, rgba(232, 184, 109, 0.4) 50%, transparent 70%)
\`\`\`

### Light Ray Effect (Golden State)
\`\`\`css
absolute inset-0 
bg-gradient-to-br from-yellow-200/30 via-transparent to-amber-200/20 
pointer-events-none
\`\`\`

### Text Balance
\`\`\`css
text-balance  /* Optimal line breaks */
text-pretty   /* Better wrapping */
\`\`\`

### Text Shadow
\`\`\`css
text-shadow: 0 1px 2px rgba(0,0,0,0.1)
\`\`\`

### Box Shadows
\`\`\`css
/* Standard */
shadow-lg hover:shadow-xl

/* Golden Glow */
shadow-lg hover:shadow-2xl hover:shadow-amber-500/20

/* Multi-layer */
box-shadow: 0 4px 20px rgba(30, 41, 59, 0.25), 0 1px 3px rgba(0, 0, 0, 0.1)

/* Inset Highlight */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.5)
\`\`\`

---

## 🎨 Component-Specific Styles

### Navigation Bar
\`\`\`css
/* Base */
fixed top-0 left-0 right-0 z-50
bg-white/80 backdrop-blur-sm
border-b border-gray-200/50

/* Scrolled State */
bg-white/95 backdrop-blur-md
shadow-sm

/* Nav Links */
px-4 py-2 
text-sm font-medium 
text-gray-700 hover:text-gray-900 
hover:bg-gray-100/60 
rounded-lg
transition-all duration-200
\`\`\`

### Hero Section
\`\`\`css
/* Container */
min-h-screen
bg-[#FEFCF8]
relative overflow-hidden

/* Content Centering */
flex items-center justify-center
max-w-4xl text-center
pt-16 sm:pt-8 md:pt-0

/* Gradient Layers */
absolute inset-0 bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-yellow-50/40
\`\`\`

### Method Section Cards
\`\`\`css
/* Card */
bg-white/80 backdrop-blur-sm
rounded-2xl p-8
border border-[#E8B86D]/20
shadow-lg hover:shadow-2xl
group cursor-pointer
relative overflow-hidden

/* Icon Container */
p-4 
bg-gradient-to-br from-[#FFD700]/10 to-[#E8B86D]/10 
rounded-2xl
\`\`\`

### Testimonial Cards
\`\`\`css
/* Card */
bg-white/80 backdrop-blur-sm
rounded-2xl p-8
shadow-lg hover:shadow-xl
border border-amber-100/50

/* Avatar */
w-16 h-16 
bg-gradient-to-br from-amber-400 to-orange-500 
rounded-full
text-white font-bold text-lg

/* Stars */
flex text-yellow-400 text-sm
\`\`\`

---

## 📋 Content Patterns

### Section Header Pattern
\`\`\`jsx
<div className="text-center mb-16">
  <h2 className="text-4xl md:text-5xl font-bold text-[#2C3E50] mb-6">
    Headline with <span className="text-transparent bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text">Gradient</span>
  </h2>
  <p className="text-xl text-[#2C3E50]/80 max-w-3xl mx-auto leading-relaxed">
    Supporting description text
  </p>
</div>
\`\`\`

### Badge Pattern
\`\`\`jsx
<div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
  Label
</div>
\`\`\`

### Quote Pattern
\`\`\`jsx
<blockquote className="font-lora text-2xl leading-relaxed mb-8 text-[#F8F8F8]">
  "{quote text}"
</blockquote>
<cite className="font-lora italic text-base text-[#FFD700]">
  — Reference
</cite>
\`\`\`

---

## 🎯 Key Design Principles

1. **Warm & Inviting**: Use amber/orange/yellow accents for emotional warmth
2. **Clean & Modern**: White space, subtle shadows, rounded corners (rounded-xl, rounded-2xl)
3. **Smooth Interactions**: 300ms transitions, scale/lift effects on hover
4. **Scroll-Triggered Animation**: Fade in with translateY on intersection
5. **Mobile-First**: Always start with mobile layout, enhance for larger screens
6. **Consistent Spacing**: 4-6-8-12-16-20 scale for margins/padding
7. **Readable Typography**: Large text (lg-xl-2xl), relaxed line-height
8. **Emotional Design**: Use gradients for state changes (problem→solution)
9. **Touch-Friendly**: Minimum 48px height for interactive elements
10. **Visual Hierarchy**: Clear contrast between primary/secondary/tertiary elements

---

## 📝 Quick Reference: Common Combinations

### Warm Background Section
\`\`\`css
bg-gradient-to-br from-amber-50/30 via-orange-50/20 to-yellow-50/30
relative overflow-hidden py-20
\`\`\`

### Dark Slate Section
\`\`\`css
bg-slate-800
relative overflow-hidden py-20
text-white
\`\`\`

### Card with Hover Effect
\`\`\`css
bg-white/80 backdrop-blur-sm
rounded-2xl p-8
shadow-lg hover:shadow-xl
border border-amber-100/50
transform transition-all duration-300
hover:scale-105 hover:-translate-y-2
cursor-pointer
\`\`\`

### Golden Accent Text
\`\`\`css
text-transparent bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text
\`\`\`

### Intersection Observer Animation
\`\`\`css
transition-all duration-700
${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
\`\`\`

This design system ensures consistency across all sections while maintaining the warm, modern, relationship-focused aesthetic of the Bible Romance brand.
