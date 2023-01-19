import React, { useState } from "react";
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from "../../context/Modal";
import './LoginForm.css';

function LoginFormModal() {
  // create dispatch
  const dispatch = useDispatch();
  //grab curr user if one exists
  // create state vars
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  // when submit, dispatch login thunk action
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({credential, password}))
    // if error, set errors
    .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  }

  return (
    <div className="loginContainer">
      <form onSubmit={handleSubmit} className='loginModal'>
        <h1>Log in</h1>
        <label for="credential">
          Username or Email
        </label>
          <input
            type="text"
            id="credential"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
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
        <button type="submit">Log In</button>
      </form>
      <ul className="loginErrors">
        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
      </ul>
    </div>
  );
}

export default LoginFormModal;
