/*******************************************************************************
 * Monkey-patching String BECAUSE I CAN AHAHAHAHAHAHAHAHAHA
 ******************************************************************************/
String.prototype.splice = function (idx, rem, s) {
  return (this.slice(0, idx) + s + this.slice(idx + Math.abs(rem)));
};

(function () {
  var games = [];
  var LOLY2K = function (dateStr) {
    return dateStr.splice(dateStr.length - 2, 0, '20');
  };
  var gameSorter = function (a, b) {
    var aDate = new Date(), bDate = new Date();
    aDate.setTime(Date.parse(LOLY2K(a.date)));
    bDate.setTime(Date.parse(LOLY2K(b.date)));

    if (aDate.getTime() < bDate.getTime()) {
      return -1;
    }
    if (aDate.getTime() > bDate.getTime()) {
      return 1;
    }
    return 0;
  };

  self.port.on("schedule", function (schedule) {
    for (var sport in schedule)
      games = games.concat(schedule[sport].games);
  });

  self.port.on("schedulesSent", function (num) {
    games.sort(gameSorter);

    games.forEach(function (game) {
      var tbody = document.getElementById('schedule-body');

      var el = document.createElement('tr');
      el.innerHTML = "<td>" + game.sport + "</td>" +
                     "<td>" + game.date + "</td>" +
                     "<td>" + game.event + "</td>" +
                     "<td>" + game.location + "</td>" +
                     "<td>" + game.result + "</td>";
      tbody.appendChild(el);
    });
  });
})();
