/*******************************************************************************
 * Requires
 ******************************************************************************/
let {Cc, Ci, Cu, Cr, Cm, Components} = require("chrome");
let Panel = require("sdk/panel").Panel;
let Widget = require("sdk/widget").Widget;
let data = require("sdk/self").data;
Cu.import("resource://gre/modules/Services.jsm");

/*******************************************************************************
 * HTMLParser - required to safely scrape msuspartans.com
 ******************************************************************************/
function HTMLParser (inputHTML) {
  var document, html, body;

  document = Services.appShell.hiddenDOMWindow.document;
  html = document.implementation.createDocument("http://www.w3.org/1999/xhtml", "html", null);
  body = document.createElementNS("http://www.w3.org/1999/xhtml", "body");
  html.documentElement.appendChild(body);

  body.appendChild(Cc["@mozilla.org/feed-unescapehtml;1"]
      .getService(Ci.nsIScriptableUnescapeHTML)
      .parseFragment(inputHTML, false, null, body));

  return body;
}

/*******************************************************************************
 * main_panel - The main panel
 ******************************************************************************/
var main_panel = Panel({
  width: 400,
  height: 360,
  contentURL: data.url("main_panel.html"),
  contentScriptFile: [data.url("jquery.js"), data.url("application.js")]
});

/*******************************************************************************
 * widget - The widget
 ******************************************************************************/
var widget = Widget({
  id: "sports-widget",
  label: "MSU Sports Widget",
  contentURL: data.url("icon.png"),
  panel: main_panel
});
