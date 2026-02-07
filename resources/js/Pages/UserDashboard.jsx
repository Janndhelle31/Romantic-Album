import React, { useState, useEffect } from 'react';
import { useForm, Head, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/UserdashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import LetterModal from '@/Components/LetterModal';

export default function UserDashboard({ albums, letter_content }) {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [activeAlbum, setActiveAlbum] = useState(null);
    const [editId, setEditId] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    // --- Forms ---
    const albumForm = useForm({ title: '', icon: '💖', description: '' });
    
    const musicForm = useForm({ 
        music: null, 
        display_name: '' 
    });

    const memoryForm = useForm({ 
        album_id: '', 
        image: null, 
        date_text: '', 
        note: '' 
    });

    // Updated Letter Form using the separate table prop
    const letterForm = useForm({
        recipient: letter_content?.recipient || '',
        message: letter_content?.message || '',
        closing: letter_content?.closing || '',
        sender: letter_content?.sender || ''
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
    };

    const submitMemory = (e) => {
        e.preventDefault();
        const config = {
            forceFormData: true,
            onSuccess: () => editId ? cancelEdit() : (memoryForm.reset(), setPreviewUrl(null)),
            preserveScroll: true
        };
        if (editId) memoryForm.post(route('manage.memory.update', editId), config);
        else memoryForm.post(route('manage.memory.store'), config);
    };

    const submitAlbum = (e) => {
        e.preventDefault();
        albumForm.post(route('manage.album.store'), { onSuccess: () => albumForm.reset() });
    };

    const submitMusic = (e) => {
        e.preventDefault();
        musicForm.post(route('music.update'), { 
            forceFormData: true, 
            onSuccess: () => {
                musicForm.reset();
                alert("Theme song updated! ✨");
            }
        });
    };

    const submitLetter = (e) => {
        e.preventDefault();
        letterForm.post(route('letter.update'), {
            preserveScroll: true,
            onSuccess: () => alert("Letter content saved! 💌")
        });
    };

    const deleteMemory = (id) => {
        if (confirm('Delete this memory forever?')) {
            router.delete(route('manage.memory.destroy', id));
        }
    };

    return (
        <div className="max-w-screen-xl mx-auto px-4 pb-20">
            <Head title="Creator Studio" />
            
            <header className="mb-8 mt-6">
                <h1 className="text-3xl md:text-4xl font-serif text-gray-800">The Creator Studio</h1>
                <p className="font-handwriting text-lg text-pink-400 mt-1">Refine your sunshine moments...</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                
                {/* 1. MEMORY FORM */}
                <motion.div 
                    animate={{ borderColor: editId ? '#60a5fa' : '#fbcfe8' }}
                    className="bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border-2 transition-colors duration-500"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                            <span className={`p-2 rounded-lg text-sm ${editId ? 'bg-blue-50' : 'bg-yellow-50'}`}>
                                {editId ? '📝' : '📸'}
                            </span> 
                            {editId ? 'Edit Memory' : 'Add a Memory'}
                        </h2>
                        {editId && (
                            <button onClick={cancelEdit} className="text-xs font-bold text-red-400 bg-red-50 px-3 py-1 rounded-full">
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
                            <option value="">Destination Album</option>
                            {albums.map(a => <option key={a.id} value={a.id}>{a.icon} {a.title}</option>)}
                        </select>
                        
                        <div className={`group relative border-2 border-dashed rounded-xl p-6 text-center transition-all bg-gray-50/30 overflow-hidden ${editId ? 'border-blue-200' : 'border-gray-100'}`}>
                            <input type="file" onChange={e => memoryForm.setData('image', e.target.files[0])} className="hidden" id="dash-photo" accept="image/*" />
                            <label htmlFor="dash-photo" className="cursor-pointer block active:scale-95 transition-transform">
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
                                placeholder="Date (e.g. Aug 12)" 
                            />
                            <button 
                                type="submit" 
                                disabled={memoryForm.processing} 
                                className={`text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 ${
                                    editId ? 'bg-blue-500 shadow-blue-100' : 'bg-pink-400 shadow-pink-100'
                                }`}
                            >
                                {memoryForm.processing ? 'Saving...' : (editId ? 'Update ✨' : 'Save Memory ✨')}
                            </button>
                        </div>
                        <textarea 
                            value={memoryForm.data.note} 
                            onChange={e => memoryForm.setData('note', e.target.value)} 
                            className="w-full border-gray-100 bg-gray-50/50 rounded-xl p-4 h-28 text-sm focus:ring-pink-200 focus:outline-none" 
                            placeholder="Write a sweet note..." 
                        />
                    </form>
                </motion.div>

                <div className="space-y-6">
                    {/* 2. LETTER CONTENT FORM */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-pink-50">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                                <span className="p-2 bg-pink-50 rounded-lg text-sm">💌</span> Letter Content
                            </h2>
                            <button 
                                onClick={() => setIsPreviewOpen(true)}
                                className="text-xs font-bold text-pink-500 bg-pink-50 px-3 py-1 rounded-full hover:bg-pink-100 transition-colors"
                            >
                                Preview ✨
                            </button>
                        </div>
                        <form onSubmit={submitLetter} className="space-y-3">
                            <input 
                                type="text" 
                                value={letterForm.data.recipient} 
                                onChange={e => letterForm.setData('recipient', e.target.value)} 
                                className="w-full border-gray-100 bg-gray-50/50 rounded-xl p-4 text-sm focus:ring-pink-200 focus:outline-none" 
                                placeholder="To: (e.g. My Dearest)" 
                                required 
                            />
                            <textarea 
                                value={letterForm.data.message} 
                                onChange={e => letterForm.setData('message', e.target.value)} 
                                className="w-full border-gray-100 bg-gray-50/50 rounded-xl p-4 h-32 text-sm focus:ring-pink-200 focus:outline-none" 
                                placeholder="Your heart-felt message..." 
                                required 
                            />
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={letterForm.data.closing} 
                                    onChange={e => letterForm.setData('closing', e.target.value)} 
                                    className="w-1/2 border-gray-100 bg-gray-50/50 rounded-xl p-4 text-sm focus:ring-pink-200 focus:outline-none" 
                                    placeholder="Closing (e.g. Forever yours)" 
                                />
                                <input 
                                    type="text" 
                                    value={letterForm.data.sender} 
                                    onChange={e => letterForm.setData('sender', e.target.value)} 
                                    className="w-1/2 border-gray-100 bg-gray-50/50 rounded-xl p-4 text-sm font-handwriting focus:ring-pink-200 focus:outline-none" 
                                    placeholder="From: (Your Name)" 
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={letterForm.processing}
                                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-sm active:scale-95 transition-all shadow-md"
                            >
                                {letterForm.processing ? 'Saving...' : 'Update Letter 💌'}
                            </button>
                        </form>
                    </div>

                    {/* 3. NEW ALBUM FORM */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-pink-50">
                        <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <span className="p-2 bg-pink-50 rounded-lg text-sm">📂</span> New Album
                        </h2>
                        <form onSubmit={submitAlbum} className="flex flex-col sm:flex-row gap-2">
                            <input type="text" value={albumForm.data.title} onChange={e => albumForm.setData('title', e.target.value)} className="flex-1 border-gray-100 bg-gray-50/50 rounded-xl p-4 text-sm focus:ring-pink-200 focus:outline-none" placeholder="Title..." required />
                            <div className="flex gap-2">
                                <input type="text" value={albumForm.data.icon} onChange={e => albumForm.setData('icon', e.target.value)} className="w-20 border-gray-100 bg-gray-50/50 rounded-xl p-4 text-center focus:ring-pink-200 focus:outline-none" />
                                <button type="submit" disabled={albumForm.processing} className="flex-1 sm:flex-none bg-gray-900 text-white px-6 rounded-xl font-bold text-sm h-[54px] active:scale-95 transition-all">Create</button>
                            </div>
                        </form>
                    </div>

                    {/* 4. MUSIC SETTINGS FORM */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-pink-50">
                        <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <span className="p-2 bg-blue-50 rounded-lg text-sm">🎵</span> Music Theme
                        </h2>
                        <form onSubmit={submitMusic} className="space-y-3">
                            <input 
                                type="text" 
                                value={musicForm.data.display_name}
                                onChange={e => musicForm.setData('display_name', e.target.value)}
                                className="w-full border-gray-100 bg-gray-50/50 rounded-xl p-4 text-sm focus:ring-blue-200 focus:outline-none" 
                                placeholder="Song Name (e.g. Our Music)" 
                                required
                            />
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input 
                                    type="file" 
                                    onChange={e => musicForm.setData('music', e.target.files[0])} 
                                    className="flex-1 text-xs file:bg-pink-50 file:border-0 file:rounded-lg p-3 bg-gray-50 rounded-xl" 
                                    accept="audio/mp3,audio/wav" 
                                    required
                                />
                                <button 
                                    type="submit" 
                                    disabled={musicForm.processing}
                                    className="bg-blue-400 text-white px-6 py-4 rounded-xl font-bold text-sm active:scale-95 disabled:opacity-50 transition-all"
                                >
                                    {musicForm.processing ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* --- ALBUM PREVIEW SECTION --- */}
            <section className="mt-8">
                <h3 className="text-xl font-serif text-gray-800 mb-4 px-2">Collections</h3>
                <div className="flex gap-3 overflow-x-auto pb-4 px-1 no-scrollbar snap-x">
                    {albums.map(album => (
                        <motion.button 
                            key={album.id} 
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveAlbum(activeAlbum === album.id ? null : album.id)}
                            className={`flex-shrink-0 w-32 p-4 rounded-[1.5rem] border transition-all snap-start ${
                                activeAlbum === album.id ? 'bg-pink-500 border-pink-500 text-white shadow-lg' : 'bg-white border-pink-50 text-gray-600'
                            }`}
                        >
                            <span className="text-2xl block mb-1">{album.icon}</span>
                            <h4 className="font-bold text-xs truncate">{album.title}</h4>
                        </motion.button>
                    ))}
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
                                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x">
                                    {albums.find(a => a.id === activeAlbum)?.memories?.length > 0 ? (
                                        albums.find(a => a.id === activeAlbum).memories.map((memory) => (
                                            <div key={memory.id} className="min-w-[160px] max-w-[160px] relative snap-start group">
                                                <div className="bg-white p-2 pb-6 shadow-sm border border-gray-100 rotate-1 rounded-sm">
                                                    <img src={`/storage/${memory.image_path}`} className="w-full h-32 object-cover rounded-sm mb-2" />
                                                    <p className="font-handwriting text-[10px] text-gray-500 truncate">{memory.date_text}</p>
                                                </div>
                                                
                                                <button 
                                                    onClick={() => startEdit(memory)}
                                                    className="absolute top-0 left-0 bg-blue-500 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg z-10 -translate-x-2 -translate-y-2 active:scale-90 transition-transform"
                                                >
                                                    ✎
                                                </button>

                                                <button 
                                                    onClick={() => deleteMemory(memory.id)}
                                                    className="absolute top-0 right-0 bg-red-500 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg z-10 translate-x-2 -translate-y-2 active:scale-90 transition-transform"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-400 italic py-6 px-4 w-full text-center">This collection is currently empty...</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* PREVIEW MODAL */}
            <AnimatePresence>
                {isPreviewOpen && (
                    <LetterModal 
                        onClose={() => setIsPreviewOpen(false)} 
                        data={letterForm.data} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

UserDashboard.layout = page => <DashboardLayout children={page} />;