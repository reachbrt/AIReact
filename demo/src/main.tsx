import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Import all packages to trigger version console logs
import '@aireact/core';
import '@aireact/chatbot';
import '@aireact/autosuggest';
import '@aireact/smartform';
import '@aireact/analytics';
import '@aireact/image-caption';
import '@aireact/emotion-ui';
import '@aireact/doc-intelligence';
import '@aireact/predictive-input';
import '@aireact/smart-notify';
import '@aireact/voice-actions';
import '@aireact/smart-datatable';
import '@aireact/360-spin';

// Import package CSS files directly from packages
import '../../packages/chatbot/dist/chatbot.css';
import '../../packages/autosuggest/dist/autosuggest.css';
import '../../packages/smartform/dist/smartform.css';
import '../../packages/analytics/dist/analytics.css';
import '../../packages/image-caption/dist/image-caption.css';
import '../../packages/emotion-ui/dist/emotion-ui.css';
import '../../packages/doc-intelligence/dist/doc-intelligence.css';
import '../../packages/predictive-input/dist/predictive-input.css';
import '../../packages/smart-notify/dist/smart-notify.css';
import '../../packages/voice-actions/dist/voice-actions.css';
import '../../packages/smart-datatable/dist/smart-datatable.css';
import '../../packages/360-spin/dist/360-spin.css';

// Demo version console
const DEMO_VERSION = '1.0.0';
console.log(
  `%c @aireact/demo v${DEMO_VERSION} %c All packages loaded! `,
  'background: #10b981; color: white; padding: 2px 6px; border-radius: 3px 0 0 3px; font-weight: bold;',
  'background: #059669; color: white; padding: 2px 6px; border-radius: 0 3px 3px 0;'
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

