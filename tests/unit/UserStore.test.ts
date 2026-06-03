import { describe, it, beforeEach, expect } from 'vitest';
import { useUserStore } from '@/stores/user-store';
import { createPinia, setActivePinia } from 'pinia';

// Mock user data
const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+79991234567',
  address: {
    city: 'Moscow',
    street: 'Tverskaya',
    house: '1',
    apartment: '5',
  },
};

describe('UserStore', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Create fresh Pinia instance for each test
    setActivePinia(createPinia());
  });

  it('restores user data from localStorage on initialization', () => {
    // Pre-populate localStorage before store creation
    localStorage.setItem('otus-pwa-auth', 'true');
    localStorage.setItem('otus-pwa-user', JSON.stringify(mockUser));

    const store = useUserStore();

    expect(store.user).toEqual(mockUser);
    expect(store.isAuthenticated).toBe(true);
    expect(store.fullName).toBe('John Doe');
  });

  it('logs in user and persists to localStorage', () => {
    const store = useUserStore();

    store.login(mockUser);

    expect(store.user).toEqual(mockUser);
    expect(store.isAuthenticated).toBe(true);
    expect(store.fullName).toBe('John Doe');
    expect(localStorage.getItem('otus-pwa-auth')).toBe('true');
    expect(JSON.parse(localStorage.getItem('otus-pwa-user') || '{}')).toEqual(mockUser);
  });

  it('logs out user and clears localStorage', () => {
    // First log in
    const store = useUserStore();
    store.login(mockUser);
    expect(store.isAuthenticated).toBe(true);
    expect(localStorage.getItem('otus-pwa-auth')).toBe('true');

    // Then log out
    store.logout();

    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
    expect(localStorage.getItem('otus-pwa-auth')).toBeNull();
    expect(localStorage.getItem('otus-pwa-user')).toBeNull();
  });

  it('updates profile and persists to localStorage', () => {
    const store = useUserStore();
    store.login(mockUser);

    const updatedData = { name: 'Jane Doe', phone: '+79990001111' };
    store.updateProfile(updatedData);

    expect(store.user?.name).toBe('Jane Doe');
    expect(store.user?.phone).toBe('+79990001111');
    expect(store.user?.address).toEqual(mockUser.address); // unchanged
    expect(JSON.parse(localStorage.getItem('otus-pwa-user') || '{}')).toEqual({
      ...mockUser,
      ...updatedData,
    });
  });
});