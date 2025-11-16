import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../auth/context/AuthContext"
import logo from "../oil-lamp.png"

export default function HomepageNavigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogoClick = () => {
    navigate("/")
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLearnClick = (e: React.MouseEvent) => {
    e.preventDefault()
    // Scroll to categories section on homepage
    const categoriesSection = document.getElementById('categories-section')
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  const handleNavClick = (path: string) => {
    navigate(path)
    setIsMobileMenuOpen(false)
  }

  const handleLoginClick = () => {
    navigate("/login")
    setIsMobileMenuOpen(false)
  }

  const handleStartClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard")
    } else {
      navigate("/register")
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm"
          : "bg-white/80 backdrop-blur-sm"
      }`}
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
            <span className="text-xl font-semibold text-gray-900 tracking-tight">
              Lamp to My Feet
            </span>
            <img src={logo} alt="Lamp Icon" className="w-8 h-8" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleNavClick("/")}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-all duration-200 no-underline"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick("/bible-search")}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-all duration-200 no-underline"
              >
                Bible Search
              </button>
              <button
                onClick={() => handleNavClick("/about")}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-all duration-200 no-underline"
              >
                About
              </button>
              <button
                onClick={() => handleNavClick("/support")}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-all duration-200 no-underline"
              >
                Support Us
              </button>
              <button
                onClick={() => handleNavClick("/subscriptions")}
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 hover:from-amber-400 hover:to-amber-300 rounded-lg transition-all duration-200 no-underline font-semibold shadow-md hover:shadow-lg"
              >
                Go Premium
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => handleNavClick("/dashboard")}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-all duration-200 no-underline"
                >
                  Dashboard
                </button>
              )}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={handleLoginClick}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-all duration-200 no-underline"
                >
                  Log In
                </button>
                <button
                  onClick={handleStartClick}
                  className="relative px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-emerald-500 hover:to-emerald-400 transform hover:scale-[1.02] transition-all duration-200 overflow-hidden group no-underline"
                >
                  <span className="relative z-10">Start for Free</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/dashboard")}
                className="relative px-6 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-gray-800 hover:to-gray-700 transform hover:scale-[1.02] transition-all duration-200 overflow-hidden group no-underline"
              >
                <span className="relative z-10">Dashboard</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-all duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-out ${
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-1 bg-white/95 backdrop-blur-md border-t border-gray-200/50">
          <button
            onClick={() => handleNavClick("/")}
            className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-all duration-200 no-underline"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick("/bible-search")}
            className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-all duration-200 no-underline"
          >
            Bible Search
          </button>
          <button
            onClick={() => handleNavClick("/about")}
            className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-all duration-200 no-underline"
          >
            About
          </button>
          <button
            onClick={() => handleNavClick("/support")}
            className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-all duration-200 no-underline"
          >
            Support Us
          </button>
          <button
            onClick={() => handleNavClick("/subscriptions")}
            className="block w-full text-left px-4 py-3 text-base font-medium bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 hover:from-amber-400 hover:to-amber-300 rounded-lg transition-all duration-200 no-underline font-semibold shadow-md"
          >
            Go Premium
          </button>
          {isAuthenticated && (
            <button
              onClick={() => handleNavClick("/dashboard")}
              className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-all duration-200 no-underline"
            >
              Dashboard
            </button>
          )}

          <div className="pt-3 border-t border-gray-200/50 mt-3">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={handleLoginClick}
                  className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-all duration-200 no-underline"
                >
                  Log In
                </button>
                <div className="px-4 py-2">
                  <button
                    onClick={handleStartClick}
                    className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-base font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-emerald-500 hover:to-emerald-400 transition-all duration-200 no-underline"
                  >
                    Start for Free
                  </button>
                </div>
              </>
            ) : (
              <div className="px-4 py-2">
                <button
                  onClick={() => {
                    navigate("/dashboard")
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-base font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-gray-800 hover:to-gray-700 transition-all duration-200 no-underline"
                >
                  Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
