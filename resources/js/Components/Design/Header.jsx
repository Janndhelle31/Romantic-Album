import React from 'react';

const Header = ({ 
    themeLoading, 
    selectedTheme, 
    settings, 
    auth, 
    getThemeName 
}) => {
    return (
        <header className="mb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-gray-800">Design Studio</h1>
                    <p className="font-handwriting text-xl text-pink-400 mt-2">Customize your love story's presentation</p>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-full">
                    <div className={`w-3 h-3 rounded-full ${
                        themeLoading 
                            ? 'bg-yellow-500 animate-pulse' 
                            : selectedTheme === (settings?.theme || auth?.user?.theme || 'default')
                                ? 'bg-green-500' 
                                : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium">
                        Current: <span className="font-bold capitalize">
                            {getThemeName(settings?.theme || auth?.user?.theme || selectedTheme)} Theme
                        </span>
                        {themeLoading && <span className="ml-2 text-yellow-600">Saving...</span>}
                        {!themeLoading && selectedTheme !== (settings?.theme || auth?.user?.theme) && (
                            <span className="ml-2 text-red-600 text-xs">(Click to save)</span>
                        )}
                    </span>
                </div>
            </div>
        </header>
    );
};

export default Header;