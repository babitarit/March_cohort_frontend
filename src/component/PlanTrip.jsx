import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/252/252025.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
});

export default function PlanTrip() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    tripType: "Solo",
    preferences: "",
  });

  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [weather, setWeather] = useState(null);
  const [review, setReview] = useState("");
  const [reviewsData, setReviewsData] = useState({});

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/reviews.json");
        const data = await response.json();
        setReviewsData(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchLocationData = async () => {
      if (!formData.destination) return;
      try {
        const { data } = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${formData.destination}`
        );
        if (data.length > 0) {
          const lat = data[0].lat;
          const lon = data[0].lon;
          setCoordinates({ lat, lon });

          const weatherRes = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather`,
            {
              params: {
                lat,
                lon,
                units: "metric",
                appid: "85a1d7f89447acc9ba8139b3302eb562",
              },
            }
          );
          setWeather({
            temperature: weatherRes.data.main.temp,
            description: weatherRes.data.weather[0].description,
          });
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };

    fetchLocationData();
    setReview(reviewsData[formData.destination] || "No reviews available for this location.");
  }, [formData.destination, reviewsData]);




  const formatDateForBackend = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
};







  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.startDate || !formData.endDate) {
        alert('Please select both start and end dates.');
        return;
    }

    setLoading(true);

    const payload = {
        ...formData,
        startDate: formatDateForBackend(formData.startDate),
        endDate: formatDateForBackend(formData.endDate),
    };

    console.log('Submitting:', payload);

    try {
        const { data } = await axios.post('https://march-cohort-backend.onrender.com/generate_itinerary', payload);
        navigate("/itinerary", {
            state: { ...formData, itinerary: data.itinerary_text, pdfPath: data.pdf_path },
        });
    } catch (error) {
        alert("Failed to connect to backend.");
    } finally {
        setLoading(false);
    }
};





  return (
    <div className="min-h-screen bg-purple-50 p-8">
      <h1 className="text-3xl font-bold text-purple-800 text-center mb-6 transition-transform duration-500 hover:scale-105">
       Om Tours and Travels: Itinero 
      </h1>

      <div className="relative w-full h-96 mb-10">
        <img
          src="/src/assets/banner.jpg"
          alt="Travel"
          className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg"
        />
      </div>

      


<div className="flex flex-col lg:flex-row items-center justify-center gap-10">
<div className="lg:w-1/2 text-gray-700 text-lg p-6 bg-white rounded-lg shadow-lg transition-opacity duration-700 hover:opacity-90">
  <h2 className="text-2xl font-bold text-purple-800 mb-4">Your Personalized Travel Guide</h2>
  <p className="leading-relaxed mb-3">
    Planning a trip has never been easier! Our AI-powered travel planner helps you craft the perfect itinerary,  
    customized to your budget, duration, and interests. Whether you're looking for adventure, relaxation, or cultural experiences,  
    we've got you covered.
  </p>
  <h3 className="text-xl font-semibold text-purple-700 mt-4">Why Choose Us?</h3>
  <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
    <li>✨ Discover hidden gems and must-visit destinations.</li>
    <li>🌦 Get real-time weather updates to plan accordingly.</li>
    <li>💬 Read genuine traveler reviews for the best insights.</li>
    <li>🗺 Interactive maps to help you navigate with ease.</li>
    <li>📜 Download a PDF itinerary for hassle-free access.</li>
    <li>⚡ AI-driven smart recommendations to optimize your trip.</li>
  </ul>
</div>


<div className="bg-white shadow-lg rounded-2xl p-8 w-full lg:w-1/3 hover:shadow-2xl transition-transform duration-500 hover:scale-105">
          <h2 className="text-xl font-bold text-purple-800 mb-4">Plan Your Perfect Trip</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(formData).map((field, index) => (
              field !== "tripType" ? (
                field === "startDate" || field === "endDate" ? (
                  <input
                    key={index}
                    type="date"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-lg focus:border-purple-500 focus:ring-purple-300"
                  />
                ) : (
                  <input
                    key={index}
                    type="text"
                    name={field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-lg focus:border-purple-500 focus:ring-purple-300"
                  />
                )
              ) : (
                <select
                  key={index}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:border-purple-500 focus:ring-purple-300"
                >
                  <option value="Solo">Solo</option>
                  <option value="Family">Family</option>
                  <option value="Friends">Friends</option>
                  <option value="Business">Business</option>
                </select>
              )
            ))}
            <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">
              {loading ? "Generating..." : "Generate Itinerary"}
            </button>
          </form>



        </div>
      </div>

      {formData.destination && (
        <div className="mt-10 text-center">
          <h2 className="text-2xl font-bold text-purple-800">Destination Details</h2>
          <p className="text-gray-700">Weather in {formData.destination}: {weather?.temperature}°C, {weather?.description}</p>
          <p className="text-gray-700 italic mt-2">{review}</p>
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-2xl font-bold text-purple-800 text-center mb-4">Destination Map</h2>
        {coordinates ? (
          <MapContainer center={[coordinates.lat, coordinates.lon]} zoom={13} className="w-full h-96 rounded-lg shadow-lg">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[coordinates.lat, coordinates.lon]} icon={customIcon}>
              <Popup>
                <strong>{formData.destination}</strong>
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p className="text-center text-gray-500">Enter a destination to see the map.</p>
        )}
      </div>
      <footer className="mt-10 p-4 text-center bg-purple-200 text-purple-800 rounded-lg">
        &copy; 2025 AI Travel Planner. All rights reserved.
      </footer>
    </div>
  );
}





