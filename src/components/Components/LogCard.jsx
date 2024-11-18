// LogCard.jsx
import React from 'react';
import { Tag, Calendar } from 'lucide-react';

const LogCard = ({ log, handleViewBitacora, formatDate }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-200 transform hover:-translate-y-1">
            <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex flex-col sm:flex-row items-start gap-4 w-full">
                        {log.sitePhotos && log.sitePhotos[0] && (
                            <div className="relative w-full sm:w-24 h-24 rounded-lg overflow-hidden">
                                <img
                                    src={log.sitePhotos[0]}
                                    alt="Sitio"
                                    className="absolute w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div className="flex-1">
                            <div className="text-sm text-blue-600 font-medium mb-1">
                                {formatDate(log.createdAt)}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{log.title}</h3>
                            <div className="flex flex-wrap gap-3">
                                <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                                    <Tag size={16} className="text-blue-500" />
                                    {log.collectedSpecies.length} especies
                                </span>
                                {log.habitat.description && log.habitat.description !== "No Aplica" && (
                                    <span className="text-sm text-gray-600">
                                        {log.habitat.description}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <button
                            onClick={() => handleViewBitacora(log)}
                            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                        >
                            Ver Bitácora
                        </button>
                    </div>
                </div>

                {log.additionalNotes && log.additionalNotes !== "No Aplica" && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                        <strong>Notas:</strong> {log.additionalNotes}
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar size={16} className="text-gray-400" />
                        {log.date}
                    </span>
                    <span className="text-sm text-gray-600">
                        <strong>Latitud:</strong> {log.location.latitude}
                    </span>
                    <span className="text-sm text-gray-600">
                        <strong>Longitud:</strong> {log.location.longitude}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LogCard;