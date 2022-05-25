import React, { useContext, useState } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/auth";

function MenuBar() {
  const { userData, logout } = useContext(AuthContext);
  const pathname = window.location.pathname;

  const path = pathname === "/" ? "home" : pathname.substring(1);
  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => setActiveItem(name);
  const menuBar = userData ? (
    <Menu pointing secondary size="massive" color="orange">
      <Menu.Item
        name={userData.username}
        active={
          activeItem === userData.username ||
          activeItem === "home" ||
          path === "home"
        }
        onClick={handleItemClick}
        as={Link}
        to="/"
      />
      <Menu.Item
        name="items"
        active={activeItem === "items"}
        onClick={handleItemClick}
        as={Link}
        to="/items"
      />
      <Menu.Item
        name="users"
        active={activeItem === "users"}
        onClick={handleItemClick}
        as={Link}
        to="/users"
      />

      <Menu.Menu position="right">
        <Menu.Item name="logout" onClick={logout} />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu pointing secondary size="massive" color="orange">
      <Menu.Item
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />

      <Menu.Menu position="right">
        <Menu.Item
          name="login"
          active={activeItem === "login"}
          onClick={handleItemClick}
          as={Link}
          to="/login"
        />
      </Menu.Menu>
    </Menu>
  );

  return menuBar;
}

export default MenuBar;
