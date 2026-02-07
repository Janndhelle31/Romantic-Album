export default {
  name: "Classy Vintage",
  description: "Elegant theme with gold accents and vintage elements",
  colors: {
    primary: "#2c1810",
    secondary: "#3d2518",
    accent: "#c9a66b",
    text: "#f5f1e8",
    textMuted: "#d4c9b8",
    background: "#f8f4e9",
    polaroidBg: "#ffffff",
    polaroidBorder: "#e8d8b6",
  },
  fonts: {
    primary: "'Cormorant Garamond', serif",
    handwriting: "'Great Vibes', cursive",
  },
  effects: {
    polaroidOpacity: 0.5,
    blurStrength: "1px",
    animationSpeed: 1,
  },
  polaroids: [
    { id: 1, src: "/images/classy/vintage1.jpg", top: "8%", left: "8%", rotate: -12, duration: 28 },
    { id: 2, src: "/images/classy/vintage2.jpg", top: "15%", left: "80%", rotate: 10, duration: 32 },
  ],
  components: {
    musicPlayer: 'ClassyMusicPlayer',
    letterModal: 'ClassyLetterModal',
    coverScreen: 'ClassyCoverScreen',
  }
};