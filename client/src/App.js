import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "@mui/material";

import "./App.css";

import { AuthProvider } from "./context/auth";
import { AuthRoute, AuthenticatedRoute } from "./util/AuthRoute";

import MenuBar from "./components/MenuBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Users from "./pages/Users";
import Items from "./pages/Items";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Routes>
            <Route
              path="/"
              element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              }
            />
            <Route
              path="/home"
              element={
                <AuthenticatedRoute>
                  <Home />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <AuthenticatedRoute>
                  <Users />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/items"
              element={
                <AuthenticatedRoute>
                  <Items />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              }
            />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
