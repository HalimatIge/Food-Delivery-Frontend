
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../config/axios";
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit, FiSave, FiX, FiLock, FiCheck, FiX as FiXIcon } from "react-icons/fi";
import { toast } from "react-toastify";
import { API_URL } from '../config/constants';

export default function UserProfile() {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  // Password validation function (same as registration)
  const validatePassword = (password) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*]/.test(password)
    };
    
    setPasswordRequirements(requirements);
    
    return requirements.minLength && 
           requirements.hasUpperCase && 
           requirements.hasNumber && 
           requirements.hasSpecialChar;
  };

  useEffect(() => {
    if (user) {
      const fullName = user.name || `${user.firstname || ''} ${user.lastname || ''}`.trim();
      
      setFormData({
        name: fullName,
        phone: user.phone || "",
        address: user.address || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate password in real-time when newPassword changes
    if (name === 'newPassword') {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

  

    // Validate passwords if changing password
    if (showPasswordFields) {
      if (!formData.currentPassword) {
        toast.error("Please enter your current password");
        setLoading(false);
        return;
      }

      if (formData.newPassword && !validatePassword(formData.newPassword)) {
        toast.error("New password must meet all requirements");
        setLoading(false);
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("New passwords do not match");
        setLoading(false);
        return;
      }
    }

    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      };

      if (showPasswordFields && formData.currentPassword && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

    
      // const response = await axios.put(
      //   `${API_URL}/api/auth/update-profile`,
      //   updateData,
      //   { 
      //     withCredentials: true
      //   }
      // );

      const response = await axios.put(
  `${API_URL}/api/auth/update-profile`,
  updateData,
  { 
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  }
);

    

      if (response.data.success) {
        setUser(response.data.user);
        
        setFormData(prev => ({
          ...prev,
          name: response.data.user.name || response.data.user.firstname + ' ' + response.data.user.lastname,
          phone: response.data.user.phone || "",
          address: response.data.user.address || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }));

        // Reset password requirements
        setPasswordRequirements({
          minLength: false,
          hasUpperCase: false,
          hasNumber: false,
          hasSpecialChar: false
        });

        toast.success("Profile updated successfully!");
        setIsEditing(false);
        setShowPasswordFields(false);
        
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("❌ Profile update error:", err);
      console.error("Error details:", err.response?.data);
      
      if (err.response?.status === 400) {
        toast.error(err.response.data.message || "Invalid data provided");
      } else if (err.response?.status === 401) {
        toast.error("Please log in again to update your profile.");
      } else {
        toast.error(err.response?.data?.message || "Failed to update profile");
      }
    } finally {
      setLoading(false);
    }
  };

  // Password requirement component
  const PasswordRequirements = () => (
    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
      <p className="text-sm font-medium text-gray-700 mb-2">Password must contain:</p>
      <div className="space-y-1">
        <div className={`flex items-center text-sm ${passwordRequirements.minLength ? 'text-green-600' : 'text-gray-500'}`}>
          {passwordRequirements.minLength ? <FiCheck className="mr-2" /> : <FiXIcon className="mr-2" />}
          At least 8 characters
        </div>
        <div className={`flex items-center text-sm ${passwordRequirements.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
          {passwordRequirements.hasUpperCase ? <FiCheck className="mr-2" /> : <FiXIcon className="mr-2" />}
          One uppercase letter (A-Z)
        </div>
        <div className={`flex items-center text-sm ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
          {passwordRequirements.hasNumber ? <FiCheck className="mr-2" /> : <FiXIcon className="mr-2" />}
          One number (0-9)
        </div>
        <div className={`flex items-center text-sm ${passwordRequirements.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
          {passwordRequirements.hasSpecialChar ? <FiCheck className="mr-2" /> : <FiXIcon className="mr-2" />}
          One special character (!@#$%^&*)
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5EB] to-[#FFE4D6] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-32 bg-gradient-to-r from-[#FF7B54] to-[#FF4C29]">
            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white flex items-center justify-center overflow-hidden">
                {user?.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser className="h-16 w-16 text-[#FF4C29]" />
                )}
              </div>
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                {isEditing ? "Edit Profile" : "My Profile"}
              </h1>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center text-[#FF4C29] hover:text-[#FF7B54] transition-colors"
                >
                  <FiEdit className="mr-2" /> Edit
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setShowPasswordFields(false);
                      // Reset password requirements
                      setPasswordRequirements({
                        minLength: false,
                        hasUpperCase: false,
                        hasNumber: false,
                        hasSpecialChar: false
                      });
                      // Reset form to current user data
                      const fullName = user.name || `${user.firstname || ''} ${user.lastname || ''}`.trim();
                      setFormData(prev => ({
                        ...prev,
                        name: fullName,
                        phone: user.phone || "",
                        address: user.address || "",
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: ""
                      }));
                    }}
                    className="flex items-center text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="mr-1" /> Cancel
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Full Name */}
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                        isEditing ? "border-gray-300" : "border-transparent bg-gray-50"
                      } focus:ring-2 focus:ring-[#FF4C29] focus:border-transparent transition-all duration-200`}
                      required
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-transparent bg-gray-50 text-gray-500"
                      disabled
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                        isEditing ? "border-gray-300" : "border-transparent bg-gray-50"
                      } focus:ring-2 focus:ring-[#FF4C29] focus:border-transparent transition-all duration-200`}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                      <FiMapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                        isEditing ? "border-gray-300" : "border-transparent bg-gray-50"
                      } focus:ring-2 focus:ring-[#FF4C29] focus:border-transparent transition-all duration-200`}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* Password Change Section */}
              {isEditing && (
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordFields(!showPasswordFields);
                      // Reset password requirements when closing
                      if (showPasswordFields) {
                        setPasswordRequirements({
                          minLength: false,
                          hasUpperCase: false,
                          hasNumber: false,
                          hasSpecialChar: false
                        });
                      }
                    }}
                    className="flex items-center text-[#FF4C29] hover:text-[#FF7B54] transition-colors mb-4"
                  >
                    <FiLock className="mr-2" />
                    {showPasswordFields ? "Cancel Password Change" : "Change Password"}
                  </button>

                  {showPasswordFields && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <input
                          id="currentPassword"
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF4C29] focus:border-transparent"
                          placeholder="Enter current password"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          id="newPassword"
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF4C29] focus:border-transparent"
                          placeholder="Enter new password"
                        />
                        {/* Password Requirements */}
                        {formData.newPassword && <PasswordRequirements />}
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          id="confirmPassword"
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF4C29] focus:border-transparent"
                          placeholder="Confirm new password"
                        />
                        {/* Show match status */}
                        {formData.newPassword && formData.confirmPassword && (
                          <div className={`mt-2 flex items-center text-sm ${
                            formData.newPassword === formData.confirmPassword ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formData.newPassword === formData.confirmPassword ? (
                              <FiCheck className="mr-2" />
                            ) : (
                              <FiXIcon className="mr-2" />
                            )}
                            Passwords {formData.newPassword === formData.confirmPassword ? 'match' : 'do not match'}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {isEditing && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`py-3 px-6 rounded-lg bg-gradient-to-r from-[#FF4C29] to-[#FF7B54] text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center ${
                      loading ? "opacity-75" : ""
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave className="mr-2" /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

