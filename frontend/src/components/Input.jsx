import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

function Input({ type, placeholder, value, onChange, label }) {
    const [showPassword, setShowPassword] = useState(false);
    
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="w-full">
            <label className="block text-gray-700 font-medium mb-1">{label}</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <input
                    type={type === "password" ? (showPassword ? "text" : "password") : type}
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e)}
                    className="w-full outline-none bg-transparent"
                />
                {type === "password" && (
                    <>
                        {showPassword ? (
                            <FaRegEye
                                size={20}
                                className="text-gray-500 cursor-pointer"
                                onClick={toggleShowPassword}
                            />
                        ) : (
                            <FaRegEyeSlash
                                size={20}
                                className="text-gray-500 cursor-pointer"
                                onClick={toggleShowPassword}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Input;
