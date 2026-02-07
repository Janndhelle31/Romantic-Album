cat > resources/js/Components/MusicPlayer/DefaultMusicPlayer.jsx << 'EOF'
export default function DefaultMusicPlayer({ url, displayName, skipCountdown, start, onComplete }) {
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🎵</span>
          </div>
          <div>
            <p className="text-gray-800 font-medium">Theme Song</p>
            <p className="text-gray-600 text-sm">{displayName || "Select a song..."}</p>
          </div>
          <button className="ml-4 p-2 bg-pink-100 rounded-lg hover:bg-pink-200 transition">
            <span className="text-xl">⏸️</span>
          </button>
        </div>
      </div>
    </div>
  );
}
EOF