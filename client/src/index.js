
/**
 * Entry point for the React application.
 * 
 * This file initializes the React application by rendering the root component (`App`)
 * into the DOM element with the ID `root`. It also includes optional performance
 * measurement functionality using `reportWebVitals`.
 * 
 * Imports:
 * - React: The core library for building user interfaces.
 * - ReactDOM: Provides DOM-specific methods for rendering React components.
 * - './index.css': The global CSS file for styling the application.
 * - './App': The main application component.
 * - './reportWebVitals': A utility for measuring app performance.
 * 
 * Key Functions:
 * - `ReactDOM.createRoot`: Creates a root React DOM node.
 * - `root.render`: Renders the React component tree into the DOM.
 * - `reportWebVitals`: Logs or sends performance metrics for the app.
 * 
 * Usage:
 * - The `App` component is wrapped in `React.StrictMode` to enable additional checks
 *   and warnings during development.
 * - To measure performance, pass a callback function to `reportWebVitals` (e.g., `console.log`).
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root')); // Get the root element from the HTML
root.render(
  <React.StrictMode> 
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
