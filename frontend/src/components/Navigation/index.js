import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector} from "react-redux";
import ProfileButton from "./ProfileButton";
import './Navigation.css';

function Navigation({isLoaded}) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul>
      <li>
        <NavLink exact to='/'><i className="fa-2xl logo fa-solid fa-house-chimney-user"></i></NavLink>
      </li>
      <h2>SpareBnB</h2>
      {isLoaded && (
        <li className="profileDropDown">
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
