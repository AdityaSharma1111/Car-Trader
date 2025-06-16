import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CarCard from '../Cards/CarCard.jsx';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/ApiPaths.js';

const Buy = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get('query') || '';
  const [searchInput, setSearchInput] = useState(query);

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCars = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(`${API_PATHS.CAR.GET_ALL_CARS}`, {
        params: {
          search: query,
          page: currentPage
        }
      });

      setCars(response.data.data?.cars || []);
      setTotalPages(response.data.data?.totalPages || 1);
      setError('');
    } catch (err) {
      setError('Failed to fetch cars');
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [query, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (trimmed) {
      setCurrentPage(1);
      navigate(`/search?query=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div className="p-6">
      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row items-center mb-6 bg-white rounded-full overflow-hidden shadow max-w-xl mx-auto"
      >
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by car name, fuel type, etc..."
          className="w-full px-5 py-3 outline-none text-gray-700 text-sm sm:text-base"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-3 w-full sm:w-auto hover:bg-blue-700 transition text-sm sm:text-base"
        >
          Search
        </button>
      </form>

      <h1 className="text-2xl font-bold mb-4">
        Showing results for: <span className="text-blue-600">{query}</span>
      </h1>

      {loading ? (
        <p>Loading cars...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : cars.length === 0 ? (
        <p>No cars found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-lg font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Buy;
