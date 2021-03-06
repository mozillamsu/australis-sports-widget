/*******************************************************************************
 * Requires
 ******************************************************************************/
let Util = require("./util");

/*******************************************************************************
 * Game object - represents one game in a schedule. Builds out its properties
 * by interpreting table data from the scraped page. Takes a sport name as an
 * argument to the constructor, which while duplicated from the Schedule object,
 * saves us quite a bit of time later on.
 ******************************************************************************/
function Game (row, sport) {
  this.location = row.location;
  this.sport = sport;

  this.setDate(row.date);
  this.setOpponent(row.event);
  this.setHome(this.location === 'East Lansing, Mich.');
  this.setHistory(row.result[0] === 'W' || row.result[0] === 'L');

  if (this.history === true) {
    this.setWin(row.result[0] === 'W');
    this.setScore(row.result);
  } else {
    this.setTime(row.result);
  }
}

Game.prototype = {
  // These setters ensure that their logically opposite properties are set the
  // right way, every time.
  setHome: function (home) {
    this.home = home;
    this.away = !home;
  },

  setWin: function (win) {
    this.win = win;
    this.loss = !win;
  },

  setHistory: function (history) {
    this.history = history;
    this.future = !history;
  },

  // These setters mostly sanitize input data from the scraped page.

  // Parses the string date into a JS date
  setDate: function (date) {
    this.date = new Date();
    this.date.setTime(Date.parse(Util.fixY2KDateString(date)));
    // This next one's required for the way we're passing data to the content
    // script right now, but it shouldn't really be Game's responsibility.
    this.dateString = "" + (this.date.getMonth() + 1) + "/" +
                      this.date.getDate() + "/" + this.date.getFullYear();
  },

  // Parses the time and adds it to the date field, if the game hasn't been
  // played yet
  setTime: function (time) {
    var afternoon, tokens, hours, minutes;

    // If the game time is TBA, that's all we've got
    if (time.contains('TBA')) {
      this.timeString = 'TBA';
      return;
    }

    // If we get a slash time (7/9:30 PM), we want the earliest one
    if (time[1] === '/') {
      time[2] = time[0];
      time = time.substr(2);
    }

    // Figure out the meridian (AM/PM), set up a sanitized timeString
    afternoon = time.contains('p.m.') || time.contains('PM');
    tokens = time.split(' ')[0].split(':');
    this.timeString = tokens[0] + ':' + tokens[1] + ' ' +
                      (afternoon ? 'PM' : 'AM');

    // Convert hours to 24-hour time, set the time properties of this.date
    hours = parseInt(tokens[0]) + (afternoon ? 12 : 0);
    minutes = parseInt(tokens[1]);
    this.date.setHours(hours, minutes);
  },

  // Parses a score, in the format of "[W/L], winnerScore-loserScore"
  setScore: function (result) {
    var tokens;

    // Tokenize by ", " to separate MSU win/loss from scores
    tokens = result.split(', ');
    this.score = tokens[1];
    // Split scores apart
    tokens = this.score.split('-');

    // If we won, State's score is on the left, otherwise on the right. Excuse
    // the boolean trickery. The + operator acts to cast the booleans to
    // integers, giving us the right indices without having to repeat code.
    this.spartanScore = tokens[+this.loss];
    this.opponentScore = tokens[+this.win];
  },

  // Parses an opposing team in the format "[vs./at] School (nonsense)"
  setOpponent: function (event) {
    var tokens;

    // Regex any parenthetical text out of the string, then tokenize by spaces.
    tokens = event.replace(/\([^)]+\)/g, '').split(' ');

    // Get rid of the "vs./at" at the start of the string if it's present.
    if (event.startsWith('vs.') || event.startsWith('at')) {
      tokens = tokens.slice(1, tokens.length);
    }

    // Eliminate any tokens that don't begin with A-Za-z. Methinks ASCII
    // codes and the LISP chainsaw save a little time over regex.
    tokens = tokens.filter(function (token) {
      var code = token.charCodeAt(0);
      return (code >= 65 && code <= 90) ||
             (code >= 97 && code <= 122);
    });

    // Join the tokens back together by spaces and store in the object
    this.opponent = tokens.join(' ');
  },

  dateSorter: function (a, b) {
    if (a.date.getTime() < b.date.getTime())
      return -1;
    if (a.date.getTime() > b.date.getTime())
      return 1;

    return 0;
  }
};

/*******************************************************************************
 * Exports
 ******************************************************************************/
exports.Game = Game;
