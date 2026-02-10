import React, { useState, useEffect } from 'react';
import { useForm, Head, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/UserdashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserDashboard({ albums }) {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [activeAlbum, setActiveAlbum] = useState(null);
    const [editId, setEditId] = useState(null);
    const [showAlbumFirstPrompt, setShowAlbumFirstPrompt] = useState(albums.length === 0);

    // --- Limits ---
    const MAX_ALBUMS = 9; // Maximum 9 albums total
    const MAX_MEMORIES_PER_ALBUM = 6; // Maximum 6 memories per album

    // --- Forms ---
    const albumForm = useForm({ title: '', icon: '💖', description: '' });
    
    const memoryForm = useForm({ 
        album_id: '', 
        image: null, 
        date_text: '', 
        note: '' 
    });

    // Handle image preview logic
    useEffect(() => {
        if (!memoryForm.data.image && !editId) return setPreviewUrl(null);
        if (memoryForm.data.image) {
            const url = URL.createObjectURL(memoryForm.data.image);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [memoryForm.data.image, editId]);

    // Auto-select first album if available and none selected
    useEffect(() => {
        if (albums.length > 0 && !memoryForm.data.album_id && !editId) {
            memoryForm.setData('album_id', albums[0].id);
        }
        // Hide prompt if albums exist
        if (albums.length > 0 && showAlbumFirstPrompt) {
            setShowAlbumFirstPrompt(false);
        }
    }, [albums]);

    // Check if album has reached memory limit
    const hasReachedMemoryLimit = (albumId) => {
        const album = albums.find(a => a.id === albumId);
        return album && album.memories && album.memories.length >= MAX_MEMORIES_PER_ALBUM;
    };

    // Check if user has reached album limit
    const hasReachedAlbumLimit = () => {
        return albums.length >= MAX_ALBUMS;
    };

    // --- Actions ---
    const startEdit = (memory) => {
        setEditId(memory.id);
        memoryForm.setData({
            album_id: memory.album_id,
            image: null,
            date_text: memory.date_text,
            note: memory.note || ''
        });
        setPreviewUrl(`/storage/${memory.image_path}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditId(null);
        memoryForm.reset();
        setPreviewUrl(null);
        // Reset to first album if available
        if (albums.length > 0) {
            memoryForm.setData('album_id', albums[0].id);
        }
    };

    const submitMemory = (e) => {
        e.preventDefault();
        
        // Check if album has reached memory limit (only for new memories, not edits)
        if (!editId && hasReachedMemoryLimit(memoryForm.data.album_id)) {
            alert(`This album has reached the maximum limit of ${MAX_MEMORIES_PER_ALBUM} memories. Please select another album or delete existing memories.`);
            return;
        }
        
        const config = {
            forceFormData: true,
            onSuccess: () => {
                if (editId) {
                    cancelEdit();
                } else {
                    memoryForm.reset();
                    setPreviewUrl(null);
                    // Reset to first album
                    if (albums.length > 0) {
                        memoryForm.setData('album_id', albums[0].id);
                    }
                }
            },
            preserveScroll: true
        };
        if (editId) memoryForm.post(route('manage.memory.update', editId), config);
        else memoryForm.post(route('manage.memory.store'), config);
    };

    const submitAlbum = (e) => {
        e.preventDefault();
        
        // Check if user has reached album limit
        if (hasReachedAlbumLimit()) {
            alert(`You have reached the maximum limit of ${MAX_ALBUMS} albums. Please delete an existing album to create a new one.`);
            return;
        }
        
        albumForm.post(route('manage.album.store'), { 
            onSuccess: () => {
                albumForm.reset();
                // Hide the prompt once an album is created
                setShowAlbumFirstPrompt(false);
            },
            preserveScroll: true
        });
    };

    const deleteMemory = (id) => {
        if (confirm('Delete this memory forever?')) {
            router.delete(route('manage.memory.destroy', id));
        }
    };

    const deleteAlbum = (id) => {
        if (confirm('Delete this album and all its memories? This cannot be undone.')) {
            router.delete(route('manage.album.destroy', id));
        }
    };

    return (
        <div className="max-w-screen-xl mx-auto px-4 pb-20">
            <Head title="Creator Studio" />
            
            <header className="mb-8 mt-6">
                <h1 className="text-3xl md:text-4xl font-serif text-gray-800">Memory Manager</h1>
                <p className="font-handwriting text-lg text-pink-400 mt-1">Organize and cherish your special moments...</p>
            </header>

            {/* ALBUM FIRST PROMPT FOR NEW USERS */}
            <AnimatePresence>
                {showAlbumFirstPrompt && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-6 bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-200 rounded-2xl p-6 md:p-8 text-center"
                    >
                        <div className="flex flex-col items-center">
                            <span className="text-5xl mb-4">📂</span>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Create Your First Album</h2>
                            <p className="text-gray-600 mb-6 max-w-md">
                                Start by creating an album to organize your memories. 
                                You can create up to <span className="font-bold text-pink-500">9 albums</span>, 
                                each holding up to <span className="font-bold text-pink-500">6 memories</span>.
                            </p>
                            
                            {/* Quick Album Creation Form */}
                            <form onSubmit={submitAlbum} className="w-full max-w-md bg-white p-4 rounded-xl shadow-sm">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input 
                                        type="text" 
                                        value={albumForm.data.title} 
                                        onChange={e => albumForm.setData('title', e.target.value)} 
                                        className="flex-1 border border-pink-100 rounded-xl p-4 text-sm focus:ring-2 focus:ring-pink-200 focus:outline-none" 
                                        placeholder="Album Title (e.g. Our First Year)" 
                                        required 
                                        autoFocus
                                    />
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            value={albumForm.data.icon} 
                                            onChange={e => albumForm.setData('icon', e.target.value)} 
                                            className="w-20 border border-pink-100 rounded-xl p-4 text-center text-lg focus:ring-2 focus:ring-pink-200 focus:outline-none" 
                                            placeholder="💖"
                                        />
                                        <button 
                                            type="submit" 
                                            disabled={albumForm.processing}
                                            className="bg-pink-500 text-white px-6 py-4 rounded-xl font-bold text-sm active:scale-95 transition-all hover:bg-pink-600"
                                        >
                                            {albumForm.processing ? 'Creating...' : 'Create'}
                                        </button>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-3 text-center">
                                    Limit: {MAX_ALBUMS} albums total, {MAX_MEMORIES_PER_ALBUM} memories per album
                                </p>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                
                {/* 1. MEMORY FORM */}
                <motion.div 
                    animate={{ borderColor: editId ? '#60a5fa' : '#fbcfe8' }}
                    className={`bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border-2 transition-colors duration-500 ${albums.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    {albums.length === 0 ? (
                        <div className="text-center py-8">
                            <span className="text-4xl block mb-4">📸</span>
                            <p className="text-gray-500 font-medium">Create an album first to add memories</p>
                            <p className="text-sm text-gray-400 mt-2">Each album can hold up to {MAX_MEMORIES_PER_ALBUM} memories</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                                    <span className={`p-2 rounded-lg text-sm ${editId ? 'bg-blue-50' : 'bg-yellow-50'}`}>
                                        {editId ? '📝' : '📸'}
                                    </span> 
                                    {editId ? 'Edit Memory' : 'Add a Memory'}
                                </h2>
                                {editId && (
                                    <button onClick={cancelEdit} className="text-xs font-bold text-red-400 bg-red-50 px-3 py-1 rounded-full hover:bg-red-100 transition-colors">
                                        Cancel
                                    </button>
                                )}
                            </div>
                            
                            <form onSubmit={submitMemory} className="space-y-4">
                                <select 
                                    value={memoryForm.data.album_id} 
                                    onChange={e => memoryForm.setData('album_id', e.target.value)} 
                                    className="w-full border-gray-100 bg-gray-50/50 rounded-xl p-4 text-sm focus:ring-2 focus:ring-pink-200 focus:outline-none"
                                    required
                                >
                                    <option value="">Select Album</option>
                                    {albums.map(a => (
                                        <option 
                                            key={a.id} 
                                            value={a.id}
                                            disabled={hasReachedMemoryLimit(a.id) && !editId}
                                            className={hasReachedMemoryLimit(a.id) && !editId ? 'text-red-400 bg-red-50' : ''}
                                        >
                                            {a.icon} {a.title} 
                                            {(a.memories?.length || 0) > 0 && (
                                                <span className="text-gray-400 text-xs ml-2">
                                                    ({a.memories?.length || 0}/{MAX_MEMORIES_PER_ALBUM})
                                                </span>
                                            )}
                                            {hasReachedMemoryLimit(a.id) && !editId && ' (Full)'}
                                        </option>
                                    ))}
                                </select>
                                
                                {/* Album memory limit warning */}
                                {memoryForm.data.album_id && hasReachedMemoryLimit(memoryForm.data.album_id) && !editId && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                                        <p className="text-red-600 text-sm font-medium">
                                            ⚠️ This album has reached the limit of {MAX_MEMORIES_PER_ALBUM} memories
                                        </p>
                                        <p className="text-red-500 text-xs mt-1">
                                            Please select another album or delete existing memories
                                        </p>
                                    </div>
                                )}
                                
                                <div className={`group relative border-2 border-dashed rounded-xl p-6 text-center transition-all bg-gray-50/30 overflow-hidden ${editId ? 'border-blue-200' : 'border-gray-100'}`}>
                                    <input 
                                        type="file" 
                                        onChange={e => memoryForm.setData('image', e.target.files[0])} 
                                        className="hidden" 
                                        id="dash-photo" 
                                        accept="image/*" 
                                        required={!editId}
                                    />
                                    <label 
                                        htmlFor="dash-photo" 
                                        className={`cursor-pointer block active:scale-95 transition-transform ${
                                            memoryForm.data.album_id && hasReachedMemoryLimit(memoryForm.data.album_id) && !editId ? 'pointer-events-none opacity-50' : ''
                                        }`}
                                    >
                                        {previewUrl ? (
                                            <div className="relative">
                                                <img src={previewUrl} className="mx-auto h-48 md:h-56 object-cover rounded-lg shadow-md mb-2 border-4 border-white" alt="Preview" />
                                                <span className={`text-[10px] font-bold uppercase tracking-wider ${editId ? 'text-blue-500' : 'text-pink-500'}`}>
                                                    Tap to Change Photo
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center py-4">
                                                <span className="text-5xl mb-2">🖼️</span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Photo</span>
                                                <span className="text-xs text-gray-500 mt-2">JPG, PNG (max 5MB)</span>
                                            </div>
                                        )}
                                    </label>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <input 
                                        type="text" 
                                        value={memoryForm.data.date_text} 
                                        onChange={e => memoryForm.setData('date_text', e.target.value)} 
                                        className="w-full border-gray-100 bg-gray-50/50 rounded-xl p-4 text-sm focus:ring-pink-200 focus:outline-none" 
                                        placeholder="Date (e.g. Aug 12, 2023)" 
                                        required
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={memoryForm.processing || (memoryForm.data.album_id && hasReachedMemoryLimit(memoryForm.data.album_id) && !editId)} 
                                        className={`text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                                            editId ? 'bg-blue-500 shadow-blue-100 hover:bg-blue-600' : 'bg-pink-400 shadow-pink-100 hover:bg-pink-500'
                                        }`}
                                    >
                                        {memoryForm.processing ? 'Saving...' : (editId ? 'Update ✨' : 'Save Memory ✨')}
                                    </button>
                                </div>
                                <textarea 
                                    value={memoryForm.data.note} 
                                    onChange={e => memoryForm.setData('note', e.target.value)} 
                                    className="w-full border-gray-100 bg-gray-50/50 rounded-xl p-4 h-28 text-sm focus:ring-pink-200 focus:outline-none" 
                                    placeholder="Write a sweet note (optional)..." 
                                />
                            </form>
                        </>
                    )}
                </motion.div>

                {/* 2. NEW ALBUM FORM (Always visible) */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-pink-50">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                                <span className="p-2 bg-pink-50 rounded-lg text-sm">📂</span> 
                                {albums.length === 0 ? 'Create First Album' : 'New Album'}
                            </h2>
                            {albums.length > 0 && (
                                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                                    hasReachedAlbumLimit() ? 'bg-red-100 text-red-600' : 'bg-gray-50 text-gray-400'
                                }`}>
                                    {albums.length}/{MAX_ALBUMS} albums
                                    {hasReachedAlbumLimit() && ' (Maximum reached)'}
                                </span>
                            )}
                        </div>
                        <form onSubmit={submitAlbum} className="flex flex-col sm:flex-row gap-2">
                            <input 
                                type="text" 
                                value={albumForm.data.title} 
                                onChange={e => albumForm.setData('title', e.target.value)} 
                                className={`flex-1 border-gray-100 rounded-xl p-4 text-sm focus:ring-2 focus:outline-none ${
                                    hasReachedAlbumLimit() ? 'bg-gray-50/50 text-gray-400 cursor-not-allowed' : 'bg-gray-50/50 focus:ring-pink-200'
                                }`} 
                                placeholder={hasReachedAlbumLimit() ? "Album limit reached (max " + MAX_ALBUMS + ")" : (albums.length === 0 ? "Our First Year Together..." : "New Album Title...")} 
                                required 
                                disabled={hasReachedAlbumLimit()}
                            />
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={albumForm.data.icon} 
                                    onChange={e => albumForm.setData('icon', e.target.value)} 
                                    className={`w-20 border-gray-100 rounded-xl p-4 text-center text-lg focus:ring-2 focus:outline-none ${
                                        hasReachedAlbumLimit() ? 'bg-gray-50/50 text-gray-400 cursor-not-allowed' : 'bg-gray-50/50 focus:ring-pink-200'
                                    }`} 
                                    disabled={hasReachedAlbumLimit()}
                                />
                                <button 
                                    type="submit" 
                                    disabled={albumForm.processing || hasReachedAlbumLimit()} 
                                    className={`flex-1 sm:flex-none px-6 rounded-xl font-bold text-sm h-[54px] active:scale-95 transition-all ${
                                        hasReachedAlbumLimit() ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-black'
                                    }`}
                                >
                                    {albumForm.processing ? 'Creating...' : 
                                     hasReachedAlbumLimit() ? 'Limit Reached' :
                                     albums.length === 0 ? 'Start Journey' : 'Create'}
                                </button>
                            </div>
                        </form>
                        {!hasReachedAlbumLimit() ? (
                            albums.length === 0 ? (
                                <p className="text-xs text-gray-400 mt-3">
                                    Tip: Create albums like "Vacations", "Anniversaries", or "Date Nights"
                                </p>
                            ) : (
                                <p className="text-xs text-gray-400 mt-3">
                                    You can create up to {MAX_ALBUMS} albums total, each holding {MAX_MEMORIES_PER_ALBUM} memories
                                </p>
                            )
                        ) : (
                            <p className="text-xs text-red-500 mt-3 font-medium">
                                ⚠️ You have reached the maximum of {MAX_ALBUMS} albums. Delete an existing album to create a new one.
                            </p>
                        )}
                    </div>

                    {/* Quick Stats Section */}
                    {albums.length > 0 && (
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-pink-50">
                            <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                                <span className="p-2 bg-green-50 rounded-lg text-sm">📊</span> 
                                Memory Stats
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-pink-50 rounded-xl">
                                    <div className="text-2xl font-bold text-pink-600">
                                        {albums.length}<span className="text-sm text-pink-400">/{MAX_ALBUMS}</span>
                                    </div>
                                    <div className="text-xs text-gray-600">Albums</div>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-xl">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {albums.reduce((total, album) => total + (album.memories?.length || 0), 0)}
                                    </div>
                                    <div className="text-xs text-gray-600">Total Memories</div>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-amber-50 rounded-xl">
                                <p className="text-xs text-amber-700 text-center">
                                    📦 Limit: {MAX_ALBUMS} albums total, {MAX_MEMORIES_PER_ALBUM} memories per album
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* --- ALBUM COLLECTION SECTION --- */}
            {albums.length > 0 && (
                <section className="mt-8">
                    <div className="flex justify-between items-center mb-4 px-2">
                        <h3 className="text-xl font-serif text-gray-800">Your Collections ({MAX_ALBUMS} max)</h3>
                        <span className={`text-sm px-3 py-1 rounded-full ${
                            hasReachedAlbumLimit() ? 'bg-red-100 text-red-600' : 'text-gray-500 bg-gray-50'
                        }`}>
                            {albums.length}/{MAX_ALBUMS} albums • {albums.reduce((total, album) => total + (album.memories?.length || 0), 0)} memories
                        </span>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-4 px-1 no-scrollbar snap-x">
                        {albums.map(album => {
                            const isMemoryFull = hasReachedMemoryLimit(album.id);
                            const memoryCount = album.memories?.length || 0;
                            
                            return (
                                <motion.div 
                                    key={album.id} 
                                    className="flex-shrink-0 w-32 snap-start relative"
                                >
                                    <motion.button 
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveAlbum(activeAlbum === album.id ? null : album.id)}
                                        className={`w-full p-4 rounded-[1.5rem] border transition-all ${
                                            activeAlbum === album.id ? 'bg-pink-500 border-pink-500 text-white shadow-lg' : 
                                            isMemoryFull ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-white border-pink-50 text-gray-600 hover:bg-pink-50'
                                        }`}
                                    >
                                        <span className="text-2xl block mb-1">{album.icon}</span>
                                        <h4 className="font-bold text-xs truncate">{album.title}</h4>
                                        <span className={`text-[10px] mt-1 ${isMemoryFull ? 'text-rose-600 font-bold' : 'opacity-70'}`}>
                                            {memoryCount}/{MAX_MEMORIES_PER_ALBUM} {isMemoryFull && '✅'}
                                        </span>
                                    </motion.button>
                                    
                                    {/* Memory full indicator badge */}
                                    {isMemoryFull && (
                                        <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                            FULL
                                        </div>
                                    )}
                                    
                                    {/* Delete album button (only if empty) */}
                                    {(memoryCount === 0) && (
                                        <button
                                            onClick={() => deleteAlbum(album.id)}
                                            className="absolute -top-2 -right-2 bg-red-100 text-red-500 w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-red-200 transition-colors"
                                            title="Delete empty album"
                                        >
                                            ×
                                        </button>
                                    )}
                                </motion.div>
                            );
                        })}
                        
                        {/* Add album placeholder if not at limit */}
                        {!hasReachedAlbumLimit() && (
                            <motion.div 
                                className="flex-shrink-0 w-32 snap-start"
                                whileHover={{ scale: 1.02 }}
                            >
                                <button
                                    onClick={() => {
                                        document.querySelector('input[name="title"]')?.focus();
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="w-full h-full p-4 rounded-[1.5rem] border-2 border-dashed border-pink-200 bg-pink-50/30 text-pink-400 hover:bg-pink-100 transition-colors flex flex-col items-center justify-center"
                                >
                                    <span className="text-2xl block mb-1">+</span>
                                    <h4 className="font-bold text-xs">New Album</h4>
                                    <span className="text-[10px] mt-1 text-pink-300">
                                        {MAX_ALBUMS - albums.length} remaining
                                    </span>
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {/* --- MEMORY DRAWER --- */}
                    <AnimatePresence mode="wait">
                        {activeAlbum && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }} 
                                animate={{ opacity: 1, height: 'auto' }} 
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 overflow-hidden"
                            >
                                <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-4 border border-pink-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-4 px-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-pink-500 text-xl">
                                                {albums.find(a => a.id === activeAlbum)?.icon}
                                            </span>
                                            <h4 className="font-bold text-gray-700">
                                                {albums.find(a => a.id === activeAlbum)?.title}
                                            </h4>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs ${hasReachedMemoryLimit(activeAlbum) ? 'text-rose-600 font-bold' : 'text-gray-500'}`}>
                                                {albums.find(a => a.id === activeAlbum)?.memories?.length || 0}/{MAX_MEMORIES_PER_ALBUM} memories
                                            </span>
                                            {hasReachedMemoryLimit(activeAlbum) && (
                                                <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full">
                                                    Full
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {albums.find(a => a.id === activeAlbum)?.memories?.length > 0 ? (
                                        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x">
                                            {albums.find(a => a.id === activeAlbum).memories.map((memory) => (
                                                <div key={memory.id} className="min-w-[160px] max-w-[160px] relative snap-start group">
                                                    <div className="bg-white p-2 pb-6 shadow-sm border border-gray-100 rotate-1 rounded-sm">
                                                        <img src={`/storage/${memory.image_path}`} className="w-full h-32 object-cover rounded-sm mb-2" alt="Memory" />
                                                        <p className="font-handwriting text-[10px] text-gray-500 truncate">{memory.date_text}</p>
                                                    </div>
                                                    
                                                    <button 
                                                        onClick={() => startEdit(memory)}
                                                        className="absolute top-0 left-0 bg-blue-500 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg z-10 -translate-x-2 -translate-y-2 active:scale-90 transition-transform hover:bg-blue-600"
                                                    >
                                                        ✎
                                                    </button>

                                                    <button 
                                                        onClick={() => deleteMemory(memory.id)}
                                                        className="absolute top-0 right-0 bg-red-500 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg z-10 translate-x-2 -translate-y-2 active:scale-90 transition-transform hover:bg-red-600"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <span className="text-4xl block mb-3">🖼️</span>
                                            <p className="text-gray-500 font-medium">No memories yet</p>
                                            <p className="text-sm text-gray-400 mt-1">Add your first memory using the form above!</p>
                                            {memoryForm.data.album_id !== activeAlbum && (
                                                <button
                                                    onClick={() => {
                                                        memoryForm.setData('album_id', activeAlbum);
                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                    }}
                                                    className="mt-3 text-sm bg-pink-100 text-pink-600 px-4 py-2 rounded-full hover:bg-pink-200 transition-colors"
                                                >
                                                    Select this album to add memories
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* Add memory button when album is not full */}
                                    {!hasReachedMemoryLimit(activeAlbum) && (
                                        <div className="mt-4 text-center">
                                            <button
                                                onClick={() => {
                                                    memoryForm.setData('album_id', activeAlbum);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className="inline-flex items-center gap-2 bg-pink-500 text-white px-5 py-3 rounded-full font-bold text-sm hover:bg-pink-600 transition-colors active:scale-95"
                                            >
                                                <span>+</span>
                                                Add Memory to This Album ({albums.find(a => a.id === activeAlbum)?.memories?.length || 0}/{MAX_MEMORIES_PER_ALBUM})
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            )}
        </div>
    );
}

UserDashboard.layout = page => <DashboardLayout children={page} />;