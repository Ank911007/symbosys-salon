/**
 * Centralized API client for Minta Salon.
 * Single source of truth for base URL, auth headers, and error handling.
 */

const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Make an authenticated API request.
 * Automatically attaches the JWT token from localStorage.
 *
 * @param {string} endpoint - API path (e.g. '/salons/nearby')
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<object>} Parsed JSON response
 * @throws {Error} With the server's error message
 */
export async function apiClient(endpoint, options = {}) {
  const token = localStorage.getItem('minta_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || data.error || 'Something went wrong');
    error.status = response.status;
    throw error;
  }

  return data;
}

/**
 * Map raw backend salon data into the shape expected by frontend components.
 * Single source of truth — replaces duplicate mapping in api.js and SearchResults.jsx.
 *
 * @param {object} salon - Raw salon object from the API
 * @returns {object} Normalized salon for SalonResultCard
 */
export function mapSalonResponse(salon) {
  return {
    id: salon.id,
    name: salon.name,
    category: salon.category || 'Beauty Parlour',
    address: salon.salonAddress?.address || 'Unknown',
    city: salon.city || null,
    lat: salon.salonAddress?.lat,
    lng: salon.salonAddress?.lng,
    distance: parseFloat((salon.distance || 0).toFixed(1)),
    rating: salon.rating ? Number(salon.rating).toFixed(1) : '5.0',
    reviews: salon.totalReviews || 0,
    image: salon.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80',
    website: salon.website || null,
    features: salon.features || [],
    priceLevel: '$$',
    reviewSnippet: salon.reviews?.[0]?.comment || null,
    description: salon.description || null,
    services: salon.services || [],
    stylists: salon.stylists || [],
    openTime: salon.openTime,
    closeTime: salon.closeTime,
    closedDates: salon.closedDates || [],
  };
}

export { API_URL };
