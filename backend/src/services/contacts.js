import { pool } from '../config/db.js';

const columns = 'id, first_name, last_name, email, phone, company, job_title, address, notes, created_at, updated_at';
export async function listContacts({ page, pageSize, sort, direction, search }) {
  const where = search ? 'WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ? OR company LIKE ?' : '';
  const pattern = `%${search}%`;
  const params = search ? [pattern, pattern, pattern, pattern, pattern] : [];
  const sortSql = sort === 'name' ? `last_name ${direction}, first_name ${direction}` : `created_at ${direction}`;
  const [rows] = await pool.execute(`SELECT ${columns} FROM contacts ${where} ORDER BY ${sortSql}, id DESC LIMIT ? OFFSET ?`, [...params, pageSize, (page - 1) * pageSize]);
  const [counts] = await pool.execute(`SELECT COUNT(*) AS total FROM contacts ${where}`, params);
  return { contacts: rows, pagination: { page, pageSize, total: Number(counts[0].total), totalPages: Math.ceil(Number(counts[0].total) / pageSize) } };
}
export async function getContact(id) { const [rows] = await pool.execute(`SELECT ${columns} FROM contacts WHERE id = ?`, [id]); return rows[0] || null; }
export async function createContact(data) {
  const fields = Object.keys(data); const values = Object.values(data);
  const [result] = await pool.execute(`INSERT INTO contacts (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`, values);
  return getContact(result.insertId);
}
export async function updateContact(id, data) {
  const fields = Object.keys(data);
  await pool.execute(`UPDATE contacts SET ${fields.map(field => `${field} = ?`).join(', ')} WHERE id = ?`, [...Object.values(data), id]);
  return getContact(id);
}
export async function deleteContact(id) { const [result] = await pool.execute('DELETE FROM contacts WHERE id = ?', [id]); return result.affectedRows > 0; }
export async function getStats() {
  const [rows] = await pool.execute(`SELECT COUNT(*) total, SUM(email IS NOT NULL AND email <> '') with_email, SUM(phone IS NOT NULL AND phone <> '') with_phone, SUM(created_at >= NOW() - INTERVAL 30 DAY) recent FROM contacts`);
  const [recent] = await pool.execute(`SELECT ${columns} FROM contacts ORDER BY created_at DESC, id DESC LIMIT 5`);
  const r = rows[0];
  return { total: Number(r.total), recentCount: Number(r.recent || 0), withEmail: Number(r.with_email || 0), withPhone: Number(r.with_phone || 0), recentContacts: recent };
}
