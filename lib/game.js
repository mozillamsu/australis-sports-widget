/*******************************************************************************
 * Game object - represents one game in a schedule. Builds out its properties
 * by interpreting table data from the scraped page. Warning: functions in this
 * object have a small number of interwoven side effects. Changing the order
 * of function calls in the constructor could break things.
 ******************************************************************************/
function Game (row) {
  this.date = row.date;
  this.location = row.location;

  this.parseOpponent(row.event);
  this.setHome(this.location === 'East Lansing, Mich.');
  this.setHistory(row.result[0] === 'W' || row.result[0] === 'L');
  if (this.history === true) {
    this.setWin(row.result[0] === 'W');
    this.parseScore(row.result);
  }
}

Game.prototype = {
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

  parseScore: function (result) {
    var tokens;

    tokens = result.split(', ');
    this.score = tokens[1];
    tokens = this.score.split('-');

    if (this.win === true) {
      this.spartanScore = tokens[0];
      this.opponentScore = tokens[1];
    } else {
      this.spartanScore = tokens[1];
      this.opponentScore = tokens[0];
    }
  },

  parseOpponent: function (event) {
    var tokens;

    tokens = event.split(' ');
    this.opponent = tokens.slice(1, tokens.length).join(' ');
  }
};

exports.Game = Game;
