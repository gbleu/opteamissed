chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.sendMessage(tab.id, { action: 'TOGGLE' }, function(response) {
    chrome.tabs.update(tab.id, { url: tab.url });
  });
});
