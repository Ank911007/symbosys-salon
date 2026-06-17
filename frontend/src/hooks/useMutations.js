import { useMutation } from '@tanstack/react-query';
import { apiClient, API_URL } from '../lib/apiClient';

/**
 * Hook for login
 */
export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials) => apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  });
};

/**
 * Hook for register
 */
export const useRegister = () => {
  return useMutation({
    mutationFn: (userData) => apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  });
};

/**
 * Hook for submitting the Entry Booking Modal form.
 */
export const useSubmitBooking = () => {
  return useMutation({
    mutationFn: (bookingData) => apiClient('/appointments', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }),
    onSuccess: (data) => {
      console.log('Booking submitted successfully:', data);
    },
    onError: (error) => {
      console.error('Failed to submit booking:', error);
    }
  });
};

/**
 * Hook for submitting the Contact Us form.
 * Keeping this simulated if backend doesn't have a contact endpoint yet.
 */
export const useSubmitContact = () => {
  return useMutation({
    mutationFn: async (formData) => {
      return new Promise((resolve) => setTimeout(() => resolve({ success: true, data: formData }), 1200));
    },
    onSuccess: (data) => {
      console.log('Contact message submitted successfully:', data);
    },
    onError: (error) => {
      console.error('Failed to submit contact message:', error);
    }
  });
};

/**
 * Hook for submitting a Salon Review
 */
export const useSubmitReview = (salonId) => {
  return useMutation({
    mutationFn: (reviewData) => apiClient(`/salons/${salonId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    }),
    onSuccess: (data) => {
      console.log('Review submitted successfully:', data);
    },
    onError: (error) => {
      console.error('Failed to submit review:', error);
    }
  });
};

/**
 * Hook for updating a Review's approval status
 */
export const useUpdateReviewApproval = () => {
  return useMutation({
    mutationFn: ({ reviewId, isApproved }) => apiClient(`/owner/salon/reviews/${reviewId}/approval`, {
      method: 'PATCH',
      body: JSON.stringify({ isApproved }),
    }),
  });
};

// ─── Customer Phone Auth Hooks ───────────────────────────────────────────────

/**
 * Hook for checking phone number (existing vs new customer)
 */
export const useCheckPhone = () => {
  return useMutation({
    mutationFn: (data) => apiClient('/customer/check-phone', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  });
};

/**
 * Hook for verifying OTP
 */
export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: (data) => apiClient('/customer/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  });
};

/**
 * Hook for completing customer profile after OTP
 */
export const useCompleteProfile = () => {
  return useMutation({
    mutationFn: ({ tempToken, ...data }) => {
      return fetch(`${API_URL}/customer/complete-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tempToken}`,
        },
        body: JSON.stringify(data),
      }).then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to complete profile');
        return json;
      });
    },
  });
};
