import test from 'node:test';
import assert from 'node:assert/strict';
import { parseId, parseListOptions, validateContact } from '../src/validators/contacts.js';

test('validates and trims contact input', () => {
  assert.deepEqual(validateContact({ first_name: '  Ada ', email: ' ada@example.com ' }).first_name, 'Ada');
});
test('rejects missing name and invalid email', () => {
  assert.throws(() => validateContact({ first_name: ' ' }), /First name is required/);
  assert.throws(() => validateContact({ first_name: 'Ada', email: 'broken' }), /valid email/);
});
test('validates pagination, sort whitelist, and ids', () => {
  assert.equal(parseListOptions({ page: '2', sort: 'name' }).page, 2);
  assert.throws(() => parseListOptions({ pageSize: '1000' }), /pagination/);
  assert.throws(() => parseListOptions({ sort: 'id; DROP TABLE contacts' }), /sort/);
  assert.equal(parseId('12'), 12);
  assert.throws(() => parseId('x'), /ID/);
});
