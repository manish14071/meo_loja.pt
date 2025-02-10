import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';

// Rate limiting
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Security headers
export const securityHeaders = helmet();

// XSS Protection
export const xssProtection = xss();

// CORS options
export const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3267',"https://meo-loja-pt.onrender.com/"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie'],
}; 