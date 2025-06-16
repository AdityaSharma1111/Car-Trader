import React, { useContext, useState } from 'react';
import {
  PencilSquareIcon,
  CurrencyRupeeIcon,
  CalendarIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function CarListItem({
  car,
  showEdit = false,
  isFavorite = false,
  isBooking = false,
  isMyCar = false,
  onRemove,
}) {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const {user, setUser} = useContext(UserContext);

  const handleView = () => navigate(`/car/${car._id}`);
  const handleEdit = () => navigate(`/update/${car._id}`, { state: { car } });

  const handleRemove = async () => {
    try {
      if (isFavorite) { // to remove favorite
        await axiosInstance.delete(`/api/v1/user/favorites/${car._id}`);
        setUser((prevUser) => ({
          ...prevUser,
          favorites: prevUser.favorites.filter((id) => id !== car._id),
        }));
        toast.success("Removed from favorites");
      } 
      else if (isBooking) { // to remove booking
        await axiosInstance.delete(`/api/v1/user/bookings/${car._id}`);
        setUser((prevUser) => ({
          ...prevUser,
          bookedCars: prevUser.bookedCars.filter((id) => id !== car._id),
        }));
        toast.success("Booking cancelled");
      } 
      else if (isMyCar) { // to remove the car
        await axiosInstance.delete(`/api/v1/cars/${car._id}`);
        setUser((prevUser) => ({
          ...prevUser,
          myCars: prevUser.myCars.filter((id) => id !== car._id),
        }));
        toast.success("Car deleted");
      }

      onRemove?.(car._id);
    } catch (err) {
      console.error(err);
      toast.error(
        isFavorite
          ? "Failed to remove from favorites"
          : isBooking
          ? "Failed to cancel booking"
          : "Failed to delete car"
      );
    } finally {
      setShowConfirm(false);
    }
  };


  const ActionButtons = () => (
    <div className="absolute top-3 right-3 flex items-center gap-2">
      {/* Edit Button */}
      {showEdit && (
        <button
          onClick={handleEdit}
          className="p-1.5 rounded-full text-gray-500 bg-gray-100 hover:bg-indigo-100 hover:text-indigo-600 transition-colors duration-200"
          aria-label="Edit car"
        >
          <PencilSquareIcon className="h-5 w-5" />
        </button>
      )}

      {/* Delete / Remove / Cancel Booking */}
      {(isFavorite || isBooking || isMyCar) &&
        (!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="p-1.5 rounded-full text-gray-500 bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
            aria-label="Remove/Delete"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        ) : (
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-white shadow-md border border-gray-200">
            <span className="text-xs font-semibold text-gray-700 ml-1">
              Sure?
            </span>
            <button
              onClick={handleRemove}
              className="p-1 rounded-full text-green-600 bg-green-100 hover:bg-green-200"
              aria-label="Confirm removal"
            >
              <CheckIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="p-1 rounded-full text-red-600 bg-red-100 hover:bg-red-200"
              aria-label="Cancel removal"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
    </div>
  );


  return (
    <div className="relative bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
      <ActionButtons />

      <div className="flex flex-col justify-between h-full">
        {/* Car Details */}
        <div>
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold pr-16">
            {car.name || "Unknown Car"}
          </div>
          <div className="flex items-center mt-2 text-gray-500">
            <CalendarIcon className="h-4 w-4 mr-1.5" />
            <p className="text-sm">{car.year || "N/A"}</p>
          </div>
          <div className="flex items-center mt-1 text-gray-700">
            <CurrencyRupeeIcon className="h-5 w-5 mr-1" />
            <p className="text-lg font-bold">
              {car.sellingPrice?.toLocaleString("en-IN") || "Price upon request"}
            </p>
          </div>
        </div>

        {/* View Details Button */}
        <button
          onClick={handleView}
          className="mt-4 w-full text-sm font-semibold text-indigo-600 hover:text-indigo-800 text-left"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default CarListItem;