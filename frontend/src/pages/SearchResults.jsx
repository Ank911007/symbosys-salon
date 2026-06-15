import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Search, ChevronDown, SlidersHorizontal, X, Loader2, Navigation } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { curatedSanctuaries } from '../data/mockData';
import { getDistance } from '../lib/utils';
import { fetchNearbySalons } from '../lib/api';
import SalonResultCard from '../components/salons/SalonResultCard';
import { SimpleFooter } from '../components/sections/SimpleFooter';
import { Pagination } from '../components/ui/Pagination';
import { UserProfileDropdown } from '../components/ui/UserProfileDropdown';

// ─── Constants ────────────────────────────────────────────────────────────────

const DISTANCE_OPTIONS = [
  { label: 'Any Distance', value: 99999 },
  { label: 'Within 1 km', value: 1 },
  { label: 'Within 2 km', value: 2 },
  { label: 'Within 5 km', value: 5 },
  { label: 'Within 10 km', value: 10 },
  { label: 'Within 20 km', value: 20 },
  { label: 'Within 50 km', value: 50 },
];

const SORT_OPTIONS = [
  { label: 'Nearest First', value: 'distance' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Most Reviewed', value: 'reviews' },
];

const CATEGORY_FILTERS = ['All', 'Hair', 'Spa', 'Nails', 'Facial', 'Grooming', 'Massage', 'Makeup'];

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * LocationBanner — shows location status with CTA to use GPS
 */
function LocationBanner({ locationState, onUseLocation }) {
  if (locationState === 'granted') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 text-green-700 text-xs font-syne"
        role="status"
        aria-live="polite"
      >
        <Navigation size={13} className="text-green-500 shrink-0" aria-hidden="true" />
        <span>Showing real salons near you from OpenStreetMap</span>
      </motion.div>
    );
  }

  if (locationState === 'loading') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 bg-[#f0f7f1] border border-[#b8d9bc] rounded-xl px-4 py-2.5 text-[#3a7d4a] text-xs font-syne"
        role="status"
        aria-live="polite"
      >
        <Loader2 size={13} className="animate-spin text-[#5aaa6f] shrink-0" aria-hidden="true" />
        <span>Finding salons near you…</span>
      </motion.div>
    );
  }

  // denied or idle — show CTA
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between gap-3 bg-white border border-[#c8e6cc] rounded-xl px-4 py-2.5 shadow-sm"
    >
      <div className="flex items-center gap-2 text-xs font-syne text-[#5b7a5e]">
        <MapPin size={13} className="text-[#6ab87a] shrink-0" aria-hidden="true" />
        <span>Enable location for better results</span>
      </div>
      <button
        onClick={onUseLocation}
        className="flex items-center gap-1.5 bg-[#4a9e5c] hover:bg-[#3d8a4f] text-white text-[10px] font-syne font-bold tracking-widest uppercase px-4 py-2 rounded-full transition-all duration-200 hover:scale-[1.03] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] focus:ring-offset-2 shrink-0"
        aria-label="Use my current location"
      >
        <Navigation size={11} aria-hidden="true" />
        Use My Location
      </button>
    </motion.div>
  );
}

/**
 * DistanceDropdown — accessible custom select for distance filter
 */
function DistanceDropdown({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const selected = DISTANCE_OPTIONS.find(o => o.value === value) || DISTANCE_OPTIONS[0];

  return (
    <div className="relative" role="group" aria-label="Filter by distance">
      <button
        onClick={() => setOpen(v => !v)}
        disabled={disabled}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-syne font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] focus:ring-offset-1 ${
          disabled
            ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white border-[#b8d9bc] text-[#2d5a34] hover:border-[#4a9e5c] hover:bg-[#f0f7f1] cursor-pointer'
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
        id="distance-btn"
      >
        <SlidersHorizontal size={14} aria-hidden="true" />
        <span>{selected.label}</span>
        <ChevronDown
          size={14}
          className={`text-[#6aaa7a] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden="true" />
            <motion.ul
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              role="listbox"
              aria-labelledby="distance-btn"
              className="absolute top-[calc(100%+6px)] left-0 z-20 bg-white border border-[#c8e6cc] rounded-2xl shadow-[0_8px_32px_rgba(74,158,92,0.12)] overflow-hidden min-w-[180px]"
            >
              {DISTANCE_OPTIONS.map(opt => (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={opt.value === value}
                  className={`px-5 py-3 text-sm font-syne cursor-pointer transition-all duration-150 flex items-center gap-2 ${
                    opt.value === value
                      ? 'bg-[#f0f7f1] text-[#2d5a34] font-semibold'
                      : 'text-[#4a6b4e] hover:bg-[#f7faf7] hover:text-[#2d5a34]'
                  }`}
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                >
                  {opt.value === value && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4a9e5c]" aria-hidden="true" />
                  )}
                  {opt.value !== value && (
                    <span className="w-1.5 h-1.5 rounded-full bg-transparent" aria-hidden="true" />
                  )}
                  {opt.label}
                </li>
              ))}
            </motion.ul>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * SortDropdown — accessible sort picker
 */
function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = SORT_OPTIONS.find(o => o.value === value) || SORT_OPTIONS[0];

  return (
    <div className="relative" role="group" aria-label="Sort results">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#b8d9bc] bg-white text-sm font-syne font-medium text-[#2d5a34] hover:border-[#4a9e5c] hover:bg-[#f0f7f1] cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] focus:ring-offset-1"
        aria-haspopup="listbox"
        aria-expanded={open}
        id="sort-btn"
      >
        <span className="text-[#6aaa7a] text-[10px] font-bold tracking-wider uppercase">Sort:</span>
        <span>{selected.label}</span>
        <ChevronDown
          size={14}
          className={`text-[#6aaa7a] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden="true" />
            <motion.ul
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              role="listbox"
              aria-labelledby="sort-btn"
              className="absolute top-[calc(100%+6px)] right-0 z-20 bg-white border border-[#c8e6cc] rounded-2xl shadow-[0_8px_32px_rgba(74,158,92,0.12)] overflow-hidden min-w-[180px]"
            >
              {SORT_OPTIONS.map(opt => (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={opt.value === value}
                  className={`px-5 py-3 text-sm font-syne cursor-pointer transition-all duration-150 flex items-center gap-2 ${
                    opt.value === value
                      ? 'bg-[#f0f7f1] text-[#2d5a34] font-semibold'
                      : 'text-[#4a6b4e] hover:bg-[#f7faf7] hover:text-[#2d5a34]'
                  }`}
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                >
                  {opt.value === value && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4a9e5c]" aria-hidden="true" />
                  )}
                  {opt.value !== value && (
                    <span className="w-1.5 h-1.5 rounded-full bg-transparent" aria-hidden="true" />
                  )}
                  {opt.label}
                </li>
              ))}
            </motion.ul>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * CategoryPills — horizontal scrollable filter chips
 */
function CategoryPills({ selected, onChange }) {
  return (
    <div
      className="flex items-center gap-2 overflow-x-auto pb-1 custom-scroll"
      role="group"
      aria-label="Filter by category"
    >
      {CATEGORY_FILTERS.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`shrink-0 px-4 py-2 rounded-full text-xs font-syne font-bold tracking-wider uppercase transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] focus:ring-offset-1 ${
            selected === cat
              ? 'bg-[#4a9e5c] text-white shadow-[0_4px_14px_rgba(74,158,92,0.3)]'
              : 'bg-white border border-[#b8d9bc] text-[#4a6b4e] hover:border-[#4a9e5c] hover:text-[#2d5a34] hover:bg-[#f0f7f1]'
          }`}
          aria-pressed={selected === cat}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

/**
 * EmptyState — shown when no salons match filters
 */
function EmptyState({ onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-24 px-6"
      role="status"
      aria-live="polite"
    >
      <div className="w-20 h-20 rounded-full bg-[#e8f5ea] flex items-center justify-center mb-6">
        <Search size={32} className="text-[#6aaa7a]" aria-hidden="true" />
      </div>
      <h3 className="font-serif text-2xl text-[#2d5a34] mb-2">No salons found</h3>
      <p className="text-sm text-[#7aaa84] font-syne max-w-xs leading-relaxed mb-8">
        Try adjusting your distance or category filters to find more salons near you.
      </p>
      <button
        onClick={onReset}
        className="px-6 py-3 bg-[#4a9e5c] text-white font-syne font-bold text-xs tracking-widest uppercase rounded-full hover:bg-[#3d8a4f] transition-all duration-200 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] focus:ring-offset-2"
      >
        Reset Filters
      </button>
    </motion.div>
  );
}

/**
 * LoadingSkeletons — shimmer placeholders while fetching location
 */
function LoadingSkeletons() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Loading salons…" aria-busy="true">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="bg-white rounded-[2rem] overflow-hidden border border-[#e0f0e3] shadow-sm animate-pulse">
          <div className="h-56 bg-[#e8f5ea]" />
          <div className="p-6 space-y-3">
            <div className="h-3 w-1/3 bg-[#d0ead4] rounded-full" />
            <div className="h-5 w-3/4 bg-[#d0ead4] rounded-full" />
            <div className="h-3 w-full bg-[#e0f0e3] rounded-full" />
            <div className="h-3 w-2/3 bg-[#e0f0e3] rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const queryService = searchParams.get('service') || '';
  const queryCity = searchParams.get('city') || '';

  const [salons, setSalons] = useState(curatedSanctuaries);
  const [locationState, setLocationState] = useState('idle'); // idle | loading | granted | denied
  const [userCoords, setUserCoords] = useState(null);
  const [maxDistance, setMaxDistance] = useState(99999);
  const [sortBy, setSortBy] = useState('distance');
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState(queryService);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  // Scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Request geolocation + fetch real salons from OpenStreetMap
  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setLocationState('denied');
      return;
    }
    setLocationState('loading');
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        setUserCoords({ lat: latitude, lng: longitude });
        try {
          const realSalons = await fetchNearbySalons(latitude, longitude, 99999);
          setSalons(realSalons);
        } catch (err) {
          console.error('Overpass fetch failed, using fallback data:', err);
          setSalons([]);
        }
        setLocationState('granted');
        setSortBy('distance');
      },
      () => {
        setLocationState('denied');
        // Fetch all salons from DB if geolocation is denied
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
              description: salon.description || null,
              services: salon.services || [],
              stylists: salon.stylists || [],
            }));
            setSalons(formatted);
          })
          .catch(err => {
            console.error('Failed fallback fetch in SearchResults:', err);
          });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // Auto-request on mount
  useEffect(() => { requestLocation(); }, [requestLocation]);

  // Derived / filtered list
  const filteredSalons = useMemo(() => {
    let list = [...salons];

    // text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q) ||
        s.address?.toLowerCase().includes(q)
      );
    }

    // category filter
    if (category !== 'All') {
      list = list.filter(s =>
        s.category?.toLowerCase().includes(category.toLowerCase()) ||
        s.features?.some(f => f.toLowerCase().includes(category.toLowerCase()))
      );
    }

    // distance filter (only if location granted and distance set)
    if (locationState === 'granted' && maxDistance !== 99999) {
      list = list.filter(s => (s.distance ?? Infinity) <= maxDistance);
    }

    // sort
    list.sort((a, b) => {
      if (sortBy === 'distance') return (a.distance ?? 99999) - (b.distance ?? 99999);
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviews - a.reviews;
      return 0;
    });

    return list;
  }, [salons, searchQuery, category, maxDistance, locationState, sortBy]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, category, maxDistance, sortBy]);

  const resetFilters = () => {
    setCategory('All');
    setMaxDistance(99999);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const activeFilterCount = [
    category !== 'All',
    maxDistance !== 99999,
    searchQuery.trim() !== '',
  ].filter(Boolean).length;

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: 'linear-gradient(160deg, #e8f5ea 0%, #f7fbf7 40%, #ffffff 100%)' }}
    >
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-[#d0ead4] shadow-[0_2px_16px_rgba(74,158,92,0.06)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center gap-4">

          {/* Back Button */}
          <Link
            to="/"
            className="group flex items-center gap-2 text-[#2d5a34] hover:text-[#1a3d1f] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] rounded-lg p-1 -ml-1 shrink-0"
            aria-label="Return to Minta homepage"
          >
            <div className="w-8 h-8 rounded-full bg-[#e8f5ea] group-hover:bg-[#4a9e5c] flex items-center justify-center transition-all duration-200">
              <ArrowLeft size={15} className="text-[#4a9e5c] group-hover:text-white transition-colors duration-200" aria-hidden="true" />
            </div>
            <span className="font-syne font-bold text-xs tracking-[0.2em] uppercase hidden sm:inline">Minta</span>
          </Link>

          {/* Inline Search Bar */}
          <div className="flex-1 flex items-center bg-[#f0f7f1] border border-[#c0ddc4] rounded-xl px-4 py-2.5 gap-3">
            <Search size={16} className="text-[#6aaa7a] shrink-0" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={queryService || 'Search salons, services…'}
              className="flex-1 bg-transparent text-sm font-syne text-[#2d5a34] placeholder:text-[#9abf9d] focus:outline-none"
              aria-label="Search salons"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#9abf9d] hover:text-[#4a9e5c] transition-colors focus:outline-none"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Location pill */}
          {queryCity && (
            <div className="hidden md:flex items-center gap-1.5 bg-[#e8f5ea] border border-[#b8d9bc] rounded-full px-3 py-2 text-xs font-syne font-bold text-[#2d5a34] shrink-0 mr-2">
              <MapPin size={12} className="text-[#4a9e5c]" aria-hidden="true" />
              {queryCity}
            </div>
          )}

          <div className="shrink-0 flex items-center">
            <UserProfileDropdown />
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-1"
        >
          <h1 className="font-serif text-3xl md:text-4xl text-[#1a3d1f] leading-tight">
            {queryService
              ? <><span className="italic font-light">{queryService}</span> near {queryCity || 'you'}</>
              : 'Nearby Salons'
            }
          </h1>
          <p className="text-sm text-[#6aaa7a] font-syne">
            {locationState === 'loading' ? 'Detecting your location…' : `${filteredSalons.length} sanctuaries found`}
          </p>
        </motion.div>

        {/* Location Banner */}
        <LocationBanner locationState={locationState} onUseLocation={requestLocation} />

        {/* Filters Row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-3"
        >
          {/* Top: distance + sort dropdowns */}
          <div className="flex items-center gap-3 flex-wrap">
            <DistanceDropdown
              value={maxDistance}
              onChange={setMaxDistance}
              disabled={locationState !== 'granted'}
            />
            <SortDropdown value={sortBy} onChange={setSortBy} />
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 bg-red-50 text-red-500 text-xs font-syne font-bold tracking-wider hover:bg-red-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
                aria-label={`Clear ${activeFilterCount} active filter${activeFilterCount > 1 ? 's' : ''}`}
              >
                <X size={12} aria-hidden="true" />
                Clear filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
            )}
          </div>

          {/* Category pills */}
          <CategoryPills selected={category} onChange={setCategory} />
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-[#c8e6cc] via-[#a8d4ae] to-transparent" aria-hidden="true" />

        {/* Results Grid */}
        {locationState === 'loading' ? (
          <LoadingSkeletons />
        ) : filteredSalons.length === 0 ? (
          <EmptyState onReset={resetFilters} />
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              role="list"
              aria-label="Salon results"
            >
              <AnimatePresence mode="popLayout">
                {filteredSalons.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((salon, index) => (
                  <SalonResultCard key={salon.id} salon={salon} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>
            
            {/* Pagination Controls */}
            {filteredSalons.length > ITEMS_PER_PAGE && (
              <div className="mt-12 mb-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredSalons.length / ITEMS_PER_PAGE)}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                />
              </div>
            )}
          </>
        )}
      </main>

      <SimpleFooter />
    </div>
  );
}
