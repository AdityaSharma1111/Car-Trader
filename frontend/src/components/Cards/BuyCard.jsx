import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import buyCarIcon from '../../assets/icons/buy-car.png';

function BuyCard() {
  const navigate = useNavigate();

  return (
    <div className="bg-blue-50 rounded-2xl p-12 w-full md:w-[500px] flex justify-between items-end shadow-xl hover:shadow-2xl transition">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 cursor-default mb-4 leading-snug">
          Are You Looking <br /> For a Car ?
        </h2>
        <p className="text-lg text-gray-600 cursor-default mb-8">
          We are committed to providing our customers with exceptional service.
        </p>
        <button
          onClick={() => navigate('/buy')}
          className="bg-blue-600 text-white text-base px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          Get Started <ArrowUpRight size={18} />
        </button>
      </div>
      <img src={buyCarIcon} alt="Buy Car" className="h-20 ml-6" />
    </div>
  );
}

export default BuyCard;
