import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { UserProvider } from './contexts/UserContext';
import { WebSocketProvider } from "./contexts/WebSocketContext";
import './index.scss';

ReactDOM.render(
    <WebSocketProvider>
        <UserProvider>
            <App />
        </UserProvider>
    </WebSocketProvider>,
    document.getElementById('root')
);
