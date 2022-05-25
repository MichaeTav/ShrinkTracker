import React, { useState, useContext } from "react";
import { Tabs, Tab } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/auth";

export default function AppMenuBar() {
  const { userData, logout } = useContext(AuthContext);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleItemClick = (e, newValue) => {
    //Logout
    if (newValue === "logout") {
      logout();
      setSelectedTab(0);
    } else {
      setSelectedTab(newValue);
    }
    // console.log(window.location.pathname);
  };

  const menuBar = userData ? (
    <Tabs
      TabIndicatorProps={{
        style: { background: "#F2711C", textColor: "#F2711C" },
      }}
      textColor="inherit"
      value={selectedTab}
      onChange={handleItemClick}
    >
      <Tab
        disableRipple
        label={userData.username}
        LinkComponent={Link}
        to="/"
      />
      <Tab disableRipple label="Items" LinkComponent={Link} to="/items" />
      {userData.roles.length > 1 && (
        <Tab disableRipple label="Users" LinkComponent={Link} to="/users" />
      )}
      <Tab
        disableRipple
        label="Logout"
        sx={{ marginLeft: "auto" }}
        value="logout"
      />
    </Tabs>
  ) : (
    <Tabs
      TabIndicatorProps={{
        style: { background: "#F2711C", textColor: "#F2711C" },
      }}
      textColor="inherit"
      value={selectedTab}
      onChange={handleItemClick}
    >
      <Tab label="Home" LinkComponent={Link} to="/" />
      <Tab
        label="Login"
        sx={{ marginLeft: "auto" }}
        LinkComponent={Link}
        to="/login"
      />
    </Tabs>
  );

  return menuBar;
}
