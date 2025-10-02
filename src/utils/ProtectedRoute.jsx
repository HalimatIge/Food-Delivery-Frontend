// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ isAuthenticated, children }) {
//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   }
//   return children;
// }

// utils/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5005/api/auth/dashboard", {
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
