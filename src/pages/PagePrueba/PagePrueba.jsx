import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, ThermometerSun, ArrowLeft, Edit2, Trash2 } from 'lucide-react';

const BitacoraDetailPage = () => {
    const [selectedPhoto, setSelectedPhoto] = useState(0);
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const { data } = location.state;

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    {/* Sección de navegación */}
                    <div className="flex justify-between items-center mb-6">
                        <button
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={() => navigate(-1)} // Navega a la página anterior
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="text-sm font-medium">Volver</span>
                        </button>

                        <div className="flex gap-2">
                            <button
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                onClick={() => {/* handle edit */ }}
                            >
                                <Edit2 className="w-5 h-5" />
                                <span className="text-sm font-medium">Editar</span>
                            </button>
                            <button
                                className="flex items-center gap-2 text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                onClick={() => {/* handle delete */ }}
                            >
                                <Trash2 className="w-5 h-5" />
                                <span className="text-sm font-medium">Eliminar</span>
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            {/* Imagen principal */}
                            <div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-100">
                                <img
                                    src={data.sitePhotos[selectedPhoto]} // Imagen seleccionada
                                    alt="Sitio de bitácora"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Miniaturas */}
                            <div className="grid grid-cols-6 gap-2">
                                {data.sitePhotos.map((photo, index) => (
                                    <button
                                        key={index}
                                        className={`aspect-square rounded border-2 overflow-hidden ${selectedPhoto === index ? 'border-blue-500' : 'border-gray-200'
                                            }`}
                                        onClick={() => setSelectedPhoto(index)} // Cambiar la imagen principal al hacer clic
                                    >
                                        <img
                                            src={photo} // Miniatura
                                            alt={`Vista ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Información principal */}
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    <span>{data.date}</span>
                                    <Clock className="w-4 h-4 ml-2" />
                                    <span>{data.time}</span>
                                </div>
                                <h1 className="text-3xl font-bold mt-2">{data.title}</h1>
                                <div className="flex items-center gap-2 mt-2">
                                    <MapPin className="w-4 h-4 text-gray-600" />
                                    <span className="text-gray-600">
                                        Coordenadas: {data.location.latitude}, {data.location.longitude}
                                    </span>
                                </div>
                            </div>

                            {/* Información del clima */}
                            <div className="border-t border-b py-4">
                                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    <ThermometerSun className="w-5 h-5" />
                                    Condiciones Climáticas
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-600">Temperatura</p>
                                        <p className="font-medium">{data.weather.temperature}°C</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Humedad</p>
                                        <p className="font-medium">{data.weather.humidity}%</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Cielo</p>
                                        <p className="font-medium">{data.weather.cloudCover}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Viento</p>
                                        <p className="font-medium">{data.weather.windSpeed} km/h</p>
                                    </div>
                                </div>
                            </div>

                            {/* Información del hábitat */}
                            <div>
                                <h2 className="text-lg font-semibold mb-3">Información del Hábitat</h2>
                                <div className="space-y-2">
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                        <div>
                                            <p className="text-gray-600">Altitud</p>
                                            <p className="font-medium">{data.habitat.altitude}m</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Tipo de Suelo</p>
                                            <p className="font-medium">{data.habitat.soilType}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Vegetación</p>
                                            <p className="font-medium">{data.habitat.vegetationType}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Cuerpos de Agua</p>
                                            <p className="font-medium">{data.habitat.waterBodies}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Especies recolectadas */}
                    <div className="mt-8">
                        <h2 className="text-xl font-bold mb-4">Especies Recolectadas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.collectedSpecies.map((species, index) => {
                                const [selectedPhoto, setSelectedPhoto] = useState(species.photos[0]); // Foto seleccionada

                                return (
                                    <div key={index} className="border rounded-lg p-4">
                                        {/* Foto principal seleccionada */}
                                        <div className="aspect-video w-full mb-4 rounded-lg overflow-hidden bg-gray-100">
                                            <img
                                                src={selectedPhoto} // Mostrar la foto seleccionada
                                                alt={species.commonName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {/* Información de la especie */}
                                        <h3 className="font-semibold text-lg">{species.commonName}</h3>
                                        <div className="mt-2 space-y-1 text-sm">
                                            <p><span className="text-gray-600">Nombre científico:</span> {species.scientificName}</p>
                                            <p><span className="text-gray-600">Familia:</span> {species.family}</p>
                                            <p><span className="text-gray-600">Estado:</span> {species.status}</p>
                                            <p><span className="text-gray-600">Cantidad:</span> {species.quantity}</p>
                                        </div>
                                        {/* Galería de fotos */}
                                        <div className="mt-4">
                                            <h4 className="text-sm font-semibold mb-2">Fotos:</h4>
                                            <div className="grid grid-cols-3 gap-2">
                                                {species.photos.map((photo, photoIndex) => (
                                                    <div
                                                        key={photoIndex}
                                                        className={`aspect-square rounded overflow-hidden bg-gray-100 cursor-pointer border ${selectedPhoto === photo ? "border-blue-500" : "border-transparent"
                                                            }`}
                                                        onClick={() => setSelectedPhoto(photo)} // Cambiar la foto principal
                                                    >
                                                        <img
                                                            src={photo}
                                                            alt={`Foto de ${species.commonName} ${photoIndex + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BitacoraDetailPage;