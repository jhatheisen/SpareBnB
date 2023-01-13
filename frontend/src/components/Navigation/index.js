import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector} from "react-redux";
import ProfileButton from "./ProfileButton";
import './Navigation.css';

function Navigation({isLoaded}) {
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    sessionLinks =(
    <>
      <div>
        <li>
          <NavLink to='/login'>Log In</NavLink>
        </li>
        <li>
          <NavLink to='/signup'>Sign Up</NavLink>
        </li>
      </div>
    </>
    );
  }

  return (
    <ul>
      <li>
        <NavLink exact to='/'>Home</NavLink>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;
