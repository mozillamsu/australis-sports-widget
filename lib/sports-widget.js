/*******************************************************************************
 * Requires
 ******************************************************************************/
let Request = require("sdk/request").Request;
let data = require("sdk/self").data;
let ChromeConstants = require("./xul-manager/chrome-constants").ChromeConstants;

let Sports = require("./schedule").Sports;
let Schedule = require("./schedule").Schedule;
let Game = require("./game").Game;

/*******************************************************************************
 * Initialization - instantiate Schedule objects, one per sport, and perform
 * the HTTP requests they need to pass raw HTML strings to Schedule objects.
 ******************************************************************************/
function SportsWidget () {
  let document = null;
  let view = null;

  var schedules = {};
  for (var sport in Sports)
    schedules[sport] = new Schedule(sport);

  function injectUI () {
    let xul = data.load("schedules.xul");
    view.innerHTML = xul;

    for (var sport in schedules) {
      var scheduleVbox = document.getElementById(Sports[sport]);
      var scheduleHeader = scheduleVbox.getElementsByClassName('schedule-head')[0];

      for (var i in schedules[sport].games) {
        var game = schedules[sport].games[i];
        var description = document.createElement('description');
        var innerVbox = scheduleVbox.getElementsByClassName('schedule-inner')[0];
        var result;

        if (game.history)
          result = (game.win ? 'Win' : 'Loss') + ', ' + game.score;
        else
          result = game.timeString;

        description.setAttribute('class', 'score');
        description.textContent = game.dateString + ' | ' +
                                  game.opponent + ' | ' +
                                  result;

        innerVbox.appendChild(description);
      }
    }
  }

  return {
    CONFIG: {
      id: "australis-sports-widget",
      type: "view",
      viewId: "PanelUI-australis-sports-widget",
      removable: true,
      defaultArea: ChromeConstants.AREA_PANEL()
    },

    widgetCreated: function (node) {
      let doc = node.ownerDocument;

      let img = doc.createElement("image");
      img.setAttribute("class", "toolbarbutton-icon");
      img.id = "PanelUI-australis-sports-widget-icon";
      img.setAttribute("src", data.url("icon.png"));
      img.setAttribute("width", "20px");
      img.setAttribute("height", "20px");

      let lbl = doc.createElement("label");
      lbl.setAttribute("class", "toolbarbutton-text toolbarbutton-label");
      lbl.setAttribute("flex", "1");
      lbl.setAttribute("value", "Spartan Sports");
      lbl.id = "PanelUI-australis-sports-widget-label";

      node.appendChild(img);
      node.appendChild(lbl);

      for (var sport in schedules) {
        // The closure you see here is an unfortunate necessity of callback functions
        // in JavaScript, without it we get 3 schedules for Women's Basketball instead
        // of 3 different sports.
        (function (sport) {
          Request({
            url: schedules[sport].requestURL,
            onComplete: function (response) {
              var message;

              // If we don't get an HTTP 200 OK back, we should probably freak out.
              if (response.status !== 200) {
                console.log("Error: couldn't download schedule for " + sport + "!");
                return;
              }

              // Inform the Schedule object corresponding to the current sport that it
              // should parse the HTML string and produce Game objects from it.
              schedules[sport].scrapeHTML(response.text);
            }
          }).get();
        })(sport);
      }
    },

    viewShowing: function (doc, theView) {
      document = doc;
      let css = data.url("style.css");
      let xmlPI = document.createProcessingInstruction("xml-stylesheet",
                                                       "href=\"" + css + "\" type=\"text/css\"");

      document.insertBefore(xmlPI, document.firstElementChild);
      view = theView;
      injectUI();
    }
  };
}

exports.SportsWidget = SportsWidget;
