import React from 'react';
import Navbar from '../Navbar';
import Footer from '../components/sections/Footer';
import { motion } from 'framer-motion';
import { Check, Target, Eye, Heart, MapPin, Phone } from 'lucide-react';

const ARTISANS = [
  {
    id: 1,
    name: 'Emma Johnson',
    role: 'Founder & Creative Director',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    name: 'Anita Johnson',
    role: 'Blow Dry & Curl Specialist',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 3,
    name: 'John Doe',
    role: 'Master Stylist & Barber',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800'
  }
];

const LOCATIONS = [
  {
    id: 1,
    name: 'Munnekolal',
    address: 'Sai Baba Temple Rd, Silver Springs Layout, Munnekolal, Bengaluru 560037',
    phone: '+91-7098652650'
  },
  {
    id: 2,
    name: 'Brookefield',
    address: 'AECS Layout - C Block, Brookefield, Bengaluru 560037',
    phone: '+91-7019240049'
  },
  {
    id: 3,
    name: 'Nagawara',
    address: 'KA RESIDENCY, Philomena Hospital Rd, Nagawara, Bengaluru 560045',
    phone: '+91-9036360874'
  },
  {
    id: 4,
    name: 'Yamare Village',
    address: 'Yamare Village, Bengaluru, Karnataka 562125',
    phone: '+91-8431007879'
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fcfdfc] flex flex-col font-syne text-[#1a3d1f]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center mt-20 overflow-hidden">
        <div className="absolute inset-0 bg-[#1a3d1f]/40 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=2000" 
          alt="Minta Salon Interior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center px-4 flex flex-col items-center">
          <span className="text-[#c8e6cc] font-syne tracking-[0.2em] text-xs font-bold uppercase mb-4 block">ESTABLISHED SINCE 2018</span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white font-bold tracking-tight mb-6">
            Minta Premium Salon
          </h1>
          <p className="text-white/90 text-sm md:text-base max-w-2xl leading-relaxed">
            Experience a sanctuary of tranquility where luxury meets premium beauty treatments.
          </p>
        </div>
      </section>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-20 lg:py-32 flex flex-col gap-32">
        
        {/* Section 1: About Our Sanctuary */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-3xl overflow-hidden h-[500px] shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80&w=1000" 
              alt="Hair textures"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-[#e0f0e3]">
              <span className="block text-[#0b5c3b] font-serif text-2xl font-bold">10+ Years</span>
              <span className="text-[#5a8c63] text-xs uppercase tracking-widest">Industry Excellence</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[#6aaa7a] font-syne tracking-widest text-xs font-bold uppercase mb-4 block">ABOUT OUR SANCTUARY</span>
            <h2 className="font-serif text-4xl lg:text-5xl text-[#0b5c3b] mb-6 leading-[1.1]">
              Luxury Salon Where You Will Feel Unique
            </h2>
            <p className="text-[#5a8c63] text-base leading-relaxed mb-8">
              At Minta Premium Salon, we believe that everyone deserves to feel their best. With branches conveniently located across the city, we offer a comprehensive range of salon services designed to enhance your natural beauty and boost your confidence.
            </p>
            <ul className="flex flex-col gap-4">
              {[
                'Master styling with over a decade of artisanal experience.',
                'Cutting-edge wellness technologies and global trends.',
                'Curated selection of premium organic and clinical products.'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#d8eedd] text-[#0b5c3b] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span className="text-[#1a3d1f] text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Section 2: Our Philosophy */}
        <section className="flex flex-col items-center text-center">
          <h2 className="font-serif text-4xl lg:text-5xl text-[#0b5c3b] mb-4">Our Philosophy</h2>
          <p className="text-[#5a8c63] text-sm md:text-base max-w-xl leading-relaxed mb-16">
            Crafting excellence through a dedicated commitment to wellness and personalized care.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {/* Mission */}
            <div className="bg-white p-10 rounded-3xl border border-[#d8eedd] shadow-sm flex flex-col text-left hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-[#f4f9f5] rounded-xl flex items-center justify-center text-[#4a9e5c] mb-6">
                <Target size={24} />
              </div>
              <h3 className="font-serif text-2xl text-[#0b5c3b] mb-4">Our Mission</h3>
              <p className="text-[#5a8c63] text-sm leading-relaxed">
                To provide exceptional beauty and grooming services that enhance confidence. We are committed to a personalized experience through skilled professionals and a customer-first approach.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-[#139a88] p-10 rounded-3xl shadow-md flex flex-col text-left hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white mb-6 backdrop-blur-sm">
                <Eye size={24} />
              </div>
              <h3 className="font-serif text-2xl text-white mb-4">Our Vision</h3>
              <p className="text-white/90 text-sm leading-relaxed">
                To be the most trusted premium salon in the community, setting new standards in the beauty industry through innovation and a culture of wellness and self-care.
              </p>
            </div>

            {/* Approach */}
            <div className="bg-white p-10 rounded-3xl border border-[#d8eedd] shadow-sm flex flex-col text-left hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-[#f4f9f5] rounded-xl flex items-center justify-center text-[#4a9e5c] mb-6">
                <Heart size={24} />
              </div>
              <h3 className="font-serif text-2xl text-[#0b5c3b] mb-4">Our Approach</h3>
              <p className="text-[#5a8c63] text-sm leading-relaxed">
                Centering around unique needs, we offer tailored services that align with individual style. We prioritize quality, cleanliness, and meticulous attention to every detail.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Meet Our Artisans */}
        <section className="flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="text-[#6aaa7a] font-syne tracking-widest text-xs font-bold uppercase mb-2 block">THE PROFESSIONALS</span>
              <h2 className="font-serif text-4xl lg:text-5xl text-[#0b5c3b]">Meet Our Artisans</h2>
            </div>
            <a href="#" className="text-[#139a88] font-syne text-xs font-bold tracking-widest uppercase hover:underline">
              VIEW ALL STAFF &rarr;
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ARTISANS.map((artisan) => (
              <div key={artisan.id} className="flex flex-col group cursor-pointer">
                <div className="w-full h-[400px] rounded-3xl overflow-hidden mb-6">
                  <img 
                    src={artisan.image} 
                    alt={artisan.name}
                    className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-serif text-2xl text-[#0b5c3b] mb-1 group-hover:text-[#139a88] transition-colors">{artisan.name}</h3>
                <span className="text-[#139a88] font-syne text-xs font-bold uppercase tracking-widest">{artisan.role}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Visit Our Sanctuary (Locations) */}
        <section className="flex flex-col items-center">
          <h2 className="font-serif text-4xl lg:text-5xl text-[#0b5c3b] mb-4">Visit Our Sanctuary</h2>
          <p className="text-[#5a8c63] text-sm md:text-base max-w-xl text-center leading-relaxed mb-16">
            Find the nearest Minta location to begin your journey.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {LOCATIONS.map((loc) => (
              <div key={loc.id} className="bg-[#f4f9f5] p-8 rounded-3xl border border-[#e0f0e3] hover:border-[#c8e6cc] transition-colors flex flex-col group cursor-pointer">
                <h3 className="font-serif text-2xl text-[#0b5c3b] mb-4 group-hover:text-[#139a88] transition-colors">{loc.name}</h3>
                <p className="text-[#5a8c63] text-xs leading-relaxed mb-6 flex-1">
                  {loc.address}
                </p>
                <div className="flex items-center gap-2 text-[#139a88] font-syne text-xs font-bold">
                  <Phone size={14} />
                  <span>{loc.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
