import React, {useEffect, useState, useRef} from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem.js";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import CreateSpotModal from "../CreateSpotModal";

function ProfileButton({user}) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

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
  };

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
            <li>
              <OpenModalMenuItem
                  itemText="Create A Spot"
                  modalComponent={<CreateSpotModal />}
                  onItemClick={closeMenu}
                  id='createSpot'
                />
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
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
