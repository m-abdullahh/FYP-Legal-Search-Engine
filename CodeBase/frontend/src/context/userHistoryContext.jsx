import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "@/hooks/useAuthContext";

const HistoryContext = createContext();

export const useHistoryContext = () => useContext(HistoryContext);

export const HistoryProvider = ({ children }) => {
  const { user } = useAuthContext(); // Get user from your existing UserContext
  const [searchHistory, setSearchHistory] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);

  // Fetch search history if the user is logged in
  useEffect(() => {
    const fetchSearchHistory = async () => {
      if (user) {
        // Check if user is logged in
        try {
          setIsFetching(true);
          const token = user.token; // Assuming user token is available in userContext
          const response = await axios.get("https://fyp-frontend-backend.onrender.com/searchhistory", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setSearchHistory(response.data.history); // Assuming response contains history array
        } catch (err) {
          setError("Failed to fetch search history");
        } finally {
          setIsFetching(false);
        }
      } else {
        // Clear history if user logs out or is not logged in
        setSearchHistory([]);
      }
    };

    fetchSearchHistory();
  }, [user]); // Refetch whenever the user changes (logs in or out)



  // Add a search entry to history
  const addSearchEntry = async (searchEntry) => {
    if (!user) return;

    try {
      const response = await axios.post(
        "https://fyp-frontend-backend.onrender.com/searchhistory",
        { ...searchEntry },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const savedEntry = response.data.history; // Get the saved entry from the response
      console.log("Saved EntrRRRRRRRRRRRRRRy", response);
      setSearchHistory((prevHistory) => [...prevHistory, savedEntry]); // Add it to the state
    } catch (error) {
      console.error("Error adding search entry:", error);
    }
  };

  // Delete a specific search entry
  const deleteSearchEntry = async (entryId) => {
    if (!user) return; // Only allow deletion if the user is logged in

    try {
      const token = user.token;
      // Use proper RESTful route convention to delete the specific search entry
      await axios.delete(`https://fyp-frontend-backend.onrender.com/searchhistory/${entryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Update local history state by filtering out the deleted entry
      setSearchHistory((prevHistory) => prevHistory.filter((entry) => entry._id !== entryId));
    } catch (error) {
      console.error("Error deleting search entry:", error);
    }
  };

  // Clear all search history
  const clearSearchHistory = async () => {
    if (!user) return; // Only allow clearing history if the user is logged in

    try {
      const token = user.token;
      await axios.delete("https://fyp-frontend-backend.onrender.com/searchhistory", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Clear local history state
      setSearchHistory([]);
    } catch (error) {
      console.error("Error clearing search history:", error);
    }
  };

  return (
    <HistoryContext.Provider value={{ searchHistory, addSearchEntry, deleteSearchEntry, clearSearchHistory, loading: isFetching, error }}>
      {children}
    </HistoryContext.Provider>
  );
};
