import React, { useState, useContext } from 'react'
import Input from '../Input'
import { Link, useNavigate } from 'react-router-dom'
import { API_PATHS } from '../../utils/ApiPaths'
import axiosInstance from '../../utils/axiosInstance.js'
import { UserContext } from '../../context/UserContext.jsx'
import { toast } from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const { setUser } = useContext(UserContext)

  const navigate = useNavigate()
  
  const validateEmail = (email) => {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email) || 
            false;
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    if(!validateEmail(email)) {
      setError("Invalid email address")
      return
    }
    if(!password) {
      setError("Password is required")
      return
    }
    setError("")
    let toastId;
    try {
      // Send a POST request to the server
      try {
        toastId = toast.loading('Logging you in... Please wait.');
        const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
          email,
          password
        });
        
        // console.log("Login Response:", response.data);
        
        const { accessToken, user } = response.data.data;
        // console.log("Full response:", response);
        // console.log("Response.data:", response.data);

        // console.log("Access Token:", accessToken);
        // console.log("User Data:", user);
        
        if (accessToken) {
          localStorage.setItem("token", accessToken);
          localStorage.setItem("user", JSON.stringify(user));
          setUser(user);
          toast.success('Welcome Back!!', { id: toastId });
          navigate("/");
        }
      } catch (error) {      
        console.log(error);
        setError(error.response.data.message)
        toast.error('Signup failed', { id: toastId });
      }

    
    } catch (error) {
      console.log(error);
      setError(error.response.data.message)
    }
  }
  
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">Welcome Back!!</h3>
          <p className="text-gray-600 text-center mb-6">Please enter your details:</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input 
              label="Email Address"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Login
            </button>

            <p className="text-gray-600 text-center">
              Don't have an account? 
              <Link to="/signup" className="text-blue-500 hover:underline ml-1">Signup</Link>
            </p>
          </form>
        </div>
      </div>

    </>
  )
}

export default Login