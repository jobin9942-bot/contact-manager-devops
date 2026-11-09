import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

const enabled = process.env.RUN_DB_TESTS === '1';
let app, pool, createdId;
test('MySQL-backed REST API integration', { skip: !enabled }, async t => {
  const database = process.env.TEST_DB_NAME || '';
  if (!database.endsWith('_test')) throw new Error('Refusing integration tests: TEST_DB_NAME must end with _test');
  process.env.DB_HOST = process.env.TEST_DB_HOST || '127.0.0.1';
  process.env.DB_PORT = process.env.TEST_DB_PORT || '3306';
  process.env.DB_USER = process.env.TEST_DB_USER || '';
  process.env.DB_PASSWORD = process.env.TEST_DB_PASSWORD || '';
  process.env.DB_NAME = database;
  ({ default: app } = await import('../src/app.js'));
  ({ pool } = await import('../src/config/db.js'));
  await t.test('health endpoint', async () => {
    const response = await request(app).get('/api/health');
    assert.equal(response.status, 200);
    assert.equal(response.body.data.status, 'ok');
  });
  await t.test('create, validate, search/list, retrieve, update, delete, and missing contact', async () => {
    const created = await request(app).post('/api/contacts').send({ first_name: 'Integration', last_name: 'Test', company: 'Test Suite' });
    assert.equal(created.status, 201); createdId = created.body.data.id;
    assert.equal((await request(app).post('/api/contacts').send({ first_name: ' ' })).status, 422);
    const listing = await request(app).get('/api/contacts').query({ search: 'Test Suite', page: 1, pageSize: 10, sort: 'name', direction: 'asc' });
    assert.equal(listing.status, 200); assert.ok(listing.body.data.contacts.some(c => c.id === createdId));
    assert.equal((await request(app).get(`/api/contacts/${createdId}`)).body.data.first_name, 'Integration');
    const updated = await request(app).put(`/api/contacts/${createdId}`).send({ first_name: 'Updated' });
    assert.equal(updated.body.data.first_name, 'Updated');
    assert.equal((await request(app).delete(`/api/contacts/${createdId}`)).status, 204); createdId = undefined;
    assert.equal((await request(app).get('/api/contacts/4294967295')).status, 404);
    assert.equal((await request(app).get('/api/contacts').query({ sort: 'raw_sql' })).status, 400);
    assert.equal((await request(app).get('/api/contacts').query({ pageSize: 1000 })).status, 400);
  });
});
after(async () => {
  if (createdId && pool) await pool.execute('DELETE FROM contacts WHERE id = ?', [createdId]);
  if (pool) await pool.end();
});
