const styles = [
  {
    id: 'selectize-css',
    url:
      'https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.12.4/css/selectize.bootstrap3.min.css'
  },
  { id: 'opteamissed-css', url: chrome.extension.getURL('opteamissed.css') }
];

const scripts = [
  {
    id: 'selectize-js',
    url:
      'https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.12.4/js/standalone/selectize.min.js'
  },
  { id: 'opteamissed-js', url: chrome.extension.getURL('opteamissed.js') }
];

function injectScript(metaScript) {
  const script = document.createElement('script');
  script.id = metaScript.id;
  script.src = metaScript.url;
  document.body.appendChild(script);
}

function injectCss(metaLink) {
  const link = document.createElement('link');
  link.id = metaLink.id;
  link.rel = 'stylesheet';
  link.href = metaLink.url;
  document.body.appendChild(link);
}

function inject() {
  chrome.runtime.sendMessage({ action: 'IS_DISABLED' }, function(disabled) {
    console.log(`opteamissed (${disabled ? 'disabled' : 'enabled'})`);
    if (!disabled) {
      styles.forEach(injectCss);
      scripts.forEach(injectScript);
    }
  });
}

inject();
