import { useContext } from "react";
import { SearchContext } from "@/context/searchContext";

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw Error("useSearchContext must be used within a SearchContextProvider");
  }
  return context;
};
