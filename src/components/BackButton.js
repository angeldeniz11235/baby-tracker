import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="p-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center"
    >
      <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
      Back
    </button>
  );
};

export default BackButton;