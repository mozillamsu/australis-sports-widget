/*******************************************************************************
 * Requires
 ******************************************************************************/
let Request = require("sdk/request").Request;
let Panel = require("sdk/panel").Panel;
let Widget = require("sdk/widget").Widget;
let data = require("sdk/self").data;

let Sports = require("./schedule").Sports;
let Schedule = require("./schedule").Schedule;

// Ignore the global, it's temporary and won't be needed after the switch to XUL
var schedulesSent = 0;

/*******************************************************************************
 * main_panel - The main panel
 ******************************************************************************/
var main_panel = Panel({
  width: 400,
  height: 360,
  contentURL: data.url("main_panel.html"),
  contentScriptFile: data.url("widget.js")
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

/*******************************************************************************
 * Initialization - instantiate Schedule objects, one per sport, and perform
 * the HTTP requests they need to get raw HTML data.
 ******************************************************************************/
var schedules = {};
for (var sport in Sports) {
  schedules[sport] = new Schedule(sport);
}

for (var sport in schedules) {
  (function (sport) {
    Request({
      url: schedules[sport].requestURL,
      onComplete: function (response) {
        var message;

        if (response.status !== 200) {
          console.log("Error: couldn't download schedule for MSU " + sport + "!");
          return;
        }

        schedules[sport].scrapeHTML(response.text);
        message = {};
        message[sport] = schedules[sport];
        main_panel.port.emit("schedule", message);

        // Disregard this, it will be gone soon
        schedulesSent++;
        if (schedulesSent === 3) {
          main_panel.port.emit("schedulesSent", 3);
        }
      }
    }).get();
  })(sport);
}
