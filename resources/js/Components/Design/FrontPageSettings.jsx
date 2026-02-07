import React from 'react';

const FrontPageSettings = ({ 
    form, 
    onSubmit, 
    loading, 
    settings, 
    hasSettings, 
    getThemeName,
    userTheme 
}) => {
    return (
        <section className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200/50">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-3 flex items-center gap-3">
                    <span className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl">🏠</span>
                    Front Page Settings
                </h2>
                <p className="text-gray-600">
                    Customize the title, subtitle, and anniversary date for your love story page.
                    <span className="ml-2 font-medium text-indigo-600">
                        Theme is managed separately below.
                    </span>
                </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Page Title <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            value={form.data.story_title} 
                            onChange={e => form.setData('story_title', e.target.value)} 
                            className="w-full border border-gray-300 bg-white rounded-xl p-4 text-lg font-medium focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all shadow-sm"
                            placeholder="Our Love Story"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Page Subtitle
                        </label>
                        <input 
                            type="text" 
                            value={form.data.story_subtitle} 
                            onChange={e => form.setData('story_subtitle', e.target.value)} 
                            className="w-full border border-gray-300 bg-white rounded-xl p-4 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all shadow-sm"
                            placeholder="A Journey of Love & Memories"
                        />
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Anniversary Date
                        </label>
                        <input 
                            type="date" 
                            value={form.data.anniversary_date} 
                            onChange={e => form.setData('anniversary_date', e.target.value)} 
                            className="w-full border border-gray-300 bg-white rounded-xl p-4 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all shadow-sm"
                        />
                    </div>
                    
                    {/* Current Theme Display (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Theme
                        </label>
                        <div className="w-full border border-gray-300 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-indigo-700">
                                        {getThemeName(userTheme)}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Stored in your user profile
                                    </div>
                                </div>
                                <div className="text-2xl">
                                    {userTheme === 'default' && '☀️'}
                                    {userTheme === 'midnight' && '🌙'}
                                    {userTheme === 'classy' && '✨'}
                                    {userTheme === 'vintage' && '📜'}
                                    {userTheme === 'nature' && '🌿'}
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Change theme in the Visual Theme section below
                        </p>
                    </div>
                </div>
                
                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={loading || form.processing}
                        className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <>
                                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                {hasSettings ? 'Updating...' : 'Creating...'}
                            </>
                        ) : (
                            <>
                                {hasSettings ? 'Update Front Page Settings' : 'Save Front Page Settings'}
                                <span className="text-xl">💾</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default FrontPageSettings;