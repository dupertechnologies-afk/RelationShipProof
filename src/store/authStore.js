import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configure axios defaults
axios.defaults.baseURL = API_URL;

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      // Set auth token in axios headers
      setAuthToken: (token) => {
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          delete axios.defaults.headers.common['Authorization'];
        }
      },

      // Login action
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post('/auth/login', { email, password });
          const { token, user } = response.data;
          console.log(token);
          set({ user, token, isLoading: false });
          get().setAuthToken(token);
          
          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Login failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Signup action
      signup: async (userData) => {
        console.log("=======");
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post('/auth/signup', userData);
          const { token, user } = response.data;
          console.log("=====------");
          set({ user, token, isLoading: false });
          get().setAuthToken(token);
          
          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Signup failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Get current user
      getMe: async () => {
        const { token } = get();
        if (!token) return { success: false, error: 'No token found' };

        set({ isLoading: true, error: null });
        try {
          get().setAuthToken(token);
          const response = await axios.get('/auth/me');
          const { user } = response.data;
          
          set({ user, isLoading: false });
          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Failed to get user data';
          set({ error: errorMessage, isLoading: false });
          
          // If token is invalid, logout
          if (error.response?.status === 401) {
            get().logout();
          }
          
          return { success: false, error: errorMessage };
        }
      },

      // Search user by registration ID
      searchUserByRegistrationId: async (registrationId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.get(`/auth/search?registrationId=${registrationId}`);
          const { user } = response.data;
          set({ isLoading: false });
          return { success: true, user };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Failed to search user';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Search users by email for suggestions
      searchUsersByEmail: async (emailQuery) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.get(`/auth/search/email?q=${emailQuery}`);
          const { users } = response.data;
          set({ isLoading: false });
          return { success: true, users };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Failed to search emails';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Update profile
      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.put('/auth/profile', profileData);
          const { user } = response.data;
          
          set({ user, isLoading: false });
          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Profile update failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: error.response?.data || { message: errorMessage } };
        }
      },

      // Logout action
      logout: () => {
        set({ user: null, token: null, error: null });
        get().setAuthToken(null);
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Check if user is authenticated
      isAuthenticated: () => {
        const { token, user } = get();
        return !!(token && user);
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user 
      }),
      onRehydrateStorage: () => (state) => {
        // Set auth token when store is rehydrated
        if (state?.token) {
          state.setAuthToken(state.token);
          // If user exists but registrationId is missing, re-fetch user data
          if (state.user && !state.user.registrationId) {
            state.getMe();
          }
        }
      }
    }
  )
);

export default useAuthStore;