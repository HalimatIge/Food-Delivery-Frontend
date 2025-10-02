
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from '../config/constants';

const ProtectedRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/api/auth/dashboard`, {
      withCredentials: true,
    }).then((res) => {
      if (res.data.status) {
        setValid(true);
      }
      setChecking(false);
    }).catch(() => {
      setChecking(false);
    });
  }, []);

  if (checking) return <p>Loading...</p>;
  if (!valid) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
