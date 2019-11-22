import React from 'react';
import './App.scss';
import Canvas from './components/canvas';
import { useWebSocket } from './hooks/useWebSocket';

function App() {
  const { messages } = useWebSocket();

  return (
    <div className="App">
      <Canvas data={messages}/>
    </div>
  );
}

export default App;
