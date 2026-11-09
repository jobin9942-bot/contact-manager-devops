import { HttpError } from '../middleware/errors.js';

const lengths = { first_name: 100, last_name: 100, email: 254, phone: 40, company: 150, job_title: 150, address: 5000, notes: 10000 };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d(][\d\s().-]*$/;

export function validateContact(input, { partial = false } = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new HttpError(400, 'A contact object is required');
  const fields = Object.keys(lengths);
  if (Object.keys(input).some(key => !fields.includes(key))) throw new HttpError(400, 'Request contains unsupported fields');
  if (partial && Object.keys(input).length === 0) throw new HttpError(400, 'At least one contact field is required');
  const result = {};
  for (const [field, max] of Object.entries(lengths)) {
    if (partial && !(field in input)) continue;
    let value = input[field] ?? '';
    if (typeof value !== 'string') throw new HttpError(422, `${field.replace('_', ' ')} must be text`);
    value = value.trim();
    if (partial && field === 'first_name' && !value) throw new HttpError(422, 'First name is required');
    if (!partial && field === 'first_name' && !value) throw new HttpError(422, 'First name is required');
    if (value.length > max) throw new HttpError(422, `${field.replace('_', ' ')} must be ${max} characters or fewer`);
    if (field === 'email' && value && !emailPattern.test(value)) throw new HttpError(422, 'Enter a valid email address');
    if (field === 'phone' && value && (value.length < 7 || value.length > 40 || !phonePattern.test(value) || !/\d/.test(value))) throw new HttpError(422, 'Enter a valid phone number');
    result[field] = value || null;
  }
  if (!partial && !result.first_name) throw new HttpError(422, 'First name is required');
  return result;
}

export function parseListOptions(query) {
  const page = query.page === undefined ? 1 : Number(query.page);
  const pageSize = query.pageSize === undefined ? 10 : Number(query.pageSize);
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) throw new HttpError(400, 'Invalid pagination values');
  const sort = query.sort || 'created_at';
  if (!['name', 'created_at'].includes(sort)) throw new HttpError(400, 'Invalid sort field');
  const direction = (query.direction || 'desc').toLowerCase();
  if (!['asc', 'desc'].includes(direction)) throw new HttpError(400, 'Invalid sort direction');
  const search = String(query.search || '').trim();
  if (search.length > 200) throw new HttpError(400, 'Search must be 200 characters or fewer');
  return { page, pageSize, sort, direction: direction.toUpperCase(), search };
}

export function parseId(value) {
  if (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 4294967295) throw new HttpError(400, 'Invalid contact ID');
  return Number(value);
}
