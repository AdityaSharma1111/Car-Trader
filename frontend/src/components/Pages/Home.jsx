import React from 'react';
import Background from '../../assets/photos/Background.jpg';
import { useNavigate } from 'react-router-dom';
import CarLogoCard from '../Cards/CarLogoCard';
import BuyCard from '../Cards/BuyCard';
import SellCard from '../Cards/SellCard';
import audi from '../../assets/photos/audi.png';
import bmw from '../../assets/photos/bmw.jpg';
import tata from '../../assets/photos/tata.png';
import mahindra from '../../assets/photos/mahindra.jpg';
import honda from '../../assets/photos/honda.png';
import hyundai from '../../assets/photos/hyundai.png';


function Home() {
  const navigate = useNavigate();
  const carBrands = [
    { imageSrc: audi, brandName: 'AUDI' },
    { imageSrc: mahindra, brandName: 'MAHINDRA' },
    { imageSrc: bmw, brandName: 'BMW' },
    { imageSrc: tata, brandName: 'TATA' },
    { imageSrc: hyundai, brandName: 'HYUNDAI' },
    { imageSrc: honda, brandName: 'HONDA' },
  ];
  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.elements.search.value.trim();
    if (query) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  };
  return (
    <>
    <div className="relative w-full h-screen">
      {/* Background Image */}
      <img
        src={Background}
        alt="bgImage"
        className="w-full h-full object-cover"
      />

      {/* Centered Search Bar */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full max-w-xl px-4">
          <form onSubmit={handleSearch} className="flex bg-white rounded-full overflow-hidden shadow-lg">
            <input
              type="text"
              name="search"
              placeholder="Search by car name, fuel type, etc..."
              className="flex-grow px-6 py-3 outline-none text-gray-700"
            />
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition">
              Search
            </button>
          </form>
      </div>
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-white animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </div>
    </div>
    <div className="bg-gray-100 py-12 px-6">
      <h1 className="text-center text-4xl font-bold mb-10">Welcome to CarTrader</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition cursor-default">
          <h2 className="text-xl font-semibold mb-2">Car Trader</h2>
          <p className="text-gray-600">A place to book and sell a car with ease and trust.</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition cursor-default">
          <h2 className="text-xl font-semibold mb-2">Access to Similar Cars</h2>
          <p className="text-gray-600">
            Trained an ML model using 1000+ car instances from the CarDekho Kaggle dataset.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition cursor-default">
          <h2 className="text-xl font-semibold mb-2">Book Cars</h2>
          <p className="text-gray-600">Authenticated users can book the car of their choice and also see the recieved bookings.</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition cursor-default">
          <h2 className="text-xl font-semibold mb-2">Manage Cars</h2>
          <p className="text-gray-600">Authenticated users can add new car listings or manage their own posted cars.</p>
        </div>
      </div>
    </div>

    <h1 className="text-3xl ml-4 font-medium mt-12 mb-6">
      Explore some of the brands:
    </h1>

    <div className="w-full px-8">
      <div className="flex justify-evenly flex-wrap gap-4">
        {carBrands.slice(0, 6).map((brand, index) => (
          <CarLogoCard
            key={index}
            imageSrc={brand.imageSrc}
            brandName={brand.brandName}
          />
        ))}

        {/* See More Card */}
        <div
          onClick={() => navigate('/search')}
          className="w-[120px] h-[120px] bg-white rounded-xl p-4 shadow hover:shadow-lg transition flex flex-col items-center justify-center cursor-pointer"
        >
          <p className="text-sm font-semibold text-blue-600">See more →</p>
        </div>
      </div>
    </div>

    <div className="mt-32 mb-32 mx-auto flex flex-col md:flex-row justify-center gap-28">
        <BuyCard />
        <SellCard />
    </div>
    </>
  );
}

export default Home;
