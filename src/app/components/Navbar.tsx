'use client';

import { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
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
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-700">
          SME
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          <ul className="flex gap-4 text-sm font-medium text-gray-700">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-blue-600 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {user ? (
            <>
              <span className="text-sm font-medium text-gray-600">
                Hola, {user.name}
              </span>
              <button
                onClick={logout}
                className="bg-red-100 hover:bg-red-200 text-red-700 text-sm px-4 py-2 rounded-md transition-colors"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-blue-700 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
            >
              Iniciar sesión
            </Link>
          )}

          <Link
            href="/donaciones"
            className="bg-green-600 text-white text-sm px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Donar ahora
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-blue-700 focus:outline-none"
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 pb-4">
          <ul className="space-y-3 text-sm font-medium text-gray-700">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block hover:text-blue-600"
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {user ? (
              <>
                <li className="text-gray-600 font-medium">
                  Hola, {user.name}
                </li>
                <li>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left hover:text-blue-600"
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
                  className="block hover:text-blue-600"
                >
                  Iniciar sesión
                </Link>
              </li>
            )}
          </ul>

          <Link
            href="/donaciones"
            onClick={() => setIsOpen(false)}
            className="mt-4 inline-block bg-green-600 text-white text-sm px-4 py-2 rounded-md hover:bg-green-700 transition-colors w-full text-center"
          >
            Donar ahora
          </Link>
        </div>
      )}
    </header>
  );
}
