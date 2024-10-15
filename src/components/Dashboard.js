import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Logout from "./Logout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import getStrapiURL from "./functions/getStrapiURL";

function Dashboard() {
  const [babies, setBabies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBaby, setSelectedBaby] = useState(null);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(true);


  useEffect(() => {
    const url = getStrapiURL() + "/api/babies";
    console.log("dashboard url: ", url);
    const fetchBabies = async () => {
      const jwt = Cookies.get("jwt");
      if (!jwt) {
        setIsAuthenticated(false);
        navigate("/");
      } else {
        try {
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });
          if (response.data && Array.isArray(response.data.data)) {
            setBabies(response.data.data);
          } else {
            setBabies([]);
          }
        } catch (error) {
          console.error("Error fetching babies:", error);
          setBabies([]);
        }
      }
    };

    fetchBabies();
  }, [navigate]);

  const handleNewBaby = (e) => {
    e.preventDefault();
    navigate("/new-baby");
  };

  const handleDeleteBaby = async (babyId) => {
    const url = getStrapiURL() + "/api/babies";
    const jwt = Cookies.get("jwt");
    try {
      await axios.delete(url + `/${babyId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setBabies(babies.filter((baby) => baby.id !== babyId));
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting baby:", error);
    }
  };

  const openModal = (baby) => {
    setSelectedBaby(baby);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedBaby(null);
    setShowModal(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded p-6 min-h-screen flex flex-col justify-center">
      <h2 className="text-2xl font-bold mb-4 text-center">Dashboard</h2>
      {babies.length === 0 ? (
        <button
          onClick={handleNewBaby}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          New Baby
        </button>
      ) : (
        <div className="space-y-4">
          {babies.map((baby) => (
            <div
              key={baby.id}
              className="block w-full p-4 bg-gray-100 rounded shadow hover:bg-gray-200 cursor-pointer relative"
              onClick={() => navigate(`/baby/${baby.id}`)}
            >
              <span className="text-lg font-semibold">{baby.attributes.name}</span>
              <FontAwesomeIcon
                icon={faTrash}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(baby);
                }}
              />
            </div>
          ))}
          <button
            onClick={handleNewBaby}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            New Baby
          </button>
        </div>
      )}
      <Logout isAuthenticated={isAuthenticated} />

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-xl mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete {selectedBaby.attributes.name}?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => handleDeleteBaby(selectedBaby.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;