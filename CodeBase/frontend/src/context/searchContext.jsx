import { createContext } from "react";

export const SearchContext = createContext();

export const searchReducer = (state, action) => {
  switch (action.type) {
    case "CREATE_SEARCH":
      return { searches: action.payload };
    default:
      return state;
  }
};

export const SearchContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(searchReducer, {
    search: null,
  });

  return <SearchContext.Provider value={{}}>{children}</SearchContext.Provider>;
};
