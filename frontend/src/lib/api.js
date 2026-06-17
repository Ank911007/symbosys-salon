import { API_URL, mapSalonResponse } from './apiClient';

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
    
    return data.map(mapSalonResponse);
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
