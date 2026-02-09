// lib/data.js - Mock database for sample content

// Sample album categories with Unsplash images
export const sampleAlbums = [
  {
    id: 'sunset-collection',
    title: "Sunset Moments",
    slug: "sunset-moments",
    description: "Golden hour memories and warm embraces that paint the sky in hues of love",
    icon: "🌅",
    theme: "default",
    memories_count: 12,
    images: [
      {
        id: 'sunset-1',
        img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80",
        date: "August 15, 2023",
        note: "That magical sunset by the beach",
        rot: -2
      },
      {
        id: 'sunset-2',
        img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80",
        date: "July 22, 2023",
        note: "Holding hands as the sun disappeared",
        rot: 3
      },
      {
        id: 'sunset-3',
        img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&auto=format&fit=crop&q=80",
        date: "June 10, 2023",
        note: "Silent understanding in golden light",
        rot: -4
      }
    ]
  },
  {
    id: 'urban-adventures',
    title: "Urban Adventures",
    slug: "urban-adventures",
    description: "City explorations and spontaneous adventures in concrete jungles",
    icon: "🌆",
    theme: "midnight",
    memories_count: 8,
    images: [
      {
        id: 'urban-1',
        img: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&auto=format&fit=crop&q=80",
        date: "May 5, 2023",
        note: "Lost in the city lights together",
        rot: 2
      },
      {
        id: 'urban-2',
        img: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&auto=format&fit=crop&q=80",
        date: "April 18, 2023",
        note: "Midnight coffee and endless talks",
        rot: -1
      },
      {
        id: 'urban-3',
        img: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&auto=format&fit=crop&q=80",
        date: "March 30, 2023",
        note: "Discovering hidden city gems",
        rot: 4
      }
    ]
  },
  {
    id: 'nature-escapes',
    title: "Nature Escapes",
    slug: "nature-escapes",
    description: "Forest trails, mountain views, and moments of pure serenity",
    icon: "🏞️",
    theme: "nature",
    memories_count: 10,
    images: [
      {
        id: 'nature-1',
        img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80",
        date: "September 8, 2023",
        note: "Mountain air and clear minds",
        rot: -3
      },
      {
        id: 'nature-2',
        img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80",
        date: "October 12, 2023",
        note: "Walking through autumn leaves",
        rot: 1
      },
      {
        id: 'nature-3',
        img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&auto=format&fit=crop&q=80",
        date: "November 3, 2023",
        note: "Nature's perfect soundtrack",
        rot: -2
      }
    ]
  },
  {
    id: 'cozy-evenings',
    title: "Cozy Evenings",
    slug: "cozy-evenings",
    description: "Quiet nights, indoor comforts, and the warmth of togetherness",
    icon: "🕯️",
    theme: "vintage",
    memories_count: 6,
    images: [
      {
        id: 'cozy-1',
        img: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&auto=format&fit=crop&q=80",
        date: "January 14, 2024",
        note: "Rainy days and cozy blankets",
        rot: 2
      },
      {
        id: 'cozy-2',
        img: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1200&auto=format&fit=crop&q=80",
        date: "February 8, 2024",
        note: "Candlelit conversations",
        rot: -1
      },
      {
        id: 'cozy-3',
        img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80",
        date: "December 20, 2023",
        note: "Winter warmth and hot cocoa",
        rot: 3
      }
    ]
  },
  {
    id: 'travel-diary',
    title: "Travel Diary",
    slug: "travel-diary",
    description: "Journeys to distant places and memories from around the world",
    icon: "✈️",
    theme: "classy",
    memories_count: 15,
    images: [
      {
        id: 'travel-1',
        img: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop&q=80",
        date: "March 22, 2023",
        note: "First trip together - Paris",
        rot: -2
      },
      {
        id: 'travel-2',
        img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&auto=format&fit=crop&q=80",
        date: "June 30, 2023",
        note: "Beach days in Bali",
        rot: 4
      },
      {
        id: 'travel-3',
        img: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&auto=format&fit=crop&q=80",
        date: "October 5, 2023",
        note: "Mountain adventures in Switzerland",
        rot: -1
      }
    ]
  }
];

// Sample letter content
export const sampleLetter = {
  recipient: "My Dearest Love",
  message: "Every moment with you feels like a page from my favorite book. From our quiet mornings to our adventurous days, each memory is a treasure I hold close to my heart. This collection is my way of saying thank you - for every laugh, every conversation, every glance that spoke volumes. You are my favorite story, and I can't wait to write the next chapter together.",
  closing: "Forever yours,",
  sender: "Your Partner"
};

// Sample music tracks
export const sampleMusic = [
  {
    id: 'music-1',
    title: "Our Song",
    display_name: "Our Theme Song",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "3:45"
  },
  {
    id: 'music-2',
    title: "Quiet Moments",
    display_name: "Acoustic Memories",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "4:20"
  }
];

// Sample user settings
export const sampleSettings = {
  story_title: "Our Love Story",
  story_subtitle: "A collection of moments that tell our tale",
  anniversary_date: "2022-06-15",
  theme: "default",
  created_at: "2023-01-01"
};

// Helper functions
export const getAlbumBySlug = (slug) => {
  return sampleAlbums.find(album => album.slug === slug);
};

export const getAllAlbums = () => {
  return sampleAlbums;
};

export const getAlbumImages = (albumId) => {
  const album = sampleAlbums.find(a => a.id === albumId);
  return album ? album.images : [];
};

export const getRandomAlbum = () => {
  return sampleAlbums[Math.floor(Math.random() * sampleAlbums.length)];
};

export const getFeaturedAlbums = (count = 3) => {
  return sampleAlbums.slice(0, count);
};

export const getSampleAlbumUrl = (slug) => {
  return `/preview/album/${slug}`;
};

export const searchAlbums = (query) => {
  return sampleAlbums.filter(album => 
    album.title.toLowerCase().includes(query.toLowerCase()) ||
    album.description.toLowerCase().includes(query.toLowerCase())
  );
};

export const getSampleMusic = () => ({
    id: 'sample-music-1',
    url: 'https://example.com/sample-music.mp3',
    display_name: 'Sample Ambient Music',
    title: 'Dreamy Ambient Sounds',
    artist: 'Sample Orchestra',
    duration: 180,
    is_sample: true
});

export const getSampleLetter = () => ({
    id: 'sample-letter-1',
    title: 'A Sample Love Letter',
    content: 'This is a sample love letter to show you how your letters will appear. In the full version, you can write your own personal messages.',
    date: 'February 14, 2024',
    is_sample: true
});
