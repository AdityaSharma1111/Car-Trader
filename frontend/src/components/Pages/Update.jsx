import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/ApiPaths';
import defaultImage from '../../assets/icons/carIcon.jpg';
import { useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import { toast, Toaster } from 'react-hot-toast'; // ✅ Added
import { useLocation, useParams } from 'react-router-dom';

const Update = () => {
    const { state } = useLocation();
    const { carId } = useParams();

    const car = state?.car;
    
    const [formData, setFormData] = useState(car || {});

    const [previewImage, setPreviewImage] = useState(car?.carImage || defaultImage);

    const [loading, setLoading] = useState(false);

    const { setUser } = useContext(UserContext);

    useEffect(() => {
        if (!car) {
            const fetchCar = async () => {
            const res = await axiosInstance.get(`/api/v1/cars/${carId}`);
            setFormData(res.data.car);
            setPreviewImage(res.data.car.carImage || defaultImage);
            };
            fetchCar();
        }
    }, [car, carId]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, carImage: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
        // Skip similarCars if it's undefined, empty, or invalid
        if (key === "similarCars") {
            if (Array.isArray(value)) {
            const validIds = value.filter(id => id && id.trim() !== "");
            if (validIds.length > 0) {
                validIds.forEach(id => data.append("similarCars", id));
            }
            }
            return; // Skip appending if it's empty or invalid
        }

        data.append(key, value);
        });


      const response = await axiosInstance.put(API_PATHS.CAR.UPDATE_CAR(carId), data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        });

      toast.success('Car updated successfully!');

    } catch (err) {
      toast.error('Error updating car. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <Toaster />
      <h2 className="text-3xl font-bold mb-6 text-center">Update Your Car</h2>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6 min-h-[500px]">
        {/* Image Upload */}
        <div className="flex flex-col justify-between md:w-1/2 border rounded p-4 shadow min-h-[500px]">
          <img
            src={previewImage}
            alt="Car Preview"
            className="w-full h-64 object-cover rounded border mb-4"
          />
          <label className="w-full cursor-pointer text-center py-2 px-4 border border-gray-300 rounded bg-gray-50 hover:bg-gray-100 transition">
            Upload Car Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* Form Fields */}
        <div className="md:w-1/2 min-h-[500px] flex flex-col justify-between">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" type="text" placeholder="Car Name" value={formData.name} onChange={handleChange} required className="p-2 border rounded" />
            <input name="year" type="number" placeholder="Manufacturing Year" value={formData.year} onChange={handleChange} required className="p-2 border rounded" />
            <input name="sellingPrice" type="number" placeholder="Selling Price" value={formData.sellingPrice} onChange={handleChange} required className="p-2 border rounded" />
            <input name="kmsDriven" type="number" placeholder="Kilometers Driven" value={formData.kmsDriven} onChange={handleChange} required className="p-2 border rounded" />

            <select name="fuel" value={formData.fuel} onChange={handleChange} required className="p-2 border rounded">
              {['Petrol', 'Diesel', 'CNG', 'Electric', 'LPG'].map((fuel) => (
                <option key={fuel} value={fuel}>{fuel}</option> 
              ))}
            </select>

            <select name="sellerType" value={formData.sellerType} onChange={handleChange} required className="p-2 border rounded">
              {['Dealer', 'Individual', 'Trustmark Dealer'].map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select name="transmission" value={formData.transmission} onChange={handleChange} required className="p-2 border rounded">
              {['Manual', 'Automatic'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <select name="owner" value={formData.owner} onChange={handleChange} required className="p-2 border rounded">
              {[
                'First Owner',
                'Second Owner',
                'Third Owner',
                'Fourth & Above Owner',
                'Test Drive Car',
              ].map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>

            <input name="location" type="text" placeholder="Location (City, State)" value={formData.location} onChange={handleChange} className="p-2 border rounded col-span-full" />

            <textarea name="description" placeholder="Description (optional)" value={formData.description} onChange={handleChange} className="p-2 border rounded col-span-full" rows="3" />
          </div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              {loading ? 'Submitting...' : 'Update Car'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Update;
