export const STRIPE_CONFIG = {
    SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    CURRENCY: 'INR',
    SUCCESS_URL: 'http://localhost:4200/theater/shows/booking/success?session_id={CHECKOUT_SESSION_ID}',
    CANCEL_URL: 'http://localhost:4200/theater/shows/booking/cancel'
}