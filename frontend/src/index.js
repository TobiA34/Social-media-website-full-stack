import React from 'react';
import ReactDOM from 'react-dom/client';
 import App from './App';
import "./App.css";
import "./index.css"
import "bootstrap/dist/css/bootstrap.min.css";

const originalError = console.error;
console.error = (...args) => {
  if (/ResizeObserver loop completed with undelivered notifications/.test(args[0])) {
    return;
  }
  originalError.call(console, ...args);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
 
  </React.StrictMode>
);

 
