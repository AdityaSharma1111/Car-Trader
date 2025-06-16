import React, { useEffect, useState } from 'react';
import carIcon from '../../assets/icons/carIcon.jpg';
import { Link } from 'react-router-dom';
import { getCarImageFromPexels } from '../../utils/getCarImageFromPexels';

const CarCard = ({ car }) => {
  const [imageUrl, setImageUrl] = useState(car.carImage || carIcon);

  useEffect(() => {
    const fetchImage = async () => {
      if (!car.carImage) {
        const fetchedImage = await getCarImageFromPexels(`${car.name} ${car.year}`);
        if (fetchedImage) setImageUrl(fetchedImage);
      }
    };
    fetchImage();
  }, [car]);

  return (
    <Link to={`/car/${car._id}`}>
      <div className="w-full max-w-xs bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <img
          src={imageUrl}
          alt={`${car.name}`}
          className="w-full h-48 object-cover"
        />
        <div className="p-4 space-y-1 text-gray-800">
          <div className="text-lg font-semibold flex justify-between">
            <span>{car.name}</span>
            <span className="text-sm text-gray-500">{car.year}</span>
          </div>
          <div className="text-blue-600 font-bold text-lg">
            ₹{car.sellingPrice.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            Driven: {car.kmsDriven.toLocaleString()} km
          </div>
          <div className="flex justify-between text-sm text-gray-700 mt-2">
            <span>Fuel: {car.fuel}</span>
            <span>Trans: {car.transmission}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;
