import { useEffect, useState } from 'react';
import { RaycastCMDK } from './components/Palette';

function App() {
  // states for port and tabs
  const [port, setPort] = useState<chrome.runtime.Port>();
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);

  // init port and current tabs
  useEffect(() => {
    const p = chrome.runtime.connect({ name: 'tabs' });
    p.postMessage({ action: 'getTabs' });
    p.onMessage.addListener(function (msg) {
      if (msg.name === 'allTabs') {
        setTabs(msg.data);
      }
    });
    setPort(p);
  }, []);

  // render main combobox
  return <RaycastCMDK />;
}

export default App;
