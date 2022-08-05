// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './components/App'
// ReactDOM.render(
//   <App />,
//   document.querySelector('#react-goes-here')
// )

import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './components/App.js';

const rootElement = document.getElementById('react-goes-here');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
