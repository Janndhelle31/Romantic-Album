export default {
  name: "Midnight Dreams",
  description: "Dark theme with stars and moon effects",
  colors: {
    primary: "#1a1a2e",
    secondary: "#16213e",
    accent: "#0f3460",
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
  effects: {
    polaroidOpacity: 0.4,
    blurStrength: "2px",
    animationSpeed: 1.2,
  },
  polaroids: [
    { id: 1, src: "/images/midnight/star1.jpg", top: "5%", left: "5%", rotate: -15, duration: 30 },
    { id: 2, src: "/images/midnight/moon.jpg", top: "10%", left: "85%", rotate: 12, duration: 35 },
    { id: 3, src: "/images/midnight/galaxy.jpg", top: "65%", left: "5%", rotate: 8, duration: 40 },
  ],
  components: {
    musicPlayer: 'MidnightMusicPlayer',
    letterModal: 'MidnightLetterModal',
    coverScreen: 'MidnightCoverScreen',
  }
};