// components/Footer.tsx
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 text-center text-sm text-gray-600 py-8 mt-16">
      <p className="mb-1 font-medium text-gray-700">
        Fundación Salud Mental Ecuador
      </p>
      <p className="text-xs">Acuerdo Ministerial: 00075-2022</p>
      <p className="text-xs mt-1">©2020 por SaludMentalEC</p>
      <p className="mt-4">
        <a href="/gobernanza" className="text-blue-700 hover:underline font-medium">
          Gobernanza
        </a>
      </p>

      {/* Social Media Icons */}
      <div className="flex justify-center gap-4 mt-4 text-blue-700">
        <a
          href="https://www.facebook.com/saludmentalecua"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-500 transition"
        >
          <FaFacebookF size={18} />
        </a>
        <a
          href="https://www.instagram.com/saludmentalecuador/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pink-500 transition"
        >
          <FaInstagram size={18} />
        </a>
        <a
          href="https://www.linkedin.com/company/salud-mental-ecuador/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition"
        >
          <FaLinkedinIn size={18} />
        </a>
      </div>
    </footer>
  );
}
