// filepath: client/src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/index.css'; // Import global styles if needed

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);