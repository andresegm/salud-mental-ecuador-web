'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { label: "Acerca de SME", href: "/" },
  { label: "Equipo", href: "/equipo" },
  { label: "Servicios", href: "/servicios" },
  { label: "Testimonios", href: "/testimonios" },
  { label: "Eventos", href: "/eventos" },
  { label: "Patrocinadores", href: "/patrocinadores" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, logout } = useAuth();

  // Load saved dark mode preference from localStorage initially
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedDarkMode);
  }, []);

  // Update localStorage and document class whenever dark mode state changes
  useEffect(() => {
    if (isDarkMode) {
      document.querySelector('html')?.classList.add('dark');
    } else {
      document.querySelector('html')?.classList.remove('dark');
    }
    localStorage.setItem("darkMode", isDarkMode.toString());
  }, [isDarkMode]);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-700 dark:text-blue-300">
          SME
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          <ul className="flex gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {user ? (
            <>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Hola, {user.name}
              </span>
              <button
                onClick={logout}
                className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-4 py-2 rounded-md transition-colors"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-blue-700 dark:bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors"
            >
              Iniciar sesión
            </Link>
          )}

          <Link
            href="/donaciones"
            className="bg-green-600 dark:bg-green-500 text-white text-sm px-4 py-2 rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
          >
            Donar ahora
          </Link>

          <button
            onClick={() => setIsDarkMode(prevMode => !prevMode)}
            className="text-blue-700 dark:text-blue-300 focus:outline-none"
          >
            {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-blue-700 dark:text-blue-300 focus:outline-none"
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 pb-4">
          <ul className="space-y-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {user ? (
              <>
                <li className="text-gray-600 dark:text-gray-300 font-medium">
                  Hola, {user.name}
                </li>
                <li>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Iniciar sesión
                </Link>
              </li>
            )}
          </ul>

          <Link
            href="/donaciones"
            onClick={() => setIsOpen(false)}
            className="mt-4 inline-block bg-green-600 dark:bg-green-500 text-white text-sm px-4 py-2 rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors w-full text-center"
          >
            Donar ahora
          </Link>

          <button
            onClick={() => setIsDarkMode(prevMode => !prevMode)}
            className="mt-4 inline-flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors w-full"
          >
            {isDarkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
            {isDarkMode ? 'Modo claro' : 'Modo oscuro'}
          </button>
        </div>
      )}
    </header>
  );
}
