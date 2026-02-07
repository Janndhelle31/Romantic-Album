// @/Components/Design/CurrentSettings.jsx
import React from 'react';

const CurrentSettings = ({ 
    getThemeName, 
    settings, 
    selectedTheme, 
    letterForm, 
    musicData
}) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (e) {
            return 'Invalid date';
        }
    };

    return (
        <div className="mt-10 pt-6 border-t border-gray-100">
            <h3 className="font-bold text-gray-700 mb-4 text-lg">Current Settings</h3>
            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Story Title:</span>
                    <span className="font-medium text-gray-800 truncate max-w-[150px]">
                        {settings?.story_title || 'Not set'}
                    </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Anniversary:</span>
                    <span className="font-medium text-gray-800">
                        {formatDate(settings?.anniversary_date)}
                    </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Active Theme:</span>
                    <span className="font-bold capitalize px-3 py-1 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700">
                        {getThemeName(settings?.theme || selectedTheme)}
                    </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Letter Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        letterForm.data.recipient && letterForm.data.message 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                    }`}>
                        {letterForm.data.recipient && letterForm.data.message ? 'Complete ✓' : 'Draft'}
                    </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Music:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        musicData 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-gray-100 text-gray-600'
                    }`}>
                        {musicData ? 'Uploaded ✓' : 'Not set'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CurrentSettings;