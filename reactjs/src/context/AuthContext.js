import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: {
    access_token: JSON.parse(localStorage.getItem("access_token")) || null,
    refresh_token: JSON.parse(localStorage.getItem("refresh_token")) || null,
  },
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
    localStorage.setItem(
      "access_token",
      JSON.stringify(state.token.access_token)
    );
    localStorage.setItem(
      "refresh_token",
      JSON.stringify(state.token.refresh_token)
    );
  }, [state.user, state.token]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
