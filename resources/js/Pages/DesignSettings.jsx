// DesignSettings.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Head, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/UserdashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import LetterModal from '@/Components/LetterModal';
import AudioPlayer from '@/Components/Design/AudioPlayer'; // Separate component
import ThemeSelector from '@/Components/Design/ThemeSelector';
import ThemeFeatures from '@/Components/Design/ThemeFeatures';
import Header from '@/Components/Design/Header';
import CurrentSettings from '@/Components/Design/CurrentSettings';
import FrontPageSettings from '@/Components/Design/FrontPageSettings';

const THEMES = [
    {
        id: 'default',
        name: 'Sunshine',
        description: 'Bright and cheerful layout with warm colors',
        emoji: '☀️',
        color: 'bg-gradient-to-r from-yellow-400 to-orange-400',
        borderColor: 'border-yellow-300',
        textColor: 'text-yellow-700',
        bgPreview: 'bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50',
        layoutComponent: 'DefaultLayout'
    },
    {
        id: 'midnight',
        name: 'Midnight',
        description: 'Dark mode with romantic ambiance',
        emoji: '🌙',
        color: 'bg-gradient-to-r from-indigo-700 to-purple-800',
        borderColor: 'border-purple-500',
        textColor: 'text-purple-100',
        bgPreview: 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900',
        layoutComponent: 'MidnightLayout'
    },
    {
        id: 'classy',
        name: 'Classy',
        description: 'Elegant gold and black sophistication',
        emoji: '✨',
        color: 'bg-gradient-to-r from-amber-600 to-stone-700',
        borderColor: 'border-amber-400',
        textColor: 'text-amber-100',
        bgPreview: 'bg-gradient-to-br from-stone-800 via-amber-900 to-stone-900',
        layoutComponent: 'ClassyLayout'
    },
    {
        id: 'vintage',
        name: 'Vintage',
        description: 'Retro aesthetic with sepia tones',
        emoji: '📜',
        color: 'bg-gradient-to-r from-amber-700 to-rose-800',
        borderColor: 'border-amber-600',
        textColor: 'text-amber-100',
        bgPreview: 'bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100',
        layoutComponent: 'VintageLayout'
    },
    {
        id: 'nature',
        name: 'Nature',
        description: 'Earthy greens and natural textures',
        emoji: '🌿',
        color: 'bg-gradient-to-r from-emerald-600 to-green-700',
        borderColor: 'border-emerald-500',
        textColor: 'text-emerald-100',
        bgPreview: 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50',
        layoutComponent: 'NatureLayout'
    }
];

export default function DesignSettings({ 
    letter_content = {}, 
    music_data = null, 
    auth, 
    settings = null
}) {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [status, setStatus] = useState(null);
    
    const userTheme = auth?.user?.theme || 'default';
    const settingsTheme = settings?.theme || userTheme;
    
    const [selectedTheme, setSelectedTheme] = useState(settingsTheme);
    const [themeLoading, setThemeLoading] = useState(false);
    const [frontPageLoading, setFrontPageLoading] = useState(false);
    const hasSettings = !!settings;

    useEffect(() => {
        if (status) {
            const timer = setTimeout(() => {
                setStatus(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const frontPageForm = useForm({
        story_title: settings?.story_title || 'Our Love Story',
        story_subtitle: settings?.story_subtitle || 'A Journey of Love & Memories',
        anniversary_date: settings?.anniversary_date || '',
        theme: settingsTheme
    });

    useEffect(() => {
        if (settings?.theme && settings.theme !== selectedTheme) {
            setSelectedTheme(settings.theme);
            frontPageForm.setData('theme', settings.theme);
        }
    }, [settings?.theme, selectedTheme]);

    useEffect(() => {
        if (!settings && userTheme !== selectedTheme) {
            setSelectedTheme(userTheme);
            frontPageForm.setData('theme', userTheme);
        }
    }, [userTheme, settings, selectedTheme]);

    useEffect(() => {
        if (selectedTheme !== frontPageForm.data.theme) {
            frontPageForm.setData('theme', selectedTheme);
        }
    }, [selectedTheme]);

    useEffect(() => {
        if (themeLoading && selectedTheme === settingsTheme) {
            setThemeLoading(false);
        }
    }, [themeLoading, selectedTheme, settingsTheme]);

    const musicForm = useForm({ 
        music: null, 
        display_name: music_data?.file_name || ''
    });

    const letterForm = useForm({
        recipient: letter_content?.recipient || '',
        message: letter_content?.message || '',
        closing: letter_content?.closing || '',
        sender: letter_content?.sender || auth?.user?.name || ''
    });

    const handleThemeChange = useCallback((theme) => {
        if (theme === selectedTheme || themeLoading) return;
        
        setThemeLoading(true);
        
        router.post(route('theme.update'), { theme: theme }, {
            preserveScroll: true,
            preserveState: false,
            onSuccess: (page) => {
                setStatus({ type: 'success', message: `Theme updated to "${getThemeName(theme)}"` });
                
                if (hasSettings) {
                    router.post(route('settings.store', { setting: settings.id }), {
                        theme: theme,
                        story_title: frontPageForm.data.story_title,
                        story_subtitle: frontPageForm.data.story_subtitle,
                        anniversary_date: frontPageForm.data.anniversary_date
                    }, {
                        preserveScroll: true,
                        preserveState: false,
                        onFinish: () => {
                            setThemeLoading(false);
                        }
                    });
                } else {
                    frontPageForm.setData('theme', theme);
                    setThemeLoading(false);
                }
            },
            onError: (errors) => {
                setStatus({ type: 'error', message: 'Failed to update theme' });
                setThemeLoading(false);
            }
        });
    }, [selectedTheme, themeLoading, router, frontPageForm, hasSettings, settings?.id]);

    const submitFrontPageSettings = (e) => {
        e.preventDefault();
        setFrontPageLoading(true);
        
        if (settings && settings.id) {
            frontPageForm.post(route('settings.store', { setting: settings.id }), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setStatus({ type: 'success', message: 'Front page settings updated' });
                    
                    if (frontPageForm.data.theme !== userTheme) {
                        router.post(route('theme.update'), { 
                            theme: frontPageForm.data.theme 
                        }, {
                            preserveScroll: true,
                            preserveState: false,
                            onFinish: () => {
                                setFrontPageLoading(false);
                            }
                        });
                    } else {
                        setFrontPageLoading(false);
                    }
                },
                onError: (errors) => {
                    setStatus({ type: 'error', message: 'Failed to update settings' });
                    setFrontPageLoading(false);
                }
            });
        } else {
            frontPageForm.post(route('settings.store'), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setStatus({ type: 'success', message: 'Settings saved successfully' });
                    
                    if (frontPageForm.data.theme !== userTheme) {
                        router.post(route('theme.update'), { 
                            theme: frontPageForm.data.theme 
                        }, {
                            preserveScroll: true,
                            preserveState: false,
                            onFinish: () => {
                                setFrontPageLoading(false);
                            }
                        });
                    } else {
                        setFrontPageLoading(false);
                    }
                },
                onError: (errors) => {
                    setStatus({ type: 'error', message: 'Failed to save settings' });
                    setFrontPageLoading(false);
                }
            });
        }
    };

    const submitLetter = (e) => {
        e.preventDefault();
        letterForm.post(route('letter.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setStatus({ type: 'success', message: 'Love letter saved' });
            },
            onError: (errors) => {
                setStatus({ type: 'error', message: 'Failed to save letter' });
            }
        });
    };

    const submitMusic = (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        if (musicForm.data.display_name?.trim()) {
            formData.append('display_name', musicForm.data.display_name);
        }
        
        if (musicForm.data.music) {
            formData.append('music', musicForm.data.music);
        }
        
        musicForm.post(route('music.update'), {
            data: formData,
            preserveScroll: true,
            onSuccess: () => {
                setStatus({ type: 'success', message: 'Music uploaded successfully' });
                musicForm.setData({ music: null });
            },
            onError: (errors) => {
                setStatus({ type: 'error', message: 'Failed to upload music' });
            }
        });
    };

    const getThemeName = (themeId) => {
        return THEMES.find(t => t.id === themeId)?.name || themeId;
    };

    const isThemeActive = (themeId) => {
        if (settings?.theme) {
            return settings.theme === themeId;
        }
        return userTheme === themeId;
    };

    const getActiveTheme = () => {
        if (settings?.theme) return settings.theme;
        return userTheme;
    };

    const getThemeSelectionStatus = () => {
        const activeTheme = getActiveTheme();
        if (selectedTheme === activeTheme) {
            return 'Your theme is saved and active.';
        }
        return themeLoading 
            ? 'Saving your selection...' 
            : 'Click a theme above to apply it to your page.';
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <Head title="Page Design & Settings" />
            
            {status && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${status.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    <div className="flex items-center gap-2">
                        {status.type === 'success' ? '✅' : '❌'}
                        <span>{status.message}</span>
                    </div>
                </div>
            )}
            
            <Header 
                themeLoading={themeLoading}
                selectedTheme={selectedTheme}
                settings={settings}
                auth={auth}
                getThemeName={getThemeName}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-3">
                    <FrontPageSettings 
                        form={frontPageForm}
                        onSubmit={submitFrontPageSettings}
                        loading={frontPageLoading}
                        settings={settings}
                        hasSettings={hasSettings}
                        getThemeName={getThemeName}
                        userTheme={userTheme}
                    />
                </div>

                <div className="lg:col-span-3">
                    <section className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200/50">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-3 flex items-center gap-3">
                                <span className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl">🎨</span>
                                Visual Theme
                            </h2>
                            <p className="text-gray-600">
                                Choose a visual style that matches the mood of your memories. 
                                Your theme is stored in your user profile.
                            </p>
                        </div>

                        <ThemeSelector 
                            themes={THEMES}
                            selectedTheme={selectedTheme}
                            themeLoading={themeLoading}
                            onThemeChange={handleThemeChange}
                            getThemeName={getThemeName}
                            isThemeActive={isThemeActive}
                            settings={settings}
                            auth={auth}
                            userTheme={userTheme}
                        />

                        <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-gray-700 mb-1">Selection Status</h4>
                                    <p className="text-sm text-gray-600">
                                        {getThemeSelectionStatus()}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Source: {settings?.theme ? 'Settings Table' : 'User Profile'}
                                    </p>
                                </div>
                                {selectedTheme !== getActiveTheme() && !themeLoading && (
                                    <div className="text-sm text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                                        <span className="font-medium">Changes not saved</span>
                                    </div>
                                )}
                            </div>
                        </div>

                     

                        <ThemeFeatures 
                            themes={THEMES}
                            isThemeActive={isThemeActive}
                        />
                    </section>
                </div>

                <div className="lg:col-span-2">
                    <LetterForm 
                        letterForm={letterForm}
                        onSubmit={submitLetter}
                        isPreviewOpen={isPreviewOpen}
                        setIsPreviewOpen={setIsPreviewOpen}
                    />
                </div>

                <div className="lg:col-span-1">
                    <MusicSettings 
                        musicForm={musicForm}
                        onSubmit={submitMusic}
                        musicData={music_data}
                        isAudioPlaying={isAudioPlaying}
                        setIsAudioPlaying={setIsAudioPlaying}
                        getThemeName={getThemeName}
                        settings={settings}
                        auth={auth}
                        selectedTheme={selectedTheme}
                        letterForm={letterForm}
                        userTheme={userTheme}
                    />
                </div>
            </div>

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

function LetterForm({ letterForm, onSubmit, setIsPreviewOpen }) {
    return (
        <section className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200/50 h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                        <span className="p-3 bg-gradient-to-r from-pink-400 to-rose-500 text-white rounded-2xl">💌</span>
                        Love Letter
                    </h2>
                    <p className="text-gray-600">Write a heartfelt message that appears on your page</p>
                </div>
                <button 
                    type="button"
                    onClick={() => setIsPreviewOpen(true)} 
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                    <span>Preview Letter</span>
                    <span className="text-lg">👁️</span>
                </button>
            </div>
            
            <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            To (Recipient) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={letterForm.data.recipient}
                            onChange={(e) => letterForm.setData('recipient', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                            placeholder="My Dearest..."
                            required
                        />
                        {letterForm.errors.recipient && (
                            <p className="mt-1 text-sm text-red-600">{letterForm.errors.recipient}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={letterForm.data.message}
                            onChange={(e) => letterForm.setData('message', e.target.value)}
                            rows={8}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition resize-none"
                            placeholder="Pour your heart out here..."
                            required
                        />
                        {letterForm.errors.message && (
                            <p className="mt-1 text-sm text-red-600">{letterForm.errors.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Closing
                            </label>
                            <input
                                type="text"
                                value={letterForm.data.closing}
                                onChange={(e) => letterForm.setData('closing', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                                placeholder="With all my love,"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                From (Your Name)
                            </label>
                            <input
                                type="text"
                                value={letterForm.data.sender}
                                onChange={(e) => letterForm.setData('sender', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                                placeholder="Your name"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={letterForm.processing}
                        className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {letterForm.processing ? (
                            <>
                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                Saving...
                            </>
                        ) : (
                            <>
                                <span className="text-lg">💾</span>
                                Save Letter
                            </>
                        )}
                    </button>
                </div>
            </form>
        </section>
    );
}

function MusicSettings({ 
    musicForm, 
    onSubmit, 
    musicData, 
    isAudioPlaying, 
    setIsAudioPlaying,
    getThemeName,
    settings,
    auth,
    selectedTheme,
    letterForm,
    userTheme
}) {
    const [fileName, setFileName] = useState('');
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            musicForm.setData('music', file);
            setFileName(file.name);
        }
    };

    const removeFile = () => {
        musicForm.setData('music', null);
        setFileName('');
    };

    return (
        <section className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200/50 h-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <span className="p-3 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-2xl">🎵</span>
                Background Music
            </h2>
            
            <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Display Name
                        </label>
                        <input
                            type="text"
                            value={musicForm.data.display_name || ''}
                            onChange={(e) => musicForm.setData('display_name', e.target.value || '')}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="e.g., Our Song"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Music File (MP3, max 10MB)
                        </label>
                        <div className="space-y-3">
                            {fileName ? (
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🎵</span>
                                        <div>
                                            <p className="font-medium text-gray-700">{fileName}</p>
                                            <p className="text-sm text-gray-500">Ready to upload</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeFile}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                                    >
                                        <span className="text-lg">✕</span>
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="audio/mp3,audio/*"
                                        onChange={handleFileChange}
                                    />
                                    <div className="text-center">
                                        <span className="text-4xl mb-2">🎶</span>
                                        <p className="text-gray-600 mb-1">Click to upload MP3 file</p>
                                        <p className="text-sm text-gray-500">Maximum file size: 10MB</p>
                                    </div>
                                </label>
                            )}
                        </div>
                    </div>

                    {musicData && musicData.file_path && (
                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium text-gray-700">Current Music:</h4>
                                {!fileName && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (confirm('Are you sure you want to remove the current music?')) {
                                                router.delete(route('music.destroy'));
                                            }
                                        }}
                                        className="text-sm text-red-600 hover:text-red-800"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <AudioPlayer
                                src={musicData.file_path}
                                title={musicData.display_name || 'Background Music'}
                                isPlaying={isAudioPlaying}
                                onPlay={() => setIsAudioPlaying(true)}
                                onPause={() => setIsAudioPlaying(false)}
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <button
                        type="submit"
                        disabled={musicForm.processing || (!musicForm.data.music && !(musicForm.data.display_name || '').trim())}
                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {musicForm.processing ? (
                            <>
                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                Uploading...
                            </>
                        ) : (
                            <>
                                <span className="text-lg">💾</span>
                                Save Music
                            </>
                        )}
                    </button>
                </div>
            </form>
            
            <CurrentSettings 
                getThemeName={getThemeName}
                settings={settings}
                auth={auth}
                selectedTheme={selectedTheme}
                letterForm={letterForm}
                musicData={musicData}
                userTheme={userTheme}
            />
        </section>
    );
}

DesignSettings.layout = page => <DashboardLayout children={page} />;