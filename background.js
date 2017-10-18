const icons = {
  enabled: {
    '32': 'images/opteamis-32x32.png',
    '16': 'images/opteamis-16x16.png'
  },
  disabled: {
    '32': 'images/disabled-32x32.png',
    '16': 'images/disabled-16x16.png'
  }
};

chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              hostEquals: 'www.opteamis.com',
              pathPrefix: '/cli'
            }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});

const isDisabled = () => JSON.parse(localStorage.getItem('disabled') || false);

const toggle = tab => {
  localStorage.setItem('disabled', JSON.stringify(!isDisabled()));
  chrome.tabs.reload(tab.id);
};
chrome.pageAction.onClicked.addListener(toggle);

const updateIcon = tabId => {
  const icon = isDisabled() ? icons.disabled : icons.enabled;
  chrome.pageAction.setIcon({ tabId, path: icon });
};
chrome.tabs.onUpdated.addListener(updateIcon);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'IS_DISABLED') {
    sendResponse(isDisabled());
  }
});
