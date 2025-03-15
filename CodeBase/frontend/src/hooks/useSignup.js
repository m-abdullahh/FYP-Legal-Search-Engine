import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Changed default to false
  const { dispatch } = useAuthContext();

  const signup = async (name, email, password) => {
    setIsLoading(true);
    setError(null); // Reset error state

    try {
      const response = await fetch("https://fyp-frontend-backend.onrender.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error); // Set error message
        throw new Error(json.error); // Throw error to reject the promise
      }

      // Handle successful signup
      // console.log(json.token);
      localStorage.setItem("user", JSON.stringify(json));
      dispatch({ type: "LOGIN", payload: json });
    } catch (err) {
      // Handle the error and set it in the state
      setError(err.message || "An error occurred during signup");
      throw err; // Re-throw the error to reject the promise
    } finally {
      setIsLoading(false); // Ensure loading state is updated
    }
  };

  return { signup, isLoading, error };
};
