import { getDistance } from './utils';

const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Fetches salons from the backend API.
 *
 * @param {number}  lat        User latitude
 * @param {number}  lng        User longitude
 * @param {number}  radiusKm   Search radius in km (default 50)
 * @returns {Promise<Array>}   Salon objects shaped for SalonResultCard
 */
export async function fetchNearbySalons(lat, lng, radiusKm = 50) {
  try {
    const params = new URLSearchParams({ lat, lng, radius: radiusKm });
    const response = await fetch(`${API_URL}/salons/nearby?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch salons: ${response.status}`);
    }

    const { data } = await response.json();
    
    // Format the backend data to match what the frontend expects
    return data.map(salon => ({
      id: salon.id,
      name: salon.name,
      category: salon.category || 'Beauty Parlour',
      address: salon.salonAddress?.address || 'Unknown',
      city: salon.city || null,
      lat: salon.salonAddress?.lat,
      lng: salon.salonAddress?.lng,
      distance: parseFloat((salon.distance || 0).toFixed(1)),
      rating: salon.rating.toFixed(1),
      reviews: salon.totalReviews,
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
    }));
  } catch (err) {
    console.error('Failed to fetch from backend API:', err);
    return [];
  }
}

export async function fetchRecentReviews() {
  try {
    const response = await fetch(`${API_URL}/salons/reviews/recent`, {
      cache: 'no-store',
      headers: {
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache'
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    
    return data.data || [];
  } catch (err) {
    console.error('Failed to fetch recent reviews:', err);
    return [];
  }
}
