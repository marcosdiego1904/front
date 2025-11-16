// This is a placeholder navbar component for any pages not using HomepageNavigation
// Currently all pages use HomepageNavigation, but this exists to prevent import errors

import HomepageNavigation from "./components/homepage-navigation"

export default function Navbar() {
  // For now, just use the same HomepageNavigation component
  // Can be customized later if needed for specific authenticated pages
  return <HomepageNavigation />
}
