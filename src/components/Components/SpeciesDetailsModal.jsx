import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Camera } from 'lucide-react';

const SpeciesDetailsModal = ({ isOpen, onClose, onAddSpecies }) => {
    const [formData, setFormData] = useState({
        scientificName: '',
        commonName: '',
        family: '',
        quantity: '',
        status: '',
        photos: [],
    });
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            setFormData((prev) => ({ ...prev, photos: Array.from(files) }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validación de los campos
        if (!formData.scientificName || !formData.commonName || !formData.family || !formData.quantity || !formData.status || formData.photos.length === 0) {
            setError('Por favor, complete todos los campos, incluyendo la carga de una fotografía.');
            return;
        }

        // Si todos los campos son válidos, proceder con la acción
        setError('');
        onAddSpecies(formData);

        // Limpiar el formulario
        setFormData({
            scientificName: '',
            commonName: '',
            family: '',
            quantity: '',
            status: '',
            photos: [],
        });

        // Cerrar la modal
        onClose();
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
                <Dialog.Content className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-[90%] lg:w-full max-w-md p-4 md:p-6 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
                    <Dialog.Title className="text-base md:text-lg font-medium text-gray-900">
                        Detalles de Especie
                    </Dialog.Title>
                    {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
                    <form onSubmit={handleSubmit} className="mt-3 md:mt-4 space-y-3 md:space-y-4">
                        {/* Form for species details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">Nombre Científico</label>
                                <input
                                    type="text"
                                    name="scientificName"
                                    value={formData.scientificName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
                                    placeholder="Ej: Quercus robur"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">Nombre Común</label>
                                <input
                                    type="text"
                                    name="commonName"
                                    value={formData.commonName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
                                    placeholder="Ej: Roble"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">Familia</label>
                                <input
                                    type="text"
                                    name="family"
                                    value={formData.family}
                                    onChange={handleInputChange}
                                    className="w-full px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
                                    placeholder="Ej: Fagaceae"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">Cantidad Observada</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    className="w-full px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
                                    placeholder="Ej: 5"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">Estado de Conservación</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
                            >
                                <option value="No Evaluado">No Evaluado</option>
                                <option value="En Peligro">En Peligro</option>
                                <option value="Vulnerable">Vulnerable</option>
                                <option value="Seguro">Seguro</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">Fotografías</label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-24 md:h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center pt-4 md:pt-5 pb-4 md:pb-6">
                                        <Camera className="w-6 h-6 md:w-8 md:h-8 mb-2 md:mb-4 text-gray-500" />
                                        <p className="text-xs md:text-sm text-gray-500 text-center px-2">
                                            <span className="font-semibold">Click para subir</span> o arrastrar y soltar
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse md:flex-row justify-end space-y-2 space-y-reverse md:space-y-0 md:space-x-4 mt-4">
                            <button
                                type="button"
                                className="w-full md:w-auto px-4 md:px-6 py-2 text-sm md:text-base text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
                                onClick={onClose}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="w-full md:w-auto px-4 md:px-6 py-2 text-sm md:text-base bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                Guardar Especie
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default SpeciesDetailsModal;
