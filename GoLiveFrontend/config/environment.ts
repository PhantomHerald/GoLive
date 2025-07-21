// Environment configuration
interface Environment {
  API_BASE_URL: string;
  API_TIMEOUT: number;
  ENVIRONMENT: 'development' | 'staging' | 'production' | 'test';
}

// Development environment (default)
const development: Environment = {
  API_BASE_URL: 'https://your-staging-api.com',
  API_TIMEOUT: 10000,
  ENVIRONMENT: 'development',
};

// Staging environment
const staging: Environment = {
  API_BASE_URL: 'https://your-staging-api.com',
  API_TIMEOUT: 15000,
  ENVIRONMENT: 'staging',
};

// Production environment
const production: Environment = {
  API_BASE_URL: 'https://your-production-api.com',
  API_TIMEOUT: 20000,
  ENVIRONMENT: 'production',
};

// Test environment
const test: Environment = {
  API_BASE_URL: 'https://your-production-api.com',
  API_TIMEOUT: 25000,
  ENVIRONMENT: 'test',
};

// Get current environment
const getEnvironment = (): Environment => {
  // You can set this via environment variables or build configuration
  const env = (process.env.NODE_ENV || 'development') as 'development' | 'staging' | 'production' | 'test';
  
  switch (env) {
    case 'production':
      return production;
    case 'staging':
      return staging;
    case 'test':
      return test;
    default:
      return development;
  }
};

// For mobile development, you might need to use different URLs
// since localhost won't work on physical devices
const getMobileEnvironment = (): Environment => {
  const env = getEnvironment();
  
  // If running on a physical device, you'll need to use your computer's IP address
  // instead of localhost
  if (env.ENVIRONMENT === 'development') {
    return {
      ...env,
      // Using your computer's IP address for hotspot connection
      API_BASE_URL: 'http://10.61.251.105:8080',
    };
  }
  
  return env;
};

export const environment = getMobileEnvironment();

// Helper function to get API URL for a specific endpoint
export const getApiUrl = (endpoint: string): string => {
  return `${environment.API_BASE_URL}${endpoint}`;
};

// Helper function to check if we're in development
export const isDevelopment = (): boolean => {
  return environment.ENVIRONMENT === 'development';
};

// Helper function to check if we're in production
export const isProduction = (): boolean => {
  return environment.ENVIRONMENT === 'production';
}; 