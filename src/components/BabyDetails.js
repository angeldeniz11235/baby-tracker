import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

function BabyDetails() {
  const { babyId } = useParams();
  const [baby, setBaby] = useState(null);
  const [diaperChanges, setDiaperChanges] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const jwt = Cookies.get("jwt");
    if (jwt) {
      axios
        .get(`http://localhost:1337/api/babies/${babyId}`, {
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
          `http://localhost:1337/api/diaper-changes?filters[baby]=${babyId}`,
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
    }
  }, [babyId]);

  if (!baby) return <div>Loading...</div>;

  //sort diaper changes by time in descending order
  diaperChanges.sort(
    (a, b) => new Date(b.attributes.time) - new Date(a.attributes.time)
  );

  const displayedDiaperChanges = expanded
    ? diaperChanges
    : diaperChanges.slice(0, 1);

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
      {diaperChanges.length === 0 && <p>No diaper changes recorded</p>}
      <div className="mb-4">
        {diaperChanges.length > 0 && (
          <>
            <h3 className="text-xl font-bold mb-2">Recent Diaper Changes</h3>
            {!expanded && (
              <ul className="space-y-2">
                {displayedDiaperChanges.map((change, index) => (
                  <li key={index} className="border-b pb-2">
                    <p>
                      <strong>Time:</strong>{" "}
                      {new Date(change.attributes.time).toLocaleString()}
                    </p>
                    <p>
                      <strong>Type:</strong> {change.attributes.type}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            {diaperChanges.length > 1 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="w-full p-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center justify-center mt-2"
              >
                <FontAwesomeIcon
                  icon={expanded ? faChevronUp : faChevronDown}
                  className="mr-2"
                />
                {expanded ? "Show Less" : "Show More"}
              </button>
            )}
            {expanded && (
                <div className="max-h-64 overflow-y-auto">
                <ul className="space-y-2">
                  {diaperChanges.map((change, index) => (
                    <li key={index} className="border-b pb-2">
                      <p>
                        <strong>Time:</strong>{" "}
                        {new Date(change.attributes.time).toLocaleString()}
                      </p>
                      <p>
                        <strong>Type:</strong> {change.attributes.type}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      
    </div>
  );
}

export default BabyDetails;
