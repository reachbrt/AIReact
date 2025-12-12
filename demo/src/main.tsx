import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Import all packages to trigger version console logs
import '@reactai/core';
import '@reactai/chatbot';
import '@reactai/autosuggest';
import '@reactai/smartform';
import '@reactai/analytics';

// Import package CSS files directly from packages
import '../../packages/chatbot/dist/chatbot.css';
import '../../packages/autosuggest/dist/autosuggest.css';
import '../../packages/smartform/dist/smartform.css';
import '../../packages/analytics/dist/analytics.css';

// Demo version console
const DEMO_VERSION = '1.0.0';
console.log(
  `%c @reactai/demo v${DEMO_VERSION} %c All packages loaded! `,
  'background: #10b981; color: white; padding: 2px 6px; border-radius: 3px 0 0 3px; font-weight: bold;',
  'background: #059669; color: white; padding: 2px 6px; border-radius: 0 3px 3px 0;'
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

