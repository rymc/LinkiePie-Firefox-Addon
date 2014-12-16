if ("undefined" == typeof(LinkiePieChrome)) {
    var LinkiePieChrome = {};
};

/**
 * Controls the browser overlay.
 */
LinkiePieChrome.BrowserOverlay = {


    bookmarkCurrent : function(aEvent) {
        let prefs = Components.classes["@mozilla.org/preferences-service;1"]
                   .getService(Components.interfaces.nsIPrefService)
                   .getBranch("extensions.linkiepie.");
               
        let username = prefs.getCharPref("username");
        let api_key = prefs.getCharPref("api_key");
        if (username == '' || api_key == ''){
            alert("Please set username and API Key in preferences!");
        }
        let url = "https://linkiepie.com/api/v1/links/?username="+username+"&api_key="+api_key;
        let request = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"]
            .createInstance(Components.interfaces.nsIXMLHttpRequest);
        request.onload = function(aEvent) {
            //window.alert("Response Text: " + aEvent.target.responseText);
        };
        request.onerror = function(aEvent) {
            window.alert("Error Status: " + aEvent.target.status);
        };
        request.open("POST", url, true);
        request.setRequestHeader("Content-Type", "application/json");
        var data = {"url": gBrowser.contentDocument.location.href};
        request.send(JSON.stringify(data));
    }
};
