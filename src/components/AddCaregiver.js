import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom";
import getStrapiURL from "./functions/getStrapiURL";

function AddCaregiver() {
  const { babyId } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLinkExistingUser = async () => {
    const url = getStrapiURL() + "/api";
    const jwt = Cookies.get("jwt");
    try {
      const response = await axios.get(url + `/users?email=${email}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (response.data.length === 0) {
        setError("User with this email does not exist.");
      } else {
        // Send request to the user to become a caregiver
        await axios.post(
          url + `/caregiver-requests`,
          {
            baby: babyId,
            user: response.data[0].id,
          },
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        setSuccess("Request sent to the user.");
      }
    } catch (error) {
      console.error("Error linking existing user:", error);
      setError("An error occurred. Please try again.");
    }
  };

  const handleInviteNewUser = async () => {
    const url = getStrapiURL() + "/api";
    const jwt = Cookies.get("jwt");
    try {
      await axios.post(
        url + `/invite-caregiver`,
        {
          email,
          baby: babyId,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      setSuccess("Invitation sent to the user.");
    } catch (error) {
      console.error("Error inviting new user:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded p-6 min-h-screen flex flex-col justify-center">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Caregiver</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
      {success && <p className="text-green-500 text-xs italic mb-4">{success}</p>}
      <div className="flex justify-between">
        <button
          onClick={handleLinkExistingUser}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center mb-4 mr-2"
        >
          Link Existing User
        </button>
        <button
          onClick={handleInviteNewUser}
          className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center mb-4 ml-2"
        >
          Invite New User
        </button>
      </div>
      <button
        onClick={() => navigate(-1)}
        className="w-full p-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center justify-center"
      >
        Back
      </button>
    </div>
  );
}

export default AddCaregiver;