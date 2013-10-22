/*******************************************************************************
 * Requires
 ******************************************************************************/
let HTMLParser = require("./util").HTMLParser;
let Game = require("./game").Game;

/*******************************************************************************
 * Sports object - maps human-readable sport names to the URL fragments used on
 * the MSU Athletics site.
 ******************************************************************************/
Sports = {
  "Football": "m-footbl",
  "Men's Basketball": "m-baskbl",
  "Women's Basketball": "w-baskbl"
};

/*******************************************************************************
 * Schedule object - holds a collection of Game objects. Is aware of its sport,
 * builds the request URL for the page being scraped, and scrapes raw HTML
 * strings delivered from main.js.
 ******************************************************************************/
function Schedule (sport) {
  this.sport = sport;
  this.games = [];
  this.requestURL = "http://www.msuspartans.com/sports/" + Sports[sport] +
                    "/sched/msu-" + Sports[sport] + "-sched.html";
}

Schedule.prototype.scrapeHTML = function (inputHTML) {
  var body, rows;

  // HTMLParser gets us an HTMLElement object for the body tag of the page to be
  // scraped without actually loading it into a document where it can "run."
  body = HTMLParser(inputHTML);

  // All the <tr>s in the schedule tables have the class .event-listing.
  rows = body.getElementsByClassName('event-listing');

  for (var i = 0; i < rows.length; i++) {
    // Similarly, the <td>s inside those <tr>s all have .row-text.
    // How convenient.
    var cols = rows[i].getElementsByClassName('row-text');

    // Push a new game up to the list. Node.prototype.textContent is used to
    // prevent any markup inside the <td>s from being sent to the new Game
    // object.
    this.games.push(new Game({
      date: cols[0].textContent,
      event: cols[1].textContent,
      location: cols[2].textContent,
      result: cols[3].textContent
    }, this.sport));
  }
};

/*******************************************************************************
 * Exports
 ******************************************************************************/
exports.Sports = Sports;
exports.Schedule = Schedule;
