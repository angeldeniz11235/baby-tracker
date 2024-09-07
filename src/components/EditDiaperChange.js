import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import getStrapiURL from "./functions/getStrapiURL";

function EditDiaperChange() {
  const { babyId, changeId } = useParams();
  const [time, setTime] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiaperChange = async () => {
      const jwt = Cookies.get("jwt");
      try {
        const url = getStrapiURL() + "/api";
        const response = await axios.get(
          url + `/diaper-changes/${changeId}`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        const { time, type } = response.data.data.attributes;
        // Convert UTC time to local time
        const utcDate = new Date(time);
        //convert to local time
        const now = new Date();
        const offset = now.getTimezoneOffset();
        const localTime = new Date(utcDate.getTime() - offset * 60 * 1000);
        //const localTime = utcDate;
        setTime(localTime.toISOString().slice(0, 16));
        setType(type);
      } catch (error) {
        console.error("Error fetching diaper change:", error.response);
        setError("Failed to fetch diaper change. Please try again.");
      }
    };

    fetchDiaperChange();
  }, [changeId]);

  const handleInputChange = (e) => {
    setTime(e.target.value);
  };

  const handleUpdateDiaperChange = async (e) => {
    e.preventDefault();
    const jwt = Cookies.get("jwt");

    if (!time || !type) {
      setError("All fields are required");
      return;
    }

    try {
      const url = getStrapiURL() + "/api";
      // Convert local time to UTC
      const localDate = new Date(time);
      const utcDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);

      await axios.put(
        url + `/diaper-changes/${changeId}`,
        {
          data: {
            time: utcDate.toISOString(),
            type: type,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      // Redirect back to baby details after updating diaper change
      navigate(`/baby/${babyId}`);
    } catch (error) {
      console.error("Error updating diaper change:", error.response);
      setError("Failed to update diaper change. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded p-6 min-h-screen flex flex-col justify-center">
      <form onSubmit={handleUpdateDiaperChange} className="space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Edit Diaper Change
        </h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="datetime-local"
          value={time}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        >
          <option value="">Select Type</option>
          <option value="Wet">Wet</option>
          <option value="Soiled">Soiled</option>
          <option value="Both">Both</option>
        </select>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Update Diaper Change
        </button>
      </form>
    </div>
  );
}

export default EditDiaperChange;