# Security Audit Report

**Repository:** marcosdiego1904/front (Lamp to My Feet)
**Audit Date:** 2025-11-21
**Auditor:** Automated Security Scan
**Severity Rating:** Critical - Immediate Action Required

---

## Executive Summary

This comprehensive security audit of the Lamp to My Feet React frontend application identified **20 security vulnerabilities** across 4 severity levels:

| Severity | Count | Status |
|----------|-------|--------|
| Critical | 4 | Immediate action required |
| High | 7 | Fix within 1 week |
| Medium | 6 | Fix within 1 month |
| Low | 3 | Address when possible |

**The most critical finding is the exposure of API keys in source code**, which are visible in production builds and can be extracted by any attacker.

---

## Critical Vulnerabilities (Fix Immediately)

### CRIT-001: Hardcoded RapidAPI Key Exposed

**Severity:** CRITICAL
**File:** `src/services/bibleApi.ts`
**Lines:** 297, 326
**CVSS Score:** 9.8

```typescript
// Line 297 & 326 - API KEY EXPOSED IN SOURCE CODE
'x-rapidapi-key': '563ea39f66msh0512ba3143fdccfp1bb39fjsnde81db4498b1',
```

**Risk:**
- API key visible in browser DevTools Network tab
- Visible in production JavaScript bundles
- Attackers can abuse API quota, incur charges, or exhaust rate limits
- Key can be scraped from source maps

**Immediate Action:**
1. Rotate this API key immediately at https://rapidapi.com/api-keys
2. Move API calls to backend server (never expose keys in frontend)
3. Create a backend proxy endpoint: `POST /api/bible/verse`

---

### CRIT-002: Hardcoded NLT API Key Exposed

**Severity:** CRITICAL
**File:** `src/services/bibleApi.ts`
**Line:** 401
**CVSS Score:** 9.8

```typescript
// Line 401 - API KEY IN URL STRING
const url = `https://api.nlt.to/api/passages?...&key=e109f896-e965-4dcf-aeda-cf5af78098cf`;
```

**Risk:**
- API key embedded directly in URL
- Visible in browser history, access logs, and referrer headers
- Console.log on line 403 exposes full URL with key

**Immediate Action:**
1. Rotate this API key at https://api.nlt.to
2. Move to backend proxy
3. Remove console.log statements with URLs

---

### CRIT-003: JWT Tokens Stored in Vulnerable localStorage

**Severity:** CRITICAL
**File:** `src/auth/context/AuthContext.tsx`
**Lines:** 53-54, 85-86, 124-125, 144-145
**CVSS Score:** 8.6

```typescript
// Lines 85-86, 124-125 - INSECURE TOKEN STORAGE
localStorage.setItem('token', data.token);
localStorage.setItem('user', JSON.stringify(data.user));
```

**Risk:**
- localStorage is vulnerable to XSS attacks
- Any malicious JavaScript can read the token
- Tokens stored in plaintext without encryption
- No HttpOnly protection (only available for cookies)
- User data (email, ID) also exposed

**Immediate Action:**
1. Migrate to httpOnly cookies (requires backend changes)
2. As interim: use sessionStorage instead of localStorage
3. Implement token refresh mechanism
4. Never store full user object client-side

---

### CRIT-004: Critical Dependency Vulnerability (form-data)

**Severity:** CRITICAL
**Package:** form-data 4.0.0 - 4.0.3
**Advisory:** GHSA-fjxv-7rqg-78g4

**Issue:** Uses unsafe random function for choosing boundary, making multipart form data predictable.

**Immediate Action:**
```bash
npm audit fix
```

---

## High Severity Vulnerabilities (Fix Within 1 Week)

### HIGH-001: Axios SSRF and DoS Vulnerabilities

**Severity:** HIGH
**Package:** axios ^1.7.9 (current: vulnerable version)
**Advisories:**
- GHSA-jr5f-v2jv-69x6 (SSRF/Credential Leakage)
- GHSA-4hjh-wcwx-xvwj (DoS via data size)

**Current Version:** 1.7.9
**Fixed Version:** 1.12.0+

**Action:**
```bash
npm update axios
# Or in package.json: "axios": "^1.12.0"
```

---

### HIGH-002: React Router Pre-render Data Spoofing

**Severity:** HIGH
**Package:** react-router 7.0 - 7.5.1
**Advisory:** GHSA-cpj6-fhp6-mr6j

**Issue:** Allows pre-render data spoofing in React-Router framework mode.

**Action:**
```bash
npm update react-router react-router-dom
```

---

### HIGH-003: No CSRF Protection

**Severity:** HIGH
**Files:** All POST/PUT/DELETE requests in auth system

**Issue:** No CSRF tokens are sent with state-changing requests.

**Affected Files:**
- `src/auth/context/AuthContext.tsx` (login, register, profile update)
- `src/auth/api/authApi.ts`
- `src/services/stripeApi.ts`

**Recommended Fix:**
```typescript
// Add to axios instance
api.defaults.headers.common['X-CSRF-Token'] = getCsrfToken();
```

---

### HIGH-004: Hardcoded Email Bypass for Premium Features

**Severity:** HIGH
**Files:**
- `pages/learnsection/BibleSearch/index.tsx:36-40`
- `src/components/hero-section.tsx:40-43`

```typescript
// AUTHORIZATION BYPASS - Line 37-39
if (user.email === 'marcosdiego1904@gmail.com') {
  setIsPremium(true);  // Creator gets free premium
  return;
}
```

**Risk:**
- Frontend authorization can be bypassed
- Anyone registering with this email gets premium
- Authorization should ALWAYS be server-side

**Action:** Remove this check; implement proper role-based access on backend.

---

### HIGH-005: Excessive Console Logging of Sensitive Data

**Severity:** HIGH
**Files:** Multiple

| File | Line | Data Exposed |
|------|------|--------------|
| `pages/learnsection/BibleSearch/index.tsx` | 33-34 | User email, full user object |
| `pages/learnsection/BibleSearch/index.tsx` | 45 | Stripe subscription status |
| `src/services/bibleApi.ts` | 267 | Full API responses |
| `src/services/bibleApi.ts` | 403 | API URL with key |
| `src/auth/api/authApi.ts` | 126 | Password reset email |

**Action:** Remove all console.log statements or use conditional logging:
```typescript
if (import.meta.env.DEV) {
  console.log('Debug:', data);
}
```

---

### HIGH-006: No Token Expiration Validation

**Severity:** HIGH
**File:** `src/auth/context/AuthContext.tsx:54-58`

```typescript
// NO EXPIRATION CHECK
const storedToken = localStorage.getItem('token');
if (storedToken && storedUser) {
  setUser(JSON.parse(storedUser));  // Expired tokens accepted
  setToken(storedToken);
}
```

**Risk:**
- Expired tokens used until server rejects them
- `TOKEN_REFRESH_INTERVAL` defined in config but never used

**Action:**
```typescript
import { jwtDecode } from 'jwt-decode';

const storedToken = localStorage.getItem('token');
if (storedToken) {
  const decoded = jwtDecode(storedToken);
  if (decoded.exp * 1000 > Date.now()) {
    setToken(storedToken);
  } else {
    localStorage.removeItem('token');
  }
}
```

---

### HIGH-007: glob Command Injection Vulnerability

**Severity:** HIGH
**Package:** glob 10.2.0 - 10.4.5
**Advisory:** GHSA-5j98-mcp5-4vw2

**Action:**
```bash
npm audit fix
```

---

## Medium Severity Vulnerabilities (Fix Within 1 Month)

### MED-001: Weak Password Validation

**Severity:** MEDIUM
**File:** `src/auth/components/registratrion/Register.tsx:107-109`
**Config:** `src/auth/config/config.ts:19`

```typescript
// Only 6 characters required - TOO WEAK
export const PASSWORD_MIN_LENGTH = 6;

// No complexity requirements
if (formData.password.length < 6) {
  errors.password = 'Password must be at least 6 characters';
}
```

**Recommended Fix:**
```typescript
export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_REQUIREMENTS = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecial: true
};
```

---

### MED-002: Weak Email Validation

**Severity:** MEDIUM
**Files:** `Login.tsx:89`, `Register.tsx:101`, `ForgotPassword.tsx:42`

```typescript
// TOO PERMISSIVE - accepts invalid emails
!/\S+@\S+\.\S+/.test(email)
```

**Accepts invalid:** `test@t.c`, `@example.com`, `user@.com`

**Recommended Fix:**
```typescript
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
```

---

### MED-003: esbuild Development Server Vulnerability

**Severity:** MODERATE
**Package:** esbuild <=0.24.2
**Advisory:** GHSA-67mh-4wv8-2f99

**Issue:** Any website can send requests to development server and read responses.

**Action:**
```bash
npm audit fix
```

---

### MED-004: js-yaml Prototype Pollution

**Severity:** MODERATE
**Package:** js-yaml 4.0.0 - 4.1.0
**Advisory:** GHSA-mh29-5h37-fv8m

**Action:**
```bash
npm audit fix
```

---

### MED-005: No Rate Limiting

**Severity:** MEDIUM
**Files:** Login, Register, ForgotPassword components

**Issue:** No throttling on form submissions - enables brute force attacks.

**Recommended Fix:**
```typescript
const [lastSubmit, setLastSubmit] = useState(0);

const handleSubmit = async () => {
  if (Date.now() - lastSubmit < 1000) {
    return; // Rate limit: 1 request per second
  }
  setLastSubmit(Date.now());
  // ... submit logic
};
```

---

### MED-006: Missing Subresource Integrity (SRI)

**Severity:** MEDIUM
**File:** `index.html:68, 138`

```html
<!-- NO INTEGRITY ATTRIBUTE -->
<link href="https://fonts.googleapis.com/css2..." rel="stylesheet">
<script src="https://www.googletagmanager.com/gtag/js..." />
```

**Risk:** CDN compromise could inject malicious code.

**Action:** Add integrity hashes or self-host fonts.

---

## Low Severity Vulnerabilities

### LOW-001: brace-expansion ReDoS

**Package:** brace-expansion 1.0.0 - 1.1.11
**Advisory:** GHSA-v6h2-p8h4-qcjw

### LOW-002: @eslint/plugin-kit ReDoS

**Package:** @eslint/plugin-kit <0.3.4
**Advisory:** GHSA-xffm-g5w8-qvg7

### LOW-003: No Content Security Policy

**File:** `vercel.json`

**Recommended Addition:**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.lamptomyfeet.co https://api.nlt.to https://niv-bible.p.rapidapi.com"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## Additional Security Concerns

### Inconsistent API Configuration

**Issue:** Different API URLs across files:

| File | URL |
|------|-----|
| `src/config/api.ts` | `http://localhost:5000/api` |
| `src/auth/context/AuthContext.tsx` | `http://localhost:3001` |
| `src/auth/api/authApi.ts` | `http://localhost:3001` |

**Action:** Centralize all API configuration in `src/config/api.ts`.

### Password Reset Not Implemented

**File:** `src/auth/components/ForgotPassword.tsx:60-66`

```typescript
// PLACEHOLDER - NOT FUNCTIONAL
setTimeout(() => {
  setSuccessMessage('If an account exists...');
}, 1500);
```

**Action:** Implement actual password reset with backend integration.

### Duplicate ProtectedRoute Implementations

**Files:**
- `src/App.tsx:38-56`
- `src/auth/components/ProtectedRoute.tsx:1-29`

**Issue:** Two different implementations with inconsistent behavior.

**Action:** Remove inline implementation in App.tsx; use ProtectedRoute.tsx.

---

## Dependency Vulnerabilities Summary

Run `npm audit` to see full details:

```
11 vulnerabilities (3 low, 3 moderate, 4 high, 1 critical)
```

**Quick Fix:**
```bash
npm audit fix
```

---

## Remediation Priority

### Phase 1: Immediate (Today)
1. Rotate exposed API keys (RapidAPI, NLT)
2. Run `npm audit fix` to patch dependencies
3. Remove hardcoded email premium bypass

### Phase 2: This Week
1. Move API keys to backend proxy
2. Remove all sensitive console.log statements
3. Implement token expiration validation
4. Add CSRF protection

### Phase 3: This Month
1. Migrate from localStorage to httpOnly cookies
2. Strengthen password requirements
3. Implement rate limiting
4. Add Content Security Policy headers
5. Consolidate API configuration
6. Implement actual password reset

### Phase 4: Ongoing
1. Regular dependency updates
2. Security testing in CI/CD
3. Penetration testing
4. Security awareness training

---

## Files Requiring Changes

| File | Priority | Issues |
|------|----------|--------|
| `src/services/bibleApi.ts` | CRITICAL | API keys, console logs |
| `src/auth/context/AuthContext.tsx` | CRITICAL | Token storage, expiration |
| `pages/learnsection/BibleSearch/index.tsx` | HIGH | Email bypass, logging |
| `src/components/hero-section.tsx` | HIGH | Email bypass |
| `src/auth/components/registratrion/Register.tsx` | MEDIUM | Password validation |
| `src/auth/components/registratrion/Login.tsx` | MEDIUM | Email validation |
| `vercel.json` | MEDIUM | Security headers |
| `package.json` | HIGH | Dependencies |

---

## Verification Checklist

After implementing fixes, verify:

- [ ] API keys no longer visible in production bundle (`npm run build && grep -r "rapidapi" dist/`)
- [ ] No console.log in production (`grep -r "console.log" src/`)
- [ ] Token expiration validated on app load
- [ ] CSRF tokens sent with POST requests
- [ ] Password requirements enforced (12+ chars, complexity)
- [ ] `npm audit` returns 0 vulnerabilities
- [ ] Security headers present (check with https://securityheaders.com)

---

## References

- OWASP Top 10: https://owasp.org/Top10/
- React Security Best Practices: https://react.dev/learn/security
- JWT Best Practices: https://auth0.com/blog/jwt-security-best-practices/
- Content Security Policy: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP

---

**Report Generated:** 2025-11-21
**Next Audit Recommended:** After fixes implemented
