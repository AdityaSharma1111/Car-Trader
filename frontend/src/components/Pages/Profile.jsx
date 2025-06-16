import React, { useContext, useEffect, useState } from 'react';
import {
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  UserCircleIcon,
  StarIcon,
  CircleStackIcon,
  CalendarDaysIcon,
  InboxStackIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/ApiPaths';
import Modal from '../Modal';
import CarListItem from '../Cards/CarListItem';
import InfoCard from '../Cards/InfoCard';
import RecBookingsItem from '../Cards/RecBookingsItem';


// User Detail line
function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-center text-gray-600">
      {icon}
      <span className="ml-3">
        <span className="font-semibold">{label}:</span> {value}
      </span>
    </div>
  );
}

function Profile() {
  const { user } = useContext(UserContext);
  
  const [favoriteCars, setFavoriteCars] = useState([]);
  const [bookedCarDetails, setBookedCarDetails] = useState([]);
  const [myCars, setMyCars] = useState([]);
  const [recBookings, setRecBookings] = useState([]);

  const [selectedBooking, setSelectedBooking] = useState(null);


  useEffect(() => {
    const fetchCarsByIds = async (ids, setter) => {
      try {
        if (!ids.length) return;
        const res = await axiosInstance.post(API_PATHS.CAR.GET_CARS_BY_IDS, { ids });
        setter(res.data.cars);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    const fetchReceivedBookings = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.USER.GET_RECEIVED_BOOKINGS);
        setRecBookings(
          res.data.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        );
      } catch (error) {
        console.error('Error fetching received bookings:', error);
      }
    };

    if (user?.favorites) {
      fetchCarsByIds(user.favorites, setFavoriteCars);
    }
    if (user?.bookedCars) {
      fetchCarsByIds(user.bookedCars, setBookedCarDetails);
    }
    if(user?.myCars) {
      fetchCarsByIds(user.myCars, setMyCars);
    }

    if (user?._id) {
      fetchReceivedBookings();
    }

  }, [user]);



  if (!user) {
    return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
  }

  // console.log("My cars: ", myCars);
  

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left column */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-2xl shadow-md p-6 text-center relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-indigo-600">
              <PencilSquareIcon className="h-6 w-6" />
            </button>
            <img
              className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-indigo-100"
              src={`https://ui-avatars.com/api/?name=${user.fullName}&background=random&font-size=0.33`}
              alt="User Avatar"
            />
            <h1 className="text-2xl font-bold text-gray-900">{user.fullName}</h1>
            <p className="text-md text-gray-500">{user.email}</p>
            <hr className="my-6" />
            <div className="space-y-4 text-left">
              <DetailItem icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />} label="Email" value={user.email} />
              <DetailItem icon={<DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" />} label="Phone" value={user.phoneNo} />
              <DetailItem icon={<UserCircleIcon className="h-5 w-5 text-gray-400" />} label="Member Since" value="Jan 2024" />
            </div>
          </div>

          <InfoCard title="My Cars" icon={<CircleStackIcon className="h-6 w-6 text-indigo-500" />}>
            <div className="space-y-4">
              {myCars.length > 0 ? (
                myCars.map((car) => <CarListItem
                  car={car}
                  showEdit={true}       // shows edit button
                  isMyCar={true}        // enables delete functionality
                  onRemove={(id) => {
                    // remove the deleted car from UI
                    setMyCars((prevCars) => prevCars.filter((c) => c._id !== id));
                  }}
                />
                )
              ) : (
                <p className="text-gray-500 p-3 text-center">You haven't added any cars yet.</p>
              )}
            </div>
          </InfoCard>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoCard title="Favorite Cars" icon={<StarIcon className="h-6 w-6 text-indigo-500" />}>
              <div className="space-y-4">
                {favoriteCars.length > 0 ? (
                  favoriteCars.map((car) => <CarListItem
                      key={car._id}
                      car={car}
                      isFavorite={true}
                      onRemove={(id) =>
                        setFavoriteCars((prev) => prev.filter((car) => car._id !== id))
                      }
                    />)
                ) : (
                  <p className="text-gray-500 p-3 text-center">No favorite cars found.</p>
                )}
              </div>
            </InfoCard>

            <InfoCard title="Booked Cars" icon={<CalendarDaysIcon className="h-6 w-6 text-indigo-500" />}>
              <div className="space-y-4">
                {bookedCarDetails.length > 0 ? (
                  bookedCarDetails.map((car) => <CarListItem
                    key={car._id}
                    car={car}
                    isBooking={true}
                    onRemove={(id) =>
                      setBookedCarDetails((prev) => prev.filter((car) => car._id !== id))
                    }
                  />)
                ) : (
                  <p className="text-gray-500 p-3 text-center">You have no upcoming bookings.</p>
                )}
              </div>
            </InfoCard>
          </div>

          <InfoCard title="Received Bookings" icon={<InboxStackIcon className="h-6 w-6 text-indigo-500" />}>
            <div className="space-y-3">
              {recBookings.length > 0 ? (
                recBookings.map((booking, index) => (
                  <RecBookingsItem
                    key={index}
                    text={`${booking.bookedBy.fullName} booked ${booking.car.name} on ${new Date(booking.timestamp).toLocaleDateString()}`}
                    hasAction
                    onClick={() => setSelectedBooking(booking)}
                  />
                ))
              ) : (
                <p className="text-gray-500 p-3 text-center">No bookings received.</p>
              )}
            </div>
          </InfoCard>
        </div>
      </div>
      {selectedBooking && (
        <Modal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}

export default Profile;
