import assert from 'node:assert/strict';
import { triageTicket } from '../triage.mjs';

const fixedNow = new Date('2026-08-16T09:00:00.000Z');
const baseTicket = {
  name: 'Demo User',
  email: 'Demo@Example.com',
  subject: 'Need help',
  description: 'Please review this request.',
};

const run = (overrides = {}) => triageTicket(
  { ...baseTicket, ...overrides },
  { now: fixedNow, idSuffix: 'ABCDE' },
);

const invalid = triageTicket(
  { name: 'Demo User', subject: '', description: 'Missing email and subject.' },
  { now: fixedNow, idSuffix: 'ABCDE' },
);
assert.equal(invalid.ok, false);
assert.deepEqual(invalid.missingFields, ['email', 'subject']);

const security = run({ subject: 'Possible phishing breach' });
assert.equal(security.ticket.category, 'Security');
assert.equal(security.ticket.priority, 'Critical');
assert.equal(security.ticket.slaHours, 1);

const outage = run({ description: 'The production server is down and unavailable.' });
assert.equal(outage.ticket.category, 'Technical');
assert.equal(outage.ticket.priority, 'High');
assert.equal(outage.ticket.slaHours, 4);

const account = run({ subject: 'Account locked', description: 'I cannot login with my password.' });
assert.equal(account.ticket.category, 'Account Access');
assert.equal(account.ticket.priority, 'High');

const billing = run({ subject: 'Invoice question', description: 'I need a refund for a duplicate charge.' });
assert.equal(billing.ticket.category, 'Billing');
assert.equal(billing.ticket.priority, 'Medium');

const general = run();
assert.equal(general.ticket.category, 'General Support');
assert.equal(general.ticket.priority, 'Normal');
assert.equal(general.ticket.dueAt, '2026-08-17T09:00:00.000Z');
assert.equal(general.ticket.requester.email, 'demo@example.com');
assert.equal(general.ticket.id, 'TKT-1786870800000-ABCDE');

console.log('All 6 triage scenarios passed.');
