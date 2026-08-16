# IT Support Ticket Triage Automation

An import-ready n8n workflow that receives IT support requests through a webhook, validates the request, classifies the issue, assigns a priority, calculates an SLA deadline, and returns a structured JSON response.

## Why this project matters

Support teams lose time when every incoming ticket must be reviewed manually. This workflow creates a consistent first-pass triage process using transparent rules that are easy to audit and extend.

## Features

- Receives tickets through a `POST` webhook.
- Validates `name`, `email`, `subject`, and `description`.
- Classifies Security, Technical, Account Access, Billing, and General Support issues.
- Assigns Critical, High, Medium, or Normal priority.
- Calculates an SLA deadline from the assigned priority.
- Returns a reusable JSON result with a unique ticket ID.
- Uses only core n8n nodes and requires no credentials.
- Includes sample payloads and automated tests.

## Workflow

1. **Receive Support Ticket** — accepts the incoming webhook request.
2. **Validate & Triage Ticket** — validates fields, applies classification rules, calculates priority and SLA.
3. **Return Triage Result** — sends the structured result to the caller.

## Quick start

1. Open n8n and choose **Import from File**.
2. Select `workflow.json`.
3. Open the **Receive Support Ticket** node and copy its test URL.
4. Click **Listen for test event**.
5. Send a `POST` request using `sample-ticket.json`.

Example with cURL:

```bash
curl -X POST "YOUR_N8N_TEST_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  --data @sample-ticket.json
```

Activate the workflow before using the production webhook URL.

## Classification rules

| Category | Example keywords | Priority | SLA |
|---|---|---:|---:|
| Security | breach, phishing, malware, unauthorized | Critical | 1 hour |
| Technical | outage, unavailable, server error, cannot access | High | 4 hours |
| Account Access | login, password, locked, authentication | High | 4 hours |
| Billing | payment, invoice, refund, charge | Medium | 8 hours |
| General Support | no matching keyword | Normal | 24 hours |

Security rules are evaluated first so a security-related request is never downgraded by another matching category.

## Validation response

If a required field is missing, the workflow returns:

```json
{
  "ok": false,
  "statusCode": 400,
  "error": "Validation failed",
  "missingFields": ["email"]
}
```

## Run the tests

```bash
node tests/triage.test.mjs
```

The tests cover validation, security, technical outage, account access, billing, and default triage scenarios.

## Portfolio description

Built an n8n webhook automation that validates incoming IT support tickets, assigns categories and priorities using transparent rules, calculates SLA deadlines, and returns a structured JSON response. Packaged the workflow with sample payloads, documentation, and automated tests.

## Future improvements

- Store tickets in PostgreSQL.
- Send critical alerts to Slack or email.
- Add an AI summarization step for long descriptions.
- Add authentication and rate limiting in front of the webhook.
- Connect the workflow to Jira, Linear, or another ticketing platform.

## License

MIT
