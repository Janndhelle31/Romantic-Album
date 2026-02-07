import { motion } from "framer-motion";

export default function MidnightMusicPlayer({ url, displayName, skipCountdown, start, onComplete }) {
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🎵</span>
          </div>
          <div>
            <p className="text-white font-medium">Midnight Melody</p>
            <p className="text-gray-400 text-sm">{displayName || "Playing..."}</p>
          </div>
          <button className="ml-4 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
            <span className="text-xl">⏸️</span>
          </button>
        </div>
      </div>
    </div>
  );
}