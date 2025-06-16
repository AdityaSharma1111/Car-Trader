export const BASE_URL = "http://localhost:5174";
export const API_PATHS = {
    AUTH: {
        LOGIN: "/api/v1/auth/login",
        REGISTER: "/api/v1/auth/register"
    },
    USER: {
        GET_CURRENT_USER: "/api/v1/user/current",
        GET_MY_CARS: "/api/v1/user/myCars",
        GET_FAVORITES: "/api/v1/user/favorites",
        ADD_TO_FAVORITES: (carId) => `/api/v1/user/favorites/${carId}`,
        REMOVE_FROM_FAVORITES: (carId) => `/api/v1/user/favorites/${carId}`,
        GET_BOOKINGS: "/api/v1/user/bookings",
        ADD_BOOKING: (carId) => `/api/v1/user/bookings/${carId}`,
        REMOVE_BOOKING: (bookingId) => `/api/v1/user/bookings/${bookingId}`,
        GET_RECEIVED_BOOKINGS: "/api/v1/user/received-bookings"
    },
    CAR: {
        GET_ALL_CARS: "/api/v1/cars",
        GET_CAR_BY_ID: (carId) => `/api/v1/cars/${carId}`,
        GET_CARS_BY_IDS: "/api/v1/cars/getByIds",
        CREATE_CAR: "/api/v1/cars/create",
        UPDATE_CAR: (carId) => `/api/v1/cars/update/${carId}`,
        DELETE_CAR: (carId) => `/api/v1/cars/${carId}`,
        GET_SIMILAR_CARS: (carId) => `/api/v1/cars/similar/${carId}`
    }
};