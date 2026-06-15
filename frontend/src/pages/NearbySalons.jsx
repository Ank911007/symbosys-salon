import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { curatedSanctuaries } from '../data/mockData';
import { getDistance } from '../lib/utils';
import { fetchNearbySalons } from '../lib/api';
import heroBg from '../assets/hero_bg.png';
import HeroSearchBar from '../components/salons/HeroSearchBar';
import CategoryCarousel from '../components/salons/CategoryCarousel';
import ServiceShowcase from '../components/salons/ServiceShowcase';
import SalonResultCard from '../components/salons/SalonResultCard';
import SalonResultCardSkeleton from '../components/salons/SalonResultCardSkeleton';
import { SimpleFooter } from '../components/sections/SimpleFooter';

const categories = [
  { id: 'hair', name: 'HAIR', icon: '✂️' },
  { id: 'spa', name: 'SPA', icon: '🌿' },
  { id: 'nails', name: 'NAILS', icon: '🖐️' },
  { id: 'grooming', name: 'GROOMING', icon: '🧑' },
  { id: 'facial', name: 'FACIAL', icon: '💆‍♀️' },
  { id: 'massage', name: 'MASSAGE', icon: '💆‍♂️' },
  { id: 'makeup', name: 'MAKEUP', icon: '💄' },
  { id: 'brows', name: 'BROWS', icon: '✏️' },
];

const groomingOptions = ['Haircut', 'Massage', 'Facial', 'Spa', 'Nails', 'Grooming', 'Makeup', 'Brows'];
const cityOptions = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur',
  'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad',
  'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad',
  'Amritsar', 'Allahabad', 'Ranchi', 'Gwalior', 'Jabalpur', 'Coimbatore', 'Vijayawada', 'Jodhpur', 'Madurai',
  'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Thiruvananthapuram', 'Bhubaneswar', 'Dehradun', 'Kochi'
];

export default function NearbySalons() {
  const [salons, setSalons] = useState(curatedSanctuaries);
  const [locationState, setLocationState] = useState('loading');

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!('geolocation' in navigator)) {
      setLocationState('denied');
    } else {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const realSalons = await fetchNearbySalons(latitude, longitude, 99999);
            setSalons(realSalons);
          } catch (err) {
            console.error('Overpass fetch failed, using fallback:', err);
            setSalons([]);
          }
          setLocationState('granted');
        },
        () => { 
          // If geolocation is denied/fails, fetch all real salons from the database instead of fake mockData
          fetch(`${import.meta.env.VITE_API_URL || '/api'}/salons`)
            .then(res => res.json())
            .then(({ data }) => {
              const formatted = data.map(salon => ({
                id: salon.id,
                name: salon.name,
                category: salon.category || 'Beauty Parlour',
                address: salon.salonAddress?.address || salon.address || 'Unknown',
                city: salon.city || null,
                lat: salon.salonAddress?.lat || salon.lat,
                lng: salon.salonAddress?.lng || salon.lng,
                distance: 0,
                rating: salon.rating ? salon.rating.toFixed(1) : '5.0',
                reviews: salon.totalReviews || 0,
                image: salon.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80',
                website: salon.website || null,
                features: salon.features || [],
                priceLevel: '$$',
                reviewSnippet: salon.reviews?.[0]?.comment || null,
                services: salon.services || [],
                stylists: salon.stylists || [],
              }));
              
              setSalons(formatted);
              setLocationState('granted');
            })
            .catch(err => {
              console.error('Failed fallback fetch:', err);
              setSalons([]);
              setLocationState('denied');
            });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  const handleSearch = (filters) => {
    console.log('Searching with filters: ', filters);
  };

  return (
    <div
      className="min-h-screen text-[#1a3d1f] selection:bg-[#4a9e5c] selection:text-white overflow-x-hidden relative transition-colors duration-300"
      style={{ background: 'linear-gradient(160deg, #e8f5ea 0%, #f7fbf7 40%, #ffffff 100%)' }}
    >

      {/* Back Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
        className="absolute top-8 left-6 md:left-12 z-50"
      >
        <Link
          to="/"
          className="group flex items-center gap-3 bg-white text-[#1a3d1f] px-5 py-2.5 rounded-full shadow-[0_8px_30px_rgba(74,158,92,0.12)] hover:shadow-[0_8px_30px_rgba(74,158,92,0.22)] transition-all duration-300 hover:bg-[#f0f7f1] focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] focus:ring-offset-2"
          aria-label="Return to Minta Homepage"
        >
          <div className="bg-[#4a9e5c] text-white p-1.5 rounded-full group-hover:-translate-x-1 transition-transform duration-300">
            <ArrowLeft size={14} strokeWidth={3} />
          </div>
          <span className="font-syne font-bold tracking-[0.25em] uppercase text-xs mt-0.5">Minta</span>
        </Link>
      </motion.div>

      {/* Hero Section */}
      <section className="relative min-h-[75vh] flex flex-col justify-center items-center pt-24 pb-12 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-fixed bg-cover bg-center scale-105 contrast-75 brightness-110"
            style={{ backgroundImage: `url(${heroBg})` }}
          />
          <div
            className="absolute inset-0 transition-colors duration-300"
            style={{
              background: 'linear-gradient(to bottom, rgba(232,245,234,0.96) 0%, rgba(240,247,241,0.80) 50%, rgba(247,251,247,1) 100%)'
            }}
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-semibold tracking-tight leading-tight text-[#1a3d1f]">
              Beauty that works <span className="italic font-normal text-[#4a9e5c]">for you</span>
            </h1>
            <p className="text-sm md:text-base text-[#5a8c63] max-w-2xl mx-auto font-medium tracking-wide leading-relaxed font-syne">
              Discover and book premium self-care experiences. Curated sanctuaries
              blending traditional hospitality with modern wellness.
            </p>
          </motion.div>

          <HeroSearchBar
            groomingOptions={groomingOptions}
            cityOptions={cityOptions}
            onSearch={handleSearch}
          />
        </div>
      </section>

      {/* Category Cards Carousel */}
      <CategoryCarousel categories={categories} />

      {/* Service Showcase */}
      <ServiceShowcase />

      {/* Featured Sanctuaries */}
      <section className="w-full max-w-7xl mx-auto px-6 py-20 mb-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1a3d1f] mb-2">Featured Sanctuaries</h2>
            <p className="text-[#6aaa7a] text-sm font-syne">Top-rated local salons near you.</p>
          </div>
          <Link
            to="/search"
            className="text-[10px] font-syne tracking-widest font-bold uppercase text-[#4a9e5c] hover:text-[#2d5a34] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] p-1 rounded-sm"
          >
            VIEW ALL →
          </Link>
        </div>

        {locationState === 'loading' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
            {[...Array(6)].map((_, index) => (
              <SalonResultCardSkeleton key={index} />
            ))}
          </div>
        ) : salons.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#d0ead4] rounded-3xl">
            <p className="text-[#6aaa7a] font-syne">No sanctuaries found in your area yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
            {salons.map((sanctuary, index) => (
              <SalonResultCard
                key={sanctuary.id}
                salon={sanctuary}
                index={index}
              />
            ))}
          </div>
        )}
      </section>

      <SimpleFooter />
    </div>
  );
}
