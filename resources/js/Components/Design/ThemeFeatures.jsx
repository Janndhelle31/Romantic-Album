import React from 'react';

const ThemeFeatures = ({ themes, isThemeActive }) => {
    return (
        <div className="mt-12 pt-8 border-t border-gray-100">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Theme Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {themes.map((theme) => {
                    const isActive = isThemeActive(theme.id);
                    return (
                        <div key={theme.id} className={`p-4 rounded-xl border ${
                            isActive 
                                ? 'border-pink-300 bg-pink-50/30' 
                                : 'border-gray-100 bg-gray-50/30'
                        }`}>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`p-2 rounded-lg ${
                                    isActive 
                                        ? theme.color 
                                        : 'bg-gray-200'
                                }`}>
                                    {theme.emoji}
                                </span>
                                <div>
                                    <span className="font-bold text-gray-800">{theme.name}</span>
                                    {isActive && (
                                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Active</span>
                                    )}
                                </div>
                            </div>
                            <ul className="text-xs text-gray-600 space-y-1">
                                <li>• {theme.id === 'vintage' ? 'Old paper textures' : 
                                    theme.id === 'nature' ? 'Leaf patterns & earth tones' : 
                                    theme.id === 'midnight' ? 'Dark background' : 
                                    'Clean layout'}</li>
                                <li>• {theme.id === 'midnight' ? 'Starry night elements' : 
                                    theme.id === 'nature' ? 'Natural wood textures' : 
                                    theme.id === 'classy' ? 'Gold accents' : 
                                    theme.id === 'vintage' ? 'Sepia filters' : 
                                    'Warm colors'}</li>
                                <li>• {theme.id === 'nature' ? 'Plant & floral elements' : 
                                    theme.id === 'classy' ? 'Elegant typography' : 
                                    'Romantic ambiance'}</li>
                            </ul>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ThemeFeatures;