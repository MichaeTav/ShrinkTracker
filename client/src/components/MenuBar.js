import React, { useState, useContext } from "react";
import { Tabs, Tab, AppBar } from "@mui/material";
import { Link } from "react-router-dom";
import { isMobile } from "react-device-detect";

import { AuthContext } from "../context/auth";

export default function MenuBar() {
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
  };

  const menuBar = userData ? (
    <>
      <AppBar>
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
            to="/home"
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
      </AppBar>
      <Tabs />
    </>
  ) : (
    <></>
  );

  return menuBar;
}
