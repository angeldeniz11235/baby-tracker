import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { Bar, Line } from "react-chartjs-2";
import 'chart.js/auto';
import getStrapiURL from "./functions/getStrapiURL";

function Metrics() {
  const { babyId } = useParams();
  const [diaperChanges, setDiaperChanges] = useState([]);
  const [feedings, setFeedings] = useState([]);
  const [timeRange, setTimeRange] = useState("1"); // Default to last 24 hours
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [showCustomRange, setShowCustomRange] = useState(false);

  useEffect(() => {
    const jwt = Cookies.get("jwt");
    const url = getStrapiURL() + "/api";
    if (jwt) {
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
        .get(url + `/feedings?filters[baby]=${babyId}`, {
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

  const filterDataByTimeRange = (data) => {
    const now = new Date();
    let pastDate = new Date(now);

    if (timeRange === "custom") {
      pastDate = new Date(customRange.start);
      const endDate = new Date(customRange.end);
      return data.filter((entry) => {
        const entryDate = new Date(entry.attributes.time);
        return entryDate >= pastDate && entryDate <= endDate;
      });
    } else {
      pastDate.setDate(now.getDate() - parseInt(timeRange));
      return data.filter((entry) => {
        const entryDate = new Date(entry.attributes.time);
        return entryDate >= pastDate && entryDate <= now;
      });
    }
  };

  const handleTimeRangeChange = (e) => {
    const value = e.target.value;
    setTimeRange(value);
    setShowCustomRange(value === "custom");
  };

  const filteredDiaperChanges = filterDataByTimeRange(diaperChanges);
  const filteredFeedings = filterDataByTimeRange(feedings);

  const diaperChangeTypes = filteredDiaperChanges.reduce((acc, change) => {
    acc[change.attributes.type] = (acc[change.attributes.type] || 0) + 1;
    return acc;
  }, {});

  const feedingAmounts = filteredFeedings.reduce((acc, feeding) => {
    acc.total = (acc.total || 0) + feeding.attributes.amount;
    return acc;
  }, {});

  const diaperChangeData = {
    labels: Object.keys(diaperChangeTypes),
    datasets: [
      {
        label: "Diaper Changes",
        data: Object.values(diaperChangeTypes),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const feedingData = {
    labels: filteredFeedings.map((feeding) =>
      new Date(feeding.attributes.time).toLocaleString()
    ),
    datasets: [
      {
        label: "Feeding Amount (ml)",
        data: filteredFeedings.map((feeding) => feeding.attributes.amount),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded p-6 min-h-screen flex flex-col justify-center">
      <h2 className="text-2xl font-bold mb-4 text-center">Metrics</h2>
      <div className="mb-4">
        <label htmlFor="timeRange" className="block mb-2">
          Select Time Range:
        </label>
        <select
          id="timeRange"
          value={timeRange}
          onChange={handleTimeRangeChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="1">Last 24 hours</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>
      {showCustomRange && (
        <div className="mb-4">
          <label htmlFor="customStart" className="block mb-2">
            Start Date and Time:
          </label>
          <input
            type="datetime-local"
            id="customStart"
            value={customRange.start}
            onChange={(e) =>
              setCustomRange({ ...customRange, start: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
          <label htmlFor="customEnd" className="block mb-2">
            End Date and Time:
          </label>
          <input
            type="datetime-local"
            id="customEnd"
            value={customRange.end}
            onChange={(e) =>
              setCustomRange({ ...customRange, end: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      )}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-2">Diaper Changes</h3>
        <Bar data={diaperChangeData} />
      </div>
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-2">Feedings</h3>
        <Line data={feedingData} />
      </div>
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-2">Total Feeding Amount</h3>
        <p>{feedingAmounts.total || 0} ml</p>
      </div>
    </div>
  );
}

export default Metrics;