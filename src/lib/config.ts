export const ADMIN_STORAGE_KEY = "isAdmin";

export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
};

// QR code menu URL is now dynamically generated in the admin page
// using window.location.origin to ensure it works across all environments:
// - Development: http://localhost:3000/menu
// - Production (Vercel): https://minute-burger.vercel.app/menu
// - Custom domains: https://your-domain.com/menu
