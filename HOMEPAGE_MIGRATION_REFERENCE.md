# Homepage Migration Reference Document

**Created:** 2025-11-06
**Purpose:** Reference for preserving key elements during homepage redesign
**Backup Branch:** `backup-old-homepage`

---

## 🎨 Assets to Preserve

### Logo/Icon
- **File:** `/home/user/front/src/oil-lamp.png`
- **Alt File:** `/home/user/front/src/icons8-lantern-96.png`
- **Usage:** Navbar brand logo
- **Current Text:** "Lamp to my feet"

---

## 🧭 Navigation Structure to Preserve

### Primary Navigation Links (Desktop & Mobile)
All routes defined in `/src/Navbar/index.tsx`:

| Link Name | Route | Icon | Notes |
|-----------|-------|------|-------|
| **Home** | `/` | `bi-house-door` | Main homepage |
| **Learn** | Scroll to `#categories-section` | `bi-book` | Smooth scroll to categories |
| **Bible Search** | `/bible-search` | `bi-search` | Dedicated search page |
| **About** | `/about` | `bi-info-circle` | About page |
| **Support Us** | `/support` | `bi-heart` | Support/donation page |
| **Dashboard** | `/dashboard` | `bi-grid` | *Auth required* |

### Authentication Links

**When NOT Logged In:**
- **Login** → `/login` (Icon: `bi-box-arrow-in-right`)
- **Register** → `/register` (Icon: `bi-person-plus`)

**When Logged In:**
- **User Dropdown** → Shows username (Icon: `bi-person-circle`)
  - **Profile** → `/profile`
  - **Logout** → Calls `logout()` function

---

## 🔐 Authentication Integration

### Auth Context
- **Location:** `/src/auth/context/AuthContext`
- **Hook:** `useAuth()`
- **Exported Values:**
  - `user` - Current user object
  - `isAuthenticated` - Boolean auth status
  - `loading` - Loading state
  - `logout()` - Logout function

### Protected Routes
- `/dashboard` - Requires authentication
- `/profile` - Requires authentication
- Unauthenticated users redirected to `/login`

---

## 📄 Current Homepage Structure (TO BE REPLACED)

### File: `/src/Home/index.tsx`

**Main Sections:**
1. **Hero Section** (`.main-cont`) - Lines 91-126
   - Left: Text content with CTA buttons
   - Right: Image overlay
   - Buttons: "Get Started Now!" and "My Learned Verses"

2. **Categories Section** - Lines 129-139
   - Uses `HomeCategoryHighlights` component
   - Scrollable section with ref `categoriesRef`

**Key Features:**
- Authentication message alert (lines 93-101)
- Scroll-based visibility toggling
- URL parameter handling (`scrollToCategories=true`, `authRequired=true`)
- Smooth scroll functionality

---

## 🔌 Dependencies to Keep

### Components
- `Navbar` → `/src/Navbar/index.tsx`
- `HomeCategoryHighlights` → `/src/Home/HomeCategoryHighlights.tsx` *(optional - if keeping categories)*
- `AuthContext` → `/src/auth/context/AuthContext`

### Utilities/Functions
- `scrollToCategories()` - Smooth scroll to categories section
- `getCategories()` - API call from `/src/services/api`

### Routing
- React Router DOM (`useNavigate`, `useLocation`, `NavLink`)
- All routes defined in `/src/App.tsx`

---

## 🎯 Integration Points for New Design

When importing new homepage design:

### 1. Logo Integration
```tsx
import imag from "../oil-lamp.png";
// Use in navbar or hero section
<img src={imag} alt="Lamp Icon" className="logo-icon" />
```

### 2. Auth State Integration
```tsx
import { useAuth } from "../auth/context/AuthContext";

const { isAuthenticated, user } = useAuth();
// Use isAuthenticated for conditional rendering
// Use user for personalization
```

### 3. Navigation Integration
```tsx
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();
// Use navigate('/path') for programmatic navigation
```

### 4. Scroll to Categories (if applicable)
```tsx
const scrollToCategories = () => {
  const categoriesSection = document.getElementById('categories-section');
  if (categoriesSection) {
    categoriesSection.scrollIntoView({ behavior: 'smooth' });
  }
};
```

---

## 📦 Files Related to Current Homepage

**Core Files:**
- `/src/Home/index.tsx` - Main homepage component
- `/src/Home/styles.css` - Homepage styles
- `/src/Home/HomeSearchAndCategories.css` - Categories section styles
- `/src/Home/HomeCategoryHighlights.tsx` - Categories component
- `/src/Home/HomeCategoryHighlights.css` - Categories component styles

**These files will be modified/replaced during migration.**

---

## ✅ Pre-Migration Checklist

- [x] Backup branch created: `backup-old-homepage`
- [x] Logo files located and documented
- [x] Navigation routes documented
- [x] Auth integration points identified
- [x] Dependencies mapped

**Ready for new design import!**

---

## 🚀 Next Steps

1. Import new homepage design files
2. Integrate logo (`oil-lamp.png`)
3. Wire up navigation links to existing routes
4. Connect authentication context
5. Test all navigation flows
6. Verify auth-protected routes work
7. Test responsive behavior
