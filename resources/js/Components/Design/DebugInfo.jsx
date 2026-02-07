import React from 'react';

const DebugInfo = ({ 
    selectedTheme, 
    settings, 
    auth, 
    themeLoading 
}) => {
    if (process.env.NODE_ENV !== 'development') return null;

    return (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-bold text-sm mb-2">Theme Debug Info:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                    <span className="font-medium">Selected:</span> {selectedTheme}
                </div>
                <div>
                    <span className="font-medium">Database (Settings):</span> {settings?.theme || 'Not set'}
                </div>
                <div>
                    <span className="font-medium">Database (User):</span> {auth?.user?.theme || 'Not set'}
                </div>
                <div>
                    <span className="font-medium">Sync Status:</span> 
                    <span className={`ml-1 ${
                        selectedTheme === (settings?.theme || auth?.user?.theme || 'default')
                            ? 'text-green-600 font-bold' 
                            : themeLoading 
                                ? 'text-yellow-600 font-bold' 
                                : 'text-red-600 font-bold'
                    }`}>
                        {selectedTheme === (settings?.theme || auth?.user?.theme || 'default')
                            ? '✓ SYNCED' 
                            : themeLoading 
                                ? '⏳ PENDING' 
                                : '✗ UNSAVED'}
                    </span>
                </div>
                <div>
                    <span className="font-medium">Loading:</span> {themeLoading ? 'Yes' : 'No'}
                </div>
            </div>
        </div>
    );
};

export default DebugInfo;