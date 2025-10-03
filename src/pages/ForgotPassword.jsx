import React, { useState } from "react";
import axios from "../config/axios";
import {FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiChevronLeft } from "react-icons/fi";
import { useNavigate ,Link} from "react-router-dom";
import { toast } from "react-toastify";
import { API_URL } from '../config/constants';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const sendOtp = async () => {
    try {
      setLoading(true);
      setError("");
      await axios.post(`${API_URL}/api/auth/forgot-password/send-otp`, { email },
        {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
}
      );
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      setError("");
      const otpCode = otp.join('');
      console.log('Verifying OTP:', { email, otp: otpCode });
  const response = await axios.post(`${API_URL}/api/auth/verify-otp`, { 
      email, 
      otp: otpCode 
    },{
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});
    
    console.log('OTP Verification Response:', response.data);
      setStep("reset");
    } catch (err) {
        console.error('OTP Verification Error:', err.response?.data);
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };


  const validatePassword = (pwd) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(pwd);
  };

  const resetPassword = async () => {
    const otpCode = otp.join('');

    if (!validatePassword(password)) {
      return setError("Password must be at least 8 characters, contain an uppercase letter, number, and special character.");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);
      setError("");
      console.log('Reset Password Data:', {
      email,
      otp: otpCode,
      newPassword: password
    });

      const res = await axios.post(`${API_URL}/api/auth/reset-password`, {
        email,
        otp: otpCode,
        newPassword: password,
      },
      {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
}
    );
       console.log('Reset Password Response:', res.data);

      if (res.data.success) {
        toast.success("Password reset successful! You can now log in.");
        setEmail("");
        setOtp(["", "", "", "", "", ""]);
        setPassword("");
        setConfirmPassword("");
        navigate("/login", { state: { passwordReset: true } });
      } else {
        setError(res.data.message);
      }
    } catch (err) {
       console.error('Reset Password Error:', err.response?.data);
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step === "otp") setStep("email");
    else if (step === "reset") setStep("otp");
  };

  return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF5EB] to-[#FFE4D6] px-4 py-8">
  <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
      {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FF7B54] to-[#FF4C29]"></div>
        

     {/* Illustration side */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#FF4C29] to-[#FF7B54] items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-white"></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-white"></div>
            <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-white"></div>
          </div>
          <div className="relative z-10 text-center">
            <img 
              src="/assets/chefbro.svg" 
              alt="Culinary Illustration" 
              className="w-full max-w-xs mx-auto mb-8 transform hover:scale-105 transition-transform duration-500" 
            />
            <h3 className="text-2xl font-bold text-white mb-2">Welcome to QuickPlate</h3>
            <p className="text-white opacity-90">Join our culinary community today</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-[#FF4C29] flex items-center justify-center">
                <FiMail className="h-6 w-6 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {step === "email" ? "Forgot Password" 
               : step === "otp" ? "Enter OTP" 
               : "Reset Password"}
            </h2>
            <p className="text-gray-600">
              {step === "email" ? "Enter your email to begin" 
               : step === "otp" ? `Enter the OTP sent to ${email}` 
               : "Fill in your details to complete registration"}
            </p>
          </div>

          {step === "email" && (
            <form onSubmit={(e) => { e.preventDefault(); sendOtp(); }} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF4C29] focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className={`w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[#FF4C29] to-[#FF7B54] text-white font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center ${
                  loading || !email ? "opacity-75" : ""
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending OTP...
                  </>
                ) : (
                  'Send OTP'
                )}
              </button>
            </form>
          )}


           {step === "otp" && (
                      <form onSubmit={(e) => { e.preventDefault(); verifyOtp(); }} className="space-y-6">
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                            <div className="flex justify-between space-x-2">
                              {otp.map((digit, index) => (
                                <input
                                  key={index}
                                  id={`otp-${index}`}
                                  type="text"
                                  maxLength="1"
                                  value={digit}
                                  onChange={(e) => handleOtpChange(e, index)}
                                  className="w-12 h-12 text-center text-2xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4C29] focus:border-transparent"
                                  pattern="\d*"
                                  inputMode="numeric"
                                  required
                                />
                              ))}
                            </div>
                          </div>
                        </div>
          
                        <div className="flex space-x-3">
                          <button
                            type="button"
                            onClick={goBack}
                            className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
                          >
                            <FiChevronLeft className="mr-2" /> Back
                          </button>
                          <button
                            type="submit"
                            disabled={loading || otp.some(d => d === "")}
                            className={`flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-[#FF4C29] to-[#FF7B54] text-white font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center ${
                              loading || otp.some(d => d === "") ? "opacity-75" : ""
                            }`}
                          >
                            {loading ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Verifying...
                              </>
                            ) : (
                              'Continue'
                            )}
                          </button>
                        </div>
                      </form>
                    )}

        

          {error && (
            <div className="rounded-md bg-red-50 p-4 mt-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          {step === "reset" && (
          <form onSubmit={(e) => { e.preventDefault(); resetPassword(); }} className="space-y-4">
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border pl-10 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <span
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border pl-10 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={goBack}
                className="flex-1 border py-2 rounded text-gray-600"
              >
                <FiChevronLeft className="inline" /> Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#FF4C29] text-white py-2 rounded hover:bg-[#FF7B54]"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        )}
        

         
        </div>
       


  </div>
</div>
  );
}
