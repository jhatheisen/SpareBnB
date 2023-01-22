import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector} from "react-redux";
import ProfileButton from "./ProfileButton";
import './Navigation.css';
import logo from './s-logo.png';


function Navigation({isLoaded}) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul className="navBar">
      <li>
        <NavLink exact to='/'><img src={logo} className="logo" alt='SpareBnB logo'/></NavLink>
      </li>
      <h2 className="logoText">SpareBnB</h2>
      {isLoaded && (
        <li >
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
