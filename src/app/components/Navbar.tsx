// components/Navbar.tsx
import Link from "next/link";

const navLinks = [
  { label: "Acerca de SME", href: "/" },
  { label: "Equipo", href: "/equipo" },
  { label: "Servicios", href: "/servicios" },
  { label: "Testimonios", href: "/testimonios" },
  { label: "Eventos", href: "/eventos" },
  { label: "Patrocinadores", href: "/patrocinadores" },
  { label: "Involúcrate", href: "/involucrate" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-700">
          SME
        </Link>
        <ul className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
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
      </nav>
    </header>
  );
}
