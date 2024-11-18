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

  // Search and Advanced Filter States
  const [searchParams, setSearchParams] = useState({
    title: "",
    date: "",
    location: "",
    species: ""
  });
  const [activeFilter, setActiveFilter] = useState("title");

  // Enhanced filtering state
  const [filters, setFilters] = useState({
    dateRange: { start: null, end: null },
    location: { latitude: '', longitude: '' },
    habitat: {
      vegetationType: '',
      waterBodies: '',
      soilType: '',
      altitude: ''
    },
    weather: {
      cloudCover: '',
      temperature: '',
      humidity: '',
      windSpeed: ''
    }
  });

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

  // Comprehensive filtering function
  const applyFilters = () => {
    let result = [...fieldLogs];

    // Search Filters
    if (searchParams.title) {
      result = result.filter(log =>
        log.title.toLowerCase().includes(searchParams.title.toLowerCase())
      );
    }

    if (searchParams.date) {
      result = result.filter(log =>
        log.date.includes(searchParams.date)
      );
    }

    if (searchParams.location) {
      result = result.filter(log =>
        log.location.latitude.includes(searchParams.location) ||
        log.location.longitude.includes(searchParams.location)
      );
    }

    if (searchParams.species) {
      result = result.filter(log =>
        log.collectedSpecies.some(species =>
          species.commonName.toLowerCase().includes(searchParams.species.toLowerCase()) ||
          species.scientificName.toLowerCase().includes(searchParams.species.toLowerCase())
        )
      );
    }

    // Advanced Filters
    // Date Range Filter
    if (filters.dateRange.start && filters.dateRange.end) {
      result = result.filter(log => {
        const logDate = new Date(log.date);
        return (
          logDate >= new Date(filters.dateRange.start) &&
          logDate <= new Date(filters.dateRange.end)
        );
      });
    }

    // Location Filter
    if (filters.location.latitude) {
      result = result.filter(log =>
        log.location.latitude.includes(filters.location.latitude)
      );
    }
    if (filters.location.longitude) {
      result = result.filter(log =>
        log.location.longitude.includes(filters.location.longitude)
      );
    }

    // Habitat Filters
    Object.keys(filters.habitat).forEach(key => {
      if (filters.habitat[key]) {
        result = result.filter(log =>
          log.habitat[key].toLowerCase().includes(filters.habitat[key].toLowerCase())
        );
      }
    });

    // Weather Filters
    Object.keys(filters.weather).forEach(key => {
      if (filters.weather[key]) {
        result = result.filter(log =>
          log.weather[key].toLowerCase().includes(filters.weather[key].toLowerCase())
        );
      }
    });

    setFilteredLogs(result);
  };

  // Trigger filtering when search or filters change
  useEffect(() => {
    applyFilters();
  }, [searchParams, filters, fieldLogs]);

  // Sorting function
  const sortLogs = (logs, criteria) => {
    switch (criteria) {
      case 'fecha':
        return [...logs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'lugar':
        return [...logs].sort((a, b) =>
          a.location.latitude.localeCompare(b.location.latitude)
        );
      case 'relevancia':
        return [...logs].sort((a, b) =>
          (b.collectedSpecies?.length || 0) - (a.collectedSpecies?.length || 0)
        );
      default:
        return logs;
    }
  };

  // Handler for advanced filter changes
  const handleFilterChange = (category, key, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  // Handler for search changes
  const handleSearchChange = (value) => {
    setSearchParams(prev => ({
      ...prev,
      [activeFilter]: value
    }));
  };

  // Sort logs handler
  const handleSortChange = (criteria) => {
    setSortBy(criteria);
    setFilteredLogs(sortLogs(filteredLogs, criteria));
    setIsMenuOpen(false);
  };

  // Reset all filters and search
  const handleShowAll = () => {
    // Reset search parameters
    setSearchParams({
      title: "",
      date: "",
      location: "",
      species: ""
    });

    // Reset advanced filters
    setFilters({
      dateRange: { start: null, end: null },
      location: { latitude: '', longitude: '' },
      habitat: {
        vegetationType: '',
        waterBodies: '',
        soilType: '',
        altitude: ''
      },
      weather: {
        cloudCover: '',
        temperature: '',
        humidity: '',
        windSpeed: ''
      }
    });

    // Reset active filter
    setActiveFilter("title");

    // Show all logs
    setFilteredLogs(fieldLogs);
  };

  // Date formatting utility
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
    });
  };

  // Navigation to log details
  const handleViewBitacora = (log) => {
    navigate(`/log-information/${log.id}`);
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

            <div className="mb-6 bg-white shadow rounded-lg p-6">
              <div className="flex flex-col space-y-4">
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
                    filters={filters}
                    handleFilterChange={handleFilterChange}
                    handleShowAll={handleShowAll}
                  />
                </div>
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