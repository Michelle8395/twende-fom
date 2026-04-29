const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Mock Database (In-memory for prototype)
const db = {
  users: [
    {
      id: "u1",
      fomId: "FOM-8821",
      name: "Michelle Wanjiru",
      email: "michelle@example.com",
      joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      clubs: ["c1", "c2"]
    },
    {
      id: "u2",
      fomId: "FOM-1290",
      name: "Alex Kamau",
      email: "alex@example.com",
      joinDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      clubs: ["c1"]
    },
    {
      id: "u3",
      fomId: "FOM-4432",
      name: "Brian Otieno",
      email: "brian@example.com",
      joinDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      clubs: ["c1", "c2"]
    }
  ],
  clubs: [
    {
      id: "c1",
      clubId: "CLUB-5501",
      name: "Mombasa Road Trip 🚗",
      description: "Saving for the ultimate end-of-year road trip to the coast! Accommodation and fuel included.",
      targetAmount: 50000,
      currentAmount: 32500,
      creatorId: "u1",
      members: [
        { userId: "u1", role: "admin", contributed: 15000 },
        { userId: "u2", role: "member", contributed: 10000 },
        { userId: "u3", role: "member", contributed: 7500 }
      ],
      nextEventDate: "2026-12-20",
      status: "active"
    },
    {
      id: "c2",
      clubId: "CLUB-9923",
      name: "PlayStation 5 Pro Fund 🎮",
      description: "Pooling resources for the new PS5 Pro for the hangout spot.",
      targetAmount: 110000,
      currentAmount: 45000,
      creatorId: "u3",
      members: [
        { userId: "u3", role: "admin", contributed: 20000 },
        { userId: "u1", role: "member", contributed: 25000 }
      ],
      nextEventDate: "2026-06-15",
      status: "active"
    }
  ],
  activities: [
    { id: uuidv4(), clubId: "c1", message: "🎉 50% Milestone reached! Coast here we come!", type: "milestone", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: uuidv4(), clubId: "c1", message: "Alex Kamau contributed KES 5,000", type: "payment", timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: uuidv4(), clubId: "c2", message: "Michelle Wanjiru contributed KES 10,000", type: "payment", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    { id: uuidv4(), clubId: "c2", message: "Brian Otieno created the Fom Club: PlayStation 5 Pro Fund", type: "milestone", timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() }
  ]
};

// --- Helper Functions ---
const addActivity = (clubId, message, type = 'info') => {
  db.activities.push({
    id: uuidv4(),
    clubId,
    message,
    type,
    timestamp: new Date().toISOString()
  });
};

// --- API Endpoints ---

// Create a User and generate Fom ID
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  const user = {
    id: uuidv4(),
    fomId: `FOM-${Math.floor(1000 + Math.random() * 9000)}`,
    name,
    email,
    joinDate: new Date().toISOString(),
    clubs: []
  };
  db.users.push(user);
  res.status(201).json(user);
});

// Create a Fom Club
app.post('/api/clubs', (req, res) => {
  const { name, description, targetAmount, creatorId } = req.body;
  const club = {
    id: uuidv4(),
    clubId: `CLUB-${Math.floor(1000 + Math.random() * 9000)}`,
    name,
    description,
    targetAmount: parseFloat(targetAmount),
    currentAmount: 0,
    creatorId,
    members: [{ userId: creatorId, role: 'admin', contributed: 0 }],
    nextEventDate: null,
    status: 'active'
  };
  db.clubs.push(club);
  
  const user = db.users.find(u => u.id === creatorId);
  if (user) {
    user.clubs.push(club.id);
    addActivity(club.id, `${user.name} created the Fom Club: ${club.name}`, 'milestone');
  }

  res.status(201).json(club);
});

// Record a Contribution
app.post('/api/clubs/:id/contribute', (req, res) => {
  const { userId, amount } = req.body;
  const club = db.clubs.find(c => c.id === req.params.id);
  const user = db.users.find(u => u.id === userId);
  
  if (!club || !user) return res.status(404).json({ message: 'Not found' });

  const numericAmount = parseFloat(amount);
  club.currentAmount += numericAmount;

  const member = club.members.find(m => m.userId === userId);
  if (member) {
    member.contributed += numericAmount;
  }

  addActivity(club.id, `${user.name} contributed KES ${numericAmount}`, 'payment');
  
  // Check for milestones
  const percentage = (club.currentAmount / club.targetAmount) * 100;
  if (percentage >= 100) {
    addActivity(club.id, `🎉 GOAL REACHED! ${club.name} is fully funded!`, 'milestone');
  } else if (percentage >= 50 && (club.currentAmount - numericAmount) / club.targetAmount < 0.5) {
    addActivity(club.id, `🌓 50% Milestone reached! Halfway there!`, 'milestone');
  }

  res.json({ club, activities: db.activities.filter(a => a.clubId === club.id) });
});

// Get Club Details with Activities
app.get('/api/clubs/:id', (req, res) => {
  const club = db.clubs.find(c => c.id === req.params.id);
  if (!club) return res.status(404).json({ message: 'Club not found' });

  const activities = db.activities.filter(a => a.clubId === club.id).reverse().slice(0, 10);
  const membersWithInfo = club.members.map(m => {
    const u = db.users.find(user => user.id === m.userId);
    return { ...m, name: u?.name || 'Unknown' };
  });

  res.json({ club: { ...club, members: membersWithInfo }, activities });
});

// Join a Fom Club
app.post('/api/clubs/join', (req, res) => {
  const { clubId, userId } = req.body;
  const club = db.clubs.find(c => c.clubId === clubId);
  if (!club) return res.status(404).json({ message: 'Club not found' });

  if (!club.members.find(m => m.userId === userId)) {
    club.members.push({ userId, role: 'member', contributed: 0 });
    const user = db.users.find(u => u.id === userId);
    if (user) {
      user.clubs.push(club.id);
      addActivity(club.id, `${user.name} joined the Fom!`, 'info');
    }
  }

  res.json(club);
});

// Get User Dashboard Data
app.get('/api/users/:id/dashboard', (req, res) => {
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const userClubs = db.clubs.filter(c => user.clubs.includes(c.id));
  res.json({
    user,
    clubs: userClubs
  });
});

app.listen(PORT, () => {
  console.log(`Twende Fom Backend running at http://localhost:${PORT}`);
});
