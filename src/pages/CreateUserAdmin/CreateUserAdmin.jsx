import { Link, useNavigate } from "react-router-dom";
import { Head } from "../../components/Components/Head";
import React, { useState } from 'react';
import axios from 'axios';

const CreateUserAdmin = () => {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [photo, setPhoto] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("role", "colaborador");
        formData.append("photo", photo);

        try {
            const response = await axios.post("/api/user/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            navigate('/manage-users');
        } catch (error) {
            if (error.response) {
                console.error(error.response.data.message);
            } else {
                console.error("Error al registrar el usuario:", error.message);
            }
        }
    };

    return (
        <>
            <Head
                newtitle="Crear una cuenta"
                newdescription="Crea una nueva cuenta en nuestra plataforma"
                newkeywords="registro, cuenta nueva, sign up"
            />
            <main className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-8">
                <div className="w-full max-w-md space-y-6 text-gray-600">
                    <div className="text-center">
                        <Link to={"/"} className="inline-block">
                            <img src="/Logo_IMG.jpg" width={150} className="mx-auto" alt="Logo" />
                        </Link>
                        <div className="mt-5 space-y-2">
                            <h3 className="text-gray-800 text-xl font-bold sm:text-2xl md:text-3xl">Crear una cuenta</h3>
                        </div>
                    </div>
                    <div className="bg-white shadow p-4 py-6 space-y-8 sm:p-6 rounded-lg">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="w-full sm:w-1/2">
                                    <label className="font-medium text-sm">Nombre</label>
                                    <input
                                        type="text"
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                    />
                                </div>
                                <div className="w-full sm:w-1/2">
                                    <label className="font-medium text-sm">Apellido</label>
                                    <input
                                        type="text"
                                        required
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="w-full sm:w-1/2">
                                    <label className="font-medium text-sm">Correo</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                    />
                                </div>
                                <div className="w-full sm:w-1/2">
                                    <label className="font-medium text-sm">Contraseña</label>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="font-medium text-sm">Foto de perfil</label>
                                <div className="mt-2">
                                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                        <div className="flex flex-col items-center justify-center p-4 text-center">
                                            <svg className="w-8 h-8 mb-2 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                            </svg>
                                            <p className="text-sm text-gray-500"><span className="font-semibold">Click para subir</span></p>
                                            <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG o GIF (MAX. 800x400px)</p>
                                        </div>
                                        <input
                                            id="dropzone-file"
                                            type="file"
                                            accept="image/*"
                                            required
                                            onChange={(e) => setPhoto(e.target.files[0])}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
                            >
                                Crear cuenta
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
};

export default CreateUserAdmin;