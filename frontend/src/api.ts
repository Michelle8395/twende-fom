import { INITIAL_CLUBS, INITIAL_ACTIVITIES } from './mockData';

const getStorage = (key: string, initial: any) => {
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

const setStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const api = {
  login: async (name: string, email: string) => {
    // In a real app, this would check DB. Here we just create/return user.
    const users = getStorage('tf_users', []);
    let user = users.find((u: any) => u.email === email);
    if (!user) {
      user = {
        id: `user-${Date.now()}`,
        name,
        email,
        fomId: `FOM-${Math.floor(1000 + Math.random() * 9000)}`
      };
      users.push(user);
      setStorage('tf_users', users);
    }
    return user;
  },

  getDashboard: async (userId: string) => {
    const clubs = getStorage('tf_clubs', INITIAL_CLUBS);
    const users = getStorage('tf_users', []);
    const user = users.find((u: any) => u.id === userId);
    
    // Filter clubs where user is a member
    const userClubs = clubs.filter((club: any) => 
      club.members.some((m: any) => m.userId === userId)
    );

    return {
      user: user || { name: 'Guest User', fomId: 'FOM-0000' },
      clubs: userClubs
    };
  },

  getClub: async (clubId: string) => {
    const clubs = getStorage('tf_clubs', INITIAL_CLUBS);
    const activities = getStorage('tf_activities', INITIAL_ACTIVITIES);
    
    const club = clubs.find((c: any) => c.id === clubId);
    const clubActivities = activities.filter((a: any) => a.clubId === clubId)
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return { club, activities: clubActivities };
  },

  createClub: async (data: { name: string, description: string, targetAmount: string, creatorId: string }) => {
    const clubs = getStorage('tf_clubs', INITIAL_CLUBS);
    const users = getStorage('tf_users', []);
    const creator = users.find((u: any) => u.id === data.creatorId);

    const newClub = {
      id: `club-${Date.now()}`,
      name: data.name,
      description: data.description,
      targetAmount: parseFloat(data.targetAmount),
      currentAmount: 0,
      creatorId: data.creatorId,
      nextEventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      members: [
        { 
          userId: data.creatorId, 
          name: creator?.name || 'Unknown', 
          role: 'admin', 
          contributed: 0 
        }
      ]
    };

    clubs.push(newClub);
    setStorage('tf_clubs', clubs);
    return newClub;
  },

  joinClub: async (clubId: string, userId: string) => {
    const clubs = getStorage('tf_clubs', INITIAL_CLUBS);
    const users = getStorage('tf_users', []);
    const user = users.find((u: any) => u.id === userId);
    
    const clubIndex = clubs.findIndex((c: any) => c.id === clubId);
    if (clubIndex === -1) throw new Error('Club not found');

    const club = clubs[clubIndex];
    if (!club.members.some((m: any) => m.userId === userId)) {
      club.members.push({
        userId,
        name: user?.name || 'Unknown',
        role: 'member',
        contributed: 0
      });
      setStorage('tf_clubs', clubs);
    }
    return club;
  },

  contribute: async (clubId: string, userId: string, amount: number) => {
    const clubs = getStorage('tf_clubs', INITIAL_CLUBS);
    const activities = getStorage('tf_activities', INITIAL_ACTIVITIES);
    const users = getStorage('tf_users', []);
    const user = users.find((u: any) => u.id === userId);

    const clubIndex = clubs.findIndex((c: any) => c.id === clubId);
    if (clubIndex === -1) throw new Error('Club not found');

    const club = clubs[clubIndex];
    club.currentAmount += amount;
    
    const memberIndex = club.members.findIndex((m: any) => m.userId === userId);
    if (memberIndex !== -1) {
      club.members[memberIndex].contributed += amount;
    }

    const newActivity = {
      id: `act-${Date.now()}`,
      clubId,
      userId,
      userName: user?.name || 'Unknown',
      amount,
      type: 'contribution',
      timestamp: new Date().toISOString()
    };

    activities.push(newActivity);
    
    setStorage('tf_clubs', clubs);
    setStorage('tf_activities', activities);
    
    return { club, activity: newActivity };
  }
};
