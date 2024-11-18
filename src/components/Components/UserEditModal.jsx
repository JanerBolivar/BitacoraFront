import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserEditModal = ({ user, isOpen, onClose }) => {
    const [userData, setUserData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status || 'active',
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            await axios.put(`/api/user/update-user/${user.uid}`, userData);
            onClose();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleCancel = () => {
        onClose();
        navigate('/manage-users');
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleCancel}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold mb-4">Editar Perfil de Usuario</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                            Nombre
                        </label>
                        <input
                            id="firstName"
                            name="firstName"
                            value={userData.firstName}
                            onChange={handleInputChange}
                            className="mt-1 p-2 block w-full border rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                            Apellido
                        </label>
                        <input
                            id="lastName"
                            name="lastName"
                            value={userData.lastName}
                            onChange={handleInputChange}
                            className="mt-1 p-2 block w-full border rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            value={userData.email}
                            onChange={handleInputChange}
                            className="mt-1 p-2 block w-full border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rol
                        </label>
                        <select
                            name="role"
                            value={userData.role}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 text-sm"
                        >
                            <option value="administrador">Administrador</option>
                            <option value="investigador">Investigador</option>
                            <option value="colaborador">Colaborador</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Estado
                        </label>
                        <select
                            name="status"
                            value={userData.status}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 text-sm"
                        >
                            <option value="active">Activo</option>
                            <option value="inactive">Banear</option>
                        </select>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                        onClick={handleCancel}
                    >
                        Cancelar
                    </button>
                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                        onClick={handleSave}
                    >
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserEditModal;
