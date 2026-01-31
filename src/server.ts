import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

// Initialize DB connection
connectDB();

// Only start the listener if we are NOT on Vercel (local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the app for Vercel
export default app;