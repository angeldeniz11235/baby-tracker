// src/App.js
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link,
} from "react-router-dom";
import Cookies from "js-cookie";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import NewBaby from "./components/NewBaby";
import BabyDetails from "./components/BabyDetails";
import DiaperChange from "./components/DiaperChange";
import EditDiaperChange from "./components/EditDiaperChange";
import Feeding from "./components/Feeding";
import EditFeeding from "./components/EditFeeding";
import ProtectedRoute from "./components/ProtectedRoute";
import Metrics from "./components/Metrics";
import BackButton from "./components/BackButton";
import AddCaregiver from "./components/AddCaregiver";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const jwt = Cookies.get("jwt");
    if (jwt) {
      navigate("/dashboard"); // Redirect to dashboard if JWT exists
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    Cookies.remove("jwt");
    navigate("/");
  };

  return (
    <div>
      <nav className="bg-gray-100 p-4 flex justify-between items-center border-b border-gray-300">
        <div className="flex items-center">
          <BackButton /> {/* Add BackButton here */}
          <Link
            to="/dashboard"
            className="ml-4 text-blue-500 font-bold hover:underline"
          >
            Dashboard
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Logout
        </button>
      </nav>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/new-baby" element={<NewBaby />} />
        <Route path="/baby/:babyId" element={<BabyDetails />} />
        <Route path="/baby/:babyId/diaper-change" element={<DiaperChange />} />
        <Route
          path="/baby/:babyId/diaper-change/edit/:changeId"
          element={<EditDiaperChange />}
        />
        <Route path="/baby/:babyId/feeding" element={<Feeding />} />
        <Route
          path="/baby/:babyId/feeding/edit/:feedingId"
          element={<EditFeeding />}
        />
        <Route path="/baby/:babyId/metrics" element={<Metrics />} />
        <Route path="/baby/:babyId/add-caregiver" element={<AddCaregiver />} />
      </Routes>
    </div>
  );
}

const basename = process.env.REACT_APP_ENVIRONMENT === 'DEV' ? '/' : '/babytracker';
console.log(`Environment: ${process.env.REACT_APP_ENVIRONMENT}`);
console.log(`Basename: ${basename}`);
export default function AppWrapper() {
  return (
    <Router basename={basename}>
      <App />
    </Router>
  );
}
