/*******************************************************************************
 * Game object - represents one game in a schedule. Builds out its properties
 * by interpreting table data from the scraped page. Takes a sport name as an
 * argument to the constructor, which while duplicated from the Schedule object,
 * saves us quite a bit of time later on.
 ******************************************************************************/
function Game (row, sport) {
  this.date = row.date;
  this.event = row.event;
  this.location = row.location;
  this.result = row.result;
  this.sport = sport;

  this.parseOpponent(row.event);
  this.setHome(this.location === 'East Lansing, Mich.');
  this.setHistory(row.result[0] === 'W' || row.result[0] === 'L');

  if (this.history === true) {
    this.setWin(row.result[0] === 'W');

    // Danger Will Robinson: parseScore has an ugly dependency on this.win being
    // defined before it runs.
    this.parseScore(row.result);
  }
}

Game.prototype = {
  /*****************************************************************************
   * I don't normally advocate getters and setters in JavaScript, but here the
   * setters take care of our logical opposites quite nicely.
   ****************************************************************************/
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

  // Parses a score, in the format of "[W/L], winnerScore-loserScore"
  parseScore: function (result) {
    var tokens;

    // Tokenize by ", " to separate MSU win/loss from scores
    tokens = result.split(', ');
    this.score = tokens[1];
    // Split scores apart
    tokens = this.score.split('-');

    // If we won, State's score is on the left, otherwise on the right
    if (this.win === true) {
      this.spartanScore = tokens[0];
      this.opponentScore = tokens[1];
    } else {
      this.spartanScore = tokens[1];
      this.opponentScore = tokens[0];
    }
  },

  // Parses an opposing team in the format "[vs./at] School (nonsense)"
  parseOpponent: function (event) {
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
  }
};

/*******************************************************************************
 * Exports
 ******************************************************************************/
exports.Game = Game;
