import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Calendar, MessageSquare, Tag, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Head } from "../../components/Components/Head";

const DashboardPage = () => {
  const [fieldLogs, setFieldLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFieldLogs = async () => {
      try {
        const response = await axios.get('/api/log/field-logs');
        setFieldLogs(response.data);
      } catch (error) {
        console.error('Error fetching field logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFieldLogs();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long'
    });
  };

  const filteredLogs = fieldLogs.filter(log =>
    log.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head
        newtitle="Bitácoras de Campo"
        newdescription="Explora y gestiona todas las bitácoras de campo en nuestra plataforma"
        newkeywords="bitácoras, campo, gestión de bitácoras, registro de actividades"
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-2xl font-semibold">Bitácoras</h1>
              <button
                onClick={() => navigate('/new-log')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 w-full sm:w-auto justify-center sm:justify-start"
              >
                <PlusCircle size={20} />
                Crear Bitácora
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar bitácora"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto">
                <span className="text-gray-600 text-sm">
                  {filteredLogs.length} bitácoras
                </span>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                  Todas
                  <span className="text-gray-400">▼</span>
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando bitácoras...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-200 transform hover:-translate-y-1"
                >
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
                        <button className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
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
                      <span className="text-sm text-gray-500">
                        Hora: {log.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;