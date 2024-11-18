import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import UserEditModal from '../../components/Components/UserEditModal';
import { Head } from "../../components/Components/Head";

const ManageUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/user/users');
            setUsers(response.data);
            setIsLoading(false);
        } catch (err) {
            setError(err);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        fetchUsers();
    };

    const handleDeleteClick = async (user) => {
        try {
            await axios.delete(`/api/user/delete-user/${user.uid}`);
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    if (isLoading) return <div className="text-center py-4">Cargando usuarios...</div>;

    if (error) return <div className="text-red-500 text-center py-4">Error al cargar usuarios</div>;

    return (
        <><Head
            newtitle="Administrar usuarios"
            newdescription="Gestiona los usuarios registrados en nuestra plataforma. Aquí puedes ver, editar y administrar cuentas de usuario."
            newkeywords="administrar usuarios, gestionar usuarios, usuarios registrados, administración de cuentas"
        />

            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 py-8">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                    <div>
                        <h3 className="text-gray-800 text-xl font-bold sm:text-2xl text-center sm:text-left">
                            Usuarios
                        </h3>
                        <p className="text-gray-600 mt-2">Lista de usuarios registrados en el sistema</p>
                    </div>
                    <Link
                        to={"/manage/create-user"}
                        className="inline-block px-4 py-2 text-white font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 transition-colors duration-150 mt-4 sm:mt-0 sm:text-sm"
                    >
                        Añadir usuario
                    </Link>
                </div>

                <div className="overflow-x-auto shadow-sm border rounded-lg">
                    <table className="w-full table-auto text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                            <tr>
                                <th className="py-3 px-6 sm:px-4">Usuario</th>
                                <th className="py-3 px-6 sm:px-4 hidden md:table-cell">Email</th>
                                <th className="py-3 px-6 sm:px-4 hidden lg:table-cell">Rol</th>
                                <th className="py-3 px-6 sm:px-4 hidden xl:table-cell">Estado</th>
                                <th className="py-3 px-6 sm:px-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 divide-y">
                            {users.map((user) => (
                                <tr key={user.uid} className="hover:bg-gray-50">
                                    <td className="flex items-center gap-x-3 py-3 px-6 sm:px-4 whitespace-nowrap">
                                        <img
                                            src={user.photoURL || 'https://i.pravatar.cc/150?img=1'}
                                            className="w-10 h-10 rounded-full"
                                            alt={`${user.firstName} ${user.lastName}`}
                                        />
                                        <div>
                                            <span className="block text-gray-700 text-sm font-medium">
                                                {user.firstName} {user.lastName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 sm:px-4 py-4 whitespace-nowrap hidden md:table-cell">
                                        {user.email}
                                    </td>
                                    <td className="px-6 sm:px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs ${user.role === 'admin'
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-blue-100 text-blue-600'
                                                }`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 sm:px-4 py-4 whitespace-nowrap hidden xl:table-cell">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs ${user.status === 'active'
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-red-100 text-red-600'
                                                }`}
                                        >
                                            {user.status === 'active' ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="text-right px-6 sm:px-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleEditClick(user)}
                                            className="inline-block py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(user)}
                                            className="inline-block py-2 px-3 font-medium text-red-600 hover:text-red-500 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal para editar usuario */}
                {selectedUser && (
                    <UserEditModal
                        user={selectedUser}
                        isOpen={isModalOpen}
                        onClose={handleModalClose}
                    />
                )}
            </div>
        </>
    );
};

export default ManageUsersPage;
