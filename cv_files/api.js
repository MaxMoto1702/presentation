(function(window, undefined){
  if (/\bMSIE 6/.test(navigator.userAgent) && !window.opera) {
    return;
  }

  


/**
 * @enum {string}
 */
var LivetexSettings = {
  HTTP_BALANCER: 'balancer.livetex.ru',
  CHAT_BALANCER: '//lb3.livetex.ru/',
  MEDIA_SERVER: 'tel.livetex.ru',
  BILLING_URL: 'https://billing.livetex.ru/',
  LTX_URL: '//web-client.livetex.ru/'
};


  var LTX_VERSION = '3.2.6-5';

  if (typeof window.LTX_URL === 'undefined') {
    window.LTX_URL = LivetexSettings.LTX_URL;
  }

  
  if (typeof window.LTX_IS_API === 'undefined') {
    window.LTX_IS_API = true;
  }

  if (typeof LiveTex !== 'undefined' &&
      typeof LiveTex['liveTexID'] !== 'undefined') {
    window.liveTexID = LiveTex['liveTexID'];
  }

  function nop() {}

  function loadScript(url, opt_callback) {
    var callback = opt_callback || nop;

    function completeHandler() {
      script.onreadystatechange = nop;
      script.onload = nop;

      document.body.removeChild(script);
      callback();
    }

    var script = document.createElement('script');

    script.onreadystatechange = function() {
      if (script.readyState === 'complete' ||
          script.readyState === 'loaded') {
        completeHandler();
      }
    };

    script.onload = completeHandler;
    script.src = window.LTX_URL + url + '?' + LTX_VERSION;

    document.body.appendChild(script);
  }

  function loadStyle(url, opt_callback) {
    if (document.createStyleSheet) {
      document.createStyleSheet(url);
    } else {
      var head = document.getElementsByTagName('head')[0];
      var link = document.createElement('link');

      if (link !== null && head !== undefined) {
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', url);
        link.setAttribute('rel', 'stylesheet');

        head.appendChild(link);
      }
    }

    if (typeof opt_callback === 'function') {
      setTimeout(opt_callback, 200);
    }
  }

  function buttonsCssUrl(siteId) {
    return window.LTX_URL + 'csscontroller/cssbuttons/' + siteId + '.css';
  }

  function inviteCssUrl(siteId) {
    var src = '';
    if (isMobileWidget()) {
      src = window.LTX_URL + 'css/app-mobile.css';
    } else {
      src = window.LTX_URL + 'csscontroller/cssinvite/' + siteId + '.css';
    }
    return src;
  }

  function makeAppJsUrl() {
    if (typeof document.getElementsByClassName === 'function' &&
        JSON instanceof Object &&
        typeof JSON.parse === 'function' &&
        typeof JSON.stringify === 'function' &&
        window['MooTools'] === undefined) {
      return 'js/app.js';
    } else {
      return 'js/app-compat.js';
    }
  }

  function isMobileWidget() {
    return (/iPhone|iPod|Android/i.test(navigator.userAgent) &&
      window.liveSettings['flag_mobile'] === 1);
  }

  if (/Opera Mini/.test(navigator.userAgent)) return false;

  if (typeof window['LiveTex'] === 'undefined') {
    window['LiveTex'] = {};
  }

  if (window['LiveTex']['is_init'] !== true) {
    window['LiveTex']['is_init'] = true;

    loadScript('js/settings/' + liveTexID.toString() + '.js', function() {
      loadStyle(buttonsCssUrl(liveTexID.toString()), function() {
        loadStyle(inviteCssUrl(liveTexID.toString()), function() {
          loadScript(makeAppJsUrl());
        });
      });
    });
  } else {
    if (typeof console !== 'undefined' &&
        typeof console.error !== 'undefined') {
      console.error('LiveTex script loaded two or more times. ' +
          'Load the script only once, please.');
    }
  }
})(window);
