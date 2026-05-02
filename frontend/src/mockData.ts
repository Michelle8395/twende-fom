export const INITIAL_CLUBS = [
  {
    id: 'club-1',
    name: 'Zanzibar Trip 🏝️',
    description: 'Saving up for our end of year trip to the spice islands! Sun, sand, and seafood.',
    targetAmount: 150000,
    currentAmount: 45000,
    creatorId: 'user-1',
    nextEventDate: '2026-12-20T00:00:00.000Z',
    members: [
      { userId: 'user-1', name: 'Michelle Wanjiru', role: 'admin', contributed: 20000 },
      { userId: 'user-2', name: 'Brian Koech', role: 'member', contributed: 15000 },
      { userId: 'user-3', name: 'Sarah Atieno', role: 'member', contributed: 10000 },
    ]
  },
  {
    id: 'club-2',
    name: 'Chama Investment 📈',
    description: 'Monthly contributions for our real estate investment fund.',
    targetAmount: 500000,
    currentAmount: 120000,
    creatorId: 'user-2',
    nextEventDate: '2026-06-05T00:00:00.000Z',
    members: [
      { userId: 'user-1', name: 'Michelle Wanjiru', role: 'member', contributed: 40000 },
      { userId: 'user-2', name: 'Brian Koech', role: 'admin', contributed: 50000 },
      { userId: 'user-3', name: 'Sarah Atieno', role: 'member', contributed: 30000 },
    ]
  }
];

export const INITIAL_ACTIVITIES = [
  { id: 'act-1', clubId: 'club-1', userId: 'user-1', userName: 'Michelle Wanjiru', amount: 5000, type: 'contribution', timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 'act-2', clubId: 'club-1', userId: 'user-2', userName: 'Brian Koech', amount: 3000, type: 'contribution', timestamp: new Date(Date.now() - 172800000).toISOString() },
  { id: 'act-3', clubId: 'club-2', userId: 'user-3', userName: 'Sarah Atieno', amount: 10000, type: 'contribution', timestamp: new Date(Date.now() - 43200000).toISOString() },
];
