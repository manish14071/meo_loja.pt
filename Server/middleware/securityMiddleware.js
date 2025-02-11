import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';

// Rate limiting
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Security headers
export const securityHeaders = helmet({
  contentSecurityPolicy: false, // Disable CSP temporarily for debugging
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
});

// XSS Protection
export const xssProtection = xss();

// CORS options with function to handle dynamic origins
export const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3267',
      "https://peppy-rolypoly-0bcae4.netlify.app/",
     

    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200
};


