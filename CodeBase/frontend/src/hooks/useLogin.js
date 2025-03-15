import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const uselogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://fyp-frontend-backend.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      // If the response is not OK, throw an error
      if (!response.ok) {
        throw new Error(json.error || "Login failed");
      }

      // If successful, store user info in localStorage and update context
      localStorage.setItem("user", JSON.stringify(json));
      dispatch({ type: "LOGIN", payload: json });

      // Return the successful response data
      return json;

    } catch (err) {
      // Handle error by setting the error state
      setError(err.message);
      throw err; // This ensures the error handler in toast.promise gets triggered
    } finally {
      // Always set isLoading to false after the request is finished
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
