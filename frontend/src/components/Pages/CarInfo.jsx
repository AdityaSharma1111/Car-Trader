import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/ApiPaths.js';
import carIcon from '../../assets/icons/carIcon.jpg';
import CarCard from '../Cards/CarCard.jsx';
import { getCarImageFromPexels } from '../../utils/getCarImageFromPexels.js';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext.jsx';
import { toast, Toaster } from 'react-hot-toast';

const CarInfo = () => {
  const { carId } = useParams();
  const [car, setCar] = useState(null);
  const [similarCars, setSimilarCars] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const [imageUrl, setImageUrl] = useState(carIcon); // default

  useEffect(() => {
    const fetchImage = async () => {
      if (car && !car.carImage) {
        const fetchedImage = await getCarImageFromPexels(`${car.name} ${car.year}`);
        if (fetchedImage) setImageUrl(fetchedImage);
      } else if (car?.carImage) {
        setImageUrl(car.carImage);
      }
    };
    fetchImage();
  }, [car]);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.CAR.GET_CAR_BY_ID(carId));
        setCar(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCar();
  }, [carId]);

  useEffect(() => {
    const fetchSimilarCars = async () => {
      if (!car?.similarCars?.length) return;
      try {
        const responses = await Promise.all(
          car.similarCars.map((id) => axiosInstance.get(API_PATHS.CAR.GET_CAR_BY_ID(id)))
        );
        const carsData = responses.map((res) => res.data.data);
        setSimilarCars(carsData);
      } catch (err) {
        console.error('Error fetching similar cars:', err);
      }
    };
    fetchSimilarCars();
  }, [car]);

  const handleAddFavorite = async () => {
    if (!user) {
      toast.error('Please log in to add to favorites.');
      return;
    }
    try {
      await axiosInstance.post(API_PATHS.USER.ADD_TO_FAVORITES(carId));
      toast.success('Added to favorites!');
      setUser({
        ...user,
        favorites: [...(user.favorites || []), carId]
      });
    } catch (err) {
      console.error(err);
      toast.error('Error adding to favorites.');
    }
  };

  const handleAddBooking = async () => {
    if (!user) {
      toast.error('Please log in to book a car.');
      return;
    }
    try {
      await axiosInstance.post(API_PATHS.USER.ADD_BOOKING(carId));
      toast.success('Car booked successfully!');
      setUser({
        ...user,
        bookedCars: [...(user.bookedCars || []), carId]
      });
    } catch (err) {
      // console.error(err);
      toast.error(err.response.data.message);
    }
  };

  const handleRemoveFavorite = async () => {
    if (!user) {
      toast.error('Please log in to remove from favorites.');
      return;
    }
    try {
      await axiosInstance.delete(API_PATHS.USER.REMOVE_FROM_FAVORITES(carId));
      toast.success('Removed from favorites!');
      setUser({
        ...user,
        favorites: (user.favorites || []).filter(id => id !== carId)
      });
    } catch (err) {
      console.error(err);
      toast.error('Error removing from favorites.');
    }
  };

  const handleRemoveBooking = async () => {
    if (!user) {
      toast.error('Please log in to cancel booking.');
      return;
    }
    try {
      await axiosInstance.delete(API_PATHS.USER.REMOVE_BOOKING(carId));
      toast.success('Booking cancelled!');
      setUser({
        ...user,
        bookedCars: (user.bookedCars || []).filter(id => id !== carId)
      });
    } catch (err) {
      console.error(err);
      toast.error('Error cancelling booking.');
    }
  };

  if (!car) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-10">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Top Section */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Image & Buttons */}
        <div className="md:w-1/2 flex flex-col items-center">
          <img
            src={imageUrl}
            alt={car.name}
            className="w-full h-80 object-cover rounded shadow"
          />
          <div className="mt-4 flex gap-4 w-full">
            {/* Favorites Button */}
            {user && user.favorites && user.favorites.includes(carId) ? (
              <button
                onClick={handleRemoveFavorite}
                className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
              >
                Remove from Favorites
              </button>
            ) : (
              <button
                onClick={handleAddFavorite}
                className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition"
              >
                Add to Favorites
              </button>
            )}

            {/* Bookings Button */}
            {user && user.bookedCars && user.bookedCars.includes(carId) ? (
              <button
                onClick={handleRemoveBooking}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
              >
                Cancel Booking
              </button>
            ) : (
              <button
                onClick={handleAddBooking}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
              >
                Book Now
              </button>
            )}
          </div>
        </div>

        {/* Right: Car Details */}
        <div className="md:w-1/2 space-y-3">
          <h1 className="text-3xl font-bold">{car.name}</h1>
          <p className="text-gray-600">{car.year} • {car.kmsDriven.toLocaleString()} km driven</p>
          <p className="text-blue-600 text-2xl font-semibold">
            ₹{car.sellingPrice.toLocaleString()}
          </p>
          <div className="text-gray-700 space-y-1">
            <p><strong>Fuel:</strong> {car.fuel}</p>
            <p><strong>Transmission:</strong> {car.transmission}</p>
            <p><strong>Owner:</strong> {car.owner}</p>
            <p><strong>Seller Type:</strong> {car.sellerType}</p>
            <p><strong>Location:</strong> {car.location}</p>
            <p><strong>Description:</strong> {car.description || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Similar Cars */}
      {similarCars.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Similar Cars</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {similarCars.map((similarCar) => (
              <div
                key={similarCar._id}
                className="min-w-[270px] max-w-[300px] flex-shrink-0"
              >
                <CarCard car={similarCar} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarInfo;
