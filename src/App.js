import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from "react-router-dom";
import Content from './components/content';
import Login from './components/login';
// import Phone from './components/phone';
import './App.scss';
import PrivateRoute from './components/privateroute';

function App() {
  return (
    <Router>
      <div className="app">
        {/* <Phone /> */}

        <div className="app-inner">
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <PrivateRoute path="/app" component={Content} />
            <Redirect to="/app" />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
