'use client';

import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import StatsSection from "./components/homepage/StatsSection";
import AboutSection from "./components/homepage/AboutSection";
import ServicesSection from "./components/homepage/ServicesSection";
import TimelineSection from "./components/homepage/TimelineSection";
import { useRef } from "react";

export default function Home() {

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 text-gray-900">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-100 to-blue-200 py-24 text-center">
        <h1 className="text-4xl font-extrabold text-blue-800">
            Mereces felicidad. Mereces una buena salud mental.
          </h1>
          <p className="mt-4 text-blue-700 font-medium text-lg max-w-2xl mx-auto">
            Porque el bienestar emocional es un derecho, no un privilegio.
          </p>
        </section>

     
        <StatsSection />

        <AboutSection />

        <ServicesSection />

        <TimelineSection />

      </main>
      <Footer />
    </>
  );
}