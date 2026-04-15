const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Mock Database (In-memory for prototype)
const db = {
  users: [],
  clubs: [],
  contributions: [],
  activities: []
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
