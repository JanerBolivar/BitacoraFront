import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, ThermometerSun, ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from "../../contexts/useAuth";
import Papa from "papaparse";
import { jsPDF } from "jspdf";
import LocationMap from '../../components/Components/LocationMap';

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
    const isAdmin = user?.role === 'administrador';


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
        // Crear arrays separados para cada sección de datos
        const generalInfo = [{
            Seccion: "INFORMACIÓN GENERAL",
            Campo: "",
            Valor: ""
        }, {
            Seccion: "Identificación",
            Campo: "ID",
            Valor: bitacora.id
        }, {
            Seccion: "Identificación",
            Campo: "Título",
            Valor: bitacora.title
        }, {
            Seccion: "Identificación",
            Campo: "Fecha de Creación",
            Valor: new Date(bitacora.createdAt).toLocaleString()
        }, {
            Seccion: "Identificación",
            Campo: "Estado",
            Valor: bitacora.status ? "Activo" : "Inactivo"
        }, {
            Seccion: "Identificación",
            Campo: "Notas Adicionales",
            Valor: bitacora.additionalNotes
        }, {
            Seccion: "",
            Campo: "",
            Valor: ""
        }, {
            Seccion: "INFORMACIÓN DEL CLIMA",
            Campo: "",
            Valor: ""
        }, {
            Seccion: "Clima",
            Campo: "Temperatura",
            Valor: `${bitacora.weather.temperature}°C`
        }, {
            Seccion: "Clima",
            Campo: "Humedad",
            Valor: `${bitacora.weather.humidity}%`
        }, {
            Seccion: "Clima",
            Campo: "Cobertura de Nubes",
            Valor: bitacora.weather.cloudCover
        }, {
            Seccion: "Clima",
            Campo: "Velocidad del Viento",
            Valor: `${bitacora.weather.windSpeed} km/h`
        }, {
            Seccion: "",
            Campo: "",
            Valor: ""
        }, {
            Seccion: "INFORMACIÓN DEL HÁBITAT",
            Campo: "",
            Valor: ""
        }, {
            Seccion: "Hábitat",
            Campo: "Altitud",
            Valor: `${bitacora.habitat.altitude} m`
        }, {
            Seccion: "Hábitat",
            Campo: "Tipo de Suelo",
            Valor: bitacora.habitat.soilType
        }, {
            Seccion: "Hábitat",
            Campo: "Tipo de Vegetación",
            Valor: bitacora.habitat.vegetationType
        }, {
            Seccion: "Hábitat",
            Campo: "Cuerpos de Agua",
            Valor: bitacora.habitat.waterBodies
        }, {
            Seccion: "",
            Campo: "",
            Valor: ""
        }, {
            Seccion: "UBICACIÓN",
            Campo: "",
            Valor: ""
        }, {
            Seccion: "Ubicación",
            Campo: "Latitud",
            Valor: bitacora.location.latitude
        }, {
            Seccion: "Ubicación",
            Campo: "Longitud",
            Valor: bitacora.location.longitude
        }];

        // Preparar datos de especies
        const speciesData = [{
            Seccion: "",
            Campo: "",
            Valor: ""
        }, {
            Seccion: "ESPECIES RECOLECTADAS",
            Campo: "",
            Valor: ""
        }];

        bitacora.collectedSpecies.forEach((species, index) => {
            speciesData.push({
                Seccion: `Especie ${index + 1}`,
                Campo: "Nombre Común",
                Valor: species.commonName
            }, {
                Seccion: `Especie ${index + 1}`,
                Campo: "Nombre Científico",
                Valor: species.scientificName
            }, {
                Seccion: `Especie ${index + 1}`,
                Campo: "Familia",
                Valor: species.family
            }, {
                Seccion: `Especie ${index + 1}`,
                Campo: "Estado",
                Valor: species.status
            }, {
                Seccion: `Especie ${index + 1}`,
                Campo: "Cantidad",
                Valor: species.quantity
            });
        });

        // Preparar datos de comentarios
        const commentsData = [{
            Seccion: "",
            Campo: "",
            Valor: ""
        }, {
            Seccion: "COMENTARIOS",
            Campo: "",
            Valor: ""
        }];

        Object.values(bitacora.comments || {}).forEach((comment, index) => {
            commentsData.push({
                Seccion: `Comentario ${index + 1}`,
                Campo: "Usuario",
                Valor: comment.user.name
            }, {
                Seccion: `Comentario ${index + 1}`,
                Campo: "Comentario",
                Valor: comment.comment
            }, {
                Seccion: `Comentario ${index + 1}`,
                Campo: "Fecha",
                Valor: new Date(comment.timestamp).toLocaleString()
            });
        });

        // Combinar todos los datos
        const allData = [...generalInfo, ...speciesData, ...commentsData];

        // Convertir a CSV con configuración específica
        const csv = Papa.unparse(allData, {
            quotes: true, // Envolver campos en comillas
            delimiter: ",", // Usar coma como delimitador
        });

        // Crear y descargar el archivo
        const blob = new Blob(["\ufeff", csv], {
            type: "text/csv;charset=utf-8-sig;"
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `bitacora_${bitacora.id}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };


    const exportToPDF = () => {
        const doc = new jsPDF();
        let y = 10;  // posición inicial vertical
        const pageHeight = doc.internal.pageSize.height;
        const margin = 10;

        // Función auxiliar para verificar y agregar nueva página si es necesario
        const checkAndAddPage = (requiredSpace) => {
            if (y + requiredSpace > pageHeight - margin) {
                doc.addPage();
                y = 10;
                return true;
            }
            return false;
        };

        // Función auxiliar para agregar texto con control de página
        const addText = (text, xPos, yIncrement = 10, indent = 0) => {
            checkAndAddPage(yIncrement);
            doc.text(text, xPos + indent, y);
            y += yIncrement;
        };

        // Configuración inicial
        doc.setFontSize(12);

        // Información básica
        addText(`ID: ${bitacora.id}`, margin);
        addText(`Título: ${bitacora.title}`, margin);
        addText(`Fecha de Creación: ${new Date(bitacora.createdAt).toLocaleString()}`, margin);

        // Estado de la bitácora
        const estado = bitacora.status ? "Activa" : "Inactiva";
        addText(`Estado: ${estado}`, margin);
        addText(`Notas adicionales: ${bitacora.additionalNotes}`, margin);

        // Colaboradores
        addText("Colaboradores:", margin);
        bitacora.collaborators.forEach(collaborator => {
            checkAndAddPage(30);  // Espacio necesario para cada colaborador
            addText(`Nombre: ${collaborator.firstName} ${collaborator.lastName}`, margin, 6, 20);
            addText(`Correo: ${collaborator.email}`, margin, 6, 20);
            addText(`Rol: ${collaborator.role}`, margin, 10, 20);
        });

        // Especies recolectadas
        addText("Especies recolectadas:", margin);
        bitacora.collectedSpecies.forEach(species => {
            checkAndAddPage(40);  // Espacio necesario para cada especie
            addText(`Nombre común: ${species.commonName}`, margin, 6, 20);
            addText(`Nombre científico: ${species.scientificName}`, margin, 6, 20);
            addText(`Estado: ${species.status}`, margin, 6, 20);
            addText(`Familia: ${species.family}`, margin, 6, 20);
            addText(`Cantidad: ${species.quantity}`, margin, 10, 20);
        });

        // Comentarios
        addText("Comentarios:", margin);
        Object.values(bitacora.comments || {}).forEach(comment => {
            checkAndAddPage(30);  // Espacio necesario para cada comentario
            addText(`Usuario: ${comment.user.name}`, margin, 6, 20);
            addText(`Comentario: ${comment.comment}`, margin, 6, 20);
            addText(`Fecha: ${new Date(comment.timestamp).toLocaleString()}`, margin, 12, 20);
        });

        // Información del hábitat
        checkAndAddPage(50);  // Espacio necesario para la sección de hábitat
        addText("Hábitat:", margin);
        addText(`Altitud: ${bitacora.habitat.altitude}`, margin, 6, 20);
        addText(`Descripción: ${bitacora.habitat.description}`, margin, 6, 20);
        addText(`Tipo de suelo: ${bitacora.habitat.soilType}`, margin, 6, 20);
        addText(`Tipo de vegetación: ${bitacora.habitat.vegetationType}`, margin, 6, 20);
        addText(`Cuerpos de agua: ${bitacora.habitat.waterBodies}`, margin, 10, 20);

        // Ubicación
        checkAndAddPage(30);  // Espacio necesario para la sección de ubicación
        addText("Ubicación:", margin);
        addText(`Latitud: ${bitacora.location.latitude}`, margin, 6, 20);
        addText(`Longitud: ${bitacora.location.longitude}`, margin, 10, 20);

        // Información meteorológica
        checkAndAddPage(50);  // Espacio necesario para la sección meteorológica
        addText("Condiciones meteorológicas:", margin);
        addText(`Temperatura: ${bitacora.weather.temperature}°C`, margin, 6, 20);
        addText(`Humedad: ${bitacora.weather.humidity}%`, margin, 6, 20);
        addText(`Velocidad del viento: ${bitacora.weather.windSpeed} km/h`, margin, 6, 20);
        addText(`Nubosidad: ${bitacora.weather.cloudCover}`, margin, 6, 20);
        addText(`Precipitación: ${bitacora.weather.precipitation || "No aplica"}`, margin, 10, 20);

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
                            (isOwner || isCollaborator || isAdmin) && (
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
                                        onClick={() => setSelectedPhoto(index)}
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
                                <div className="mt-2">
                                    <LocationMap
                                        latitude={bitacora.location.latitude}
                                        longitude={bitacora.location.longitude}
                                        title={bitacora.title}
                                    />
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