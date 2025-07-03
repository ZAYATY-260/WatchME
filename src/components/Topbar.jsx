import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Topbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 flex justify-between items-center px-6 py-4 transition-colors duration-300 z-50
        ${scrolled ? "bg-black bg-opacity-90" : "bg-transparent"}
      `}
    >
      <div className="flex items-center space-x-8">
        {/* Logo */}
        <h1 className="text-3xl font-bold text-red-600 tracking-wider">WATCH ME</h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium items-center">
          <Link to="/" className="hover:text-gray-300 transition">Home</Link>
          <Link to="/movies" className="hover:text-gray-300 transition">Movies</Link>
          <Link to="/tv-shows" className="hover:text-gray-300 transition">TV Shows</Link>
          <Link to="/mylist" className="hover:text-gray-300 transition">My List</Link>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        {/* Profile Image - show only on desktop */}
        <img
          src="https://media.licdn.com/dms/image/v2/D4D35AQEJ-pIca5IaQw/profile-framedphoto-shrink_400_400/B4DZfLFZsMH4Ac-/0/1751458880757?e=1752102000&v=beta&t=jCBNqRysQcB0sEaLH3GoZwk6HqLImVYYS2qF9XDanfQ"
          alt="Profile"
          className="hidden md:block w-8 h-8 rounded-full object-cover border border-gray-500"
        />

        {/* Hamburger Icon - show only on mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu - show when open */}
      {mobileMenuOpen && (
        <nav className="absolute top-full left-0 right-0 bg-black bg-opacity-90 flex flex-col space-y-4 py-4 px-6 md:hidden z-40">
          <Link to="/" className="hover:text-gray-300 transition" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/movies" className="hover:text-gray-300 transition" onClick={() => setMobileMenuOpen(false)}>Movies</Link>
          <Link to="/tv-shows" className="hover:text-gray-300 transition" onClick={() => setMobileMenuOpen(false)}>TV Shows</Link>
          <Link to="/mylist" className="hover:text-gray-300 transition" onClick={() => setMobileMenuOpen(false)}>My List</Link>
        </nav>
      )}
    </header>
  );
};

export default Topbar;
