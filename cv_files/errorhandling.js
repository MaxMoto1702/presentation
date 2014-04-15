window.onerror = function(msg, file, line) {
    'use strict';

    if (!msg || !file || line === 0 || msg === 'Script error.' || msg === 'Script error' || !/0[0|1]$/.test(window.HH_REQUEST_ID)) {
        return;
    }

    window._gaq = window._gaq || [];
    _gaq.push(['main._trackEvent', 'js_error', [file, line, msg].join(':'), [location.pathname, navigator.userAgent].join(':'), 0, true]);

    return false;
};
