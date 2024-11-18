import React, { useState } from 'react';
import { ChevronDown, Calendar, MapPin, Star, X } from 'lucide-react';

const AdvancedFiltersModal = ({
    filters,
    handleFilterChange,
    handleShowAll,
    isOpen,
    onClose
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Filtros Avanzados</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Date Range Filter */}
                    <div className="flex flex-col">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rango de Fechas</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="w-full">
                                <label className="text-xs text-gray-600">Desde</label>
                                <input
                                    type="date"
                                    value={filters.dateRange.start || ''}
                                    onChange={(e) => handleFilterChange('dateRange', 'start', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                            </div>
                            <div className="w-full">
                                <label className="text-xs text-gray-600">Hasta</label>
                                <input
                                    type="date"
                                    value={filters.dateRange.end || ''}
                                    onChange={(e) => handleFilterChange('dateRange', 'end', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location Filters */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación Geográfica</label>
                        <input
                            type="text"
                            placeholder="Latitud"
                            value={filters.location.latitude}
                            onChange={(e) => handleFilterChange('location', 'latitude', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Longitud"
                            value={filters.location.longitude}
                            onChange={(e) => handleFilterChange('location', 'longitude', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                    </div>

                    {/* Habitat Filters */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hábitat</label>
                        <input
                            type="text"
                            placeholder="Tipo de Vegetación"
                            value={filters.habitat.vegetationType}
                            onChange={(e) => handleFilterChange('habitat', 'vegetationType', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                    </div>

                    {/* Weather Filters */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Clima</label>
                        <input
                            type="text"
                            placeholder="Cobertura de Nubes"
                            value={filters.weather.cloudCover}
                            onChange={(e) => handleFilterChange('weather', 'cloudCover', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                    </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                        onClick={handleShowAll}
                        className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                        Limpiar Filtros
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Aplicar Filtros
                    </button>
                </div>
            </div>
        </div>
    );
};

const SortDropdown = ({
    sortBy,
    isMenuOpen,
    setIsMenuOpen,
    handleSortChange,
    filters,
    handleFilterChange,
    handleShowAll,
    sortOptions = [
        { value: 'fecha', label: 'Fecha', icon: Calendar },
        { value: 'lugar', label: 'Ubicación', icon: MapPin },
        { value: 'relevancia', label: 'Relevancia', icon: Star }
    ]
}) => {
    const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

    const openFiltersModal = () => {
        setIsFiltersModalOpen(true);
        setIsMenuOpen(false);
    };

    const closeFiltersModal = () => {
        setIsFiltersModalOpen(false);
    };

    return (
        <>
            <div className="relative">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                    Ordenar por: {sortOptions.find(opt => opt.value === sortBy)?.label || sortBy}
                    <ChevronDown className="text-gray-400" size={16} />
                </button>
                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg z-10 min-w-[180px]">
                        {sortOptions.map((option) => (
                            <button
                                key={option.value}
                                className="flex items-center gap-3 px-4 py-2 text-left text-sm hover:bg-gray-100 w-full"
                                onClick={() => {
                                    handleSortChange(option.value);
                                    setIsMenuOpen(false);
                                }}
                            >
                                {option.icon && <option.icon size={16} className="text-gray-500" />}
                                {option.label}
                            </button>
                        ))}
                        <div className="border-t border-gray-200 my-1"></div>
                        <button
                            className="flex items-center gap-3 px-4 py-2 text-left text-sm hover:bg-gray-100 w-full"
                            onClick={openFiltersModal}
                        >
                            Filtros Avanzados
                        </button>
                    </div>
                )}
            </div>

            <AdvancedFiltersModal
                filters={filters}
                handleFilterChange={handleFilterChange}
                handleShowAll={handleShowAll}
                isOpen={isFiltersModalOpen}
                onClose={closeFiltersModal}
            />
        </>
    );
};

export default SortDropdown;