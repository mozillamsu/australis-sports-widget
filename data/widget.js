(function () {
  self.port.on("schedule", function (schedule) {
    for (var sport in schedule) {
      var games = schedule[sport].games;
      var tbody = document.getElementById('schedule-body');

      games.forEach(function (game) {
        var el = document.createElement('tr');
        el.innerHTML = "<td>" + sport + "</td>" +
                       "<td>" + game.date + "</td>" +
                       "<td>" + game.event + "</td>" +
                       "<td>" + game.location + "</td>" +
                       "<td>" + game.result + "</td>";
        tbody.appendChild(el);
      });
    }
  });
})();
