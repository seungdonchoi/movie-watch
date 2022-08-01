// import React from 'react';
// import ReactDOM from 'react-dom';

// ReactDOM.render(
//   <h1>Hello</h1>,
//   document.querySelector('#react-goes-here')
// )

import React from 'react';
import {createRoot} from 'react-dom/client';

const rootElement = document.getElementById('react-goes-here');
const root = createRoot(rootElement);

root.render(
  <h1>Hello!</h1>,
)
