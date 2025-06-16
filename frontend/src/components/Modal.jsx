import React, { useState } from 'react';

function BookingDetailsModal({ booking, onClose }) {
  if (!booking) return null;

  const { bookedBy, car, timestamp } = booking;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>
        <h2 className="text-xl font-bold mb-4 text-indigo-600">Booking Details</h2>
        
        <p><strong>Name:</strong> {bookedBy.fullName}</p>
        <p><strong>Email:</strong> {bookedBy.email}</p>
        <p><strong>Phone:</strong> {bookedBy.phoneNo}</p>
        <hr className="my-3" />
        <p><strong>Car:</strong> {car.name}</p>
        <p><strong>Year:</strong> {car.year}</p>
        <p><strong>Price:</strong> ₹{car.sellingPrice.toLocaleString('en-IN')}</p>
        <p><strong>Booked On:</strong> {new Date(timestamp).toLocaleString()}</p>
      </div>
    </div>
  );
}

export default BookingDetailsModal