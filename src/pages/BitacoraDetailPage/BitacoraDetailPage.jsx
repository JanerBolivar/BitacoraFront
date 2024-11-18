import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, ThermometerSun, ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from "../../contexts/useAuth";
import Papa from "papaparse";
import { jsPDF } from "jspdf";

const BitacoraDetailPage = () => {
    const [selectedPhoto, setSelectedPhoto] = useState(0);
    const [selectedSpeciesPhotos, setSelectedSpeciesPhotos] = useState({});
    const [newComment, setNewComment] = useState("");
    const navigate = useNavigate();
    const { user } = useAuth();
    const { id } = useParams();

    const [bitacora, setBitacora] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBitacora = async () => {
            try {
                const response = await axios.get(`/api/log/field-logs/${id}`);
                setBitacora(response.data);
                // Inicializar el estado de fotos seleccionadas para cada especie
                const initialSelectedPhotos = {};
                response.data.collectedSpecies.forEach((species, index) => {
                    initialSelectedPhotos[index] = species.photos[0];
                });
                setSelectedSpeciesPhotos(initialSelectedPhotos);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar la bitácora');
                setLoading(false);
            }
        };

        fetchBitacora();
    }, [id]);

    // Verifica si la bitácora y los datos del usuario están disponibles
    const isOwner = bitacora?.owner?.uid === user?.uid;
    const isCollaborator = bitacora?.collaborators?.some(collaborator => collaborator?.uid === user?.uid);


    // Función para actualizar la foto seleccionada de una especie específica
    const handleSpeciesPhotoSelect = (speciesIndex, photo) => {
        setSelectedSpeciesPhotos(prev => ({
            ...prev,
            [speciesIndex]: photo
        }));
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`/api/log/delete-log/${id}`);

            if (response.status === 200) {
                alert('Bitácora eliminada con éxito');
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error al eliminar la bitácora:', error);
            alert('Hubo un error al eliminar la bitácora');
        }
    };

    const handleEditBitacora = () => {
        navigate(`/logs/edit/${id}`);
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const response = await axios.post(`/api/log/comments/${id}`, {
                comment: newComment,
                user: {
                    name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
                    avatar: user.photoURL
                }
            });

            setNewComment("");
        } catch (err) {
            console.error("Error al agregar el comentario:", err);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando informacion de la bitácora...</p>
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    const exportToCSV = () => {
        // Extraer toda la información de la bitácora
        const bitacoraData = {
            "ID": bitacora.id,
            "Título": bitacora.title,
            "Descripción": bitacora.description,
            "Fecha de Creación": new Date(bitacora.createdAt).toLocaleString(),
            "Estado": bitacora.status,
            "Comentarios": Object.values(bitacora.comments || {}).map(comment => ({
                "Nombre del Usuario": comment.user.name,
                "Comentario": comment.comment,
                "Avatar": comment.user.avatar,
                "Fecha": new Date(comment.timestamp).toLocaleString(),
            }))
        };

        // Convertir a CSV
        const csv = Papa.unparse([bitacoraData]);

        // Crear un archivo descargable
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "bitacora_detalle.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };


    const exportToPDF = () => {
        const doc = new jsPDF();
        let y = 10;  // posición inicial vertical
        doc.setFontSize(12);

        // Agregar detalles de la bitácora al PDF
        doc.text(`ID: ${bitacora.id}`, 10, y);
        y += 10;
        doc.text(`Título: ${bitacora.title}`, 10, y);
        y += 10;
        doc.text(`Fecha de Creación: ${new Date(bitacora.createdAt).toLocaleString()}`, 10, y);
        y += 10;

        // Estado de la bitácora
        const estado = bitacora.status ? "Activa" : "Inactiva";
        doc.text(`Estado: ${estado}`, 10, y);
        y += 10;

        // Notas adicionales
        doc.text(`Notas adicionales: ${bitacora.additionalNotes}`, 10, y);
        y += 10;

        // Colaboradores
        doc.text("Colaboradores:", 10, y);
        y += 10;
        bitacora.collaborators.forEach(collaborator => {
            doc.text(`Nombre: ${collaborator.firstName} ${collaborator.lastName}`, 30, y);
            y += 6;
            doc.text(`Correo: ${collaborator.email}`, 30, y);
            y += 6;
            doc.text(`Rol: ${collaborator.role}`, 30, y);
            y += 10;
        });

        // Especies recolectadas
        doc.text("Especies recolectadas:", 10, y);
        y += 10;
        bitacora.collectedSpecies.forEach(species => {
            doc.text(`Nombre común: ${species.commonName}`, 30, y);
            y += 6;
            doc.text(`Nombre científico: ${species.scientificName}`, 30, y);
            y += 6;
            doc.text(`Estado: ${species.status}`, 30, y);
            y += 6;
            doc.text(`Familia: ${species.family}`, 30, y);
            y += 6;
            doc.text(`Cantidad: ${species.quantity}`, 30, y);
            y += 10;
        });

        // Comentarios
        doc.text("Comentarios:", 10, y);
        y += 10;
        Object.values(bitacora.comments || {}).forEach(comment => {
            doc.text(`Usuario: ${comment.user.name}`, 30, y);
            y += 6;
            doc.text(`Comentario: ${comment.comment}`, 30, y);
            y += 6;
            doc.text(`Fecha: ${new Date(comment.timestamp).toLocaleString()}`, 30, y);
            y += 12;

            if (y > 270) {
                doc.addPage();
                y = 10;
            }
        });

        // Información del hábitat
        doc.text("Hábitat:", 10, y);
        y += 10;
        doc.text(`Altitud: ${bitacora.habitat.altitude}`, 30, y);
        y += 6;
        doc.text(`Descripción: ${bitacora.habitat.description}`, 30, y);
        y += 6;
        doc.text(`Tipo de suelo: ${bitacora.habitat.soilType}`, 30, y);
        y += 6;
        doc.text(`Tipo de vegetación: ${bitacora.habitat.vegetationType}`, 30, y);
        y += 6;
        doc.text(`Cuerpos de agua: ${bitacora.habitat.waterBodies}`, 30, y);
        y += 10;

        // Ubicación (latitud y longitud)
        doc.text("Ubicación:", 10, y);
        y += 10;
        doc.text(`Latitud: ${bitacora.location.latitude}`, 30, y);
        y += 6;
        doc.text(`Longitud: ${bitacora.location.longitude}`, 30, y);
        y += 10;

        // Información meteorológica
        doc.text("Condiciones meteorológicas:", 10, y);
        y += 10;
        doc.text(`Temperatura: ${bitacora.weather.temperature}°C`, 30, y);
        y += 6;
        doc.text(`Humedad: ${bitacora.weather.humidity}%`, 30, y);
        y += 6;
        doc.text(`Velocidad del viento: ${bitacora.weather.windSpeed} km/h`, 30, y);
        y += 6;
        doc.text(`Nubosidad: ${bitacora.weather.cloudCover}`, 30, y);
        y += 6;
        doc.text(`Precipitación: ${bitacora.weather.precipitation || "No aplica"}`, 30, y);
        y += 10;

        // Guardar el archivo PDF
        doc.save("bitacora_detalle.pdf");
    };


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
                        {
                            (isOwner || isCollaborator) && (
                                <div className="flex gap-2">
                                    <button
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                        onClick={() => { handleEditBitacora() }}
                                    >
                                        <Edit2 className="w-5 h-5" />
                                        <span className="text-sm font-medium">Editar</span>
                                    </button>
                                    <button
                                        className="flex items-center gap-2 text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                        onClick={() => { handleDelete() }}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                        <span className="text-sm font-medium">Eliminar</span>
                                    </button>
                                </div>
                            )
                        }
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            {/* Imagen principal */}
                            <div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-100">
                                <img
                                    src={bitacora.sitePhotos[selectedPhoto]} // Imagen seleccionada
                                    alt="Sitio de bitácora"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Miniaturas */}
                            <div className="grid grid-cols-6 gap-2">
                                {bitacora.sitePhotos.map((photo, index) => (
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
                                    <span>{bitacora.date}</span>
                                    <Clock className="w-4 h-4 ml-2" />
                                    <span>{bitacora.time}</span>
                                </div>
                                <h1 className="text-3xl font-bold mt-2">{bitacora.title}</h1>
                                <div className="flex items-center gap-2 mt-2">
                                    <MapPin className="w-4 h-4 text-gray-600" />
                                    <span className="text-gray-600">
                                        Coordenadas: {bitacora.location.latitude}, {bitacora.location.longitude}
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
                                        <p className="font-medium">{bitacora.weather.temperature}°C</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Humedad</p>
                                        <p className="font-medium">{bitacora.weather.humidity}%</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Cielo</p>
                                        <p className="font-medium">{bitacora.weather.cloudCover}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Viento</p>
                                        <p className="font-medium">{bitacora.weather.windSpeed} km/h</p>
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
                                            <p className="font-medium">{bitacora.habitat.altitude} m</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Tipo de Suelo</p>
                                            <p className="font-medium">{bitacora.habitat.soilType}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Vegetación</p>
                                            <p className="font-medium">{bitacora.habitat.vegetationType}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Cuerpos de Agua</p>
                                            <p className="font-medium">{bitacora.habitat.waterBodies}</p>
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
                            {bitacora.collectedSpecies.map((species, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                    {/* Foto principal seleccionada */}
                                    <div className="aspect-video w-full mb-4 rounded-lg overflow-hidden bg-gray-100">
                                        <img
                                            src={selectedSpeciesPhotos[index]}
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
                                                    className={`aspect-square rounded overflow-hidden bg-gray-100 cursor-pointer border ${selectedSpeciesPhotos[index] === photo
                                                        ? "border-blue-500"
                                                        : "border-transparent"
                                                        }`}
                                                    onClick={() => handleSpeciesPhotoSelect(index, photo)}
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
                            ))}
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-xl font-bold mb-4">Comentarios</h2>

                        {/* Lista de comentarios */}
                        <div className="space-y-4">
                            {Object.values(bitacora.comments || {}).map((comment, index) => (
                                <div key={index} className="flex items-center gap-x-4 p-4 bg-white shadow rounded-lg">
                                    <img
                                        src={comment.user.avatar || "https://via.placeholder.com/150"}
                                        alt={comment.user.name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <span className="block text-gray-800 font-semibold">{comment.user.name}</span>
                                        <span className="block text-gray-600 text-sm mt-0.5">{comment.comment}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Formulario para agregar comentarios */}
                        {(isOwner || isCollaborator) && (
                            <div className="mt-6">
                                <textarea
                                    className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
                                    rows="3"
                                    placeholder="Escribe tu comentario aquí..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <button
                                    className="mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                                    onClick={handleAddComment}
                                >
                                    Comentar
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Botones para exportar */}
                    <div className="mt-8">
                        <button
                            className="p-2 bg-blue-500 text-white rounded mr-2"
                            onClick={exportToCSV}
                        >
                            Exportar a CSV
                        </button>
                        <button
                            className="p-2 bg-green-500 text-white rounded"
                            onClick={exportToPDF}
                        >
                            Exportar a PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BitacoraDetailPage;