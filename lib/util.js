/*******************************************************************************
 * Requires
 ******************************************************************************/
let {Cc, Ci, Cu, Cr, Cm, Components} = require("chrome");
Cu.import("resource://gre/modules/Services.jsm");

/*******************************************************************************
 * HTMLParser - required to safely scrape cross-domain pages
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

exports.HTMLParser = HTMLParser;
