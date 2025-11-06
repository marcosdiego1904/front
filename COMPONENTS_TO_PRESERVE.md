# Components to Preserve During Homepage Migration

**Date:** 2025-11-06

---

## 🧩 Navbar Component (KEEP AS-IS)

**Location:** `/src/Navbar/index.tsx`

### Key Features:
- ✅ Responsive design (desktop + mobile sidebar)
- ✅ Authentication-aware (shows different links based on login status)
- ✅ User dropdown with profile/logout
- ✅ Smooth scroll to categories functionality
- ✅ Bootstrap icons integration

### Props/Dependencies:
```tsx
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/context/AuthContext";
import imag from "../oil-lamp.png"; // Logo file
```

### Usage in New Homepage:
```tsx
// Already rendered in App.tsx - no changes needed
<Navbar /> // This stays!
```

**Styling:** `/src/Navbar/nav.css` (preserve this file)

---

## 🎨 Logo Assets (PRESERVE)

### Primary Logo
- **Path:** `/src/oil-lamp.png`
- **Size:** 1523 bytes
- **Current usage:** Navbar brand

### Secondary Logo
- **Path:** `/src/icons8-lantern-96.png`
- **Size:** 2150 bytes
- **Usage:** Alternative icon

**DO NOT DELETE THESE FILES**

---

## 🔐 Authentication Context (CRITICAL - DO NOT MODIFY)

**Location:** `/src/auth/context/AuthContext`

### Provides:
- `user` - User object with username, email, etc.
- `isAuthenticated` - Boolean
- `loading` - Loading state
- `logout()` - Logout function
- `login()` - Login function

### Usage Pattern:
```tsx
import { useAuth } from "../auth/context/AuthContext";

const YourComponent = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.username}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
};
```

---

## 📚 Categories Component (OPTIONAL)

**Location:** `/src/Home/HomeCategoryHighlights.tsx`

### Purpose:
Displays Bible verse categories for learning

### Usage:
```tsx
import HomeCategoryHighlights from "./HomeCategoryHighlights";

// In your component:
<div id="categories-section">
  <HomeCategoryHighlights />
</div>
```

**Styling:** `/src/Home/HomeCategoryHighlights.css`

**Note:** You can keep or remove this depending on new design. If keeping, ensure you:
1. Include the `#categories-section` ID for smooth scroll
2. Import and render the component
3. Keep the CSS file

---

## 🛣️ Routing Configuration (DO NOT MODIFY)

**Location:** `/src/App.tsx`

All routes are already configured:
- `/` → Homepage (this is what we're replacing)
- `/login` → Login page
- `/register` → Register page
- `/dashboard` → Dashboard (protected)
- `/profile` → Profile (protected)
- `/bible-search` → Bible Search
- `/about` → About page
- `/support` → Support page
- `/terms` → Terms of Service
- `/privacy` → Privacy Policy

**New homepage should only replace the `<Home />` component content, NOT routes.**

---

## 🎯 API Services (KEEP)

**Location:** `/src/services/api`

### Exported Functions:
- `getCategories()` - Fetches Bible categories
- Other API calls for auth, verses, etc.

### Usage:
```tsx
import { getCategories } from "../services/api";

useEffect(() => {
  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };
  fetchCategories();
}, []);
```

---

## 🎨 Global Styles (PRESERVE)

**Location:** `/src/styles/global-design-system.css`

- Already imported in App.tsx and Home component
- Contains design tokens and global styles
- **DO NOT DELETE**

---

## ⚙️ Bootstrap Configuration (KEEP)

### Dependencies:
- Bootstrap CSS (imported)
- Bootstrap Icons (`bootstrap-icons/font/bootstrap-icons.css`)
- Bootstrap JavaScript components (for navbar collapse, dropdowns)

**Used in Navbar for:**
- Responsive collapse menu
- Dropdown menus
- Icons

---

## 📋 Summary Checklist

When integrating new homepage design:

### ✅ Keep These Files:
- [x] `/src/Navbar/index.tsx`
- [x] `/src/Navbar/nav.css`
- [x] `/src/oil-lamp.png`
- [x] `/src/icons8-lantern-96.png`
- [x] `/src/auth/context/AuthContext`
- [x] `/src/services/api`
- [x] `/src/styles/global-design-system.css`
- [x] `/src/App.tsx` (routing config)

### ✏️ Can Modify/Replace:
- [x] `/src/Home/index.tsx` (this is your new design!)
- [x] `/src/Home/styles.css`
- [x] `/src/Home/HomeSearchAndCategories.css`

### ❓ Optional (Keep if needed):
- [ ] `/src/Home/HomeCategoryHighlights.tsx`
- [ ] `/src/Home/HomeCategoryHighlights.css`

---

## 🔌 Code Snippets for Integration

### Import Logo in New Design
```tsx
import logo from "../oil-lamp.png";

// Use it:
<img src={logo} alt="Lamp to my feet" />
```

### Check Authentication Status
```tsx
import { useAuth } from "../auth/context/AuthContext";

const { isAuthenticated, user } = useAuth();

{isAuthenticated && <p>Welcome {user?.username}!</p>}
```

### Navigate Programmatically
```tsx
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();
navigate('/dashboard'); // Navigate to dashboard
```

### Link to Other Pages
```tsx
import { Link } from "react-router-dom";

<Link to="/about">About Us</Link>
<Link to="/login">Sign In</Link>
```

---

**All set! Ready to import your new design. 🚀**
