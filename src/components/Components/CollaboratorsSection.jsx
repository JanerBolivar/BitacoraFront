import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import axios from 'axios';

const CollaboratorsSection = ({ collaborators, onCollaboratorAdd, onCollaboratorRemove }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Simula la búsqueda de usuarios - Reemplazar con llamada a API real
    const searchUsers = async (term) => {
        if (term.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            // Usamos axios para hacer la solicitud GET
            const response = await axios.get(`/api/log/collaborators/search`, {
                params: { term }
            });

            // Guardamos los datos de los usuarios encontrados
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error searching users:', error);
            setSearchResults([]); // En caso de error, limpiamos los resultados
        } finally {
            setIsSearching(false); // Terminamos la búsqueda
        }
    };

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        searchUsers(term);
    };

    const handleAddCollaborator = (user) => {
        onCollaboratorAdd(user);
        setSearchTerm('');
        setSearchResults([]);
    };

    return (
        <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Colaboradores</h3>

            {/* Búsqueda de usuarios */}
            <div className="relative mb-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Buscar usuarios por nombre o email..."
                    />
                </div>

                {/* Resultados de búsqueda */}
                {searchTerm && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200">
                        {isSearching ? (
                            <div className="p-4 text-center text-gray-500">Buscando...</div>
                        ) : searchResults.length > 0 ? (
                            <ul className="max-h-60 overflow-auto">
                                {searchResults.map((user) => (
                                    <li
                                        key={user.id}
                                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                                        onClick={() => handleAddCollaborator(user)}
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                        <button className="text-indigo-600 hover:text-indigo-900">
                                            Agregar
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-4 text-center text-gray-500">No se encontraron usuarios</div>
                        )}
                    </div>
                )}
            </div>

            {/* Lista de colaboradores */}
            <div className="mt-4">
                <div className="space-y-2">
                    {collaborators.length > 0 ? (
                        collaborators.map((collaborator) => (
                            <div
                                key={collaborator.id}
                                className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-md"
                            >
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{collaborator.name}</p>
                                    <p className="text-sm text-gray-500">{collaborator.email}</p>
                                </div>
                                <button
                                    onClick={() => onCollaboratorRemove(collaborator.id)}
                                    className="text-gray-400 hover:text-red-500"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 italic">No hay colaboradores agregados</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CollaboratorsSection;