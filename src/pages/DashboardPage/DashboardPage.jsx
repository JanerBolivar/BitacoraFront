import React, { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import axios from "axios";

import { Head } from "../../components/Components/Head";
import SearchFilter from "../../components/Components/SearchFilter";
import SearchBar from "../../components/Components/SearchBar";
import SortDropdown from "../../components/Components/SortDropdown";
import LogCard from "../../components/Components/LogCard";

const DashboardPage = () => {
  const [fieldLogs, setFieldLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("fecha");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Search states
  const [searchParams, setSearchParams] = useState({
    title: "",
    date: "",
    location: "",
    species: ""
  });
  const [activeFilter, setActiveFilter] = useState("title");

  useEffect(() => {
    const fetchFieldLogs = async () => {
      try {
        const response = await axios.get("/api/log/field-logs");
        setFieldLogs(response.data);
        setFilteredLogs(response.data);
      } catch (error) {
        console.error("Error fetching field logs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFieldLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [searchParams, fieldLogs]);

  const filterLogs = () => {
    let filtered = [...fieldLogs];

    // Filter by title
    if (searchParams.title) {
      filtered = filtered.filter(log =>
        log.title.toLowerCase().includes(searchParams.title.toLowerCase())
      );
    }

    // Filter by date
    if (searchParams.date) {
      filtered = filtered.filter(log =>
        log.date.includes(searchParams.date)
      );
    }

    // Filter by location
    if (searchParams.location) {
      filtered = filtered.filter(log =>
        log.location.latitude.includes(searchParams.location) ||
        log.location.longitude.includes(searchParams.location)
      );
    }

    // Filter by species
    if (searchParams.species) {
      filtered = filtered.filter(log =>
        log.collectedSpecies.some(species =>
          species.commonName.toLowerCase().includes(searchParams.species.toLowerCase()) ||
          species.scientificName.toLowerCase().includes(searchParams.species.toLowerCase())
        )
      );
    }

    setFilteredLogs(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
    });
  };

  const handleSortChange = (criteria) => {
    setSortBy(criteria);
    let sorted = [...filteredLogs];

    switch (criteria) {
      case "fecha":
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "lugar":
        sorted.sort((a, b) => a.location.latitude.localeCompare(b.location.latitude));
        break;
      case "relevancia":
        sorted.sort((a, b) => b.collectedSpecies.length - a.collectedSpecies.length);
        break;
      default:
        break;
    }

    setFilteredLogs(sorted);
    setIsMenuOpen(false);
  };

  const handleSearchChange = (value) => {
    setSearchParams(prev => ({
      ...prev,
      [activeFilter]: value
    }));
  };

  const handleViewBitacora = (log) => {
    navigate(`/log-information/${log.id}`);
  };

  const handleShowAll = () => {
    // Reset all search parameters
    setSearchParams({
      title: "",
      date: "",
      location: "",
      species: ""
    });
    // Reset the filtered logs to show all logs
    setFilteredLogs(fieldLogs);
    // Reset the active filter to title (default)
    setActiveFilter("title");
  };

  const isInvestigator = user.role === "investigador";

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
            {isInvestigator && (
              <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 mb-6">
                <h1 className="text-2xl font-semibold text-center sm:text-left">Bitácoras</h1>
                <button
                  onClick={() => navigate("/logs/new")}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 w-full sm:w-auto justify-center sm:justify-start"
                >
                  <PlusCircle size={20} />
                  Crear Bitácora
                </button>
              </div>
            )}

            <div className="flex flex-col space-y-4 mb-6">
              <SearchFilter
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                handleShowAll={handleShowAll}
              />

              <div className="flex flex-col sm:flex-row gap-4">
                <SearchBar
                  activeFilter={activeFilter}
                  searchParams={searchParams}
                  handleSearchChange={handleSearchChange}
                />

                <SortDropdown
                  sortBy={sortBy}
                  isMenuOpen={isMenuOpen}
                  setIsMenuOpen={setIsMenuOpen}
                  handleSortChange={handleSortChange}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">Cargando bitácoras...</div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No se encontraron bitácoras que coincidan con tu búsqueda
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredLogs.map((log) => (
                  <LogCard
                    key={log.id}
                    log={log}
                    handleViewBitacora={handleViewBitacora}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;