import { body, param, validationResult } from 'express-validator';

export const validateProduct = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0.01 }).withMessage('Price must be greater than 0'),
  body('category_id').isInt().withMessage('Valid category ID is required'),
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be non-negative'),
];

export const validateCategory = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('description').trim().optional(),
];

export const validateUser = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

export const validateOrder = [
  body('total_amount').isFloat({ min: 0.01 }).withMessage('Valid total amount is required'),
  body('shipping_address').notEmpty().withMessage('Shipping address is required'),
  body('payment_method').notEmpty().withMessage('Payment method is required'),
  body('order_items').isArray({ min: 1 }).withMessage('Order must contain items'),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}; 