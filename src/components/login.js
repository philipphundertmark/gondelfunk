import React, { useContext, useEffect, useState } from "react";
import { withRouter } from "react-router";
import uniqid from 'uniqid';
import './login.scss';
import Sex from './sex';
import gondel from "../assets/gondel.svg";
import { UserContext } from "../contexts/UserContext";
import { WebSocketContext } from "../contexts/WebSocketContext";

const Login = ({ history }) => {
  const { onLogin, user } = useContext(UserContext);
  const { send } = useContext(WebSocketContext);
  const [age, setAge] = useState(18);
  const [gender, setGender] = useState("venus");

  const handleAgeChange = (event) => {
    const { value } = event.target;
    setAge(value ? parseInt(value) : 0);
  }

  const isFormValid = () => {
    if (age < 18) {
      return false;
    }

    return true;
  }

  const handleLogin = () => {
    if (!isFormValid()) {
      return;
    }

    const userId = uniqid("user-");

    onLogin({
      id: userId,
      age,
      gender
    });

    send({
      type: "login", 
      of: userId
    });
  }

  useEffect(() => {
    if (user) {
      history.push("/app");
    }
  }, [history, user]);

  return (
    <div className="app-login">
      <h1 style={{marginBottom: 16}}>
        Gondelfunk
      </h1>

      <img src={gondel} alt="gondel" width={80} style={{marginBottom: 64}} />

      <h3 style={{marginTop: 0}}>
        Choose your sex
      </h3>

      <div className="sex-chooser">
        <Sex gender="mars" selected={gender === "mars"} onClick={() => setGender("mars")} />
        <Sex gender="venus" selected={gender === "venus"} onClick={() => setGender("venus")}/>
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

export default withRouter(Login);