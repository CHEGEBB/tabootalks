export const generateMockData = () => {
    const names = ['Sophia', 'Emma', 'Olivia', 'Ava', 'Isabella', 'Mia', 'Charlotte', 'Amelia', 'Luna', 'Harper'];
    const locations = ['Berlin', 'Munich', 'Hamburg', 'Vienna', 'Zurich', 'Amsterdam', 'Paris', 'Rome'];
    const captions = [
      'Living my best life ✨',
      'Sunset vibes are everything 🌅',
      'Coffee and good conversations',
      'Weekend mood',
      'Making memories that last',
      'Life is beautiful',
      'Chasing dreams and adventures',
      'Good vibes only',
      'Enjoying every moment',
      'Self-care Sunday'
    ];
  
    const profiles = Array.from({ length: 10 }, (_, i) => ({
      id: `profile_${i + 1}`,
      name: names[i],
      age: 22 + Math.floor(Math.random() * 8),
      location: locations[Math.floor(Math.random() * locations.length)],
      online: Math.random() > 0.5,
      imageUrl: `https://images.unsplash.com/photo-${1494790108377 + i * 100000}?w=400&h=500&fit=crop&q=80`
    }));
  
    const posts = profiles.map((profile, i) => ({
      id: `post_${i + 1}`,
      profileId: profile.id,
      profileName: profile.name,
      profileAge: profile.age,
      profileImage: profile.imageUrl,
      imageUrl: `https://images.unsplash.com/photo-${1516726817505 + i * 50000}?w=600&h=600&fit=crop&q=80`,
      caption: captions[i],
      likes: Math.floor(Math.random() * 100) + 20,
      timestamp: `${Math.floor(Math.random() * 24)}h ago`,
      isLiked: false,
      isFollowing: i === 1 || i === 4
    }));
  
    return { profiles, posts };
  };