import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config/environment"; // Assuming you have a config file for API base URL

const Scheduler = () => {
  const [formData, setFormData] = useState({
    summary: "",
    description: "",
    startTime: "",
    endTime: ""
  });

  const [meetingLink, setMeetingLink] = useState("");
  const [error, setError] = useState("");


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokens = urlParams.get('tokens');
    if (tokens) {
      try {
        const { access_token, refresh_token } = JSON.parse(decodeURIComponent(tokens));
        if (access_token && refresh_token) {
          localStorage.setItem('accessToken', access_token);
          localStorage.setItem('refreshToken', refresh_token);
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (error) {
        console.error('Error parsing tokens:', error);
        setError('Authentication failed. Please try again.');
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!accessToken || !refreshToken) {
      setError("Please sign in with Google first");
      return;
    }

    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/api/calendar/schedule`,
        { 
          ...formData,
          accessToken,
          refreshToken
        }
      );
      
      if (response.data.success) {
        setMeetingLink(response.data.googleMeetLink);
        setFormData({
          summary: "",
          description: "",
          startTime: "",
          endTime: ""
        });
      } else {
        throw new Error(response.data.error);
      }
    } catch (err) {
      console.error("Error scheduling meeting:", err);
      setError(err.message || "Failed to schedule meeting. Please try again.");
    }
  };

  const handleSignIn = () => {
    window.location.href = `${config.API_BASE_URL}/api/auth/google`;
  };

  return (
    <div style={{ margin: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Google Meet Scheduler</h1>
      <button onClick={handleSignIn} style={{ padding: "10px 20px", marginBottom: "20px" }}>
        Sign in with Google
      </button>
      <h2>Schedule a Meeting</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "500px", marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Summary: </label>
          <input
            type="text"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
            
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Description: </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Start Time: </label>
          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>End Time: </label>
          <input
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px 20px" }}>
          Schedule Meeting
        </button>
      </form>
      {meetingLink && (
        <div style={{ marginTop: "20px" }}>
          <h3>Meeting Scheduled!</h3>
          <p>
            Join the meeting:{" "}
            <a href={meetingLink} target="_blank" rel="noopener noreferrer">
              {meetingLink}
            </a>
          </p>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Scheduler;
