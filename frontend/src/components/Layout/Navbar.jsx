import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext.jsx';
import userIcon from '../../assets/icons/user.png'; // adjust if needed

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/buy', label: 'Buy' },
  { to: '/sell', label: 'Sell' },
  { to: '/login', label: 'Login/Signup' },
];

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null); // Attach to the dropdown menu container

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearUser();
    setShowMenu(false);
    navigate("/");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav
      className={`${
        isHome
          ? 'absolute top-0 left-0 w-full z-10 bg-transparent text-white'
          : 'sticky top-0 w-full z-10 bg-white shadow text-black'
      } px-10 py-4 flex justify-between items-center transition-colors duration-300`}
      aria-label="Main Navigation"
    >
      <div
        className="font-extrabold text-2xl tracking-tight cursor-pointer"
        onClick={() => navigate("/")}
      >
        Car
        <span className="text-blue-600">Trader</span>
      </div>

      <div className="flex items-center space-x-8">
        {navLinks.map(({ to, label }) =>
          user && label === 'Login/Signup' ? null : (
            <Link
              key={to}
              to={to}
              className={`relative px-3 py-1 rounded transition-colors duration-200
                ${location.pathname === to
                  ? 'text-blue-400 font-semibold after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-blue-600'
                  : 'hover:text-blue-500'}
                ${label.toLowerCase().includes('login') ? 'bg-blue-600 text-white hover:text-white hover:bg-blue-800' : ''}`}
              aria-current={location.pathname === to ? 'page' : undefined}
            >
              {label}
            </Link>
          )
        )}

        {user && (
          <div className="relative" ref={menuRef}>
            <img
              src={userIcon}
              alt="User"
              className="w-8 h-8 rounded-full cursor-pointer border-2 border-blue-600 object-cover"
              onClick={() => setShowMenu((prev) => !prev)}
            />
            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 text-black bg-white border border-gray-200 rounded shadow-lg z-50">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
