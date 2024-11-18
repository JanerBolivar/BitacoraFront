// SortDropdown.jsx
import React from 'react';
import { ChevronDown } from 'lucide-react';

const SortDropdown = ({ sortBy, isMenuOpen, setIsMenuOpen, handleSortChange }) => {
    return (
        <div className="relative">
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
            >
                Ordenar por: {sortBy}
                <ChevronDown className="text-gray-400" size={16} />
            </button>
            {isMenuOpen && (
                <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg z-10">
                    {['fecha', 'lugar', 'relevancia'].map((criteria) => (
                        <button
                            key={criteria}
                            className="block px-4 py-2 text-left text-sm hover:bg-gray-100 w-full"
                            onClick={() => handleSortChange(criteria)}
                        >
                            {criteria.charAt(0).toUpperCase() + criteria.slice(1)}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SortDropdown;