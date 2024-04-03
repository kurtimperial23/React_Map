// App.js

import React, { useState } from "react";
import Map from "./components/Map";
import "leaflet/dist/leaflet.css";

function App() {
  const [city, setCity] = useState("");
  const [locations, setLocations] = useState([]);

  const handleAddCity = async () => {
    if (city.trim() !== "") {
      try {
        const cityCoordinates = await getCityCoordinates(city);
        if (cityCoordinates) {
          setLocations([
            ...locations,
            {
              address: city,
              lat: cityCoordinates.lat,
              lng: cityCoordinates.lon,
            },
          ]);
          setCity("");
        }
      } catch (error) {
        console.error("Error fetching city coordinates:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const getCityCoordinates = async (city) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          city
        )}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        return { lat: parseFloat(lat), lon: parseFloat(lon) };
      } else {
        console.error("City coordinates not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching city coordinates:", error);
      throw error;
    }
  };

  return (
    <div className="App">
      <div>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={handleInputChange}
        />
        <button onClick={handleAddCity}>Add City</button>
      </div>
      <Map locations={locations} />
    </div>
  );
}

export default App;
