const RULES = [
  {
    category: 'Security',
    priority: 'Critical',
    priorityScore: 100,
    slaHours: 1,
    keywords: ['security', 'hacked', 'breach', 'unauthorized', 'malware', 'phishing', 'data leak'],
  },
  {
    category: 'Technical',
    priority: 'High',
    priorityScore: 80,
    slaHours: 4,
    keywords: ['down', 'outage', 'unavailable', 'server error', 'cannot access', '500 error'],
  },
  {
    category: 'Account Access',
    priority: 'High',
    priorityScore: 70,
    slaHours: 4,
    keywords: ['login', 'password', 'sign in', 'locked', 'authentication'],
  },
  {
    category: 'Billing',
    priority: 'Medium',
    priorityScore: 50,
    slaHours: 8,
    keywords: ['payment', 'billing', 'invoice', 'refund', 'charge'],
  },
];

const DEFAULT_RULE = {
  category: 'General Support',
  priority: 'Normal',
  priorityScore: 30,
  slaHours: 24,
};

export function triageTicket(payload, options = {}) {
  const now = options.now ?? new Date();
  const idSuffix = options.idSuffix ?? Math.random().toString(36).slice(2, 7).toUpperCase();
  const requiredFields = ['name', 'email', 'subject', 'description'];
  const missingFields = requiredFields.filter((field) => {
    const value = payload?.[field];
    return typeof value !== 'string' || value.trim() === '';
  });

  if (missingFields.length > 0) {
    return {
      ok: false,
      statusCode: 400,
      error: 'Validation failed',
      missingFields,
      timestamp: now.toISOString(),
    };
  }

  const searchableText = `${payload.subject} ${payload.description}`.toLowerCase();
  const match = RULES.find((rule) => rule.keywords.some((keyword) => searchableText.includes(keyword))) ?? DEFAULT_RULE;
  const dueAt = new Date(now.getTime() + match.slaHours * 60 * 60 * 1000);

  return {
    ok: true,
    statusCode: 200,
    ticket: {
      id: `TKT-${now.getTime()}-${idSuffix}`,
      requester: {
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
      },
      subject: payload.subject.trim(),
      description: payload.description.trim(),
      category: match.category,
      priority: match.priority,
      priorityScore: match.priorityScore,
      slaHours: match.slaHours,
      dueAt: dueAt.toISOString(),
      status: 'New',
      source: 'n8n-webhook',
      createdAt: now.toISOString(),
    },
  };
}
