import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector} from "react-redux";
import ProfileButton from "./ProfileButton";
import './Navigation.css';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';

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
          <OpenModalButton
            buttonText="Log in"
            modalComponent={<LoginFormModal />}
          />
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
