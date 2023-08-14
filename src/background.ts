chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  );
  if (request.greeting === 'hello') sendResponse({ farewell: 'goodbye' });
});

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(async function (msg) {
    if (msg.action === 'getTabs') {
      const tabs = await chrome.tabs.query({});
      port.postMessage({ name: 'allTabs', data: tabs });
    }

    if (msg.action === 'selectTab') {
      const tab = msg.data as chrome.tabs.Tab;
      if (tab.id) {
        chrome.tabs.update(tab.id, { active: true });
      }
    }
  });
});

chrome.commands.onCommand.addListener((command) => {
  console.log(`Command: ${command}`);
});

export {};
