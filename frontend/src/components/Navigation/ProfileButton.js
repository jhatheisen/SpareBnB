import React, {useEffect, useState, useRef} from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem.js";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import CreateSpotModal from "../CreateSpotModal";
import { useHistory } from "react-router-dom";

function ProfileButton({user}) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);


    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    window.alert("Logout Successful")
    history.push('/');
  };

  const redirectBookings = (e) => {
    history.push('/user/bookings');
  }

  const  redirectUserSpots = () => {
    history.push('/user/spots');
  }

  const demoLogin = (e) => {
    dispatch(sessionActions.login({credential: "Demo-lition", password: "password"}));
  }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button className="userProfile" onClick={openMenu}>
        <i className="fa-solid fa-user" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li>{user.username}</li>
            <li>{user.firstName} {user.lastName}</li>
            <li>{user.email}</li>
            <li id="createSpotModalButton">
              <OpenModalMenuItem
                  itemText="Create A Spot"
                  modalComponent={<CreateSpotModal />}
                  onItemClick={closeMenu}
                  id='createSpot'
                />
            </li>
            <li>
              <button onClick={redirectUserSpots}>Check My Spots</button>
            </li>
            <li>
              <button onClick={redirectBookings}>Check My Bookings</button>
            </li>
            <li>
              <button onClick={logout}>Log Out</button>
            </li>
          </>
        ): (
          <>
            <li>
              <OpenModalMenuItem
                itemText="Log In"
                modalComponent={<LoginFormModal />}
                onItemClick={closeMenu}
                id='login'
              />
            </li>
            <li>
              <OpenModalMenuItem
                itemText="Sign Up"
                modalComponent={<SignupFormModal />}
                onItemClick={closeMenu}
                id='signup'
              />
            </li>
            <li>
              <button onClick={demoLogin}>Demo User</button>
            </li>
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
