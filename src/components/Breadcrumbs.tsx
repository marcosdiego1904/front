import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

/**
 * Breadcrumbs Component with SEO-optimized BreadcrumbList Schema
 *
 * Automatically generates breadcrumb navigation and structured data
 * based on current route.
 *
 * Features:
 * - Automatic breadcrumb generation from route
 * - BreadcrumbList JSON-LD structured data
 * - Responsive design
 * - Accessibility (semantic HTML, ARIA)
 *
 * @example
 * ```tsx
 * <Breadcrumbs />
 * ```
 */
export default function Breadcrumbs() {
  const location = useLocation();

  // Generate breadcrumb items from current path
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);

    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', path: '/' }
    ];

    // Route name mapping for better labels
    const routeLabels: Record<string, string> = {
      'bible-search': 'Bible Search',
      'learn': 'Learn',
      'ranks': 'Rankings',
      'about': 'About Us',
      'support': 'Support',
      'subscriptions': 'Subscriptions',
      'dashboard': 'Dashboard',
      'profile': 'My Profile',
      'memorized-verses': 'Memorized Verses',
      'terms': 'Terms of Service',
      'privacy': 'Privacy Policy',
      'login': 'Login',
      'register': 'Register',
      'forgot-password': 'Forgot Password'
    };

    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({ label, path: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Don't show breadcrumbs on homepage
  if (location.pathname === '/') {
    return null;
  }

  // Generate BreadcrumbList structured data
  useEffect(() => {
    // Remove existing breadcrumb schema if any
    const existingSchema = document.querySelector('script[data-breadcrumb-schema]');
    if (existingSchema) {
      existingSchema.remove();
    }

    // Create new schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.label,
        "item": `https://lamptomyfeet.co${crumb.path}`
      }))
    };

    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-breadcrumb-schema', 'true');
    script.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(script);

    return () => {
      const schemaToRemove = document.querySelector('script[data-breadcrumb-schema]');
      if (schemaToRemove) {
        schemaToRemove.remove();
      }
    };
  }, [location.pathname]);

  return (
    <nav
      aria-label="Breadcrumb"
      className="py-3 px-4 bg-gray-50 border-b border-gray-200"
    >
      <ol className="flex items-center space-x-2 text-sm max-w-7xl mx-auto">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={crumb.path} className="flex items-center">
              {index > 0 && (
                <ChevronRight
                  className="w-4 h-4 mx-2 text-gray-400"
                  aria-hidden="true"
                />
              )}

              {isLast ? (
                <span
                  className="text-gray-700 font-medium"
                  aria-current="page"
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Compact Breadcrumbs - Minimal version for tight spaces
 */
export function CompactBreadcrumbs() {
  const location = useLocation();

  if (location.pathname === '/') {
    return null;
  }

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);

    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', path: '/' }
    ];

    const routeLabels: Record<string, string> = {
      'bible-search': 'Bible Search',
      'learn': 'Learn',
      'ranks': 'Rankings',
      'about': 'About',
      'support': 'Support',
      'subscriptions': 'Subscriptions',
      'dashboard': 'Dashboard',
      'profile': 'Profile',
      'memorized-verses': 'Verses',
      'terms': 'Terms',
      'privacy': 'Privacy',
      'login': 'Login',
      'register': 'Register'
    };

    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({ label, path: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 text-xs text-gray-600">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={crumb.path} className="flex items-center">
              {index > 0 && <span className="mx-1">/</span>}

              {isLast ? (
                <span className="font-medium">{crumb.label}</span>
              ) : (
                <Link
                  to={crumb.path}
                  className="hover:text-blue-600 transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
