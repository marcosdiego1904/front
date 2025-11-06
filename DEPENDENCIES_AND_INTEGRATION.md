# Dependencies and Integration Points

**Project:** Bible Memory App
**Date:** 2025-11-06
**Purpose:** Reference for new homepage integration

---

## 📦 Current Dependencies (package.json)

### Core Framework
- **React:** `^18.3.1`
- **React DOM:** `^18.3.1`
- **TypeScript:** `~5.6.2`
- **Vite:** `^6.0.5` (Build tool)

### Routing
- **react-router-dom:** `^7.1.4`
  - Used for: `useNavigate`, `useLocation`, `NavLink`, `Link`, `Navigate`
  - All navigation in the app

### UI Framework
- **Bootstrap:** `^5.3.3`
  - Used for: Navbar, responsive grid, utilities
- **Bootstrap Icons:** `^1.11.3`
  - Used for: All navigation icons

### Animations (Available to Use)
- **Framer Motion:** `^12.0.6`
  - Can be used for page transitions, animations in new design
  - Not required, but available

### HTTP Client
- **Axios:** `^1.7.9`
  - Used for API calls in `/src/services/api`

### State Management
- **@tanstack/react-query:** `^5.66.0`
  - For server state management (if needed)

### Notifications
- **react-toastify:** `^11.0.3`
  - For toast notifications (available to use)

### Fonts
- **@fontsource/inter:** `^5.1.1`
- **inter-ui:** `^4.1.0`

---

## 🔌 Key Integration Points

### 1. Authentication System

**Context Provider:** `/src/auth/context/AuthContext`

**Hook Usage:**
```tsx
import { useAuth } from "../auth/context/AuthContext";

const YourComponent = () => {
  const {
    user,              // User object: { id, username, email }
    isAuthenticated,   // Boolean: true if logged in
    loading,           // Boolean: true during auth check
    login,             // Function: login(credentials)
    logout             // Function: logout()
  } = useAuth();

  // Use these values in your new design
};
```

**Example - Conditional Rendering:**
```tsx
{isAuthenticated ? (
  <button onClick={() => navigate('/dashboard')}>
    Go to Dashboard
  </button>
) : (
  <button onClick={() => navigate('/login')}>
    Sign In
  </button>
)}
```

---

### 2. Navigation System

**Router Hook:**
```tsx
import { useNavigate, useLocation } from "react-router-dom";

const YourComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigate programmatically
  const goToDashboard = () => navigate('/dashboard');

  // Check current path
  const isHome = location.pathname === '/';
};
```

**Link Components:**
```tsx
import { Link } from "react-router-dom";

// Standard link
<Link to="/about">About</Link>

// Link with styling
<Link to="/login" className="btn btn-primary">
  Login
</Link>
```

---

### 3. API Integration

**Location:** `/src/services/api`

**Example Usage:**
```tsx
import { getCategories } from "../services/api";

useEffect(() => {
  const fetchData = async () => {
    try {
      const categories = await getCategories();
      setCategories(categories);
    } catch (error) {
      console.error("Failed to fetch:", error);
    }
  };
  fetchData();
}, []);
```

**API Base URL:**
Check `/src/services/api` for the base URL configuration

---

### 4. Styling System

**Global CSS:** `/src/styles/global-design-system.css`
- Already imported in App.tsx
- Contains design tokens, CSS variables

**Bootstrap Utilities Available:**
- Grid system: `container`, `row`, `col-*`
- Spacing: `m-*`, `p-*`, `mt-*`, etc.
- Display: `d-flex`, `d-none`, etc.
- Text: `text-center`, `text-primary`, etc.

**Bootstrap Icons:**
```tsx
import "bootstrap-icons/font/bootstrap-icons.css";

// Use in JSX:
<i className="bi bi-heart"></i>
<i className="bi bi-search"></i>
<i className="bi bi-person-circle"></i>
```

---

### 5. Protected Routes Pattern

**How it works:** (Already configured in App.tsx)
```tsx
// Route requires authentication
{
  path: "/dashboard",
  element: <ProtectedRoute><Dashboard /></ProtectedRoute>
}
```

If user not authenticated → redirects to `/login`

**In your new homepage:**
- Don't need to implement this
- Just use navigation: `navigate('/dashboard')`
- Protection happens automatically

---

## 🎯 Homepage Component Structure

### Current Location
`/src/Home/index.tsx` - This is what you'll replace

### Expected Export
```tsx
const Home = () => {
  // Your new design here
  return (
    <div>
      {/* Your JSX */}
    </div>
  );
};

export default Home;
```

### Already Rendered In
`/src/App.tsx` at route `/`:
```tsx
{ path: "/", element: <Home /> }
```

---

## 🔄 Scroll Functionality (Optional)

If you want to keep smooth scroll to categories:

```tsx
const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};

// Use it:
<button onClick={() => scrollToSection('categories-section')}>
  View Categories
</button>

// In the target section:
<div id="categories-section">
  {/* Content */}
</div>
```

---

## 🎨 Framer Motion (Optional Animation Library)

**Already installed** - You can use for animations:

```tsx
import { motion } from "framer-motion";

// Animated div
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content here
</motion.div>

// Page transitions
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
>
  {/* Page content */}
</motion.div>
```

---

## 🚨 Toast Notifications (Optional)

**react-toastify** is installed:

```tsx
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Show notifications
toast.success("Welcome!");
toast.error("Something went wrong");
toast.info("Please log in");
```

**Setup in App.tsx:**
```tsx
import { ToastContainer } from 'react-toastify';

<ToastContainer position="top-right" />
```

---

## 🛠️ Build Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Start (production mode)
npm start
```

---

## 📱 Responsive Design Considerations

**Bootstrap Breakpoints:**
- `sm`: ≥576px
- `md`: ≥768px
- `lg`: ≥992px
- `xl`: ≥1200px
- `xxl`: ≥1400px

**Navbar is already responsive** - handles mobile menu automatically

---

## ✅ Integration Checklist for New Design

When you import your new design:

### Required Integrations:
- [ ] Import and use logo: `/src/oil-lamp.png`
- [ ] Use `useAuth()` for authentication state
- [ ] Use `useNavigate()` for navigation
- [ ] Keep Navbar component (already in App.tsx)
- [ ] Export component as default: `export default Home`

### Optional Integrations:
- [ ] Use Bootstrap classes for styling
- [ ] Add Framer Motion animations
- [ ] Implement toast notifications
- [ ] Add smooth scroll functionality
- [ ] Include categories section

### Testing After Integration:
- [ ] Homepage loads correctly
- [ ] Logo appears properly
- [ ] Navigation links work (all routes)
- [ ] Login/Register redirect works
- [ ] Authenticated state shows Dashboard link
- [ ] Mobile navbar works
- [ ] Responsive design looks good

---

## 📝 Common Patterns

### Button with Navigation
```tsx
const navigate = useNavigate();

<button
  onClick={() => navigate('/login')}
  className="btn btn-primary"
>
  Get Started
</button>
```

### Conditional Content Based on Auth
```tsx
const { isAuthenticated } = useAuth();

{isAuthenticated ? (
  <p>Welcome back!</p>
) : (
  <p>Please sign in</p>
)}
```

### Link with Active State
```tsx
import { NavLink } from "react-router-dom";

<NavLink
  to="/about"
  className={({ isActive }) =>
    isActive ? "active-link" : "link"
  }
>
  About
</NavLink>
```

---

**Everything is ready! You can now import your new design. 🎉**
