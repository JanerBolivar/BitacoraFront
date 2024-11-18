// SearchFilter.jsx
import React from 'react';
import { ListFilter } from 'lucide-react';

const SearchFilter = ({ activeFilter, setActiveFilter, handleShowAll }) => {
    const filters = ["title", "date", "location", "species"];

    return (
        <div className="flex flex-wrap items-center gap-2">
            {filters.map((filter) => (
                <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1 rounded-full text-sm ${activeFilter === filter
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
            ))}
            <button
                onClick={handleShowAll}
                className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-green-500 text-white hover:bg-green-600 transition duration-200"
            >
                <ListFilter size={16} />
                Mostrar Todo
            </button>
        </div>
    );
};

export default SearchFilter;