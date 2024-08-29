import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";

function EditFeeding() {
  const { babyId, feedingId } = useParams();
  const [time, setTime] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeeding = async () => {
      const jwt = Cookies.get("jwt");
      try {
        const response = await axios.get(
          `http://localhost:1337/api/feedings/${feedingId}`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        const { time, amount } = response.data.data.attributes;
        setTime(new Date(time).toISOString().slice(0, 16));
        setAmount(amount);
      } catch (error) {
        console.error("Error fetching feeding:", error.response);
        setError("Failed to fetch feeding. Please try again.");
      }
    };

    fetchFeeding();
  }, [feedingId]);

  const handleUpdateFeeding = async (e) => {
    e.preventDefault();
    const jwt = Cookies.get("jwt");

    if (!time || !amount) {
      setError("All fields are required");
      return;
    }

    try {
      await axios.put(
        `http://localhost:1337/api/feedings/${feedingId}`,
        {
          data: {
            time: time,
            amount: amount,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      // Redirect back to baby details after updating feeding
      navigate(`/baby/${babyId}`);
    } catch (error) {
      console.error("Error updating feeding:", error.response);
      setError("Failed to update feeding. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded p-6 min-h-screen flex flex-col justify-center">
      <form onSubmit={handleUpdateFeeding} className="space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Edit Feeding
        </h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="datetime-local"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Update Feeding
        </button>
      </form>
    </div>
  );
}

export default EditFeeding;