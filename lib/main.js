/*******************************************************************************
 * Requires
 ******************************************************************************/
let Request = require("sdk/request").Request;
let Panel = require("sdk/panel").Panel;
let Widget = require("sdk/widget").Widget;
let data = require("sdk/self").data;

let Sports = require("./schedule").Sports;
let Schedule = require("./schedule").Schedule;

/*******************************************************************************
 * Initialization - instantiate Schedule objects, one per sport, and perform
 * the HTTP requests they need to get raw HTML data.
 ******************************************************************************/
var schedules = {};
for (var sport in Sports)
  schedules[sport] = new Schedule(sport);

for (var sport in schedules) {
  (function (sport) {
    Request({
      url: schedules[sport].requestURL,
      onComplete: function (response) {
        if (response.status !== 200) {
          console.log("Error: couldn't download schedule for MSU " + sport + "!");
          return;
        }

        schedules[sport].scrapeHTML(response.text);
      }
    }).get();
  })(sport);
}

/*******************************************************************************
 * main_panel - The main panel
 ******************************************************************************/
var main_panel = Panel({
  width: 400,
  height: 360,
  contentURL: data.url("main_panel.html")
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
