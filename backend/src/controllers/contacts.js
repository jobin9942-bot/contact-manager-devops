import * as service from '../services/contacts.js';
import { HttpError } from '../middleware/errors.js';
import { parseId, parseListOptions, validateContact } from '../validators/contacts.js';

export async function health(_req, res) {
  try { await import('../config/db.js').then(({ pool }) => pool.query('SELECT 1')); res.json({ success: true, data: { status: 'ok' } }); }
  catch { res.status(503).json({ success: false, error: 'Service temporarily unavailable' }); }
}
export async function list(req, res) { res.json({ success: true, data: await service.listContacts(parseListOptions(req.query)) }); }
export async function stats(_req, res) { res.json({ success: true, data: await service.getStats() }); }
export async function get(req, res) { const item = await service.getContact(parseId(req.params.id)); if (!item) throw new HttpError(404, 'Contact not found'); res.json({ success: true, data: item }); }
export async function create(req, res) { const item = await service.createContact(validateContact(req.body)); res.status(201).json({ success: true, data: item }); }
export async function update(req, res) { const item = await service.updateContact(parseId(req.params.id), validateContact(req.body, { partial: true })); if (!item) throw new HttpError(404, 'Contact not found'); res.json({ success: true, data: item }); }
export async function remove(req, res) { if (!await service.deleteContact(parseId(req.params.id))) throw new HttpError(404, 'Contact not found'); res.status(204).end(); }
