import React from 'react';
import { Search, Calendar, MapPin, Bug } from 'lucide-react';

const SearchBar = ({ activeFilter, searchParams, handleSearchChange }) => {
    const SearchIcon = () => {
        const icons = {
            title: <Search size={20} />,
            date: <Calendar size={20} />,
            location: <MapPin size={20} />,
            species: <Bug size={20} />
        };
        return icons[activeFilter] || <Search size={20} />;
    };

    const getSearchPlaceholder = () => {
        const placeholders = {
            title: "Buscar por título...",
            date: "Buscar por fecha (YYYY-MM-DD)...",
            location: "Buscar por ubicación...",
            species: "Buscar por especie..."
        };
        return placeholders[activeFilter] || "Buscar...";
    };

    return (
        <div className="relative flex-grow">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <SearchIcon />
            </div>
            <input
                type={activeFilter === "date" ? "date" : "text"}
                placeholder={getSearchPlaceholder()}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition duration-200"
                value={searchParams[activeFilter]}
                onChange={(e) => handleSearchChange(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;