"use client";

import { cookies } from 'next/headers';

export function isAuthenticated() {
  try {
    // For client components
    const authCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='));
    
    if (authCookie) {
      const token = JSON.parse(decodeURIComponent(authCookie.split('=')[1]));
      return token.authenticated === true;
    }
    
    return false;
  } catch (error) {
    return false;
  }
}

export function getAuthToken() {
  try {
    const authCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='));
    
    if (authCookie) {
      return JSON.parse(decodeURIComponent(authCookie.split('=')[1]));
    }
    
    return null;
  } catch (error) {
    return null;
  }
}