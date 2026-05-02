const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

// ✅ IMPORTANT: Use Render's port
const PORT = process.env.PORT || 5001;

// ✅ Middleware
app.use(express.json());

// Allow all origins for now (we'll restrict later)
app.use(cors({
  origin: "*"
}));

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
      description: "Saving for the ultimate end-of-year road trip to the coast!",
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
      description: "Pooling resources for the new PS5 Pro",
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
  activities: []
};

// Helper function
const addActivity = (clubId, message, type = 'info') => {
  db.activities.push({
    id: uuidv4(),
    clubId,
    message,
    type,
    timestamp: new Date().toISOString()
  });
};

// ---------- ROUTES ----------

// Health check (VERY useful for testing)
app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

// Create user
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

// Create club
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
    status: 'active'
  };

  db.clubs.push(club);

  const user = db.users.find(u => u.id === creatorId);
  if (user) {
    user.clubs.push(club.id);
    addActivity(club.id, `${user.name} created the club`, 'milestone');
  }

  res.status(201).json(club);
});

// Contribute
app.post('/api/clubs/:id/contribute', (req, res) => {
  const { userId, amount } = req.body;

  const club = db.clubs.find(c => c.id === req.params.id);
  const user = db.users.find(u => u.id === userId);

  if (!club || !user) {
    return res.status(404).json({ message: 'Not found' });
  }

  const numericAmount = parseFloat(amount);
  club.currentAmount += numericAmount;

  const member = club.members.find(m => m.userId === userId);
  if (member) {
    member.contributed += numericAmount;
  }

  addActivity(club.id, `${user.name} contributed KES ${numericAmount}`, 'payment');

  res.json(club);
});

// Get club
app.get('/api/clubs/:id', (req, res) => {
  const club = db.clubs.find(c => c.id === req.params.id);

  if (!club) {
    return res.status(404).json({ message: 'Club not found' });
  }

  const activities = db.activities.filter(a => a.clubId === club.id);

  res.json({ club, activities });
});

// Join club
app.post('/api/clubs/join', (req, res) => {
  const { clubId, userId } = req.body;

  const club = db.clubs.find(c => c.clubId === clubId);

  if (!club) {
    return res.status(404).json({ message: 'Club not found' });
  }

  if (!club.members.find(m => m.userId === userId)) {
    club.members.push({ userId, role: 'member', contributed: 0 });
  }

  res.json(club);
});

// User dashboard
app.get('/api/users/:id/dashboard', (req, res) => {
  const user = db.users.find(u => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const userClubs = db.clubs.filter(c => user.clubs.includes(c.id));

  res.json({ user, clubs: userClubs });
});

// ---------- START SERVER ----------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});