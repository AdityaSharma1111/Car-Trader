import React from 'react';
import { useNavigate } from 'react-router-dom';

function CarLogoCard({ imageSrc, brandName }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/search?query=${encodeURIComponent(brandName)}`);
  };

  return (
    <div
      onClick={handleClick}
      className="w-[120px] h-[120px] bg-white rounded-xl p-4 shadow hover:shadow-lg transition flex flex-col items-center justify-center cursor-pointer"
    >
      <img
        src={imageSrc}
        alt={brandName}
        className="h-10 mb-2 object-contain"
      />
      <p className="text-sm font-medium text-center">{brandName}</p>
    </div>
  );
}

export default CarLogoCard;
