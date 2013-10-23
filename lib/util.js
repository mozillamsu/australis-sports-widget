/*******************************************************************************
 * Requires
 ******************************************************************************/
let {Cc, Ci, Cu, Cr, Cm, Components} = require("chrome");
Cu.import("resource://gre/modules/Services.jsm");

/*******************************************************************************
 * HTMLParser - safely obtains an HTMLElement object for the <body> tag of the
 * HTML string in question. Mostly from this, with a few compatibility fixes:
 * https://developer.mozilla.org/en-US/docs/Code_snippets/HTML_to_DOM
 ******************************************************************************/
function HTMLParser (inputHTML) {
  var document, html, body;

  // Grab a reference to the fake "document" object available through the SDK
  document = Services.appShell.hiddenDOMWindow.document;

  // Create empty <html> and <body> tags, nesting the <body> tag inside <html>
  html = document.implementation.createDocument("http://www.w3.org/1999/xhtml",
                                                "html",
                                                null);
  body = document.createElementNS("http://www.w3.org/1999/xhtml", "body");
  html.documentElement.appendChild(body);

  // Mozilla magic
  body.appendChild(Cc["@mozilla.org/feed-unescapehtml;1"]
      .getService(Ci.nsIScriptableUnescapeHTML)
      .parseFragment(inputHTML, false, null, body));

  // Voila, scrapable <body> HTMLElement object, sans scripts and other nasties
  return body;
}

function spliceString(str, idx, rem, s) {
  return (str.slice(0, idx) + s + str.slice(idx + Math.abs(rem)));
}

function fixY2KDateString(dateStr) {
  return spliceString(dateStr, dateStr.length - 2, 0, '20');
}

/*******************************************************************************
 * Exports
 ******************************************************************************/
exports.HTMLParser = HTMLParser;
exports.spliceString = spliceString;
exports.fixY2KDateString = fixY2KDateString;
