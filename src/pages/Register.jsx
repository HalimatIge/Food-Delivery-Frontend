import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../config/axios";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiChevronLeft } from "react-icons/fi";
import { API_URL } from '../config/constants';
export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email"); 
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    password: "",
    confirmPassword: "",

  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);


const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

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
      // await axios.post(`${API_URL}/api/auth/send-otp`, { email });
      await axios.post(`${API_URL}/api/auth/send-otp`, { email }, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});
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
      // await axios.post(`${API_URL}/api/auth/verify-otp`, { email, otp: otpCode });
      await axios.post(`${API_URL}/api/auth/verify-otp`, { email, otp: otpCode }, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});
      setStep("form");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };
const handleRegister = async () => {
  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  if (!passwordRegex.test(formData.password)) {
    setError("Password must be at least 8 characters long and contain a capital letter, number, and special character.");
    return;
  }

  try {
    setLoading(true);
    setError("");
    const otpCode = otp.join('');
    
    console.log('Registering user:', {
      email,
      firstname: formData.firstname,
      lastname: formData.lastname
    });

    // const res = await axios.post(`${API_URL}/api/auth/register`, {
    //   ...formData,
    //   email,
    //   otp: otpCode,
    // });
const res = await axios.post(`${API_URL}/api/auth/register`, {
  ...formData,
  email,
  otp: otpCode,
}, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});
    console.log('Registration response:', res.data);

    
    if (res.data.success) {
      
      setFormData({ firstname: "", lastname: "", password: "", confirmPassword: "" });
      setOtp(["", "", "", "", "", ""]);
      setEmail("");
      setStep("email");
      
   
      navigate("/login", { 
        state: { 
          registrationSuccess: true,
          email: email 
        } 
      });
    } else {
      setError(res.data.message || "Registration failed");
    }
  } catch (err) {
    console.error('Registration error:', err.response?.data);
    setError(err.response?.data?.message || "Registration failed");
  } finally {
    setLoading(false);
  }
};

  
  const goBack = () => {
    if (step === "otp") {
      setStep("email");
    } else if (step === "form") {
      setStep("otp");
    }
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
        
        {/* Form side */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-[#FF4C29] flex items-center justify-center">
                <FiUser className="h-6 w-6 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {step === "email" ? "Create Account" 
               : step === "otp" ? "Verify Email" 
               : "Complete Profile"}
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

          {step === "form" && (
            <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="firstname"
                        type="text"
                        placeholder="First Name"
                        value={formData.firstname}
                        onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF4C29] focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="lastname"
                        type="text"
                        placeholder="Last Name"
                        value={formData.lastname}
                        onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF4C29] focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF4C29] focus:border-transparent transition-all duration-200"
                      required
                      minLength="6"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FiLock className="h-5 w-5 text-gray-400" />
    </div>
    <input
      id="confirmPassword"
      type={showPassword ? "text" : "password"}
      placeholder="••••••••"
      value={formData.confirmPassword}
      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
      className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF4C29] focus:border-transparent transition-all duration-200"
      required
    />
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
                  disabled={loading || !formData.firstname || !formData.lastname || !formData.password}
                  className={`flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-[#FF4C29] to-[#FF7B54] text-white font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center ${
                    loading || !formData.firstname || !formData.lastname || !formData.password ? "opacity-75" : ""
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registering...
                    </>
                  ) : (
                    'Register Now'
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

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <a href="#" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
              <div>
                <a href="#" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-[#FF4C29] hover:text-[#FF7B54] transition-colors duration-200">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

