import React from 'react';
import {createRoot} from 'react-dom/client';

import Popup from './src/Popup.jsx';

const root = document.getElementById('root');
const client = createRoot(root);

client.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('root')
);