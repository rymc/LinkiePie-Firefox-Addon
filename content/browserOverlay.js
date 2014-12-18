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
            this.openPreferences(aEvent)
        }
        let url = "https://linkiepie.com/api/v1/links/?format=json'&username="+username+"&api_key="+api_key;
        let request = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"]
            .createInstance(Components.interfaces.nsIXMLHttpRequest);
        request.onerror = function(aEvent) {
            alert("Oops something went wrong? Check your account details! " + aEvent);
        };
        request.onreadystatechange = function (aEvent) {
            if (request.readyState == 4) {
                if(request.status != 201 && request.responseText != ''){
                    alert(request.responseText);
                } 
            }
        }
        request.open("POST", url, true);
        request.setRequestHeader("Content-Type", "application/json");
        let data = {"url": gBrowser.contentDocument.location.href};
        try {
            request.send(JSON.stringify(data));
        }catch(e) {
            alert(e);
        }
    },


    openLinkiePie : function(aEvent) {
        let win = Components.classes['@mozilla.org/appshell/window-mediator;1']
            .getService(Components.interfaces.nsIWindowMediator)
            .getMostRecentWindow('navigator:browser');
        win.gBrowser.selectedTab = win.gBrowser.addTab("https://linkiepie.com");

    },

    openPreferences : function(aEvent) {
        if (null == this._preferencesWindow || this._preferencesWindow.closed) {
            let instantApply =
                Application.prefs.get("browser.preferences.instantApply");
            let features =
                "chrome,titlebar,toolbar,centerscreen" +
                (instantApply.value ? ",dialog=no" : ",modal");

            this._preferencesWindow =
                window.openDialog(
                        "chrome://linkiepie/content/preferencesOverlay.xul",
                        "linkiepie-prefs", features);
        }

        this._preferencesWindow.focus();

    },





};


function installButton(toolbarId, id, afterId) {
    if (!document.getElementById(id)) {
        var toolbar = document.getElementById(toolbarId);

        // If no afterId is given, then append the item to the toolbar
        var before = null;
        if (afterId) {
            let elem = document.getElementById(afterId);
            if (elem && elem.parentNode == toolbar)
                before = elem.nextElementSibling;
        }

        toolbar.insertItem(id, before);
        toolbar.setAttribute("currentset", toolbar.currentSet);
        document.persist(toolbar.id, "currentset");
    }
}

 if (firstRun) {
    installButton("nav-bar", "linkiepie-button");
}
