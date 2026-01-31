import app from './app';
const PORT = process.env.PORT || 5000;
// Only listen if we are not on Vercel (Vercel sets VERCEL=1)
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
}
// Export the app for Vercel serverless functions
// @vercel/node automatically handles Express apps
export default app;
