import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

const App = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [polyline, setPolyline] = useState(null);
  const [pathCoordinates, setPathCoordinates] = useState([]);  // Store the vehicle path

  
  const fetchVehicleData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/vehicle-data');
      const data = await response.json();

      
      const latestPosition = data[data.length - 1];
      const { latitude, longitude } = latestPosition;
      const newLatLng = [latitude, longitude];

      
      if (marker) {
        marker.setLatLng(newLatLng);
      }

      
      setPathCoordinates(prevCoordinates => [...prevCoordinates, newLatLng]);

      
      if (polyline) {
        polyline.setLatLngs([...pathCoordinates, newLatLng]);
      }

     
      if (map) {
        map.setView(newLatLng);
      }

    } catch (error) {
      console.error('Error fetching vehicle data:', error);
    }
  };

  useEffect(() => {
    if (!mapRef.current) {
      
      const mapInstance = L.map('map').setView([17.385044, 78.486671], 13);

      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(mapInstance);

      
      const vehicleIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/12689/12689302.png', 
        iconSize: [38, 38],
      });

      
      const markerInstance = L.marker([17.385044, 78.486671], { icon: vehicleIcon }).addTo(mapInstance);

      
      const polylineInstance = L.polyline([], { color: 'blue', weight: 4 }).addTo(mapInstance);

      
      setMap(mapInstance);
      setMarker(markerInstance);
      setPolyline(polylineInstance);

      mapRef.current = mapInstance;  
    }

    
    const interval = setInterval(fetchVehicleData, 5000);

    
    return () => clearInterval(interval);
  }, [marker, polyline, map, pathCoordinates]);

  return (
    <div>
      <h1>Real-Time Vehicle Movement on Map</h1>
      <div id="map"></div>
    </div>
  );
};

export default App;

