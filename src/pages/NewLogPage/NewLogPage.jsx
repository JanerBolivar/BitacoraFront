import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Head } from "../../components/Components/Head";
import SpeciesDetailsModal from "../../components/Components/SpeciesDetailsModal";

import CollaboratorsSection from "../../components/Components/CollaboratorsSection";

import { useAuth } from "../../contexts/useAuth";

const LogPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [initialLoading, setInitialLoading] = useState(isEditMode);
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        location: {
            latitude: '',
            longitude: ''
        },
        weather: {
            temperature: '',
            humidity: '',
            cloudCover: '',
            precipitation: '',
            windSpeed: '',
            additionalWeatherNotes: ''
        },
        habitat: {
            vegetationType: '',
            altitude: '',
            soilType: '',
            waterBodies: '',
            description: ''
        },
        sitePhotos: [],
        collectedSpecies: [],
        additionalNotes: '',
        collaborators: [],
        owner: user
    });

    const [isSpeciesModalOpen, setIsSpeciesModalOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Cargar datos existentes si estamos en modo edición
    useEffect(() => {
        const fetchLogData = async () => {
            if (isEditMode) {
                try {
                    const response = await axios.get(`/api/log/field-logs/${id}`);

                    // Actualizar el estado con los datos recibidos y los archivos
                    setFormData({
                        ...response.data,
                    });
                } catch (err) {
                    setError("Error al cargar los datos de la bitácora");
                    console.error("Error fetching log data:", err);
                } finally {
                    setInitialLoading(false);
                }
            }
        };

        fetchLogData();
    }, [id, isEditMode]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formDataToSend = new FormData();

            formDataToSend.append('data', JSON.stringify({
                ...formData,
                sitePhotos: [],
                collectedSpecies: formData.collectedSpecies.map(species => ({
                    ...species,
                    photos: []
                }))
            }));

            if (formData.sitePhotos?.length > 0) {
                formData.sitePhotos.forEach((photo) => {
                    formDataToSend.append('sitePhotos', photo);
                });
            }

            formData.collectedSpecies.forEach((species) => {
                if (species.photos?.length > 0) {
                    species.photos.forEach((photo) => {
                        formDataToSend.append('speciesPhotos[]', photo);
                    });
                }
            });

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    console.log(`Progreso: ${percentCompleted}%`);
                },
            };

            let response;
            if (isEditMode) {
                response = await axios.post(`/api/log/update-field-logs/${id}`, formDataToSend, config);
            } else {
                response = await axios.post('/api/log/new-field-logs', formDataToSend, config);
            }

            navigate('/dashboard');

        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al guardar la bitácora';
            setError(errorMessage);
            console.error('Error completo:', err);
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    const toggleSpeciesModal = () => {
        setIsSpeciesModalOpen((prevState) => !prevState);
    };

    const handleCloseModal = () => {
        setIsSpeciesModalOpen(false); // Cierra la modal
    };

    const handleAddSpecies = (speciesData) => {
        setFormData(prev => ({
            ...prev,
            collectedSpecies: [...prev.collectedSpecies, speciesData]
        }));
        toggleSpeciesModal();
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            sitePhotos: [...prev.sitePhotos, ...files]
        }));
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragIn = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragOut = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files).filter(file =>
            file.type.startsWith('image/')
        );

        if (files.length > 0) {
            setFormData(prev => ({
                ...prev,
                sitePhotos: [...prev.sitePhotos, ...files]
            }));
        }
    };

    const handleCancel = () => {
        navigate('/dashboard');
    };

    const handleAddCollaborator = (user) => {
        setFormData(prev => ({
            ...prev,
            collaborators: [...prev.collaborators, user]
        }));
    };

    const handleRemoveCollaborator = (userId) => {
        setFormData(prev => ({
            ...prev,
            collaborators: prev.collaborators.filter(c => c.id !== userId)
        }));
    };

    return (
        <>
            <Head
                newtitle={isEditMode ? "Editar Bitácora" : "Crear Bitácora"}
                newdescription="Crea nuevas bitácoras de campo para registrar y organizar tus actividades."
                newkeywords="crear bitácora, registro de campo, nueva bitácora, actividades"
            />

            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">
                            {isEditMode ? "Editar Bitácora" : "Nueva Entrada de Bitácora"}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {isEditMode ? "Modifique los detalles de la bitácora" : "Complete los detalles del muestreo"}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
                            {error}
                        </div>
                    )}

                    {/* Main Form */}
                    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 space-y-6">
                        {/* Título y Fecha/Hora */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Título de la Bitácora
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Descripción general del muestreo"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fecha
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Hora
                                    </label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Localización */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Localización Geográfica</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Latitud
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="location.latitude"
                                        value={formData.location.latitude}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Longitud
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="location.longitude"
                                        value={formData.location.longitude}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Condiciones Climáticas */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Condiciones Climáticas</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Temperatura (°C)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="weather.temperature"
                                        value={formData.weather.temperature}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Humedad (%)
                                    </label>
                                    <input
                                        type="number"
                                        name="weather.humidity"
                                        value={formData.weather.humidity}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nubosidad
                                    </label>
                                    <input
                                        type="text"
                                        name="weather.cloudCover"
                                        value={formData.weather.cloudCover}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Ej: Despejado, Parcialmente nublado"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Velocidad del Viento
                                    </label>
                                    <input
                                        type="text"
                                        name="weather.windSpeed"
                                        value={formData.weather.windSpeed}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Ej: Calmo, Brisa suave"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notas adicionales del clima
                                </label>
                                <textarea
                                    name="weather.additionalWeatherNotes"
                                    value={formData.weather.additionalWeatherNotes}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Otras observaciones climáticas relevantes"
                                />
                            </div>
                        </div>

                        {/* Hábitat */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Descripción del Hábitat</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tipo de Vegetación
                                    </label>
                                    <input
                                        type="text"
                                        name="habitat.vegetationType"
                                        value={formData.habitat.vegetationType}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Altitud (m.s.n.m.)
                                    </label>
                                    <input
                                        type="number"
                                        name="habitat.altitude"
                                        value={formData.habitat.altitude}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tipo de Suelo
                                    </label>
                                    <input
                                        type="text"
                                        name="habitat.soilType"
                                        value={formData.habitat.soilType}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Cuerpos de Agua Cercanos
                                    </label>
                                    <input
                                        type="text"
                                        name="habitat.waterBodies"
                                        value={formData.habitat.waterBodies}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descripción Detallada del Hábitat
                                </label>
                                <textarea
                                    name="habitat.description"
                                    value={formData.habitat.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Descripción detallada del entorno y características particulares del hábitat"
                                />
                            </div>
                        </div>

                        {/* Fotografías */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Fotografías del Sitio</h3>
                            <div
                                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors
                            ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
                                onDragEnter={handleDragIn}
                                onDragLeave={handleDragOut}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <div className="space-y-1 text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                            <span>Subir archivos</span>
                                            <input
                                                type="file"
                                                className="sr-only"
                                                multiple
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                        <p className="pl-1">o arrastrar y soltar</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG hasta 5MB</p>
                                </div>
                            </div>
                        </div>

                        {/* Especies Recolectadas */}
                        <div className="border-t border-gray-200 pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Especies Recolectadas</h3>
                                <button
                                    type="button"
                                    onClick={toggleSpeciesModal}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <svg
                                        className="h-5 w-5 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Agregar Especie
                                </button>
                            </div>

                            {formData.collectedSpecies.length > 0 ? (
                                <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
                                    <table className="w-full table-auto text-sm text-left">
                                        <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                                            <tr>
                                                <th className="py-3 px-6">Nombre Científico</th>
                                                <th className="py-3 px-6">Nombre Común</th>
                                                <th className="py-3 px-6">Familia</th>
                                                <th className="py-3 px-6">Cantidad</th>
                                                <th className="py-3 px-6">Estado</th>
                                                <th className="py-3 px-6">Fotos</th>
                                                <th className="py-3 px-6">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-600 divide-y">
                                            {formData.collectedSpecies.map((species, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap">{species.scientificName}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{species.commonName}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{species.family}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{species.quantity}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{species.status}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex gap-x-2">
                                                            {species.photos.length > 0 ? (
                                                                species.photos.map((photo, idx) => (
                                                                    <img
                                                                        key={idx}
                                                                        src={photo}
                                                                        alt={`Foto de ${species.scientificName}`}
                                                                        className="w-12 h-12 object-cover rounded"
                                                                    />
                                                                ))
                                                            ) : (
                                                                <span className="text-sm text-gray-500">Sin fotos</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="text-right px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newSpecies = formData.collectedSpecies.filter((_, i) => i !== index);
                                                                setFormData(prev => ({ ...prev, collectedSpecies: newSpecies }));
                                                            }}
                                                            className="py-2 px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">No se han agregado especies aún.</p>
                            )}
                        </div>

                        {/* Observaciones Adicionales */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Observaciones Adicionales</h3>
                            <textarea
                                name="additionalNotes"
                                value={formData.additionalNotes}
                                onChange={handleInputChange}
                                rows={4}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Ingrese cualquier observación adicional relevante para el muestreo"
                            />
                        </div>

                        {/* Colaboradores */}
                        <CollaboratorsSection
                            collaborators={formData.collaborators}
                            onCollaboratorAdd={handleAddCollaborator}
                            onCollaboratorRemove={handleRemoveCollaborator}
                        />

                        {/* Botones de Acción */}
                        <div className="border-t border-gray-200 pt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {isEditMode ? 'Actualizando...' : 'Guardando...'}
                                    </>
                                ) : (
                                    isEditMode ? 'Actualizar Bitácora' : 'Guardar Entrada'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <SpeciesDetailsModal
                    isOpen={isSpeciesModalOpen}
                    onClose={handleCloseModal}
                    onAddSpecies={handleAddSpecies}
                />
            </div>
        </>
    );
};

export default LogPage;