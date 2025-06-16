import React, { useState, useContext } from 'react';
import Input from '../Input.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { API_PATHS } from '../../utils/ApiPaths';
import axiosInstance from '../../utils/axiosInstance.js';
import { UserContext } from '../../context/UserContext.jsx';
import { toast } from 'react-hot-toast';

function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const {setUser} = useContext(UserContext)

  const validateEmail = (email) => {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email) || false;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!fullName) {
      setError('Name is required');
      return;
    }
    if(!phoneNo) {
      setError('Phone number is required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Invalid email address');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    // Send a POST request to the server
    // console.log(fullName, email, password, profilePic);

    let toastId;
    const payload = {
      fullName,
      phoneNo,
      email,
      password,
    };
    try {
      toastId = toast.loading('Creating your account...');

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, payload);

      
      // console.log("Signup Response:", response.data);
      const { accessToken, user } = response.data.data;
      // console.log("Response Data:", response.data.data);
      
      // console.log("Access Token:", accessToken);

      if(accessToken) {
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        toast.success('Account created!', { id: toastId });
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
      toast.error('Signup failed', { id: toastId });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">Create an Account</h3>
          <form onSubmit={handleSignup} className="space-y-4">

            <div className="flex flex-col space-y-3">
              <Input
                type={'text'}
                value={fullName}
                setValue={setFullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={'Name'}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Input 
                label="Email Address"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Input
                type={'text'}
                value={phoneNo}
                setValue={setPhoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                placeholder={'Phone Number'}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Input 
                label="Password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Input 
                label="Confirm Password"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </div>

            <button 
              type='submit' 
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Create Account
            </button>
          </form>
          <p className="text-center text-gray-800 mt-4">
            Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Signup;
