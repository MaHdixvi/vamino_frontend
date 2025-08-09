// core/environments/environment.prod.ts
export const environment = {
  production: true, // Indicates that the app is running in production mode
  apiUrl: 'https://api.example.com/v1', // Production API endpoint
  loggingLevel: 'error', // Only log errors in production
  enableAnalytics: true, // Enable analytics tracking in production
  appVersion: '1.0.0', // Application version
};
