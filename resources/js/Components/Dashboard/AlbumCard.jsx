import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function AlbumCard({ album, theme, index }) {
  return (
    <Link href={`/albums/${album.slug}`} className="group">
      <motion.div 
        whileHover={{ y: -10 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        className={`relative p-10 rounded-[3rem] border transition-all duration-500 backdrop-blur-lg hover:shadow-2xl ${theme.card}`}
      >
        <div className="text-6xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
          {album.icon || '📸'}
        </div>
        
        <h2 className={`text-2xl font-bold mb-2 ${theme.fontSerif} ${theme.textMain}`}>
          {album.title}
        </h2>
        
        <p className={`text-xl leading-snug ${theme.fontAccent} ${theme.textMuted}`}>
          {album.description}
        </p>

        {album.memories_count !== undefined && (
          <span className={`absolute bottom-6 right-8 text-[10px] font-bold uppercase tracking-widest opacity-60 ${theme.accent}`}>
            {album.memories_count} Moments
          </span>
        )}
      </motion.div>
    </Link>
  );
}