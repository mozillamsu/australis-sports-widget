/*******************************************************************************
 * Requires
 ******************************************************************************/
let HTMLParser = require("./util").HTMLParser;
let Game = require("./game").Game;

/*******************************************************************************
 * Sports object - maps human-readable sport names to URL fragments
 ******************************************************************************/
Sports = {
  "Football": "m-footbl",
  "Men's Basketball": "m-baskbl",
  "Women's Basketball": "w-baskbl"
};

/*******************************************************************************
 * Schedule object - holds a collection of Game objects. Is aware of its sport,
 * builds the request URL for the page being scraped, and eats/scrapes raw HTML
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

  body = HTMLParser(inputHTML);
  rows = body.getElementsByClassName('event-listing');

  for (var i = 0; i < rows.length; i++) {
    var cols = rows[i].getElementsByClassName('row-text');
    this.games.push(new Game({
      date: cols[0].textContent,
      event: cols[1].textContent,
      location: cols[2].textContent,
      result: cols[3].textContent
    }));
  }
};

exports.Sports = Sports;
exports.Schedule = Schedule;
