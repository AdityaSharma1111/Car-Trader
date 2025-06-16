import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
  RouterProvider,
  Outlet
} from 'react-router-dom';
import UserProvider from './context/UserContext';

import App from './App';

import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Home from './components/Pages/Home';
import Sell from './components/Pages/Sell';
import Buy from './components/Pages/Buy';
import SearchResults from './components/Pages/SearchResults';
import Profile from './components/Pages/Profile';
import CarInfo from './components/Pages/CarInfo';
import Update from './components/Pages/Update';
import { useContext } from 'react';
import { UserContext } from './context/UserContext';
import './index.css';

const ProtectedRoute = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return null; // or a spinner if you want

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicRoute = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return null; // or a spinner

  return user ? <Navigate to="/" replace /> : <Outlet />;
};


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>

      {/* Publicly Accessible */}
      <Route index element={<Home />} />
      <Route path="search" element={<SearchResults />} />
      <Route path="car/:carId" element={<CarInfo />} />


      {/* Public Routes (only if NOT authenticated) */}
      <Route element={<PublicRoute />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>

      {/* Protected Routes (only if authenticated) */}
      <Route element={<ProtectedRoute />}>
        <Route path="profile" element={<Profile />} />
        <Route path="sell" element={<Sell />} />
        <Route path="buy" element={<Buy />} />
        <Route path="update/:carId" element={<Update />} />
      </Route>

    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
);
