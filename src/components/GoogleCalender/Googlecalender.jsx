import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config/environment"; // Assuming you have a config file for API base URL

const GoogleCalendar = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
      setError("Please sign in with Google first");
      return;
    }

    try {
      const response = await axios.get(`${config.API_BASE_URL}/api/calendar/events`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setEvents(response.data.events || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.message || "Failed to fetch calendar events");
    }
  };

  useEffect(() => {
    // Attempt to fetch events if tokens exist
    if (localStorage.getItem('accessToken')) {
      fetchEvents();
    }
  }, []);

  const handleSignIn = () => {
    window.location.href = `${config.API_BASE_URL}/api/auth/google`;
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Google Calendar Events</h2>
      {!localStorage.getItem('accessToken') ? (
        <button 
          className="bg-green-500 text-white p-2 rounded" 
          onClick={handleSignIn}
        >
          Sign In with Google
        </button>
      ) : (
        <>
          <button 
            className="bg-blue-500 text-white p-2 rounded m-2" 
            onClick={fetchEvents}
          >
            Refresh Events
          </button>
          <ul className="mt-4">
            {events.map(event => (
              <li key={event.id} className="border p-2 my-2 rounded">
                <strong>{event.summary}</strong><br />
                Start: {new Date(event.start.dateTime || event.start.date).toLocaleString()}<br />
                {event.hangoutLink && (
                  <a href={event.hangoutLink} className="text-blue-500" target="_blank" rel="noopener noreferrer">
                    Join Meeting
                  </a>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default GoogleCalendar;
