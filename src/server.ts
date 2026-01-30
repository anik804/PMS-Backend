import app from './app.ts';
import connectDB from './config/db.ts';

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}).catch(err => {
  console.error('Database connection failed', err);
});
