export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

export function notFound(_req, _res, next) { next(new HttpError(404, 'Route not found')); }

export function errorHandler(err, _req, res, _next) {
  const status = Number(err.status) || 500;
  if (status >= 500) console.error('Request failed:', err.message);
  res.status(status).json({ success: false, error: status >= 500 ? 'Something went wrong. Please try again.' : err.message });
}
