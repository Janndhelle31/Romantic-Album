export const themes = {
  default: {
    name: "Warm Memories",
    description: "Cozy, romantic with polaroid photos",
    colors: {
      primary: "#FF6B6B",
      secondary: "#FFFBF0",
      accent: "#FF6B6B",
      text: "#333333",
      textMuted: "#666666",
      background: "#FFFBF0",
      polaroidBg: "#FFFFFF",
      polaroidBorder: "#e5e7eb",
    },
    fonts: {
      primary: "'Inter', sans-serif",
      handwriting: "'Dancing Script', cursive",
    },
    polaroids: [
      { id: 1, src: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=300", top: "5%", left: "5%", rotate: -15, duration: 25 },
      { id: 2, src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=300", top: "10%", left: "85%", rotate: 12, duration: 28 },
    ],
  },
  midnight: {
    name: "Midnight Dreams",
    description: "Dark theme with stars and moon effects",
    colors: {
      primary: "#8B5CF6",
      secondary: "#0d1117",
      accent: "#8B5CF6",
      text: "#e6e6e6",
      textMuted: "#a0a0a0",
      background: "#0d1117",
      polaroidBg: "#1e1e2e",
      polaroidBorder: "#2d2d4d",
    },
    fonts: {
      primary: "'Space Grotesk', sans-serif",
      handwriting: "'Dancing Script', cursive",
    },
    polaroids: [
      { id: 1, src: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300", top: "8%", left: "8%", rotate: -10, duration: 30 },
      { id: 2, src: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300", top: "15%", left: "75%", rotate: 15, duration: 35 },
    ],
  },
  classy: {
    name: "Classy Vintage",
    description: "Elegant vintage with gold accents",
    colors: {
      primary: "#c9a66b",
      secondary: "#f8f4e9",
      accent: "#c9a66b",
      text: "#2c1810",
      textMuted: "#6b7280",
      background: "#f8f4e9",
      polaroidBg: "#ffffff",
      polaroidBorder: "#e8d8b6",
    },
    fonts: {
      primary: "'Cormorant Garamond', serif",
      handwriting: "'Great Vibes', cursive",
    },
    polaroids: [
      { id: 1, src: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=300", top: "10%", left: "10%", rotate: -8, duration: 28 },
      { id: 2, src: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300", top: "20%", left: "80%", rotate: 12, duration: 32 },
    ],
  },
};

// Helper function to get theme by name
export const getTheme = (themeName) => themes[themeName] || themes.default;

// Check if theme is dark
export const isDarkTheme = (themeName) => themeName === 'midnight';