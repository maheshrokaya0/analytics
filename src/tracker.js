(function setupEventTracking() {
    "use strict";

    // Get current URL and document
    var currentLocation = window.location,
        currentDocument = window.document,
        scriptEl = currentDocument.currentScript,
        apiEndpoint = scriptEl.getAttribute("data-api") || new URL(scriptEl.src).origin + "/api/event";

    // Function to ignore events based on certain conditions
    function onIgnoredEvent(reason, options) {
        if (reason) console.warn('Ignoring Event: ' + reason);
        options && options.callback && options.callback()
      }

    // Function to track events
    function trigger(eventName, options) {
        // Ignore if running locally or in headless browsers

        if (window._phantom || window.__nightmare || window.navigator.webdriver || window.Cypress) {
            return onIgnoredEvent(null, options);
        }

        try {
            // Check if localStorage flag is set to ignore events
            if ("true" === window.localStorage.plausible_ignore) {
                return onIgnoredEvent("localStorage flag", options);
            }
        } catch (error) {}

        // Prepare data to be sent
        var eventData = {
            name: eventName,
            url: options && options.url ? options.url : currentLocation.href,
            domain: scriptEl.getAttribute("data-domain"),
            referrer: currentDocument.referrer || null,
            metadata: options && options.meta ? JSON.stringify(options.meta) : null,
            props: options && options.props ? options.props : null
        };

        // Send data to the server
        var xhr = new XMLHttpRequest();
        xhr.open("POST", apiEndpoint, true);
        xhr.setRequestHeader("Content-Type", "text/plain");
        xhr.send(JSON.stringify(eventData));
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && options && options.callback) {
                options.callback();
            }
        };
    }

    // Initialize Plausible tracking function
    var queue = (window.plausible && window.plausible.q) || []
    window.plausible = trigger
    for (var i = 0; i < queue.length; i++) {
        trigger.apply(this, queue[i])
    }
})();
