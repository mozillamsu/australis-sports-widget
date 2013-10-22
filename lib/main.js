/*******************************************************************************
 * Requires
 ******************************************************************************/
let Request = require("sdk/request").Request;
let Panel = require("sdk/panel").Panel;
let Widget = require("sdk/widget").Widget;
let data = require("sdk/self").data;

let Sports = require("./schedule").Sports;
let Schedule = require("./schedule").Schedule;

// For helping pass data to the content script. Deprecated. Won't be here long.
var schedulesSent = 0;

/*******************************************************************************
 * main_panel - Deprecated
 ******************************************************************************/
var main_panel = Panel({
  width: 400,
  height: 360,
  contentURL: data.url("main_panel.html"),
  contentScriptFile: data.url("widget.js")
});

/*******************************************************************************
 * widget - Deprecated
 ******************************************************************************/
var widget = Widget({
  id: "sports-widget",
  label: "MSU Sports Widget",
  contentURL: data.url("icon.png"),
  panel: main_panel
});

/*******************************************************************************
 * Initialization - instantiate Schedule objects, one per sport, and perform
 * the HTTP requests they need to pass raw HTML strings to Schedule objects.
 ******************************************************************************/
var schedules = {};
for (var sport in Sports)
  schedules[sport] = new Schedule(sport);

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
          console.log("Error: couldn't download schedule for MSU " + sport + "!");
          return;
        }

        // Inform the Schedule object corresponding to the current sport that it
        // should parse the HTML string and produce Game objects from it.
        schedules[sport].scrapeHTML(response.text);

        // Everything below this point interfaces with the content script, it's
        // not long for this codebase.
        // ---------------------------------------------------------------------
        message = {};
        message[sport] = schedules[sport];
        main_panel.port.emit("schedule", message);

        schedulesSent++;
        if (schedulesSent === 3) {
          main_panel.port.emit("schedulesSent", 3);
        }
        // ---------------------------------------------------------------------
      }
    }).get();
  })(sport);
}
