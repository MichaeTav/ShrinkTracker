import React, { createContext, useReducer } from "react";
import jwtDecode from "jwt-decode";

const initialState = {
  userData: null,
  token: null,
};

if (localStorage.getItem("jwtToken") && localStorage.getItem("userData")) {
  const decodedToken = jwtDecode(localStorage.getItem("jwtToken"));

  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userData");
  } else {
    initialState.token = localStorage.getItem("jwtToken");
    initialState.userData = JSON.parse(localStorage.getItem("userData"));
  }
}

const AuthContext = createContext({
  userData: null,
  token: null,
  login: (userDataInput) => {},
  logout: () => {},
});

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        userData: action.payload.user,
        token: action.payload.token,
      };
    case "LOGOUT":
      return {
        ...state,
        userData: null,
        token: null,
      };
    default:
      return state;
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  function login(userDataInput) {
    localStorage.setItem("jwtToken", userDataInput.token);
    localStorage.setItem("userData", JSON.stringify(userDataInput.user));
    dispatch({
      type: "LOGIN",
      payload: userDataInput,
    });
  }

  function logout() {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userData");
    dispatch({ type: "LOGOUT" });
  }

  return (
    <AuthContext.Provider
      value={{ userData: state.userData, token: state.token, login, logout }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };
