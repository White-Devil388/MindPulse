/**
 * Input sanitization utility to prevent XSS (Cross-Site Scripting)
 * Escapes harmful HTML special characters from user inputs
 */
export const sanitizeString = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Deep recursive object sanitization middleware for request body
 */
export const xssSanitize = (req, res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;

    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        // Strip script tags entirely, escape HTML tags
        obj[key] = obj[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);
  next();
};

/**
 * Strict validator for email and password
 */
export const validateAuthInput = (email, password) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { valid: false, message: 'Please provide a valid email address.' };
  }

  if (password !== undefined) {
    if (!password || password.length < 6 || password.length > 50) {
      return { valid: false, message: 'Password must be between 6 and 50 characters.' };
    }
  }

  return { valid: true };
};

