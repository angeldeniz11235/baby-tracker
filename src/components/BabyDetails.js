import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faChevronDown,
  faChevronUp,
  faTrash,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";
import getStrapiURL from "./functions/getStrapiURL";

function BabyDetails() {
  const { babyId } = useParams();
  const navigate = useNavigate();
  const [baby, setBaby] = useState(null);
  const [diaperChanges, setDiaperChanges] = useState([]);
  const [feedings, setFeedings] = useState([]);
  const [expandedDiaperChanges, setExpandedDiaperChanges] = useState(false);
  const [expandedFeedings, setExpandedFeedings] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [entryType, setEntryType] = useState("");

  useEffect(() => {
    const url = getStrapiURL() + "/api";

    console.log("baby details url: ", url);

    const jwt = Cookies.get("jwt");
    if (jwt) {
      axios
        .get( url + `/babies/${babyId}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then((response) => {
          setBaby(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching baby details:", error.response);
        });

      axios
        .get(
          url + `/diaper-changes?filters[baby]=${babyId}`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        )
        .then((response) => {
          setDiaperChanges(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching diaper changes:", error.response);
        });

      // Fetch feedings
      axios
        .get( url + `/feedings?filters[baby]=${babyId}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then((response) => {
          setFeedings(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching feedings:", error.response);
        });
    }
  }, [babyId]);

  if (!baby) return <div>Loading...</div>;

  // Sort diaper changes by time in descending order
  diaperChanges.sort(
    (a, b) => new Date(b.attributes.time) - new Date(a.attributes.time)
  );

  // Sort feedings by time in descending order
  feedings.sort(
    (a, b) => new Date(b.attributes.time) - new Date(a.attributes.time)
  );

  const displayedDiaperChanges = expandedDiaperChanges
    ? diaperChanges
    : diaperChanges.slice(0, 1);

  const displayedFeedings = expandedFeedings ? feedings : feedings.slice(0, 1);

  const openModal = (entry, type) => {
    setSelectedEntry(entry);
    setEntryType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedEntry(null);
    setEntryType("");
    setShowModal(false);
  };

  const handleDeleteEntry = async () => {
    const url = getStrapiURL() + "/api";
    const jwt = Cookies.get("jwt");
    try {
      await axios.delete(
        url + `/${entryType}/${selectedEntry.id}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (entryType === "diaper-changes") {
        setDiaperChanges(
          diaperChanges.filter((change) => change.id !== selectedEntry.id)
        );
      } else if (entryType === "feedings") {
        setFeedings(
          feedings.filter((feeding) => feeding.id !== selectedEntry.id)
        );
      }
      closeModal();
    } catch (error) {
      console.error(`Error deleting ${entryType}:`, error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded p-6 min-h-screen flex flex-col justify-center">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {baby.attributes.name}'s Details
      </h2>
      <p className="mb-2">
        <strong>Date of Birth:</strong> {baby.attributes.date_of_birth}
      </p>
      <p className="mb-4">
        <strong>Gender:</strong> {baby.attributes.gender}
      </p>
      <Link
        to={`/baby/${babyId}/diaper-change`}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center mb-4"
      >
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        Add Diaper Change
      </Link>
      <Link
        to={`/baby/${babyId}/feeding`}
        className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center mb-4"
      >
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        Add Feeding
      </Link>
      {diaperChanges.length === 0 && <p>No diaper changes recorded</p>}
      <div className="mb-4 bg-gray-100 p-4 rounded">
        {diaperChanges.length > 0 && (
          <>
            <h3 className="text-xl font-bold mb-2">Recent Diaper Changes</h3>
            <ul className="space-y-2">
              {displayedDiaperChanges.map((change, index) => (
                <li key={index} className="border-b pb-2 relative">
                  <p>
                    <strong>Time:</strong>{" "}
                    {(() => {
                      const utcDate = new Date(change.attributes.time);
                      const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
                      return localDate.toLocaleString();
                    })()}
                  </p>
                  <p>
                    <strong>Type:</strong> {change.attributes.type}
                  </p>
                  <Link
                    to={`/baby/${babyId}/diaper-change/edit/${change.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </Link>
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={() => openModal(change, "diaper-changes")}
                  />
                </li>
              ))}
            </ul>
            {diaperChanges.length > 1 && (
              <button
                onClick={() => setExpandedDiaperChanges(!expandedDiaperChanges)}
                className="w-full p-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center justify-center mt-2"
              >
                <FontAwesomeIcon
                  icon={expandedDiaperChanges ? faChevronUp : faChevronDown}
                  className="mr-2"
                />
                {expandedDiaperChanges ? "Show Less" : "Show More"}
              </button>
            )}
          </>
        )}
      </div>

      {/* Add Feeding section */}
      {feedings.length === 0 && <p>No feedings recorded</p>}
      <div className="mb-4 bg-gray-200 p-4 rounded">
        {feedings.length > 0 && (
          <>
            <h3 className="text-xl font-bold mb-2">Recent Feedings</h3>
            <ul className="space-y-2">
              {displayedFeedings.map((feeding, index) => (
                <li key={index} className="border-b pb-2 relative">
                  <p>
                    <strong>Time:</strong>{" "}
                    {(() => {
                      const utcDate = new Date(feeding.attributes.time);
                      const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
                      return localDate.toLocaleString();
                    })()}
                  </p>
                  <p>
                    <strong>Amount:</strong> {feeding.attributes.amount} ml
                  </p>
                  <Link
                    to={`/baby/${babyId}/feeding/edit/${feeding.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </Link>
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={() => openModal(feeding, "feedings")}
                  />
                </li>
              ))}
            </ul>
            {feedings.length > 1 && (
              <button
                onClick={() => setExpandedFeedings(!expandedFeedings)}
                className="w-full p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 flex items-center justify-center mt-2"
              >
                <FontAwesomeIcon
                  icon={expandedFeedings ? faChevronUp : faChevronDown}
                  className="mr-2"
                />
                {expandedFeedings ? "Show Less" : "Show More"}
              </button>
            )}
          </>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-xl mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this entry?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={handleDeleteEntry}
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
      <Link
        to={`/baby/${babyId}/metrics`}
        className="w-full p-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center justify-center mb-4"
      >
        <FontAwesomeIcon icon={faChartBar} className="mr-2" />
        View Metrics
      </Link>
      <button
        onClick={() => navigate(`/baby/${babyId}/add-caregiver`)}
        className="w-full p-2 bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center justify-center mb-4"
      >
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        Add Caregiver
      </button>
    </div>
  );
}

export default BabyDetails;