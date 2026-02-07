import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function AdminDashboard({ albums }) {
    const albumForm = useForm({ title: '', icon: '💖', description: '' });
    const memoryForm = useForm({ album_id: '', image: null, date_text: '', note: '' });

    const submitAlbum = (e) => {
        e.preventDefault();
        albumForm.post(route('admin.albums.store'), { onSuccess: () => albumForm.reset() });
    };

    const submitMemory = (e) => {
        e.preventDefault();
        memoryForm.post(route('admin.memories.store'), { onSuccess: () => memoryForm.reset() });
    };

    return (
        <div className="max-w-4xl mx-auto p-8 font-sans">
            <Head title="Admin Dashboard" />
            <h1 className="text-3xl font-serif text-pink-500 mb-10 text-center">Memory Manager</h1>

            <div className="grid md:grid-cols-2 gap-12">
                {/* CREATE ALBUM */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-pink-100">
                    <h2 className="text-xl font-bold mb-4 text-gray-700">New Album</h2>
                    <form onSubmit={submitAlbum} className="space-y-4">
                        <input type="text" placeholder="Album Title (e.g. Dates)" className="w-full rounded-lg border-gray-200"
                            value={albumForm.data.title} onChange={e => albumForm.setData('title', e.target.value)} />
                        <input type="text" placeholder="Icon (e.g. 🍕)" className="w-full rounded-lg border-gray-200"
                            value={albumForm.data.icon} onChange={e => albumForm.setData('icon', e.target.value)} />
                        <button type="submit" className="bg-pink-400 text-white px-4 py-2 rounded-lg hover:bg-pink-500">Create Album</button>
                    </form>
                </section>

                {/* CREATE MEMORY */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-pink-100">
                    <h2 className="text-xl font-bold mb-4 text-gray-700">Add Memory</h2>
                    <form onSubmit={submitMemory} className="space-y-4">
                        <select className="w-full rounded-lg border-gray-200" onChange={e => memoryForm.setData('album_id', e.target.value)}>
                            <option value="">Select Album</option>
                            {albums.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                        </select>
                        <input type="file" onChange={e => memoryForm.setData('image', e.target.files[0])} className="text-sm" />
                        <input type="text" placeholder="Date/Title" className="w-full rounded-lg border-gray-200"
                            value={memoryForm.data.date_text} onChange={e => memoryForm.setData('date_text', e.target.value)} />
                        <textarea placeholder="The Note" className="w-full rounded-lg border-gray-200"
                            value={memoryForm.data.note} onChange={e => memoryForm.setData('note', e.target.value)} />
                        <button type="submit" className="bg-pink-400 text-white px-4 py-2 rounded-lg hover:bg-pink-500">Upload Memory</button>
                    </form>
                </section>
            </div>
        </div>
    );
}

AdminDashboard.layout = page => <AppLayout children={page} />;