import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import sellCarIcon from '../../assets/icons/sell-car.png';

function SellCard() {
  const navigate = useNavigate();

  return (
    <div className="bg-pink-50 rounded-2xl p-12 w-full md:w-[500px] flex justify-between items-end shadow-xl hover:shadow-2xl transition">
      <div>
        <h2 className="text-3xl cursor-default font-bold text-gray-800 mb-4 leading-snug">
          Do You Want to <br /> Sell a Car ?
        </h2>
        <p className="text-lg cursor-default text-gray-600 mb-8">
          We are committed to providing our customers with exceptional service.
        </p>
        <button
          onClick={() => navigate('/sell')}
          className="bg-gray-900 text-white text-base px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition"
        >
          Get Started <ArrowUpRight size={18} />
        </button>
      </div>
      <img src={sellCarIcon} alt="Sell Car" className="h-20 ml-6" />
    </div>
  );
}

export default SellCard;
