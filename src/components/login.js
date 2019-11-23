import React, { useState } from "react";
import './login.scss';
import Sex from './sex';

const Login = () => {

  const [age, setAge] = useState(18);

  const handleAgeChange = (event) => {
    const { value } = event.target;
    console.log(value);
    setAge(value ? parseInt(value) : 0);
  }

  const handleLogin = () => {
    console.log("Login");
  }

  return (
    <div className="app-login">
      <h1 style={{marginBottom: 64}}>Gondelfunk</h1>
      <h3 style={{marginTop: 0}}>Choose your sex</h3>
      <div className="sex-chooser">
        <Sex gender="mars" />
        <Sex gender="venus" />
      </div>
      <h3 style={{marginTop: 32}}>
        We need your age
      </h3>
      <input type="number" className="age-input" value={age} onChange={handleAgeChange} />

      <button style={{ marginTop: 64, marginBottom: 64 }} onClick={handleLogin} className="login-button">
        <span>Let's Go</span>
      </button>
    </div>
  );
};

export default Login;