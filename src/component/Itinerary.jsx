
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Itinerary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { destination, budget, tripPurpose, preferences, itinerary, pdfPath } = location.state || {};

  const [hotels, setHotels] = useState([]);
  const [showMoreHotels, setShowMoreHotels] = useState(false);

  // Parsing itinerary into day-wise format
  const daywiseItinerary = itinerary
    ? itinerary.split(/(Day \d+:)/).reduce((acc, item, index, arr) => {
        if (item.match(/Day \d+:/)) {
          acc.push({ day: item.trim(), activities: arr[index + 1]?.trim() || "No activities specified." });
        }
        return acc;
      }, [])
    : [];

  // Fetch hotels near the destination
  useEffect(() => {
    const fetchHotels = async () => {
      if (!destination) return;

      try {
        // Get coordinates for the destination
        const geoResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${destination}`
        );
        const geoData = await geoResponse.json();

        if (geoData.length === 0) {
          console.error("No location data found");
          return;
        }

        const { lat, lon } = geoData[0];

        // Fetch hotels near the destination using Overpass API
        const overpassQuery = `
          [out:json];
          (
            node["tourism"="hotel"](around:5000, ${lat}, ${lon});
            way["tourism"="hotel"](around:5000, ${lat}, ${lon});
            relation["tourism"="hotel"](around:5000, ${lat}, ${lon});
          );
          out center;
        `;
        const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

        const hotelResponse = await fetch(overpassUrl);
        const hotelData = await hotelResponse.json();

        const hotelList = hotelData.elements.map((element) => ({
          name: element.tags.name || "Unnamed Hotel",
          address: element.tags["addr:street"] || "Address not available",
          rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 to 5.0
          image: `https://source.unsplash.com/200x150/?hotel,${destination}`, // Random hotel image from Unsplash
        }));

        setHotels(hotelList);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    fetchHotels();
  }, [destination]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold text-black mt-8">Your Trip Itinerary</h1>
      <p className="text-gray-600 mb-6">Here is your personalized trip plan.</p>

      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl w-full">
        <h2 className="text-2xl font-bold text-black mb-4 text-center">{destination || "Unknown Destination"}</h2>
        <div className="bg-gray-200 p-4 rounded-lg mb-6">
          <p><strong>Budget:</strong> Rs {budget}</p>
          <p><strong>Trip Purpose:</strong> {tripPurpose || "Not specified"}</p>
          <p><strong>Preferences:</strong> {preferences || "None specified"}</p>
        </div>

        {/* Hotels Recommendation Section */}
        <h3 className="text-xl font-bold text-purple-700 mb-4">Recommended Hotels in {destination}</h3>

        {/* Show first 4 hotels in horizontal layout */}
        <div className="flex flex-wrap justify-center gap-4">
          {hotels.slice(0, 4).map((hotel, index) => (
            <div key={index} className="bg-purple-100 p-4 rounded-lg shadow-md border-l-4 border-purple-600 w-60">
              <img src={hotel.image} alt={hotel.name} className="w-full h-32 object-cover rounded-md mb-2" />
              <h4 className="text-lg font-semibold text-purple-900">{hotel.name}</h4>
              <p className="text-black">{hotel.address}</p>
              <p className="text-yellow-600 font-semibold">⭐ {hotel.rating}/5</p>
            </div>
          ))}
        </div>

        {/* Show More Button for remaining hotels */}
        {hotels.length > 4 && (
          <div className="text-center mt-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={() => setShowMoreHotels(!showMoreHotels)}
            >
              {showMoreHotels ? "Show Less" : "View More Hotels"}
            </button>
          </div>
        )}

        {/* Dropdown or Slider for extra hotels */}
        {showMoreHotels && (
          <div className="mt-4 bg-gray-200 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">More Hotels</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hotels.slice(4).map((hotel, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-gray-500">
                  <img src={hotel.image} alt={hotel.name} className="w-full h-32 object-cover rounded-md mb-2" />
                  <h4 className="text-md font-semibold text-gray-900">{hotel.name}</h4>
                  <p className="text-black">{hotel.address}</p>
                  <p className="text-yellow-600 font-semibold">⭐ {hotel.rating}/5</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Itinerary Section */}
        <h3 className="text-xl font-bold mt-6">Generated Itinerary</h3>
        <div className="space-y-6">
          {daywiseItinerary.length > 0 ? (
            daywiseItinerary.map((day, index) => (
              <div key={index} className="bg-blue-100 p-6 rounded-lg shadow-md border-l-8 border-blue-600">
                <h4 className="text-lg font-semibold text-blue-800">{day.day}</h4>
                <ol className="list-decimal list-inside mt-2 text-black">
                  {day.activities.split("\n").map((activity, i) => (
                    <li key={i} className="mt-1">{activity}</li>
                  ))}
                </ol>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No itinerary generated.</p>
          )}
        </div>

        {/* Download & Generate Itinerary Buttons */}
        <div className="flex flex-col gap-3 mt-6">
          {pdfPath && (
            <a
              href={`http://localhost:5000/download_pdf`}
              download
              className="block text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Download Itinerary PDF
            </a>
          )}

          <button
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
            onClick={() => navigate("/generate-itinerary")}
          >
            Generate New Itinerary
          </button>
        </div>
      </div>
    </div>
  );
}
