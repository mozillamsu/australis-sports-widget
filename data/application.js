(function () {
  function Game (data) {
    var score;

    this.date = data.date;
    this.event = data.event;
    this.location = data.location;
    this.result = data.result;

    this.home = this.location === 'East Lansing, Mich.';
    this.history = data.result[0] === 'W' || data.result[0] === 'L';
    if (this.history)
      this.win = data.result[0] === 'W';

    this.opponent = this.parseOpponent(data.event);
    if (this.history === true) {
      score = this.parseScore(data.result);
    }
  }

  Game.prototype = {
    date: null,
    event: null,
    location: null,
    result: null,
    home: null,
    away: function () { return !this.home; },
    win: null,
    loss: function () { return !this.win; },
    history: null,
    future: function () { return !this.history; },
    opponent: null,
    score: null,
    spartanScore: null,
    opponentScore: null,

    parseScore: function (result) {
      var tokens, score, spartanScore, opponentScore;

      tokens = result.split(', ');
      score = tokens[1];
      tokens = score.split('-');

      if (this.win === true) {
        spartanScore = tokens[0];
        opponentScore = tokens[1];
      } else {
        spartanScore = tokens[1];
        opponentScore = tokens[0];
      }

      return {
        score: score,
        spartanScore: spartanScore,
        opponentScore: opponentScore
      };
    },

    parseOpponent: function (event) {
      var tokens, result;

      tokens = event.split(' ');
      result = tokens.slice(1, tokens.length).join(' ');

      return result;
    }
  };

  var games = [];

  jQuery(document).ready(function () {
    jQuery.get('http://www.msuspartans.com/sports/m-footbl/sched/msu-m-footbl-sched.html', function (data) {
      var doc, table, rows, $tableBody;
      doc = jQuery.parseHTML(data);
      table = jQuery(doc).find('#schedtable');
      rows = jQuery(table).find('tr.event-listing');

      jQuery.each(rows, function (i, tr) {
        var cols = jQuery(tr).find('td.row-text');

        games.push(new Game({
          date: jQuery(cols[0]).text(),
          event: jQuery(cols[1]).text(),
          location: jQuery(cols[2]).text(),
          result: jQuery(cols[3]).text()
        }));
      });

      $tableBody = jQuery("#schedule-body");
      jQuery.each(games, function (i, game) {
        $tableBody.append("<tr><td>Football</td><td>" + game.date + "</td><td>" + game.event + "</td><td>" + game.location + "</td><td>" + game.result + "</td></tr");
      });
    });
  });
}());
