import relay from './tabRelay';
import { initializeHook } from "./hook";
import { version as devToolsVersion } from "../manifest.json";

if (document instanceof HTMLDocument) {
  const script = document.createElement("script");
  script.textContent = `;(${initializeHook.toString()})(window, "${devToolsVersion}")`;
  document.documentElement.appendChild(script);
  script.parentNode.removeChild(script);
}

relay.then(({ tab, id }) => {
  tab.listen('actionHookFired', message => {
    console.log('actionHookFired', message);
    // Pass to devtools client
  });

  tab.listen('devtools-initialized', message => {
    console.log('devtools-initialized', message);
    tab.send('create-panel', {
      to: `background:devtools-${id}`
    });
  });

  tab.listen('panel-open', message => {
    console.log('panel-open', message);
    console.log('Panel is open');
  });
});
