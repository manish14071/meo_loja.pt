import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';

// Rate limiting with higher limits for production
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // increased limit for production
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Security headers with CSP for Netlify and Cloudinary
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "https:", "data:", "blob:", "res.cloudinary.com"],
      connectSrc: ["'self'", 
        "https://peppy-rolypoly-0bcae4.netlify.app",
        "https://meo-loja-pt.onrender.com",
        "localhost:*"
      ],
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false
});

// XSS Protection
export const xssProtection = xss();

// CORS options for production and development
export const corsOptions = {
  origin: [
    'https://peppy-rolypoly-0bcae4.netlify.app',
    'https://meo-loja-pt.onrender.com',
    'http://localhost:5173',
    'http://localhost:3267'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
  exposedHeaders: ['set-cookie'],
  optionsSuccessStatus: 200
};