import React from 'react';
import ReactDOM from 'react-dom';
import style from './index.css?inline';
import App from './App';

const sheet = new CSSStyleSheet();
sheet.replaceSync(style);

const root = document.createElement('div');
root.id = 'agora-root';
document.body.append(root);
const shadow = root.attachShadow({ mode: 'open' });
shadow.adoptedStyleSheets = [sheet];
const renderIn = document.createElement('div');
shadow.appendChild(renderIn);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  renderIn
);
