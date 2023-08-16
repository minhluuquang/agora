import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import style from './index.css?inline';

const sheet = new CSSStyleSheet();
sheet.replaceSync(style);

const root = document.createElement('div');
root.id = 'agora-root';
root.style.position = 'absolute';
root.style.top = '15%';
root.style.left = '40%';
document.body.appendChild(root);
const shadow = root.attachShadow({ mode: 'open' });
shadow.adoptedStyleSheets = [sheet];
const renderIn = document.createElement('div');
shadow.appendChild(renderIn);

ReactDOM.createRoot(renderIn).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
