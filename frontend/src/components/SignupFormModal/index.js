import React, { useState} from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from '../../store/session';
import './SignupForm.css';
import { useModal } from "../../context/Modal";

function SignupFormModal() {

  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    // stop form page reset
    e.preventDefault();
    // if pass and confirm same
    if (password === confirmPassword) {
      // reset errors
      setErrors([]);
      // dispatch signup action
      return dispatch(sessionActions.signup({email, username, firstName, lastName, password}))
        // if any errors, set errors state
        .then(closeModal)
        .catch( async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    }
    // if password not same, set error
    return setErrors(['Confirm Password field must be the same as the Password field'])
  };

  return (
    <div className="signupContainer">
      <form onSubmit={handleSubmit} className="signupModal">
        <h1>Sign Up</h1>
        <label for="email">
          Email
        </label>
          <input
            type="text"
            value={email}
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        <label for="username">
          Username
        </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        <label for='firstName'>
          First Name
        </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        <label for='lastName'>
          Last Name
        </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            />
        <label for="password">
          Password
        </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        <label for="confirm">
          Confirm Password
        </label>
          <input
            type="password"
            id="confirm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        <button type="submit">Sign Up</button>
      </form>

      <ul className="signupErrors">
        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
      </ul>

    </div>
  );
}

export default SignupFormModal;
