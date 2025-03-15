import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const logout = async () => {
    // remove user from Storage
    localStorage.removeItem("user");
    // dispatch logout
    dispatch({ type: "LOGOUT" });
  };
  return { logout };
};
