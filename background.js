chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.sendMessage(tab.id, { action: 'TOGGLE' }, function(response) {
    chrome.tabs.reload(tab.id);
  });
});
