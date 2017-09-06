function injectScript(url) {
  const script = document.createElement('script');
  script.src = url;
  document.body.appendChild(script);
}

function injectCss(url) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.body.appendChild(link);
}

[
  'https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.12.4/css/selectize.bootstrap3.min.css',
  chrome.extension.getURL('opteamissed.css')
].forEach(injectCss);

[
  'https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.12.4/js/standalone/selectize.min.js',
  chrome.extension.getURL('opteamissed.js')
].forEach(injectScript);